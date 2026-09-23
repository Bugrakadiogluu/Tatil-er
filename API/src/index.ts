import { AutonomousScheduler } from './scheduler/cronJob.js';
import { ScrapingEngine } from './services/engine.js';
import { DatabaseService } from './services/db.js';
import { ScrapingTarget } from './types/index.js';

async function main() {
  console.log('=============================================================================');
  console.log('  GLOBAL PRICE AGGREGATOR API - CROSS-BORDER ARBITRAGE (ARBITRIP)');
  console.log('=============================================================================');

  const args = process.argv.slice(2);

  if (args.includes('--test')) {
    console.log('[CLI] Running in TEST mode. Testing concrete adapters...');

    // Test Target 1: Amazon UAE (PlayStation 5 Pro)
    const testTargetAmazon: ScrapingTarget = {
      id: '00000000-0000-0000-0000-000000000001',
      productId: '00000000-0000-0000-0000-000000000001',
      productName: 'Sony PlayStation 5 Pro 2TB',
      retailerId: '00000000-0000-0000-0000-000000000002',
      retailerName: 'Amazon UAE (AE)',
      countryCode: 'AE',
      currencyCode: 'AED',
      productUrl: 'https://www.amazon.ae/dp/B0DFV295Q5',
      scraperAdapter: 'amazon_paapi'
    };

    // Test Target 2: Yodobashi Japan (PlayStation 5 Pro)
    const testTargetYodobashi: ScrapingTarget = {
      id: '00000000-0000-0000-0000-000000000002',
      productId: '00000000-0000-0000-0000-000000000001',
      productName: 'Sony PlayStation 5 Pro 2TB',
      retailerId: '00000000-0000-0000-0000-000000000003',
      retailerName: 'Yodobashi Camera (JP)',
      countryCode: 'JP',
      currencyCode: 'JPY',
      productUrl: 'https://www.yodobashi.com/product/100000001008681285/',
      scraperAdapter: 'puppeteer_yodobashi',
      requiresHeadless: false // Will attempt Cheerio first, auto-escalate if needed
    };

    console.log('\n--- Executing Amazon Test Scrape ---');
    const resAmazon = await ScrapingEngine.scrapeTarget(testTargetAmazon);
    console.log('Amazon Result:', JSON.stringify(resAmazon, null, 2));

    console.log('\n--- Executing Yodobashi Test Scrape ---');
    const resYodobashi = await ScrapingEngine.scrapeTarget(testTargetYodobashi);
    console.log('Yodobashi Result:', JSON.stringify(resYodobashi, null, 2));

    process.exit(0);
  }

  if (args.includes('--arbitrage')) {
    const query = args[args.indexOf('--arbitrage') + 1] || 'PlayStation 5 Pro';
    const { ArbitrageCalculatorService } = await import('./services/arbitrage.js');
    console.log(`\n[Arbitrage] Calculating cross-border arbitrage for: "${query}"...`);
    const report = await ArbitrageCalculatorService.calculateArbitrageForProduct(query);

    if (!report) {
      console.log(`[Arbitrage] No active data found for "${query}".`);
      process.exit(0);
    }

    console.log(`\n=============================================================================`);
    console.log(`  ARBITRAJ RAPORU: ${report.brand} - ${report.modelName}`);
    console.log(`  Türkiye Baz Fiyatı (${report.domesticRetailer}): ${report.domesticPriceTry.toLocaleString('tr-TR')} ₺`);
    console.log(`=============================================================================`);

    console.log(`\n🏆 EN KARLI ÜLKE FIRSATLARI SIRALAMASI:`);
    for (const opp of report.allOpportunities) {
      console.log(`\n  [Sıra #${opp.rank}] ${opp.countryName} (${opp.countryCode}) - ${opp.retailerName}`);
      console.log(`  ├─ Yerel Fiyat: ${opp.originalPrice.toLocaleString()} ${opp.currencyCode} (${opp.convertedPriceTry.toLocaleString('tr-TR')} ₺)`);
      console.log(`  ├─ Vergi İadesi (Tax-Free): -${opp.vatRefundTry.toLocaleString('tr-TR')} ₺ (%${opp.vatRefundPct})`);
      console.log(`  ├─ Gümrük/Kayıt Harcı: +${opp.customsFeesTry.toLocaleString('tr-TR')} ₺`);
      console.log(`  ├─ Net Maliyet: ${opp.netAbroadLandedCostTry.toLocaleString('tr-TR')} ₺`);
      console.log(`  ├─ Net Kâr / Tasarruf: ${opp.netSavingsTry.toLocaleString('tr-TR')} ₺ (%${opp.savingsPercentage})`);
      console.log(`  └─ Durum: ${opp.verdictTurkish}`);
    }
    console.log(`\n=============================================================================\n`);
    return;
  }

  if (args.includes('--discover')) {
    const keyword = args[args.indexOf('--discover') + 1] || 'PlayStation 5 Pro 2TB';
    const { ProductDiscoveryService } = await import('./services/discovery.js');
    const { DatabaseService } = await import('./services/db.js');

    // Ensure product exists in Supabase catalog (auto-creates if missing!)
    const prodId = await DatabaseService.ensureProductExists(keyword);

    console.log(`[Discovery] Auto-discovering product "${keyword}" across global stores (Product ID: ${prodId})...`);
    await ProductDiscoveryService.autoDiscoverProductAcrossCountries(prodId, keyword);
    return;
  }

  if (args.includes('--trigger-now')) {
    console.log('[CLI] Manually triggering daily scraping cycle immediately...');
    await AutonomousScheduler.dispatchDailyScrapingWindow();
    return;
  }

  // Autonomous Daemon Mode
  AutonomousScheduler.start();

  // Graceful shutdown handling
  const shutdown = async () => {
    console.log('\n[Process] Received termination signal. Shutting down gracefully...');
    AutonomousScheduler.stop();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((err) => {
  console.error('[Main] Fatal application error:', err);
  process.exit(1);
});
