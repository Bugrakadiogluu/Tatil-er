import { IScraperAdapter, ScrapingTarget, ScrapeResult, ScrapingEngine } from '../types/index.js';
import { ProxyManager } from '../config/proxy.js';
import { ENV } from '../config/env.js';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Browser } from 'puppeteer';

// Register stealth plugin
puppeteer.use(StealthPlugin());

export abstract class BaseScraper implements IScraperAdapter {
  abstract readonly adapterKey: string;
  abstract readonly name: string;

  protected static sharedBrowser: Browser | null = null;
  protected static browserUsageCount = 0;

  abstract canHandle(target: ScrapingTarget): boolean;
  abstract parseHtml(html: string, target: ScrapingTarget): Omit<ScrapeResult, 'responseTimeMs' | 'engineUsed'>;

  /**
   * Main entrypoint for scraping a target with dual-engine fallback & proxy routing
   */
  public async scrape(target: ScrapingTarget): Promise<ScrapeResult> {
    const startTime = Date.now();
    const proxyUrl = ProxyManager.getProxyUrl(target.countryCode);

    // Heuristic 1: If explicitly configured for headless browser, skip Level 1 HTTP
    if (target.requiresHeadless) {
      console.log(`[${this.name}] Target requires headless browser: ${target.productUrl}`);
      return this.scrapeWithPuppeteer(target, proxyUrl, startTime);
    }

    // Heuristic 2: Tier 1 - Fast HTTP client (got-scraping / fetch with TLS fingerprinting)
    try {
      const httpResult = await this.scrapeWithHttp(target, proxyUrl, startTime);
      
      // If we got valid results without anti-bot blockage, return immediately
      if (httpResult.success && !httpResult.isCaptchaOrBlocked) {
        return httpResult;
      }

      console.warn(`[${this.name}] Tier 1 HTTP encountered challenge/block on ${target.productUrl}. Escalating to Puppeteer-Stealth.`);
    } catch (err: any) {
      console.warn(`[${this.name}] Tier 1 HTTP failed with error: ${err.message}. Escalating to Puppeteer-Stealth.`);
    }

    // Heuristic 3: Tier 2 - Escalation to Puppeteer-Stealth
    return this.scrapeWithPuppeteer(target, proxyUrl, startTime);
  }

  /**
   * Tier 1: Fast, low-memory HTTP scraping using realistic headers & Cheerio
   * Supports native ScraperAPI Cloud rendering without local browser overhead
   */
  protected async scrapeWithHttp(
    target: ScrapingTarget,
    proxyUrl: string | undefined,
    startTime: number
  ): Promise<ScrapeResult> {
    const { gotScraping } = await import('got-scraping');
    let fetchUrl = target.productUrl;
    let requestHeaders = ProxyManager.getStandardHeaders(target.countryCode);
    let effectiveProxy = proxyUrl;

    // Cloud ScraperAPI direct REST integration
    if (ENV.PROXY.PROVIDER === 'scraperapi' && ENV.PROXY.SCRAPER_API_KEY) {
      const renderParam = target.requiresHeadless ? '&render=true' : '';
      const countryParam = target.countryCode ? `&country_code=${target.countryCode.toLowerCase()}` : '';
      fetchUrl = `https://api.scraperapi.com/?api_key=${ENV.PROXY.SCRAPER_API_KEY}&url=${encodeURIComponent(target.productUrl)}${countryParam}${renderParam}`;
      effectiveProxy = undefined; // Handled directly by ScraperAPI endpoint
      requestHeaders = {}; // ScraperAPI manages headers automatically
    }

    const response = await gotScraping({
      url: fetchUrl,
      headers: requestHeaders,
      proxyUrl: effectiveProxy,
      timeout: { request: 30000 },
      retry: { limit: 1 },
      followRedirect: true,
      throwHttpErrors: false
    });

    const responseTimeMs = Date.now() - startTime;

    // Check for common HTTP block codes
    if (response.statusCode === 403 || response.statusCode === 429 || response.statusCode === 503) {
      return {
        success: false,
        currencyCode: target.currencyCode,
        inStock: false,
        responseTimeMs,
        engineUsed: 'cheerio_got',
        isCaptchaOrBlocked: true,
        errorMessage: `HTTP ${response.statusCode} Block detected`
      };
    }

    const html = response.body;
    const parsed = this.parseHtml(html, target);

    return {
      ...parsed,
      responseTimeMs,
      engineUsed: 'cheerio_got'
    };
  }

  /**
   * Tier 2: Headless Puppeteer-Stealth with disposable context & resource blocking
   */
  protected async scrapeWithPuppeteer(
    target: ScrapingTarget,
    proxyUrl: string | undefined,
    startTime: number
  ): Promise<ScrapeResult> {
    let browser: Browser | null = null;
    let page: any = null;

    try {
      browser = await this.getBrowserInstance(proxyUrl);
      page = await browser.newPage();

      // Optimize memory and bandwidth by blocking useless media assets
      await page.setRequestInterception(true);
      page.on('request', (req: any) => {
        const resourceType = req.resourceType();
        if (['image', 'stylesheet', 'font', 'media'].includes(resourceType)) {
          req.abort();
        } else {
          req.continue();
        }
      });

      // Emulate real browser fingerprint
      await page.setUserAgent(ProxyManager.getRandomUserAgent());
      await page.setExtraHTTPHeaders({
        'Accept-Language': ProxyManager.getAcceptLanguage(target.countryCode)
      });
      await page.setViewport({ width: 1920, height: 1080 });

      // Navigate with timeout
      await page.goto(target.productUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      });

      // Allow micro-delay for reactive hydration
      await new Promise((r) => setTimeout(r, 1200));

      const html = await page.content();
      const responseTimeMs = Date.now() - startTime;
      const parsed = this.parseHtml(html, target);

      return {
        ...parsed,
        responseTimeMs,
        engineUsed: 'puppeteer_stealth'
      };
    } catch (err: any) {
      return {
        success: false,
        currencyCode: target.currencyCode,
        inStock: false,
        responseTimeMs: Date.now() - startTime,
        engineUsed: 'puppeteer_stealth',
        errorMessage: `Puppeteer error: ${err.message}`
      };
    } finally {
      if (page) {
        await page.close().catch(() => {});
      }
      BaseScraper.browserUsageCount++;
      // Recycle browser instance periodically to eliminate memory leaks
      if (BaseScraper.browserUsageCount >= ENV.SCRAPING.MAX_PAGES_PER_BROWSER) {
        await this.recycleBrowser();
      }
    }
  }

  /**
   * Manages the singleton Puppeteer browser instance with recycling mechanics
   */
  protected async getBrowserInstance(proxyUrl?: string): Promise<Browser> {
    if (!BaseScraper.sharedBrowser) {
      const args = [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage', // Critical: prevents /dev/shm OOM in Docker
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ];

      if (proxyUrl) {
        args.push(`--proxy-server=${proxyUrl}`);
      }

      BaseScraper.sharedBrowser = (await puppeteer.launch({
        headless: true,
        args
      })) as unknown as Browser;
      BaseScraper.browserUsageCount = 0;
    }
    return BaseScraper.sharedBrowser;
  }

  /**
   * Closes and recreates the browser instance to release accumulated DOM & V8 heap memory
   */
  public async recycleBrowser(): Promise<void> {
    if (BaseScraper.sharedBrowser) {
      try {
        await BaseScraper.sharedBrowser.close();
      } catch (err) {
        console.error('Error closing browser during recycle:', err);
      }
      BaseScraper.sharedBrowser = null;
      BaseScraper.browserUsageCount = 0;
      console.log('[Puppeteer] Browser instance recycled to prevent memory leaks.');
    }
  }

  /**
   * Helper utility to normalize varied international currency strings to standard floating numbers
   * Handles "1,329.00 €", "174,800円", "4,699.00 AED", "56.999,00 TL", etc.
   */
  public static cleanPrice(raw: string): number | undefined {
    if (!raw) return undefined;

    let cleaned = raw.trim();

    // Remove currency symbols and non-numeric letters, preserving commas and periods
    cleaned = cleaned.replace(/[^0-9.,]/g, '');

    if (!cleaned) return undefined;

    // Detect German/European format: e.g. 1.329,00 -> periods as thousands, comma as decimal
    if (cleaned.includes('.') && cleaned.includes(',')) {
      if (cleaned.lastIndexOf(',') > cleaned.lastIndexOf('.')) {
        // European: 1.299,50 -> 1299.50
        cleaned = cleaned.replace(/\./g, '').replace(',', '.');
      } else {
        // Standard US/UK: 1,299.50 -> 1299.50
        cleaned = cleaned.replace(/,/g, '');
      }
    } else if (cleaned.includes(',')) {
      // E.g. Japanese Yen 174,800 -> 174800 OR European 50,00 -> 50.00
      const parts = cleaned.split(',');
      if (parts.length === 2 && parts[1].length === 2) {
        // likely European decimal: 49,99 -> 49.99
        cleaned = cleaned.replace(',', '.');
      } else {
        // thousands separator: 174,800 -> 174800
        cleaned = cleaned.replace(/,/g, '');
      }
    }

    const val = parseFloat(cleaned);
    return isNaN(val) ? undefined : val;
  }
}
