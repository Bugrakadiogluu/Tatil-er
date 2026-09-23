export type ScrapingEngine = 'cheerio_got' | 'puppeteer_stealth';

export interface ScrapingTarget {
  id: string; // product_retailer_mapping ID
  productId: string;
  productName: string;
  retailerId: string;
  retailerName: string;
  countryCode: string; // ISO 3166-1 alpha-2 (e.g. 'JP', 'AE', 'DE', 'US')
  currencyCode: string; // 'JPY', 'AED', 'EUR', 'USD', 'TRY'
  productUrl: string;
  retailerSku?: string;
  scraperAdapter: string; // 'amazon_paapi' | 'puppeteer_yodobashi' | 'mediamarkt_de' | 'generic'
  requiresHeadless?: boolean;
  customSelectorPrice?: string;
  customSelectorStock?: string;
  priority?: number;
}

export interface ScrapeResult {
  success: boolean;
  priceOriginal?: number;
  currencyCode: string;
  inStock: boolean;
  rawTitle?: string;
  sellerName?: string;
  discountPct?: number;
  responseTimeMs: number;
  engineUsed: ScrapingEngine;
  errorMessage?: string;
  isCaptchaOrBlocked?: boolean;
}

export interface ProxyConfig {
  provider: 'brightdata' | 'scraperapi' | 'oxylabs' | 'direct';
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  apiKey?: string;
  countryCode?: string;
}

export interface IScraperAdapter {
  readonly adapterKey: string;
  readonly name: string;
  canHandle(target: ScrapingTarget): boolean;
  scrape(target: ScrapingTarget, proxyConfig?: ProxyConfig): Promise<ScrapeResult>;
}

export interface PriceSnapshotInsert {
  product_id: string;
  retailer_id: string;
  price_original: number;
  currency_code: string;
  price_try_converted?: number;
  in_stock: boolean;
  discount_pct?: number;
  raw_title?: string;
  seller_name?: string;
  response_time_ms: number;
  engine_used: ScrapingEngine;
  scraped_at?: string;
}
