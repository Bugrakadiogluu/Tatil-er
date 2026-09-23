import { BaseScraper } from '../BaseScraper.js';
import { ScrapingTarget, ScrapeResult } from '../../types/index.js';
import * as cheerio from 'cheerio';

export class AmazonAdapter extends BaseScraper {
  readonly adapterKey = 'amazon_paapi';
  readonly name = 'Amazon Global Scraper Adapter';

  private supportedDomains = [
    'amazon.com',
    'amazon.ae',
    'amazon.de',
    'amazon.co.jp',
    'amazon.co.uk',
    'amazon.fr',
    'amazon.it',
    'amazon.es',
    'amazon.com.tr',
    'amazon.sg',
    'amazon.sa'
  ];

  public canHandle(target: ScrapingTarget): boolean {
    if (target.scraperAdapter === this.adapterKey) return true;
    try {
      const url = new URL(target.productUrl);
      return this.supportedDomains.some((domain) => url.hostname.includes(domain));
    } catch {
      return false;
    }
  }

  public parseHtml(html: string, target: ScrapingTarget): Omit<ScrapeResult, 'responseTimeMs' | 'engineUsed'> {
    const $ = cheerio.load(html);

    // 1. Detect Amazon Robot / Anti-Bot CAPTCHA Challenge
    const titleText = $('title').text().trim().toLowerCase();
    const isCaptcha =
      titleText.includes('robot check') ||
      titleText.includes('bot check') ||
      $('form[action*="validateCaptcha"]').length > 0 ||
      html.includes('Type the characters you see in this image');

    if (isCaptcha) {
      return {
        success: false,
        currencyCode: target.currencyCode,
        inStock: false,
        isCaptchaOrBlocked: true,
        errorMessage: 'Amazon Anti-Bot CAPTCHA page triggered'
      };
    }

    // 2. Extract Product Title
    const rawTitle = $('#productTitle').text().trim() || $('meta[name="title"]').attr('content')?.trim();

    // 3. Extract Price using Amazon's cascade selectors
    const priceSelectors = [
      '#corePrice_feature_div .a-price .a-offscreen',
      '#corePriceDisplay_desktop_feature_div .a-price .a-offscreen',
      '.apexPriceToPay .a-offscreen',
      '#priceblock_ourprice',
      '#priceblock_dealprice',
      '#price_inside_buybox',
      '.a-price.priceToPay .a-offscreen',
      '#sns-base-price'
    ];

    let rawPriceStr = '';
    for (const selector of priceSelectors) {
      const el = $(selector).first();
      if (el.length > 0 && el.text().trim()) {
        rawPriceStr = el.text().trim();
        break;
      }
    }

    // Custom CSS selector override if specified on target mapping
    if (!rawPriceStr && target.customSelectorPrice) {
      rawPriceStr = $(target.customSelectorPrice).first().text().trim();
    }

    const price = BaseScraper.cleanPrice(rawPriceStr);

    // 4. Extract Stock & Availability
    const availabilityText = $('#availability').text().trim().toLowerCase();
    let inStock = true;

    if (
      availabilityText.includes('currently unavailable') ||
      availabilityText.includes('out of stock') ||
      availabilityText.includes('derzeit nicht verfügbar') ||
      availabilityText.includes('一時的に在庫切れ') ||
      availabilityText.includes('mevcut değil') ||
      $('#outOfStock').length > 0
    ) {
      inStock = false;
    }

    // 5. Extract Seller / Merchant Name
    const sellerName =
      $('#sellerProfileTriggerId').text().trim() ||
      $('#merchant-info').text().trim() ||
      'Amazon.com';

    // 6. Extract Discount Percentage if available
    let discountPct = 0;
    const discountText = $('.savingsPercentage').first().text().trim();
    if (discountText) {
      const match = discountText.match(/(\d+)%/);
      if (match) {
        discountPct = parseFloat(match[1]);
      }
    }

    const success = typeof price === 'number' && price > 0;

    return {
      success,
      priceOriginal: price,
      currencyCode: target.currencyCode,
      inStock: inStock && success,
      rawTitle,
      sellerName,
      discountPct,
      errorMessage: success ? undefined : 'Failed to extract valid price from Amazon DOM'
    };
  }
}
