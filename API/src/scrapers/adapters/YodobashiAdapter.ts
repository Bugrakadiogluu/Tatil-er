import { BaseScraper } from '../BaseScraper.js';
import { ScrapingTarget, ScrapeResult } from '../../types/index.js';
import * as cheerio from 'cheerio';

export class YodobashiAdapter extends BaseScraper {
  readonly adapterKey = 'puppeteer_yodobashi';
  readonly name = 'Yodobashi Camera Japan Scraper Adapter';

  public canHandle(target: ScrapingTarget): boolean {
    if (target.scraperAdapter === this.adapterKey) return true;
    try {
      const url = new URL(target.productUrl);
      return url.hostname.includes('yodobashi.com');
    } catch {
      return false;
    }
  }

  public parseHtml(html: string, target: ScrapingTarget): Omit<ScrapeResult, 'responseTimeMs' | 'engineUsed'> {
    const $ = cheerio.load(html);

    // 1. Detect Block or Access Denied
    const titleText = $('title').text().trim();
    if (titleText.includes('Access Denied') || html.includes('403 Forbidden')) {
      return {
        success: false,
        currencyCode: 'JPY',
        inStock: false,
        isCaptchaOrBlocked: true,
        errorMessage: 'Yodobashi Access Denied / IP Block'
      };
    }

    // 2. Extract Product Title
    const rawTitle =
      $('#products_maintitle h1').text().trim() ||
      $('.productName').text().trim() ||
      $('h1.pName').text().trim();

    // 3. Extract Price (Japanese Yen)
    // Primary selectors: #js_scl_unitPrice, .salesPrice, .pPrice
    const priceSelectors = [
      '#js_scl_unitPrice',
      '.salesPrice',
      '.pPrice',
      'span[itemprop="price"]',
      '.pDetailPrice strong'
    ];

    let rawPriceStr = '';
    for (const selector of priceSelectors) {
      const el = $(selector).first();
      if (el.length > 0 && el.text().trim()) {
        rawPriceStr = el.text().trim();
        break;
      }
    }

    if (!rawPriceStr && target.customSelectorPrice) {
      rawPriceStr = $(target.customSelectorPrice).first().text().trim();
    }

    const price = BaseScraper.cleanPrice(rawPriceStr);

    // 4. Extract Stock Status
    // Japanese statuses: 在庫あり (In stock), 在庫残少 (Low stock), お取り寄せ (Backorder), 販売を終了しました (Discontinued)
    const stockText =
      $('#js_scl_stock').text().trim() ||
      $('.stock').text().trim() ||
      $('.salesStatus').text().trim();

    let inStock = true;
    if (
      stockText.includes('販売を終了') ||
      stockText.includes('予定数の販売を終了') ||
      stockText.includes('在庫切れ') ||
      stockText.includes('現在取り扱いがございません')
    ) {
      inStock = false;
    }

    // 5. Extract Reward Points (e.g. 10% Gold Points)
    let discountPct = 0;
    const pointText = $('.pPoint').text() || $('.goldPoint').text();
    const match = pointText.match(/(\d+)%/);
    if (match) {
      discountPct = parseFloat(match[1]);
    }

    const success = typeof price === 'number' && price > 0;

    return {
      success,
      priceOriginal: price,
      currencyCode: 'JPY',
      inStock: inStock && success,
      rawTitle,
      sellerName: 'Yodobashi Camera Japan',
      discountPct,
      errorMessage: success ? undefined : 'Failed to extract valid price from Yodobashi DOM'
    };
  }
}
