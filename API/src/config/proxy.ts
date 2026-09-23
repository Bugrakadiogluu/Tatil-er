import { ProxyConfig } from '../types/index.js';
import { ENV } from './env.js';

export class ProxyManager {
  private static userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_3_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3.1 Safari/605.1.15'
  ];

  /**
   * Generates a geo-targeted proxy string matching the target retailer's country
   */
  public static getProxyUrl(countryCode: string): string | undefined {
    const { PROVIDER, HOST, PORT, USERNAME, PASSWORD, SCRAPER_API_KEY } = ENV.PROXY;

    if (PROVIDER === 'brightdata' && HOST && USERNAME && PASSWORD) {
      // Bright Data Residential: append country code to username
      // Format: http://brd-customer-XYZ-zone-residential-country-jp:password@brd.superproxy.io:22225
      const cleanUser = USERNAME.replace(/-country-[a-z]{2}/i, '');
      const geoUsername = `${cleanUser}-country-${countryCode.toLowerCase()}`;
      return `http://${geoUsername}:${PASSWORD}@${HOST}:${PORT}`;
    }

    if (PROVIDER === 'scraperapi' && SCRAPER_API_KEY) {
      // ScraperAPI proxy mode with country targeting
      return `http://scraperapi.country_code=${countryCode.toLowerCase()}:${SCRAPER_API_KEY}@proxy-server.scraperapi.com:8001`;
    }

    if (PROVIDER === 'oxylabs' && HOST && USERNAME && PASSWORD) {
      // Oxylabs Residential: customer-username-cc-jp:password@pr.oxylabs.io:7777
      const geoUsername = `customer-${USERNAME}-cc-${countryCode.toLowerCase()}`;
      return `http://${geoUsername}:${PASSWORD}@${HOST}:${PORT}`;
    }

    // Direct connection or fallback
    return undefined;
  }

  /**
   * Returns a random desktop User-Agent string
   */
  public static getRandomUserAgent(): string {
    const index = Math.floor(Math.random() * this.userAgents.length);
    return this.userAgents[index];
  }

  /**
   * Returns country-appropriate Accept-Language headers to match local traffic
   */
  public static getAcceptLanguage(countryCode: string): string {
    const code = countryCode.toUpperCase();
    switch (code) {
      case 'JP':
        return 'ja-JP,ja;q=0.9,en-US;q=0.8,en;q=0.7';
      case 'DE':
      case 'AT':
        return 'de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7';
      case 'AE':
      case 'SA':
        return 'ar-AE,ar;q=0.9,en-US;q=0.8,en;q=0.7';
      case 'GB':
        return 'en-GB,en;q=0.9,en-US;q=0.8';
      case 'US':
        return 'en-US,en;q=0.9';
      case 'TR':
        return 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7';
      case 'FR':
        return 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7';
      case 'GE':
        return 'ka-GE,ka;q=0.9,ru;q=0.8,en;q=0.7';
      default:
        return 'en-US,en;q=0.9';
    }
  }

  /**
   * Standard browser headers to pass basic TLS/header consistency checks
   */
  public static getStandardHeaders(countryCode: string): Record<string, string> {
    return {
      'User-Agent': this.getRandomUserAgent(),
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': this.getAcceptLanguage(countryCode),
      'Accept-Encoding': 'gzip, deflate, br',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Sec-Ch-Ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': '"Windows"',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Upgrade-Insecure-Requests': '1'
    };
  }
}
