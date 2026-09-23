import * as cheerio from 'cheerio';
import { DatabaseService } from './db.js';
import { BaseScraper } from '../scrapers/BaseScraper.js';
import { ENV } from '../config/env.js';

export interface AmazonStoreMarket {
  countryCode: string;
  tld: string;
  currencyCode: string;
  retailerName: string;
}

export class ProductDiscoveryService {
  // Complete list of Amazon regional marketplaces worldwide (22+ countries)
  public static regionalStores: AmazonStoreMarket[] = [
    // Europe & UK
    { countryCode: 'DE', tld: 'amazon.de', currencyCode: 'EUR', retailerName: 'Amazon Germany (DE)' },
    { countryCode: 'GB', tld: 'amazon.co.uk', currencyCode: 'GBP', retailerName: 'Amazon UK (GB)' },
    { countryCode: 'FR', tld: 'amazon.fr', currencyCode: 'EUR', retailerName: 'Amazon France (FR)' },
    { countryCode: 'IT', tld: 'amazon.it', currencyCode: 'EUR', retailerName: 'Amazon Italy (IT)' },
    { countryCode: 'ES', tld: 'amazon.es', currencyCode: 'EUR', retailerName: 'Amazon Spain (ES)' },
    { countryCode: 'NL', tld: 'amazon.nl', currencyCode: 'EUR', retailerName: 'Amazon Netherlands (NL)' },
    { countryCode: 'SE', tld: 'amazon.se', currencyCode: 'SEK', retailerName: 'Amazon Sweden (SE)' },
    { countryCode: 'PL', tld: 'amazon.pl', currencyCode: 'PLN', retailerName: 'Amazon Poland (PL)' },
    { countryCode: 'BE', tld: 'amazon.com.be', currencyCode: 'EUR', retailerName: 'Amazon Belgium (BE)' },

    // Middle East & Africa
    { countryCode: 'AE', tld: 'amazon.ae', currencyCode: 'AED', retailerName: 'Amazon UAE (AE)' },
    { countryCode: 'SA', tld: 'amazon.sa', currencyCode: 'SAR', retailerName: 'Amazon Saudi (SA)' },
    { countryCode: 'EG', tld: 'amazon.eg', currencyCode: 'EGP', retailerName: 'Amazon Egypt (EG)' },
    { countryCode: 'ZA', tld: 'amazon.co.za', currencyCode: 'ZAR', retailerName: 'Amazon South Africa (ZA)' },

    // Americas
    { countryCode: 'US', tld: 'amazon.com', currencyCode: 'USD', retailerName: 'Amazon US (US)' },
    { countryCode: 'CA', tld: 'amazon.ca', currencyCode: 'CAD', retailerName: 'Amazon Canada (CA)' },
    { countryCode: 'MX', tld: 'amazon.com.mx', currencyCode: 'MXN', retailerName: 'Amazon Mexico (MX)' },
    { countryCode: 'BR', tld: 'amazon.com.br', currencyCode: 'BRL', retailerName: 'Amazon Brazil (BR)' },

    // Asia-Pacific
    { countryCode: 'JP', tld: 'amazon.co.jp', currencyCode: 'JPY', retailerName: 'Amazon Japan (JP)' },
    { countryCode: 'SG', tld: 'amazon.sg', currencyCode: 'SGD', retailerName: 'Amazon Singapore (SG)' },
    { countryCode: 'AU', tld: 'amazon.com.au', currencyCode: 'AUD', retailerName: 'Amazon Australia (AU)' },
    { countryCode: 'IN', tld: 'amazon.in', currencyCode: 'INR', retailerName: 'Amazon India (IN)' },

    // Domestic Baseline
    { countryCode: 'TR', tld: 'amazon.com.tr', currencyCode: 'TRY', retailerName: 'Amazon Turkey (TR)' }
  ];

  // Top National Retail Chains for non-Amazon countries and key regional giants
  public static localRetailers: Array<{
    countryCode: string;
    countryName: string;
    retailerName: string;
    currencyCode: string;
    searchUrlPattern: string; // {q} will be replaced by encoded query
    itemSelector: string;
    titleSelector: string;
    priceSelector: string;
    linkSelector: string;
    requiresHeadless?: boolean;
  }> = [
    // Gürcistan (Georgia) - Vergisiz / Yakın Arbitraj Koridoru
    {
      countryCode: 'GE',
      countryName: 'Georgia',
      retailerName: 'Zoommer (GE)',
      currencyCode: 'GEL',
      searchUrlPattern: 'https://zoommer.ge/search?q={q}',
      itemSelector: '.product-card, .product_item, div[class*="product"]',
      titleSelector: '.product-title, h4, a[class*="title"]',
      priceSelector: '.product-price, .price, span[class*="price"]',
      linkSelector: 'a',
      requiresHeadless: false
    },
    // Güney Kore (South Korea) - Teknoloji Devi
    {
      countryCode: 'KR',
      countryName: 'South Korea',
      retailerName: 'Gmarket (KR)',
      currencyCode: 'KRW',
      searchUrlPattern: 'http://browse.gmarket.co.kr/search?keyword={q}',
      itemSelector: '.box__item-container, .box__information',
      titleSelector: '.text__item',
      priceSelector: '.box__price-seller strong, .text__value',
      linkSelector: '.link__item, a',
      requiresHeadless: false
    },
    // Kolombiya (Colombia) - Latin Amerika Arbitrajı
    {
      countryCode: 'CO',
      countryName: 'Colombia',
      retailerName: 'Alkosto (CO)',
      currencyCode: 'COP',
      searchUrlPattern: 'https://www.alkosto.com/search?text={q}',
      itemSelector: '.product__item, .product-card',
      titleSelector: '.product__information--name, h2',
      priceSelector: '.price, .product__price--discounts__price',
      linkSelector: 'a',
      requiresHeadless: true // Cloudflare korumalı, render: true
    },
    // Sırbistan (Serbia) - Balkan Koridoru
    {
      countryCode: 'RS',
      countryName: 'Serbia',
      retailerName: 'Gigatron (RS)',
      currencyCode: 'RSD',
      searchUrlPattern: 'https://gigatron.rs/pretraga?pojam={q}',
      itemSelector: '.item, .product-item',
      titleSelector: '.item-name, h3, a[class*="name"]',
      priceSelector: '.item-price, .price, span[class*="price"]',
      linkSelector: 'a',
      requiresHeadless: false
    },
    // Kazakistan (Kazakhstan) - Orta Asya Teknoloji
    {
      countryCode: 'KZ',
      countryName: 'Kazakhstan',
      retailerName: 'Technodom (KZ)',
      currencyCode: 'KZT',
      searchUrlPattern: 'https://www.technodom.kz/search?r={q}',
      itemSelector: 'article, div[class*="product-card"]',
      titleSelector: 'h2, p[class*="title"]',
      priceSelector: 'p[class*="price"], span[class*="price"]',
      linkSelector: 'a',
      requiresHeadless: true
    },
    // Japonya Yerel Dev (Japan Local Giant)
    {
      countryCode: 'JP',
      countryName: 'Japan',
      retailerName: 'Yodobashi Camera (JP)',
      currencyCode: 'JPY',
      searchUrlPattern: 'https://www.yodobashi.com/?word={q}',
      itemSelector: '.srcResultItem, .pListBlock',
      titleSelector: '.fs14, .productName',
      priceSelector: '.pPrice, .salesPrice',
      linkSelector: 'a',
      requiresHeadless: false
    },
    // Almanya Yerel Dev (Germany Local Giant)
    {
      countryCode: 'DE',
      countryName: 'Germany',
      retailerName: 'MediaMarkt Germany (DE)',
      currencyCode: 'EUR',
      searchUrlPattern: 'https://www.mediamarkt.de/de/search.html?query={q}',
      itemSelector: 'div[data-test="mms-search-srp-productlist_item"]',
      titleSelector: 'p[data-test="product-title"]',
      priceSelector: 'span[data-test="branded-price"]',
      linkSelector: 'a',
      requiresHeadless: true
    },
    // BAE Yerel Dev (UAE Local Giant)
    {
      countryCode: 'AE',
      countryName: 'United Arab Emirates',
      retailerName: 'Sharaf DG (AE)',
      currencyCode: 'AED',
      searchUrlPattern: 'https://uae.sharaf-dg.com/?s={q}&post_type=product',
      itemSelector: '.product-inner, .product-item',
      titleSelector: '.product-title, h2',
      priceSelector: '.price, .amount',
      linkSelector: 'a',
      requiresHeadless: false
    }
  ];

  /**
   * Orchestrates multi-country product discovery in two distinct stages:
   * AŞAMA 1: Küresel Amazon Pazaryerleri (22 Ülke)
   * AŞAMA 2: Yerel Ülke Perakende Zincirleri (Kore, Çin, Gürcistan, Kolombiya, Sırbistan vb.)
   */
  public static async autoDiscoverProductAcrossCountries(
    productId: string,
    searchKeyword: string
  ): Promise<void> {
    console.log(`\n=============================================================================`);
    console.log(`[AutoDiscovery] Küresel Fiyat Keşfi Başlatılıyor: "${searchKeyword}"`);
    console.log(`=============================================================================`);

    // AŞAMA 1: ÖNCE AMAZON MAĞAZALARI
    console.log(`\n>>> [AŞAMA 1/2] KÜRESEL AMAZON PAZARYERLERİ TARANIYOR (22 Ülke)...`);
    await this.scanAmazonStores(productId, searchKeyword);

    // AŞAMA 2: SONRA DİĞER ÜLKELERİN YEREL MAĞAZALARI
    console.log(`\n>>> [AŞAMA 2/2] YEREL ÜLKE ZİNCİR MAĞAZALARI TARANIYOR (Gürcistan, Kore, Kolombiya, Sırbistan vb.)...`);
    await this.scanLocalRetailers(productId, searchKeyword);

    console.log(`\n=============================================================================`);
    console.log(`[AutoDiscovery] Tüm aşamalar tamamlandı! Veriler Supabase'e işlendi.`);
    console.log(`=============================================================================\n`);
  }

  /**
   * AŞAMA 1: Küresel Amazon Pazaryerlerini Tarama
   */
  private static async scanAmazonStores(productId: string, searchKeyword: string): Promise<void> {
    const { gotScraping } = await import('got-scraping');

    for (const store of this.regionalStores) {
      try {
        console.log(`[AutoDiscovery] Searching ${store.retailerName} (${store.countryCode})...`);
        const searchUrl = `https://www.${store.tld}/s?k=${encodeURIComponent(searchKeyword)}`;

        let fetchUrl = searchUrl;
        if (ENV.PROXY.SCRAPER_API_KEY) {
          fetchUrl = `https://api.scraperapi.com/?api_key=${ENV.PROXY.SCRAPER_API_KEY}&url=${encodeURIComponent(searchUrl)}&country_code=${store.countryCode.toLowerCase()}`;
        }

        const response = await gotScraping({
          url: fetchUrl,
          timeout: { request: 30000 },
          throwHttpErrors: false
        });

        if (response.statusCode !== 200) {
          console.warn(`[AutoDiscovery] Received status ${response.statusCode} from ${store.tld}`);
          continue;
        }

        const $ = cheerio.load(response.body);

        // Scan the top 6 search results to find the genuine product, avoiding sponsored accessories
        const searchResults = $('div[data-component-type="s-search-result"]').slice(0, 6);
        if (searchResults.length === 0) {
          console.log(`[AutoDiscovery] No search results found on ${store.tld}`);
          continue;
        }

        let bestMatch: any = null;
        const negativeKeywords = ['ssd', 'drive', 'hdd', 'stand', 'cover', 'skin', 'case', 'controller', 'headset', 'cable', 'dock', 'cooling', 'bracket', 'accessory'];

        searchResults.each((_, el) => {
          if (bestMatch?.price) return; // already found a valid match

          const item = $(el);
          const asin = item.attr('data-asin') || '';
          const title = item.find('h2 a span').text().trim() || item.find('h2').text().trim();
          const relativeUrl = item.find('h2 a').attr('href') || '';
          const fullUrl = relativeUrl.startsWith('http') ? relativeUrl : `https://www.${store.tld}${relativeUrl}`;
          const titleLower = title.toLowerCase();

          // If searching for console, skip obvious accessories (like SSD, stand, skin)
          const isAccessory = negativeKeywords.some((neg) => titleLower.includes(neg) && !titleLower.includes('console') && !titleLower.includes('konsole'));
          if (isAccessory) {
            return;
          }

          // Price extraction from multiple cascading selectors
          let rawPriceStr = '';
          const offscreenPrice = item.find('.a-price .a-offscreen').first().text().trim();
          const wholePrice = item.find('.a-price-whole').first().text().replace(/[,.]/g, '').trim();
          const fracPrice = item.find('.a-price-fraction').first().text().trim();

          if (offscreenPrice) {
            rawPriceStr = offscreenPrice;
          } else if (wholePrice) {
            rawPriceStr = fracPrice ? `${wholePrice}.${fracPrice}` : wholePrice;
          } else {
            rawPriceStr = item.find('.a-color-price').first().text().trim();
          }

          const price = BaseScraper.cleanPrice(rawPriceStr);
          const isOutOfStock =
            item.text().includes('Currently unavailable') ||
            item.text().includes('Derzeit nicht verfügbar') ||
            item.text().includes('一時的に在庫切れ') ||
            item.text().includes('Out of stock');

          if (title && (price || isOutOfStock)) {
            bestMatch = {
              title,
              price,
              fullUrl,
              asin,
              inStock: !isOutOfStock && !!price
            };
          }
        });

        if (bestMatch && bestMatch.price) {
          console.log(
            `[AutoDiscovery] MATCH FOUND on ${store.retailerName}!\n  Title: ${bestMatch.title.substring(0, 50)}...\n  Price: ${bestMatch.price} ${store.currencyCode}\n  URL: ${bestMatch.fullUrl.substring(0, 60)}...`
          );

          // Resolve or register retailer in Supabase
          const retailerId = await this.ensureRetailerExists(store);

          if (retailerId) {
            // Upsert mapping and price snapshot
            await this.persistDiscoveredPrice(
              productId,
              retailerId,
              bestMatch.fullUrl,
              bestMatch.asin,
              bestMatch.price,
              store.currencyCode,
              bestMatch.title
            );
          }
        } else if (bestMatch && !bestMatch.price) {
          console.log(`[AutoDiscovery] Found "${bestMatch.title.substring(0, 40)}..." on ${store.tld}, but it is currently OUT OF STOCK / INVITATION ONLY (No public price).`);
        } else {
          console.log(`[AutoDiscovery] Result found on ${store.tld}, but no matching console with visible price was detected.`);
        }

        // Polite delay between stores
        await new Promise((r) => setTimeout(r, 1500));
      } catch (err: any) {
        console.error(`[AutoDiscovery] Failed searching ${store.tld}:`, err.message);
      }
    }

    console.log(`[AutoDiscovery] Amazon pazaryerleri taraması tamamlandı.\n`);
  }

  /**
   * AŞAMA 2: Amazon Dışındaki Yerel Ulusal Perakende Zincirlerini Tarama
   * (Gürcistan, Güney Kore, Kolombiya, Sırbistan, Kazakistan, Japonya, Almanya yerel vb.)
   */
  private static async scanLocalRetailers(productId: string, searchKeyword: string): Promise<void> {
    const { gotScraping } = await import('got-scraping');

    for (const store of this.localRetailers) {
      try {
        console.log(`[AutoDiscovery] Aranıyor: ${store.retailerName} (${store.countryName} - ${store.countryCode})...`);
        const targetSearchUrl = store.searchUrlPattern.replace('{q}', encodeURIComponent(searchKeyword));

        let fetchUrl = targetSearchUrl;
        if (ENV.PROXY.SCRAPER_API_KEY) {
          const renderParam = store.requiresHeadless ? '&render=true' : '';
          fetchUrl = `https://api.scraperapi.com/?api_key=${ENV.PROXY.SCRAPER_API_KEY}&url=${encodeURIComponent(targetSearchUrl)}&country_code=${store.countryCode.toLowerCase()}${renderParam}`;
        }

        const response = await gotScraping({
          url: fetchUrl,
          timeout: { request: 35000 },
          throwHttpErrors: false
        });

        if (response.statusCode !== 200) {
          console.warn(`[AutoDiscovery] ${store.retailerName} yanıt vermedi (Durum: ${response.statusCode})`);
          continue;
        }

        const $ = cheerio.load(response.body);
        const items = $(store.itemSelector).slice(0, 5);

        if (items.length === 0) {
          console.log(`[AutoDiscovery] ${store.retailerName} üzerinde ürün bulunamadı.`);
          continue;
        }

        let bestMatch: any = null;
        const negativeKeywords = ['ssd', 'drive', 'hdd', 'stand', 'cover', 'skin', 'case', 'controller', 'headset', 'cable', 'dock', 'cooling'];

        items.each((_, el) => {
          if (bestMatch) return;
          const item = $(el);

          // Title
          const title = item.find(store.titleSelector).first().text().trim() || item.text().trim();
          const titleLower = title.toLowerCase();

          // Skip accessories
          const isAccessory = negativeKeywords.some((neg) => titleLower.includes(neg) && !titleLower.includes('console') && !titleLower.includes('pro'));
          if (isAccessory) return;

          // URL
          let relativeUrl = item.find(store.linkSelector).first().attr('href') || item.attr('href') || '';
          if (relativeUrl && !relativeUrl.startsWith('http')) {
            try {
              const baseDomain = new URL(store.searchUrlPattern).origin;
              relativeUrl = `${baseDomain}${relativeUrl.startsWith('/') ? '' : '/'}${relativeUrl}`;
            } catch {}
          }

          // Price extraction: selector -> meta itemprop -> text
          let rawPrice = item.find(store.priceSelector).first().text().trim();
          if (!rawPrice) {
            rawPrice = item.find('[itemprop="price"]').attr('content') || '';
          }
          if (!rawPrice) {
            rawPrice = $('meta[property="product:price:amount"]').attr('content') || '';
          }

          const price = BaseScraper.cleanPrice(rawPrice);
          if (title && price && price > 0) {
            bestMatch = {
              title,
              price,
              fullUrl: relativeUrl || targetSearchUrl
            };
          }
        });

        if (bestMatch) {
          console.log(
            `[AutoDiscovery] YEREL EŞLEŞME BULUNDU! (${store.retailerName})\n  Başlık: ${bestMatch.title.substring(0, 55)}...\n  Fiyat: ${bestMatch.price.toLocaleString()} ${store.currencyCode}\n  URL: ${bestMatch.fullUrl.substring(0, 60)}...`
          );

          const retailerId = await this.ensureLocalRetailerExists(store);
          if (retailerId) {
            await this.persistDiscoveredPrice(
              productId,
              retailerId,
              bestMatch.fullUrl,
              undefined,
              bestMatch.price,
              store.currencyCode,
              bestMatch.title
            );
          }
        } else {
          console.log(`[AutoDiscovery] ${store.retailerName} aramasında geçerli fiyatlı eşleşme çıkmadı.`);
        }

        await new Promise((r) => setTimeout(r, 1500));
      } catch (err: any) {
        console.error(`[AutoDiscovery] ${store.retailerName} hatası:`, err.message);
      }
    }
  }

  private static async ensureLocalRetailerExists(store: (typeof ProductDiscoveryService.localRetailers)[0]): Promise<string | null> {
    const supabase = DatabaseService.getClient();

    const { data: existing } = await supabase
      .from('retailers')
      .select('id')
      .eq('name', store.retailerName)
      .single();

    if (existing?.id) return existing.id;

    let baseWebsite = '';
    try {
      baseWebsite = new URL(store.searchUrlPattern).origin;
    } catch {
      baseWebsite = store.searchUrlPattern;
    }

    await DatabaseService.ensureCurrencyExists(store.currencyCode);

    const { data: inserted, error } = await supabase
      .from('retailers')
      .insert({
        name: store.retailerName,
        country_code: store.countryCode,
        currency_code: store.currencyCode,
        website_url: baseWebsite,
        is_domestic: false,
        scraper_adapter: 'generic_local',
        proxy_country_code: store.countryCode
      })
      .select('id')
      .single();

    if (error) {
      console.error(`[AutoDiscovery] Error creating local retailer ${store.retailerName}:`, error.message);
      return null;
    }

    return inserted?.id || null;
  }

  private static async ensureRetailerExists(store: AmazonStoreMarket): Promise<string | null> {
    const supabase = DatabaseService.getClient();

    const { data: existing } = await supabase
      .from('retailers')
      .select('id')
      .eq('name', store.retailerName)
      .single();

    if (existing?.id) return existing.id;

    // Ensure currency exists before creating retailer
    await DatabaseService.ensureCurrencyExists(store.currencyCode);

    // Create if missing
    const { data: inserted, error } = await supabase
      .from('retailers')
      .insert({
        name: store.retailerName,
        country_code: store.countryCode,
        currency_code: store.currencyCode,
        website_url: `https://www.${store.tld}`,
        is_domestic: false,
        scraper_adapter: 'amazon_paapi',
        proxy_country_code: store.countryCode
      })
      .select('id')
      .single();

    if (error) {
      console.error(`[AutoDiscovery] Error creating retailer ${store.retailerName}:`, error.message);
      return null;
    }

    return inserted?.id || null;
  }

  private static async persistDiscoveredPrice(
    productId: string,
    retailerId: string,
    productUrl: string,
    asin: string | undefined,
    price: number,
    currencyCode: string,
    rawTitle: string
  ): Promise<void> {
    const supabase = DatabaseService.getClient();

    // 1. Save or update product_retailer_mappings
    await supabase
      .from('product_retailer_mappings')
      .upsert({
        product_id: productId,
        retailer_id: retailerId,
        product_url: productUrl,
        retailer_sku: asin || '',
        is_monitored: true,
        last_scraped_at: new Date().toISOString(),
        last_scrape_status: 'SUCCESS'
      }, { onConflict: 'product_id,retailer_id' });

    // 2. Insert into price_snapshots (this auto-updates product_prices via our trigger)
    await DatabaseService.insertSnapshot({
      product_id: productId,
      retailer_id: retailerId,
      price_original: price,
      currency_code: currencyCode,
      in_stock: true,
      raw_title: rawTitle,
      response_time_ms: 1200,
      engine_used: 'cheerio_got',
      scraped_at: new Date().toISOString()
    });
  }
}
