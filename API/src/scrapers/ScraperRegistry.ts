import { IScraperAdapter, ScrapingTarget } from '../types/index.js';
import { AmazonAdapter } from './adapters/AmazonAdapter.js';
import { YodobashiAdapter } from './adapters/YodobashiAdapter.js';

export class ScraperRegistry {
  private static adapters: IScraperAdapter[] = [
    new AmazonAdapter(),
    new YodobashiAdapter()
  ];

  /**
   * Registers a new adapter dynamically
   */
  public static registerAdapter(adapter: IScraperAdapter): void {
    this.adapters.push(adapter);
    console.log(`[ScraperRegistry] Registered adapter: ${adapter.name} (${adapter.adapterKey})`);
  }

  /**
   * Finds the matching adapter for a given target
   */
  public static getAdapter(target: ScrapingTarget): IScraperAdapter {
    const found = this.adapters.find((adapter) => adapter.canHandle(target));
    if (!found) {
      throw new Error(
        `[ScraperRegistry] No adapter found for retailer "${target.retailerName}" (adapterKey: ${target.scraperAdapter}, url: ${target.productUrl})`
      );
    }
    return found;
  }

  /**
   * Returns all currently registered adapters
   */
  public static getAllAdapters(): IScraperAdapter[] {
    return [...this.adapters];
  }
}
