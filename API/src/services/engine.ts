import { ScrapingTarget, ScrapeResult, PriceSnapshotInsert } from '../types/index.js';
import { ScraperRegistry } from '../scrapers/ScraperRegistry.js';
import { DatabaseService } from './db.js';
import { ENV } from '../config/env.js';

export interface BatchScrapeStats {
  total: number;
  succeeded: number;
  failed: number;
  outOfStock: number;
  durationMs: number;
}

export class ScrapingEngine {
  private static domainLastRequestTime: Map<string, number> = new Map();

  /**
   * Scrapes a single target with rate-limiting and persistence
   */
  public static async scrapeTarget(target: ScrapingTarget): Promise<ScrapeResult> {
    try {
      // 1. Enforce polite delay per retailer domain
      await this.enforceDomainRateLimit(target.productUrl);

      // 2. Resolve the concrete adapter
      const adapter = ScraperRegistry.getAdapter(target);
      console.log(`[ScrapingEngine] Scraping ${target.productName} via [${adapter.name}] -> ${target.productUrl}`);

      // 3. Execute scrape
      const result = await adapter.scrape(target);

      // 4. Ingest result or log error
      if (result.success && result.priceOriginal !== undefined) {
        const snapshot: PriceSnapshotInsert = {
          product_id: target.productId,
          retailer_id: target.retailerId,
          price_original: result.priceOriginal,
          currency_code: result.currencyCode,
          in_stock: result.inStock,
          discount_pct: result.discountPct,
          raw_title: result.rawTitle,
          seller_name: result.sellerName,
          response_time_ms: result.responseTimeMs,
          engine_used: result.engineUsed,
          scraped_at: new Date().toISOString()
        };

        await DatabaseService.insertSnapshot(snapshot);
        console.log(
          `[ScrapingEngine] SUCCESS: ${target.productName} @ ${target.retailerName} -> ${result.priceOriginal} ${result.currencyCode} (In Stock: ${result.inStock}, Engine: ${result.engineUsed})`
        );
      } else {
        const errorMsg = result.errorMessage || 'Unknown scrape error';
        console.warn(`[ScrapingEngine] FAILED: ${target.productName} @ ${target.retailerName} -> ${errorMsg}`);
        await DatabaseService.recordTargetError(target.id, errorMsg);
      }

      return result;
    } catch (err: any) {
      console.error(`[ScrapingEngine] CRITICAL Exception scraping ${target.productUrl}:`, err.message);
      await DatabaseService.recordTargetError(target.id, err.message);
      return {
        success: false,
        currencyCode: target.currencyCode,
        inStock: false,
        responseTimeMs: 0,
        engineUsed: 'cheerio_got',
        errorMessage: err.message
      };
    }
  }

  /**
   * Processes a list of targets with bounded concurrency
   */
  public static async processTargetsConcurrently(
    targets: ScrapingTarget[],
    concurrency: number = ENV.SCRAPING.MAX_CONCURRENT_REQUESTS
  ): Promise<BatchScrapeStats> {
    const startTime = Date.now();
    let succeeded = 0;
    let failed = 0;
    let outOfStock = 0;

    console.log(`[ScrapingEngine] Starting concurrent batch of ${targets.length} targets (Concurrency: ${concurrency})`);

    const queue = [...targets];
    const workers = Array.from({ length: concurrency }).map(async () => {
      while (queue.length > 0) {
        const target = queue.shift();
        if (!target) break;

        const res = await this.scrapeTarget(target);
        if (res.success) {
          succeeded++;
          if (!res.inStock) outOfStock++;
        } else {
          failed++;
        }
      }
    });

    await Promise.all(workers);

    const stats: BatchScrapeStats = {
      total: targets.length,
      succeeded,
      failed,
      outOfStock,
      durationMs: Date.now() - startTime
    };

    console.log(
      `[ScrapingEngine] Batch finished in ${(stats.durationMs / 1000).toFixed(1)}s. Success: ${succeeded}, Failed: ${failed}, Out of Stock: ${outOfStock}`
    );

    return stats;
  }

  /**
   * Ensures requests to the same domain are throttled to prevent anti-bot IP blocks
   */
  private static async enforceDomainRateLimit(urlStr: string): Promise<void> {
    try {
      const hostname = new URL(urlStr).hostname;
      const lastTime = this.domainLastRequestTime.get(hostname) || 0;
      const elapsed = Date.now() - lastTime;
      const requiredDelay = ENV.SCRAPING.PER_DOMAIN_DELAY_MS;

      if (elapsed < requiredDelay) {
        const waitTime = requiredDelay - elapsed;
        await new Promise((r) => setTimeout(r, waitTime));
      }

      this.domainLastRequestTime.set(hostname, Date.now());
    } catch {
      // Fallback delay if URL parsing fails
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
}
