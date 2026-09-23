import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ENV } from '../config/env.js';
import { ScrapingTarget, PriceSnapshotInsert } from '../types/index.js';

export class DatabaseService {
  private static instance: SupabaseClient | null = null;

  public static getClient(): SupabaseClient {
    if (!this.instance) {
      this.instance = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_KEY, {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      });
    }
    return this.instance;
  }

  /**
   * Automatically resolves an existing product or dynamically creates it in Supabase
   * so foreign key errors never occur when discovering new products (e.g. RTX 5090)
   */
  public static async ensureProductExists(searchKeyword: string): Promise<string> {
    const supabase = this.getClient();
    const cleanName = searchKeyword.trim();

    // 1. Check if already exists by fuzzy name match
    const { data: existing } = await supabase
      .from('products')
      .select('id')
      .ilike('model_name', `%${cleanName}%`)
      .limit(1);

    if (existing && existing.length > 0) {
      return existing[0].id;
    }

    // 2. Infer brand and category from keyword
    const lower = cleanName.toLowerCase();
    let categoryCode = 'gpus';
    let brand = 'Generic';

    if (lower.includes('rtx') || lower.includes('gtx') || lower.includes('geforce') || lower.includes('gpu') || lower.includes('radeon')) {
      categoryCode = 'gpus';
      brand = lower.includes('radeon') ? 'AMD' : 'NVIDIA';
    } else if (lower.includes('iphone') || lower.includes('samsung') || lower.includes('pixel') || lower.includes('xiaomi') || lower.includes('phone')) {
      categoryCode = 'smartphones';
      brand = lower.includes('iphone') ? 'Apple' : lower.includes('samsung') ? 'Samsung' : 'Google';
    } else if (lower.includes('ps5') || lower.includes('playstation') || lower.includes('xbox') || lower.includes('switch') || lower.includes('console')) {
      categoryCode = 'consoles';
      brand = lower.includes('xbox') ? 'Microsoft' : lower.includes('switch') ? 'Nintendo' : 'Sony';
    } else if (lower.includes('monitor') || lower.includes('oled') || lower.includes('screen')) {
      categoryCode = 'monitors';
      brand = 'Display';
    }

    // 3. Resolve category UUID
    const { data: cat } = await supabase
      .from('product_categories')
      .select('id')
      .eq('code', categoryCode)
      .single();

    let categoryId = cat?.id;
    if (!categoryId) {
      const { data: firstCat } = await supabase.from('product_categories').select('id').limit(1).single();
      categoryId = firstCat?.id;
    }

    // 4. Insert new product
    const { data: newProd, error } = await supabase
      .from('products')
      .insert({
        category_id: categoryId,
        brand,
        model_name: cleanName.toUpperCase(),
        global_sku: `AUTO-${Date.now()}`,
        is_active: true
      })
      .select('id')
      .single();

    if (error) {
      console.error('[DatabaseService] Failed to auto-create product:', error.message);
      const { data: fallback } = await supabase.from('products').select('id').limit(1).single();
      return fallback?.id || '00000000-0000-0000-0000-000000000000';
    }

    console.log(`[DatabaseService] AUTO-CREATED product in Supabase: "${cleanName.toUpperCase()}" (ID: ${newProd.id})`);
    return newProd.id;
  }

  /**
   * Fetches active scraping targets configured in product_retailer_mappings
   */
  public static async fetchActiveTargets(): Promise<ScrapingTarget[]> {
    const supabase = this.getClient();

    const { data, error } = await supabase
      .from('product_retailer_mappings')
      .select(`
        id,
        product_id,
        retailer_id,
        product_url,
        retailer_sku,
        custom_selector_price,
        custom_selector_stock,
        priority,
        products (
          id,
          model_name,
          brand
        ),
        retailers (
          id,
          name,
          country_code,
          currency_code,
          scraper_adapter,
          requires_headless
        )
      `)
      .eq('is_monitored', true);

    if (error) {
      console.error('[DatabaseService] Failed to fetch scraping targets:', error.message);
      return [];
    }

    if (!data || data.length === 0) {
      console.warn('[DatabaseService] No active scraping targets found in product_retailer_mappings.');
      return [];
    }

    return data.map((row: any) => ({
      id: row.id,
      productId: row.product_id,
      productName: `${row.products?.brand || ''} ${row.products?.model_name || ''}`.trim(),
      retailerId: row.retailer_id,
      retailerName: row.retailers?.name || 'Unknown Retailer',
      countryCode: row.retailers?.country_code || 'US',
      currencyCode: row.retailers?.currency_code || 'USD',
      productUrl: row.product_url,
      retailerSku: row.retailer_sku,
      scraperAdapter: row.retailers?.scraper_adapter || 'generic',
      requiresHeadless: row.retailers?.requires_headless || false,
      customSelectorPrice: row.custom_selector_price,
      customSelectorStock: row.custom_selector_stock,
      priority: row.priority || 1
    }));
  }

  /**
   * Inserts a price snapshot into the partitioned price_snapshots table.
   * The database trigger automatically propagates this to `product_prices`.
   */
  public static async insertSnapshot(snapshot: PriceSnapshotInsert): Promise<boolean> {
    const supabase = this.getClient();

    // Ensure currency exists in currencies table
    await this.ensureCurrencyExists(snapshot.currency_code);

    const { error } = await supabase
      .from('price_snapshots')
      .insert({
        product_id: snapshot.product_id,
        retailer_id: snapshot.retailer_id,
        price_original: snapshot.price_original,
        currency_code: snapshot.currency_code,
        price_try_converted: snapshot.price_try_converted || 0,
        in_stock: snapshot.in_stock,
        discount_pct: snapshot.discount_pct || 0,
        raw_title: snapshot.raw_title,
        seller_name: snapshot.seller_name,
        response_time_ms: snapshot.response_time_ms,
        engine_used: snapshot.engine_used,
        scraped_at: snapshot.scraped_at || new Date().toISOString()
      });

    if (error) {
      console.error('[DatabaseService] Failed to insert price snapshot:', error.message);
      return false;
    }

    return true;
  }

  /**
   * Records a scrape failure on the target mapping
   */
  public static async recordTargetError(targetId: string, errorMessage: string): Promise<void> {
    const supabase = this.getClient();

    await supabase
      .from('product_retailer_mappings')
      .update({
        last_scrape_status: 'FAILED',
        last_error_message: errorMessage,
        scrape_error_count: 1, // trigger or increment
        updated_at: new Date().toISOString()
      })
      .eq('id', targetId);
  }

  /**
   * Automatically ensures that a currency code exists in the currencies table
   */
  public static async ensureCurrencyExists(currencyCode: string): Promise<void> {
    const supabase = this.getClient();
    const code = currencyCode.toUpperCase();

    const { data } = await supabase
      .from('currencies')
      .select('code')
      .eq('code', code)
      .single();

    if (!data) {
      await supabase
        .from('currencies')
        .insert({
          code,
          name: `${code} Currency`,
          symbol: code,
          decimal_digits: 2,
          is_active: true
        })
        .select()
        .single();
    }
  }
}
