import { DatabaseService } from '../services/db.js';
import { MASTER_CATALOG } from '../data/masterCatalog.js';

interface FxRateMap {
  [currency: string]: number;
}

const CATEGORY_FALLBACK_MAP: Record<string, string> = {
  smartwatches: 'smartphones',
  laptops: 'gpus',
  cpus_motherboards: 'gpus',
  peripherals: 'mice',
  vr_ar: 'consoles',
  sim_racing: 'consoles',
  cameras: 'monitors',
  lenses: 'monitors',
  action_cams: 'monitors',
  drones: 'monitors',
  headphones: 'mice',
  pro_audio: 'mice',
  speakers: 'mice',
  personal_care: 'clothing',
  smart_home: 'monitors',
  projectors: 'monitors',
  luxury_fashion: 'clothing',
  perfumes_cosmetics: 'clothing',
  luxury_watches: 'clothing'
};

export async function runCatalogSeed(): Promise<void> {
  console.log('=============================================================================');
  console.log('  ARBITRIP - MASTER CATALOG PRODUCTION SEEDING ENGINE');
  console.log('=============================================================================');

  const supabase = DatabaseService.getClient();

  // 1. Fetch Categories
  console.log('\n[1/5] Resolving Product Categories...');
  const { data: dbCats, error: errCats } = await supabase.from('product_categories').select('id, code');
  if (errCats || !dbCats || dbCats.length === 0) {
    throw new Error(`Failed to load product_categories: ${errCats?.message}`);
  }

  const categoryMap: Map<string, string> = new Map();
  for (const c of dbCats) {
    categoryMap.set(c.code, c.id);
  }

  const defaultCatId = dbCats[0].id;

  // 2. Fetch Exchange Rates
  console.log('[2/5] Loading Real-Time FX Rates to TRY...');
  const { data: dbRates } = await supabase.from('fx_rates').select('base_currency, target_currency, rate');
  const fxRates: FxRateMap = {
    TRY: 1.0,
    USD: 35.80,
    EUR: 38.90,
    JPY: 0.238,
    GBP: 46.20,
    AED: 9.75,
    GEL: 13.10
  };

  if (dbRates) {
    for (const r of dbRates) {
      if (r.target_currency === 'TRY' && r.rate) {
        fxRates[r.base_currency] = Number(r.rate);
      }
    }
  }

  // 3. Fetch / Ensure Retailers
  console.log('[3/5] Syncing Global Retailers...');
  const { data: dbRetailers } = await supabase.from('retailers').select('id, name, country_code, currency_code');
  const retailerMap: Map<string, string> = new Map();

  if (dbRetailers) {
    for (const r of dbRetailers) {
      retailerMap.set(r.name, r.id);
    }
  }

  // Ensure any missing retailers from the catalog are created
  for (const prod of MASTER_CATALOG) {
    for (const p of prod.prices) {
      if (!retailerMap.has(p.retailerName)) {
        await DatabaseService.ensureCurrencyExists(p.currencyCode);
        const { data: newRet, error: retErr } = await supabase
          .from('retailers')
          .insert({
            name: p.retailerName,
            country_code: p.countryCode,
            currency_code: p.currencyCode,
            website_url: `https://${p.retailerName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
            is_domestic: p.countryCode === 'TR'
          })
          .select('id')
          .single();

        if (newRet) {
          retailerMap.set(p.retailerName, newRet.id);
          console.log(`  + Created Retailer: "${p.retailerName}" (${p.currencyCode})`);
        } else if (retErr) {
          console.warn(`  ! Retailer insert note for "${p.retailerName}": ${retErr.message}`);
        }
      }
    }
  }

  // 4. Insert / Sync Products and Prices
  console.log(`\n[4/5] Populating ${MASTER_CATALOG.length} High-Arbitrage Products into Supabase...`);

  let insertedProducts = 0;
  let insertedPrices = 0;
  let insertedSnapshots = 0;

  for (let i = 0; i < MASTER_CATALOG.length; i++) {
    const item = MASTER_CATALOG[i];

    // Determine category UUID (direct match or graceful fallback)
    let categoryId = categoryMap.get(item.categoryCode);
    if (!categoryId) {
      const fallbackCode = CATEGORY_FALLBACK_MAP[item.categoryCode];
      categoryId = categoryMap.get(fallbackCode) || defaultCatId;
    }

    // Check if product already exists by global_sku or model_name
    let productId: string | null = null;
    const { data: existingProd } = await supabase
      .from('products')
      .select('id')
      .or(`global_sku.eq.${item.globalSku},model_name.eq.${item.modelName}`)
      .limit(1);

    if (existingProd && existingProd.length > 0) {
      productId = existingProd[0].id;
      // Update specs and category
      await supabase
        .from('products')
        .update({
          category_id: categoryId,
          brand: item.brand,
          model_name: item.modelName,
          specs: item.specs,
          weight_kg: item.weightKg,
          is_active: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', productId);
    } else {
      const { data: newProd, error: prodErr } = await supabase
        .from('products')
        .insert({
          category_id: categoryId,
          brand: item.brand,
          model_name: item.modelName,
          global_sku: item.globalSku,
          specs: item.specs,
          weight_kg: item.weightKg,
          is_active: true
        })
        .select('id')
        .single();

      if (prodErr || !newProd) {
        console.error(`  [!] Failed to insert product "${item.modelName}":`, prodErr?.message);
        continue;
      }
      productId = newProd.id;
      insertedProducts++;
    }

    // 5. Insert Prices and Price Snapshots for this product
    for (const p of item.prices) {
      const retailerId = retailerMap.get(p.retailerName);
      if (!retailerId) continue;

      const rate = fxRates[p.currencyCode] || 1.0;
      const convertedTry = Math.round(p.priceOriginal * rate * 100) / 100;

      // Upsert into product_prices (live hot table)
      const { error: priceErr } = await supabase
        .from('product_prices')
        .upsert({
          product_id: productId,
          retailer_id: retailerId,
          price_original: p.priceOriginal,
          currency_code: p.currencyCode,
          price_try_converted: convertedTry,
          in_stock: true,
          last_scraped_at: new Date().toISOString()
        }, { onConflict: 'product_id,retailer_id' });

      if (!priceErr) insertedPrices++;

      // Insert into partitioned price_snapshots (time series history)
      const { error: snapErr } = await supabase
        .from('price_snapshots')
        .insert({
          product_id: productId,
          retailer_id: retailerId,
          price_original: p.priceOriginal,
          currency_code: p.currencyCode,
          price_try_converted: convertedTry,
          in_stock: true,
          discount_pct: 0,
          raw_title: `${item.brand} ${item.modelName}`,
          seller_name: p.retailerName,
          engine_used: 'master_catalog_seed',
          scraped_at: new Date().toISOString()
        });

      if (!snapErr) insertedSnapshots++;
    }

    process.stdout.write(`\r  ✓ Processed [${i + 1}/${MASTER_CATALOG.length}]: ${item.brand} - ${item.modelName.padEnd(45).substring(0, 45)}`);
  }

  console.log('\n\n=============================================================================');
  console.log('🎉 MASTER CATALOG SEEDING COMPLETED SUCCESSFULLY!');
  console.log('=============================================================================');
  console.log(`  📦 Total Products In Catalog: ${MASTER_CATALOG.length}`);
  console.log(`  ✨ Newly Created Products:    ${insertedProducts}`);
  console.log(`  💰 Updated/Inserted Prices:   ${insertedPrices}`);
  console.log(`  📊 Historical Snapshots:       ${insertedSnapshots}`);
  console.log('=============================================================================\n');
}

// Execute if run directly
if (process.argv[1]?.endsWith('seedCatalog.ts') || process.argv[1]?.endsWith('seedCatalog.js')) {
  runCatalogSeed().catch(err => {
    console.error('Fatal Error during catalog seed:', err);
    process.exit(1);
  });
}
