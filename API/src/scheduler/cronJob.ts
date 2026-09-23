import cron, { ScheduledTask } from 'node-cron';
import { DatabaseService } from '../services/db.js';
import { ScrapingEngine } from '../services/engine.js';
import { ScrapingTarget } from '../types/index.js';
import { ENV } from '../config/env.js';

export class AutonomousScheduler {
  private static task: ScheduledTask | null = null;
  private static isRunning = false;
  private static scheduledTimers: NodeJS.Timeout[] = [];

  /**
   * Initializes and starts the autonomous cron scheduler
   * Heavy scraping jobs are strictly dispatched between 02:00 and 05:00 AM UTC
   */
  public static start(): void {
    const schedule = ENV.CRON_SCHEDULE; // Default: '0 2 * * *' (02:00 AM UTC)
    console.log(`[AutonomousScheduler] Initializing autonomous daily cron: "${schedule}" (Timezone: UTC)`);
    console.log(`[AutonomousScheduler] Heavy scraping window: 02:00 - 05:00 AM UTC (${ENV.SCRAPER_WINDOW_MINUTES} minutes spread)`);

    this.task = cron.schedule(
      schedule,
      async () => {
        console.log(`[AutonomousScheduler] >>> 02:00 AM UTC Triggered. Commencing randomized dispatch window...`);
        await this.dispatchDailyScrapingWindow();
      },
      {
        timezone: 'UTC'
      }
    );

    console.log('[AutonomousScheduler] Scheduler is active and waiting for next 02:00 AM UTC execution window.');
  }

  /**
   * Dispatches scraping targets randomly across the 02:00 - 05:00 AM UTC window
   */
  public static async dispatchDailyScrapingWindow(): Promise<void> {
    if (this.isRunning) {
      console.warn('[AutonomousScheduler] Previous scraping window is still active. Skipping invocation.');
      return;
    }

    this.isRunning = true;
    this.clearPendingTimers();

    try {
      // 1. Fetch all active targets across 130 countries from Supabase
      console.log('[AutonomousScheduler] Fetching active targets from Supabase...');
      const targets = await DatabaseService.fetchActiveTargets();

      if (targets.length === 0) {
        console.warn('[AutonomousScheduler] No active targets to scrape.');
        this.isRunning = false;
        return;
      }

      console.log(`[AutonomousScheduler] Found ${targets.length} targets across countries.`);

      // 2. Window calculation
      // 3 hours = 180 minutes. We reserve the final 10% (18 mins) as buffer for straggler retries.
      const windowMs = ENV.SCRAPER_WINDOW_MINUTES * 60 * 1000;
      const usableWindowMs = Math.floor(windowMs * 0.9);

      console.log(
        `[AutonomousScheduler] Distributing ${targets.length} jobs stochastically over ${(usableWindowMs / 60000).toFixed(0)} minutes.`
      );

      // 3. Group targets by retailer domain to prevent overlapping bursts to the same vendor
      const domainBuckets = this.groupByDomain(targets);

      // 4. Assign jittered execution timestamps
      let scheduledCount = 0;
      for (const [domain, domainTargets] of domainBuckets.entries()) {
        // Distribute domain targets evenly throughout the window with random jitter
        const stepMs = Math.floor(usableWindowMs / domainTargets.length);

        domainTargets.forEach((target, index) => {
          // Base slot + random jitter within ±30% of the step
          const baseDelay = index * stepMs;
          const jitter = (Math.random() - 0.5) * (stepMs * 0.6);
          const finalDelayMs = Math.max(1000, Math.floor(baseDelay + jitter));

          const timer = setTimeout(async () => {
            await ScrapingEngine.scrapeTarget(target);
          }, finalDelayMs);

          this.scheduledTimers.push(timer);
          scheduledCount++;

          const executeAt = new Date(Date.now() + finalDelayMs).toISOString().substring(11, 19);
          // Only log a sample to avoid terminal spam
          if (scheduledCount <= 5 || scheduledCount === targets.length) {
            console.log(
              `[AutonomousScheduler] Scheduled: ${target.productName} (${domain}) -> Dispatch at ${executeAt} UTC (in ${(finalDelayMs / 60000).toFixed(1)}m)`
            );
          }
        });
      }

      console.log(`[AutonomousScheduler] All ${scheduledCount} jobs successfully placed in the 02:00-05:00 AM UTC window.`);

      // Reset isRunning after the window has completely elapsed
      setTimeout(() => {
        this.isRunning = false;
        console.log('[AutonomousScheduler] Daily 02:00-05:00 AM UTC scraping window completed.');
      }, windowMs);
    } catch (err: any) {
      console.error('[AutonomousScheduler] Error in dispatchDailyScrapingWindow:', err.message);
      this.isRunning = false;
    }
  }

  /**
   * Helper to partition targets by retailer hostname
   */
  private static groupByDomain(targets: ScrapingTarget[]): Map<string, ScrapingTarget[]> {
    const buckets = new Map<string, ScrapingTarget[]>();

    for (const target of targets) {
      let hostname = 'default';
      try {
        hostname = new URL(target.productUrl).hostname;
      } catch {
        hostname = target.retailerName;
      }

      if (!buckets.has(hostname)) {
        buckets.set(hostname, []);
      }
      buckets.get(hostname)!.push(target);
    }

    return buckets;
  }

  /**
   * Stops the scheduler and cancels any pending delayed jobs (for graceful shutdown)
   */
  public static stop(): void {
    if (this.task) {
      this.task.stop();
      this.task = null;
    }
    this.clearPendingTimers();
    this.isRunning = false;
    console.log('[AutonomousScheduler] Scheduler halted.');
  }

  private static clearPendingTimers(): void {
    for (const timer of this.scheduledTimers) {
      clearTimeout(timer);
    }
    this.scheduledTimers = [];
  }
}
