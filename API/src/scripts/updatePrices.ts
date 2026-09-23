import { DatabaseService } from '../services/db.js';
import { ProductDiscoveryService } from '../services/discovery.js';

interface UpdateOptions {
  all?: boolean;
  limit?: number;
  query?: string;
  category?: string;
}

export async function runPriceUpdate(options: UpdateOptions = {}): Promise<void> {
  console.log('=============================================================================');
  console.log('  ARBITRIP - GLOBAL AUTOMATED PRICE UPDATER');
  console.log('=============================================================================');

  const supabase = DatabaseService.getClient();

  if (options.query) {
    console.log(`\n[Updater] Single Product Update Requested: "${options.query}"`);
    const prodId = await DatabaseService.ensureProductExists(options.query);
    await ProductDiscoveryService.autoDiscoverProductAcrossCountries(prodId, options.query);
    return;
  }

  // Fetch active products from catalog
  console.log('\n[Updater] Fetching products to update from Supabase...');
  let queryBuilder = supabase
    .from('products')
    .select('id, brand, model_name, global_sku')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (options.limit && !options.all) {
    queryBuilder = queryBuilder.limit(options.limit);
  } else if (!options.all) {
    // Default to top 15 most lucrative arbitrage products if not specified
    queryBuilder = queryBuilder.limit(15);
  }

  const { data: products, error } = await queryBuilder;

  if (error || !products || products.length === 0) {
    console.error('[Updater] Failed to retrieve products:', error?.message);
    return;
  }

  console.log(`[Updater] Queued ${products.length} products for live cross-border price updates.`);
  console.log('=============================================================================');

  for (let i = 0; i < products.length; i++) {
    const prod = products[i];
    const searchTerm = `${prod.brand} ${prod.model_name}`.trim();

    console.log(`\n>>> [${i + 1}/${products.length}] Updating: "${searchTerm}"...`);
    try {
      await ProductDiscoveryService.autoDiscoverProductAcrossCountries(prod.id, searchTerm);
      console.log(`  ✓ Completed update for "${searchTerm}"`);
    } catch (err: any) {
      console.error(`  ✕ Error updating "${searchTerm}":`, err.message);
    }

    // Gentle throttle between products to avoid IP or rate limit pressure
    if (i < products.length - 1) {
      console.log('  [Updater] Waiting 3 seconds before next product...');
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  console.log('\n=============================================================================');
  console.log('🎉 ALL REQUESTED PRODUCT PRICES HAVE BEEN UPDATED AND RECORDED!');
  console.log('=============================================================================\n');
}

// CLI argument parsing
const args = process.argv.slice(2);
const options: UpdateOptions = {};

if (args.includes('--all')) {
  options.all = true;
}

if (args.includes('--limit')) {
  const idx = args.indexOf('--limit');
  options.limit = parseInt(args[idx + 1], 10) || 15;
}

if (args.includes('--query')) {
  const idx = args.indexOf('--query');
  options.query = args[idx + 1];
}

if (process.argv[1]?.endsWith('updatePrices.ts') || process.argv[1]?.endsWith('updatePrices.js')) {
  runPriceUpdate(options).catch(err => {
    console.error('Fatal Updater Error:', err);
    process.exit(1);
  });
}
