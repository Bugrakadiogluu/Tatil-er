export interface CatalogProduct {
  categoryCode: string;
  brand: string;
  modelName: string;
  globalSku: string;
  specs: Record<string, any>;
  weightKg: number;
  prices: {
    retailerName: string;
    countryCode: string;
    currencyCode: string;
    priceOriginal: number;
  }[];
}

export const MASTER_CATALOG: CatalogProduct[] = [
  // ===========================================================================
  // 1. SMARTPHONES & FLAGSHIPS (High Arbitrage - Turkish IMEI Fee 45.614 TL)
  // ===========================================================================
  {
    categoryCode: 'smartphones',
    brand: 'Apple',
    modelName: 'iPhone 16 Pro Max 1TB',
    globalSku: 'APL-IP16PM-1TB',
    specs: { storage: '1TB', screen: '6.9 Super Retina XDR OLED', chip: 'A18 Pro', camera: '48MP Fusion 5x Telephoto' },
    weightKg: 0.227,
    prices: [
      { retailerName: 'Apple Turkey', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 119999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 1599.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 1899.00 },
      { retailerName: 'Amazon Japan (JP)', countryCode: 'JP', currencyCode: 'JPY', priceOriginal: 249800.00 },
      { retailerName: 'Amazon UAE (AE)', countryCode: 'AE', currencyCode: 'AED', priceOriginal: 5999.00 },
      { retailerName: 'Zoommer (GE)', countryCode: 'GE', currencyCode: 'GEL', priceOriginal: 4699.00 }
    ]
  },
  {
    categoryCode: 'smartphones',
    brand: 'Apple',
    modelName: 'iPhone 16 Pro Max 512GB',
    globalSku: 'APL-IP16PM-512',
    specs: { storage: '512GB', screen: '6.9 Super Retina XDR OLED', chip: 'A18 Pro' },
    weightKg: 0.227,
    prices: [
      { retailerName: 'Apple Turkey', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 109999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 1399.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 1649.00 },
      { retailerName: 'Amazon Japan (JP)', countryCode: 'JP', currencyCode: 'JPY', priceOriginal: 219800.00 },
      { retailerName: 'Amazon UAE (AE)', countryCode: 'AE', currencyCode: 'AED', priceOriginal: 5299.00 }
    ]
  },
  {
    categoryCode: 'smartphones',
    brand: 'Apple',
    modelName: 'iPhone 16 Pro Max 256GB',
    globalSku: 'APL-IP16PM-256',
    specs: { storage: '256GB', screen: '6.9 Super Retina XDR OLED', chip: 'A18 Pro' },
    weightKg: 0.227,
    prices: [
      { retailerName: 'Apple Turkey', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 99999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 1199.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 1449.00 },
      { retailerName: 'Amazon Japan (JP)', countryCode: 'JP', currencyCode: 'JPY', priceOriginal: 189800.00 },
      { retailerName: 'Amazon UAE (AE)', countryCode: 'AE', currencyCode: 'AED', priceOriginal: 4699.00 }
    ]
  },
  {
    categoryCode: 'smartphones',
    brand: 'Apple',
    modelName: 'iPhone 16 Pro 1TB',
    globalSku: 'APL-IP16P-1TB',
    specs: { storage: '1TB', screen: '6.3 Super Retina XDR OLED', chip: 'A18 Pro' },
    weightKg: 0.199,
    prices: [
      { retailerName: 'Apple Turkey', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 107999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 1499.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 1749.00 },
      { retailerName: 'Amazon UAE (AE)', countryCode: 'AE', currencyCode: 'AED', priceOriginal: 5599.00 }
    ]
  },
  {
    categoryCode: 'smartphones',
    brand: 'Apple',
    modelName: 'iPhone 16 Pro 512GB',
    globalSku: 'APL-IP16P-512',
    specs: { storage: '512GB', screen: '6.3 Super Retina XDR OLED', chip: 'A18 Pro' },
    weightKg: 0.199,
    prices: [
      { retailerName: 'Apple Turkey', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 97999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 1299.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 1519.00 },
      { retailerName: 'Amazon UAE (AE)', countryCode: 'AE', currencyCode: 'AED', priceOriginal: 4899.00 }
    ]
  },
  {
    categoryCode: 'smartphones',
    brand: 'Apple',
    modelName: 'iPhone 16 Pro 256GB',
    globalSku: 'APL-IP16P-256',
    specs: { storage: '256GB', screen: '6.3 Super Retina XDR OLED', chip: 'A18 Pro' },
    weightKg: 0.199,
    prices: [
      { retailerName: 'Apple Turkey', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 87999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 1099.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 1329.00 },
      { retailerName: 'Amazon Japan (JP)', countryCode: 'JP', currencyCode: 'JPY', priceOriginal: 174800.00 },
      { retailerName: 'Amazon UAE (AE)', countryCode: 'AE', currencyCode: 'AED', priceOriginal: 4299.00 }
    ]
  },
  {
    categoryCode: 'smartphones',
    brand: 'Apple',
    modelName: 'iPhone 16 Pro 128GB',
    globalSku: 'APL-IP16P-128',
    specs: { storage: '128GB', screen: '6.3 Super Retina XDR OLED', chip: 'A18 Pro' },
    weightKg: 0.199,
    prices: [
      { retailerName: 'Apple Turkey', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 82999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 999.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 1199.00 },
      { retailerName: 'Amazon Japan (JP)', countryCode: 'JP', currencyCode: 'JPY', priceOriginal: 159800.00 },
      { retailerName: 'Amazon UAE (AE)', countryCode: 'AE', currencyCode: 'AED', priceOriginal: 3949.00 }
    ]
  },
  {
    categoryCode: 'smartphones',
    brand: 'Apple',
    modelName: 'iPhone 15 Pro Max 1TB',
    globalSku: 'APL-IP15PM-1TB',
    specs: { storage: '1TB', screen: '6.7 Super Retina XDR', chip: 'A17 Pro' },
    weightKg: 0.221,
    prices: [
      { retailerName: 'Apple Turkey', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 99999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 1399.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 1629.00 },
      { retailerName: 'Amazon UAE (AE)', countryCode: 'AE', currencyCode: 'AED', priceOriginal: 5199.00 }
    ]
  },
  {
    categoryCode: 'smartphones',
    brand: 'Apple',
    modelName: 'iPhone 15 Pro Max 512GB',
    globalSku: 'APL-IP15PM-512',
    specs: { storage: '512GB', screen: '6.7 Super Retina XDR', chip: 'A17 Pro' },
    weightKg: 0.221,
    prices: [
      { retailerName: 'Apple Turkey', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 89999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 1199.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 1429.00 },
      { retailerName: 'Amazon UAE (AE)', countryCode: 'AE', currencyCode: 'AED', priceOriginal: 4599.00 }
    ]
  },
  {
    categoryCode: 'smartphones',
    brand: 'Apple',
    modelName: 'iPhone 15 Pro Max 256GB',
    globalSku: 'APL-IP15PM-256',
    specs: { storage: '256GB', screen: '6.7 Super Retina XDR', chip: 'A17 Pro' },
    weightKg: 0.221,
    prices: [
      { retailerName: 'Apple Turkey', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 79999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 1049.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 1249.00 },
      { retailerName: 'Amazon UAE (AE)', countryCode: 'AE', currencyCode: 'AED', priceOriginal: 4099.00 }
    ]
  },
  {
    categoryCode: 'smartphones',
    brand: 'Apple',
    modelName: 'iPhone 15 Pro 256GB',
    globalSku: 'APL-IP15P-256',
    specs: { storage: '256GB', screen: '6.1 Super Retina XDR', chip: 'A17 Pro' },
    weightKg: 0.187,
    prices: [
      { retailerName: 'Apple Turkey', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 74999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 949.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 1149.00 },
      { retailerName: 'Amazon UAE (AE)', countryCode: 'AE', currencyCode: 'AED', priceOriginal: 3799.00 }
    ]
  },
  {
    categoryCode: 'smartphones',
    brand: 'Apple',
    modelName: 'iPhone 15 Pro 128GB',
    globalSku: 'APL-IP15P-128',
    specs: { storage: '128GB', screen: '6.1 Super Retina XDR', chip: 'A17 Pro' },
    weightKg: 0.187,
    prices: [
      { retailerName: 'Apple Turkey', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 69999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 849.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 1049.00 },
      { retailerName: 'Amazon UAE (AE)', countryCode: 'AE', currencyCode: 'AED', priceOriginal: 3399.00 }
    ]
  },
  {
    categoryCode: 'smartphones',
    brand: 'Apple',
    modelName: 'iPhone 14 Pro Max 512GB',
    globalSku: 'APL-IP14PM-512',
    specs: { storage: '512GB', screen: '6.7 Super Retina XDR', chip: 'A16 Bionic' },
    weightKg: 0.240,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 79999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 899.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 1099.00 },
      { retailerName: 'Amazon UAE (AE)', countryCode: 'AE', currencyCode: 'AED', priceOriginal: 3499.00 }
    ]
  },
  {
    categoryCode: 'smartphones',
    brand: 'Apple',
    modelName: 'iPhone 14 Pro 256GB',
    globalSku: 'APL-IP14P-256',
    specs: { storage: '256GB', screen: '6.1 Super Retina XDR', chip: 'A16 Bionic' },
    weightKg: 0.206,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 64999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 749.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 899.00 },
      { retailerName: 'Amazon UAE (AE)', countryCode: 'AE', currencyCode: 'AED', priceOriginal: 2999.00 }
    ]
  },
  {
    categoryCode: 'smartphones',
    brand: 'Samsung',
    modelName: 'Galaxy S25 Ultra 1TB Titanium',
    globalSku: 'SAM-S25U-1TB',
    specs: { storage: '1TB', screen: '6.8 Dynamic AMOLED 2X', chip: 'Snapdragon 8 Elite' },
    weightKg: 0.219,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 97999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 1549.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 1649.00 },
      { retailerName: 'Amazon UAE (AE)', countryCode: 'AE', currencyCode: 'AED', priceOriginal: 5399.00 }
    ]
  },
  {
    categoryCode: 'smartphones',
    brand: 'Samsung',
    modelName: 'Galaxy S25 Ultra 512GB Titanium',
    globalSku: 'SAM-S25U-512',
    specs: { storage: '512GB', screen: '6.8 Dynamic AMOLED 2X', chip: 'Snapdragon 8 Elite' },
    weightKg: 0.219,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 84999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 1299.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 1399.00 },
      { retailerName: 'Amazon UAE (AE)', countryCode: 'AE', currencyCode: 'AED', priceOriginal: 4499.00 }
    ]
  },
  {
    categoryCode: 'smartphones',
    brand: 'Samsung',
    modelName: 'Galaxy S24 Ultra 512GB Titanium',
    globalSku: 'SAM-S24U-512',
    specs: { storage: '512GB', screen: '6.8 Dynamic AMOLED 2X', chip: 'Snapdragon 8 Gen 3' },
    weightKg: 0.232,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 74999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 1099.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 1199.00 },
      { retailerName: 'Amazon UAE (AE)', countryCode: 'AE', currencyCode: 'AED', priceOriginal: 3899.00 }
    ]
  },
  {
    categoryCode: 'smartphones',
    brand: 'Samsung',
    modelName: 'Galaxy Z Fold 6 1TB Foldable',
    globalSku: 'SAM-ZFOLD6-1TB',
    specs: { storage: '1TB', screen: '7.6 Dynamic AMOLED 2X Foldable', ram: '12GB' },
    weightKg: 0.239,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 99999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 1899.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 1999.00 },
      { retailerName: 'Amazon UAE (AE)', countryCode: 'AE', currencyCode: 'AED', priceOriginal: 6199.00 }
    ]
  },
  {
    categoryCode: 'smartphones',
    brand: 'Samsung',
    modelName: 'Galaxy Z Fold 6 512GB Foldable',
    globalSku: 'SAM-ZFOLD6-512',
    specs: { storage: '512GB', screen: '7.6 Dynamic AMOLED 2X Foldable', ram: '12GB' },
    weightKg: 0.239,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 89999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 1599.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 1749.00 },
      { retailerName: 'Amazon UAE (AE)', countryCode: 'AE', currencyCode: 'AED', priceOriginal: 5299.00 }
    ]
  },
  {
    categoryCode: 'smartphones',
    brand: 'Samsung',
    modelName: 'Galaxy Z Flip 6 512GB Foldable',
    globalSku: 'SAM-ZFLIP6-512',
    specs: { storage: '512GB', screen: '6.7 Dynamic AMOLED 2X Foldable', ram: '12GB' },
    weightKg: 0.187,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 62999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 999.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 1099.00 },
      { retailerName: 'Amazon UAE (AE)', countryCode: 'AE', currencyCode: 'AED', priceOriginal: 3399.00 }
    ]
  },
  {
    categoryCode: 'smartphones',
    brand: 'Google',
    modelName: 'Pixel 9 Pro XL 512GB Obsidian',
    globalSku: 'GOOG-PIX9PXL-512',
    specs: { storage: '512GB', chip: 'Google Tensor G4', screen: '6.8 Super Actua OLED' },
    weightKg: 0.221,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 89999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 1199.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 1299.00 },
      { retailerName: 'Amazon Japan (JP)', countryCode: 'JP', currencyCode: 'JPY', priceOriginal: 194900.00 }
    ]
  },
  {
    categoryCode: 'smartphones',
    brand: 'Google',
    modelName: 'Pixel 9 Pro XL 256GB Obsidian',
    globalSku: 'GOOG-PIX9PXL-256',
    specs: { storage: '256GB', chip: 'Google Tensor G4', screen: '6.8 Super Actua OLED' },
    weightKg: 0.221,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 82500.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 999.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 1099.00 },
      { retailerName: 'Amazon Japan (JP)', countryCode: 'JP', currencyCode: 'JPY', priceOriginal: 177900.00 }
    ]
  },
  {
    categoryCode: 'smartphones',
    brand: 'Google',
    modelName: 'Pixel 9 Pro Fold 512GB',
    globalSku: 'GOOG-PIX9PFOLD-512',
    specs: { storage: '512GB', screen: '8.0 Super Actua Flex Foldable', chip: 'Google Tensor G4' },
    weightKg: 0.257,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 115000.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 1919.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 2029.00 },
      { retailerName: 'Amazon Japan (JP)', countryCode: 'JP', currencyCode: 'JPY', priceOriginal: 277500.00 }
    ]
  },

  // ===========================================================================
  // 2. PREMIUM SMARTWATCHES (No IMEI Fee, Duty Free on Wrist/Luggage)
  // ===========================================================================
  {
    categoryCode: 'smartwatches',
    brand: 'Apple',
    modelName: 'Apple Watch Ultra 2 Titanium 49mm',
    globalSku: 'APL-WAT-ULTRA2',
    specs: { case: 'Titanium 49mm', cellular: true, screen: '3000 nits Sapphire', battery: '72 hrs low power' },
    weightKg: 0.061,
    prices: [
      { retailerName: 'Apple Turkey', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 49999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 749.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 849.00 },
      { retailerName: 'Amazon Japan (JP)', countryCode: 'JP', currencyCode: 'JPY', priceOriginal: 128800.00 },
      { retailerName: 'Amazon UAE (AE)', countryCode: 'AE', currencyCode: 'AED', priceOriginal: 2749.00 }
    ]
  },
  {
    categoryCode: 'smartwatches',
    brand: 'Apple',
    modelName: 'Apple Watch Series 10 Hermes Edition 46mm',
    globalSku: 'APL-WAT-HERMES10',
    specs: { case: 'Titanium 46mm', band: 'Hermes Grand H / Kilm', sapphire: true },
    weightKg: 0.045,
    prices: [
      { retailerName: 'Apple Turkey', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 79999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 1399.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 1499.00 },
      { retailerName: 'Amazon UAE (AE)', countryCode: 'AE', currencyCode: 'AED', priceOriginal: 5299.00 }
    ]
  },
  {
    categoryCode: 'smartwatches',
    brand: 'Garmin',
    modelName: 'MARQ Aviator (Gen 2) Modern Tool Watch',
    globalSku: 'GAR-MARQ2-AV',
    specs: { case: 'Grade 5 Titanium 46mm', screen: 'AMOLED Touchscreen', ceramic_bezel: true },
    weightKg: 0.084,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 129500.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 2199.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 2199.00 }
    ]
  },
  {
    categoryCode: 'smartwatches',
    brand: 'Garmin',
    modelName: 'Epix Pro (Gen 2) Sapphire Edition 51mm',
    globalSku: 'GAR-EPIXPRO-51',
    specs: { screen: '1.4 AMOLED Sapphire', flashlight: true, battery: '31 days smartwatch mode' },
    weightKg: 0.088,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 64999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 899.99 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 949.00 }
    ]
  },
  {
    categoryCode: 'smartwatches',
    brand: 'Garmin',
    modelName: 'Fenix 8 AMOLED 51mm Sapphire',
    globalSku: 'GAR-FENIX8-51',
    specs: { screen: '1.4 AMOLED Sapphire', speaker_mic: true, diving_rated: '40m' },
    weightKg: 0.092,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 74999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 1099.99 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 1149.00 }
    ]
  },

  // ===========================================================================
  // 3. HIGH-END LAPTOPS (Personal Electronics Allowance: 1 unboxed per traveler)
  // ===========================================================================
  {
    categoryCode: 'laptops',
    brand: 'Apple',
    modelName: 'MacBook Pro 16" M4 Max 64GB 1TB',
    globalSku: 'APL-MBP16-M4MAX-64',
    specs: { chip: 'M4 Max 16-core CPU / 40-core GPU', ram: '64GB Unified', ssd: '1TB', screen: 'Liquid Retina XDR' },
    weightKg: 2.14,
    prices: [
      { retailerName: 'Apple Turkey', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 184999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 3999.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 4499.00 },
      { retailerName: 'Amazon Japan (JP)', countryCode: 'JP', currencyCode: 'JPY', priceOriginal: 554800.00 },
      { retailerName: 'Amazon UAE (AE)', countryCode: 'AE', currencyCode: 'AED', priceOriginal: 15499.00 }
    ]
  },
  {
    categoryCode: 'laptops',
    brand: 'Apple',
    modelName: 'MacBook Pro 16" M4 Max 128GB 2TB',
    globalSku: 'APL-MBP16-M4MAX-128',
    specs: { chip: 'M4 Max 16-core CPU / 40-core GPU', ram: '128GB Unified', ssd: '2TB', display: 'Nano-texture glass' },
    weightKg: 2.14,
    prices: [
      { retailerName: 'Apple Turkey', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 249999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 5199.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 5899.00 }
    ]
  },
  {
    categoryCode: 'laptops',
    brand: 'Apple',
    modelName: 'MacBook Pro 14" M4 Pro 48GB 1TB',
    globalSku: 'APL-MBP14-M4PRO-48',
    specs: { chip: 'M4 Pro 14-core CPU / 20-core GPU', ram: '48GB', ssd: '1TB' },
    weightKg: 1.60,
    prices: [
      { retailerName: 'Apple Turkey', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 129999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 2599.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 2999.00 },
      { retailerName: 'Amazon UAE (AE)', countryCode: 'AE', currencyCode: 'AED', priceOriginal: 10499.00 }
    ]
  },
  {
    categoryCode: 'laptops',
    brand: 'Razer',
    modelName: 'Razer Blade 16 OLED RTX 4090 32GB',
    globalSku: 'RZR-BLADE16-4090',
    specs: { cpu: 'i9-14900HX', gpu: 'RTX 4090 16GB', ram: '32GB DDR5', screen: '16 QHD+ OLED 240Hz' },
    weightKg: 2.45,
    prices: [
      { retailerName: 'Vatan Bilgisayar (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 215000.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 3799.99 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 3999.00 }
    ]
  },
  {
    categoryCode: 'laptops',
    brand: 'Razer',
    modelName: 'Razer Blade 18 4K RTX 4090 64GB',
    globalSku: 'RZR-BLADE18-4090',
    specs: { cpu: 'i9-14900HX', gpu: 'RTX 4090 16GB', ram: '64GB DDR5', screen: '18 4K 200Hz' },
    weightKg: 3.10,
    prices: [
      { retailerName: 'Vatan Bilgisayar (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 249000.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 4499.99 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 4799.00 }
    ]
  },
  {
    categoryCode: 'laptops',
    brand: 'ASUS ROG',
    modelName: 'Zephyrus G16 OLED RTX 4090 32GB',
    globalSku: 'ASUS-G16-4090',
    specs: { cpu: 'Intel Core Ultra 9 185H', gpu: 'RTX 4090 16GB', screen: '16 2.5K OLED 240Hz' },
    weightKg: 1.95,
    prices: [
      { retailerName: 'Vatan Bilgisayar (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 195000.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 3299.99 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 3699.00 }
    ]
  },
  {
    categoryCode: 'laptops',
    brand: 'Alienware',
    modelName: 'm18 R2 Gaming Laptop RTX 4090',
    globalSku: 'DELL-M18R2-4090',
    specs: { cpu: 'Intel Core i9-14900HX', gpu: 'RTX 4090 16GB 175W', ram: '64GB', ssd: '2TB NVMe' },
    weightKg: 4.23,
    prices: [
      { retailerName: 'Vatan Bilgisayar (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 219000.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 3599.99 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 3999.00 }
    ]
  },

  // ===========================================================================
  // 4. GRAPHICS CARDS (GPUs)
  // ===========================================================================
  {
    categoryCode: 'gpus',
    brand: 'NVIDIA',
    modelName: 'GeForce RTX 5090 32GB GDDR7 Founders',
    globalSku: 'NV-RTX5090-FE',
    specs: { vram: '32GB GDDR7', bus: '512-bit', architecture: 'Blackwell', tdp: '600W' },
    weightKg: 2.10,
    prices: [
      { retailerName: 'Vatan Bilgisayar (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 189999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 2499.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 2699.00 },
      { retailerName: 'Amazon Japan (JP)', countryCode: 'JP', currencyCode: 'JPY', priceOriginal: 429800.00 }
    ]
  },
  {
    categoryCode: 'gpus',
    brand: 'ASUS ROG',
    modelName: 'ROG Strix GeForce RTX 5090 32GB OC',
    globalSku: 'ASUS-STRIX-5090OC',
    specs: { vram: '32GB GDDR7', cooler: 'Axial-tech 3.5 Slot', oc_clock: 'Boost 2750+ MHz' },
    weightKg: 2.85,
    prices: [
      { retailerName: 'Vatan Bilgisayar (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 215000.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 2899.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 3199.00 }
    ]
  },
  {
    categoryCode: 'gpus',
    brand: 'MSI',
    modelName: 'GeForce RTX 5090 Suprim X 32GB',
    globalSku: 'MSI-SUPRIM-5090X',
    specs: { vram: '32GB GDDR7', cooler: 'Tri Frozr 3S Brushed Aluminum', dual_bios: true },
    weightKg: 2.70,
    prices: [
      { retailerName: 'Vatan Bilgisayar (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 209000.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 2799.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 3099.00 }
    ]
  },
  {
    categoryCode: 'gpus',
    brand: 'NVIDIA',
    modelName: 'GeForce RTX 5080 16GB GDDR7',
    globalSku: 'NV-RTX5080-16',
    specs: { vram: '16GB GDDR7', bus: '256-bit', architecture: 'Blackwell' },
    weightKg: 1.85,
    prices: [
      { retailerName: 'Vatan Bilgisayar (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 99999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 1299.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 1449.00 }
    ]
  },
  {
    categoryCode: 'gpus',
    brand: 'ASUS ROG',
    modelName: 'ROG Strix GeForce RTX 4090 24GB OC',
    globalSku: 'ASUS-STRIX-4090OC',
    specs: { vram: '24GB GDDR6X', architecture: 'Ada Lovelace', cooling: 'Vapor Chamber' },
    weightKg: 2.50,
    prices: [
      { retailerName: 'Vatan Bilgisayar (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 139999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 2099.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 2199.00 }
    ]
  },
  {
    categoryCode: 'gpus',
    brand: 'ASUS ROG',
    modelName: 'ROG Strix GeForce RTX 4080 Super 16GB OC',
    globalSku: 'ASUS-STRIX-4080SOC',
    specs: { vram: '16GB GDDR6X', cuda_cores: 10240, dlss: 'DLSS 3.5' },
    weightKg: 2.40,
    prices: [
      { retailerName: 'Vatan Bilgisayar (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 78500.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 1149.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 1249.00 }
    ]
  },
  {
    categoryCode: 'gpus',
    brand: 'Sapphire',
    modelName: 'Nitro+ Radeon RX 7900 XTX Vapor-X 24GB',
    globalSku: 'SAPH-7900XTX-NITRO',
    specs: { vram: '24GB GDDR6', architecture: 'RDNA 3', vapor_chamber: true },
    weightKg: 1.95,
    prices: [
      { retailerName: 'Vatan Bilgisayar (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 67999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 999.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 1069.00 }
    ]
  },

  // ===========================================================================
  // 5. CPUS & MOTHERBOARDS
  // ===========================================================================
  {
    categoryCode: 'cpus_motherboards',
    brand: 'AMD',
    modelName: 'Ryzen 9 9950X 16-Core 5.7GHz Flagship',
    globalSku: 'AMD-R9-9950X',
    specs: { cores: 16, threads: 32, architecture: 'Zen 5', socket: 'AM5' },
    weightKg: 0.15,
    prices: [
      { retailerName: 'Vatan Bilgisayar (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 33500.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 599.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 589.00 }
    ]
  },
  {
    categoryCode: 'cpus_motherboards',
    brand: 'AMD',
    modelName: 'Ryzen 7 9800X3D 8-Core 3D V-Cache Gaming',
    globalSku: 'AMD-R7-9800X3D',
    specs: { cores: 8, threads: 16, cache: '104MB Cache', socket: 'AM5' },
    weightKg: 0.15,
    prices: [
      { retailerName: 'Vatan Bilgisayar (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 29500.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 479.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 529.00 }
    ]
  },
  {
    categoryCode: 'cpus_motherboards',
    brand: 'Intel',
    modelName: 'Core i9-14900KS Special Edition 6.2GHz',
    globalSku: 'INT-14900KS',
    specs: { cores: 24, threads: 32, max_boost: '6.2 GHz', socket: 'LGA1700' },
    weightKg: 0.15,
    prices: [
      { retailerName: 'Vatan Bilgisayar (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 34999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 649.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 689.00 }
    ]
  },
  {
    categoryCode: 'cpus_motherboards',
    brand: 'Intel',
    modelName: 'Core Ultra 9 285K Desktop Processor',
    globalSku: 'INT-U9-285K',
    specs: { cores: 24, threads: 24, architecture: 'Arrow Lake', socket: 'LGA1851' },
    weightKg: 0.15,
    prices: [
      { retailerName: 'Vatan Bilgisayar (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 32500.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 589.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 619.00 }
    ]
  },
  {
    categoryCode: 'cpus_motherboards',
    brand: 'ASUS ROG',
    modelName: 'ROG Maximus Z790 Dark Hero Motherboard',
    globalSku: 'ASUS-MAX-Z790-DH',
    specs: { chipset: 'Intel Z790', power: '20+1+2 Stages', wifi: 'WiFi 7', pcie: 'PCIe 5.0' },
    weightKg: 2.10,
    prices: [
      { retailerName: 'Vatan Bilgisayar (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 39500.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 599.99 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 649.00 }
    ]
  },
  {
    categoryCode: 'cpus_motherboards',
    brand: 'ASUS ROG',
    modelName: 'ROG Crosshair X670E Hero Motherboard',
    globalSku: 'ASUS-X670E-HERO',
    specs: { chipset: 'AMD X670E', power: '18+2 Stages', usb4: true, ddr5: true },
    weightKg: 2.05,
    prices: [
      { retailerName: 'Vatan Bilgisayar (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 37500.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 549.99 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 599.00 }
    ]
  },

  // ===========================================================================
  // 6. PERIPHERALS & MONITORS
  // ===========================================================================
  {
    categoryCode: 'peripherals',
    brand: 'Logitech G',
    modelName: 'G Pro X Superlight 2 Lightspeed Mouse',
    globalSku: 'LOG-GPX-SL2',
    specs: { sensor: 'HERO 2 32000 DPI', weight: '60g', switches: 'Lightforce Hybrid' },
    weightKg: 0.060,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 7499.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 149.99 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 139.00 },
      { retailerName: 'Amazon UAE (AE)', countryCode: 'AE', currencyCode: 'AED', priceOriginal: 529.00 }
    ]
  },
  {
    categoryCode: 'peripherals',
    brand: 'Razer',
    modelName: 'Viper Mini Signature Edition Magnesium Mouse',
    globalSku: 'RZR-VIPER-SIG',
    specs: { chassis: 'Magnesium Alloy Exoskeleton', weight: '49g', polling: '8000Hz Wireless' },
    weightKg: 0.049,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 24500.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 279.99 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 319.00 }
    ]
  },
  {
    categoryCode: 'peripherals',
    brand: 'Wooting',
    modelName: 'Wooting 60HE+ Hall Effect Analog Keyboard',
    globalSku: 'WTG-60HE-PLUS',
    specs: { switch: 'Lekker Magnetic Hall Effect', rapid_trigger: '0.1mm adjustable', layout: '60%' },
    weightKg: 0.75,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 14500.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 189.99 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 199.99 }
    ]
  },
  {
    categoryCode: 'peripherals',
    brand: 'ASUS ROG',
    modelName: 'ROG Azoth Extreme Custom Wireless Keyboard',
    globalSku: 'ASUS-AZOTH-EXT',
    specs: { case: 'Full Aluminum Alloy', screen: 'Full-Color OLED Touch', polling: '8000Hz' },
    weightKg: 1.15,
    prices: [
      { retailerName: 'Vatan Bilgisayar (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 29999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 499.99 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 539.00 }
    ]
  },
  {
    categoryCode: 'monitors',
    brand: 'Alienware',
    modelName: 'AW3423DW 34" Curved QD-OLED 175Hz',
    globalSku: 'DELL-AW3423DW',
    specs: { size: '34 inch ultrawide', panel: 'Quantum Dot OLED', gsync: 'G-Sync Ultimate', curve: '1800R' },
    weightKg: 8.50,
    prices: [
      { retailerName: 'Vatan Bilgisayar (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 69999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 999.99 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 1099.00 }
    ]
  },
  {
    categoryCode: 'monitors',
    brand: 'Alienware',
    modelName: 'AW3225QF 32" 4K QD-OLED 240Hz Curved',
    globalSku: 'DELL-AW3225QF',
    specs: { size: '32 inch 4K', panel: 'QD-OLED Gen 3', refresh: '240Hz', dolby_vision: true },
    weightKg: 7.90,
    prices: [
      { retailerName: 'Vatan Bilgisayar (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 78999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 1199.99 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 1299.00 }
    ]
  },
  {
    categoryCode: 'monitors',
    brand: 'ASUS ROG',
    modelName: 'Swift OLED PG32UCDM 32" 4K QD-OLED 240Hz',
    globalSku: 'ASUS-PG32UCDM',
    specs: { size: '32 inch 4K UHD', panel: 'QD-OLED 3rd Gen', refresh: '240Hz', response: '0.03ms' },
    weightKg: 7.80,
    prices: [
      { retailerName: 'Vatan Bilgisayar (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 74999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 1299.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 1399.00 }
    ]
  },

  // ===========================================================================
  // 7. GAMING CONSOLES, VR & SIM RACING
  // ===========================================================================
  {
    categoryCode: 'consoles',
    brand: 'Sony',
    modelName: 'PlayStation 5 Pro 2TB Digital',
    globalSku: 'SNY-PS5-PRO-2TB',
    specs: { storage: '2TB SSD', gpu: 'PlayStation Spectral Super Resolution (PSSR)', raytracing: 'Advanced RT' },
    weightKg: 3.10,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 49999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 699.99 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 799.99 },
      { retailerName: 'Amazon Japan (JP)', countryCode: 'JP', currencyCode: 'JPY', priceOriginal: 119980.00 },
      { retailerName: 'Amazon UAE (AE)', countryCode: 'AE', currencyCode: 'AED', priceOriginal: 3199.00 },
      { retailerName: 'Zoommer (GE)', countryCode: 'GE', currencyCode: 'GEL', priceOriginal: 2499.00 }
    ]
  },
  {
    categoryCode: 'consoles',
    brand: 'Sony',
    modelName: 'PlayStation 5 Slim 1TB Disc Edition',
    globalSku: 'SNY-PS5-SLIM-DISC',
    specs: { storage: '1TB SSD', drive: 'Ultra HD Blu-ray Disc Drive' },
    weightKg: 3.20,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 31999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 499.99 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 549.99 },
      { retailerName: 'Amazon UAE (AE)', countryCode: 'AE', currencyCode: 'AED', priceOriginal: 1899.00 }
    ]
  },
  {
    categoryCode: 'consoles',
    brand: 'Microsoft',
    modelName: 'Xbox Series X 2TB Galaxy Black Special',
    globalSku: 'MS-XBSX-2TB-GB',
    specs: { storage: '2TB Custom NVMe SSD', finish: 'Galaxy Black Special Edition' },
    weightKg: 4.45,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 44999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 599.99 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 649.99 }
    ]
  },
  {
    categoryCode: 'consoles',
    brand: 'Nintendo',
    modelName: 'Nintendo Switch OLED Model White',
    globalSku: 'NIN-SW-OLED-WHT',
    specs: { screen: '7.0 inch OLED', storage: '64GB', lan_port: true },
    weightKg: 0.42,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 19500.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 349.99 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 329.99 },
      { retailerName: 'Amazon Japan (JP)', countryCode: 'JP', currencyCode: 'JPY', priceOriginal: 37980.00 }
    ]
  },
  {
    categoryCode: 'consoles',
    brand: 'Valve',
    modelName: 'Steam Deck OLED 1TB Handheld PC',
    globalSku: 'VLV-DECK-OLED-1T',
    specs: { screen: '7.4 HDR OLED 90Hz', storage: '1TB NVMe', apu: '6nm AMD APU' },
    weightKg: 0.64,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 48500.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 649.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 679.00 }
    ]
  },
  {
    categoryCode: 'consoles',
    brand: 'ASUS ROG',
    modelName: 'ROG Ally X Handheld 24GB RAM 1TB',
    globalSku: 'ASUS-ALLY-X',
    specs: { apu: 'AMD Ryzen Z1 Extreme', ram: '24GB LPDDR5X', ssd: '1TB M.2 2280', battery: '80Wh' },
    weightKg: 0.678,
    prices: [
      { retailerName: 'Vatan Bilgisayar (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 52999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 799.99 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 899.00 }
    ]
  },
  {
    categoryCode: 'consoles',
    brand: 'Lenovo',
    modelName: 'Legion Go 8.8" QHD+ Handheld 512GB',
    globalSku: 'LNV-LEGION-GO',
    specs: { screen: '8.8 QHD+ 144Hz', apu: 'AMD Ryzen Z1 Extreme', controllers: 'Detachable TrueStrike' },
    weightKg: 0.854,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 43500.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 649.99 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 699.00 }
    ]
  },
  {
    categoryCode: 'vr_ar',
    brand: 'Apple',
    modelName: 'Vision Pro Spatial Computer 512GB',
    globalSku: 'APL-VISPRO-512',
    specs: { displays: 'Dual 4K Micro-OLED 23M Pixels', chips: 'Apple M2 & R1', eye_tracking: true },
    weightKg: 0.65,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 215000.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 3699.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 4299.00 },
      { retailerName: 'Amazon Japan (JP)', countryCode: 'JP', currencyCode: 'JPY', priceOriginal: 639800.00 }
    ]
  },
  {
    categoryCode: 'vr_ar',
    brand: 'Apple',
    modelName: 'Vision Pro Spatial Computer 1TB',
    globalSku: 'APL-VISPRO-1TB',
    specs: { storage: '1TB', displays: 'Dual 4K Micro-OLED', chips: 'M2 & R1' },
    weightKg: 0.65,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 239000.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 3899.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 4499.00 }
    ]
  },
  {
    categoryCode: 'vr_ar',
    brand: 'Meta',
    modelName: 'Meta Quest 3 Mixed Reality 512GB',
    globalSku: 'META-QUEST3-512',
    specs: { resolution: '4K+ Infinite Display', chip: 'Snapdragon XR2 Gen 2', passthrough: 'Full Color Passthrough' },
    weightKg: 0.515,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 39999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 499.99 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 549.99 },
      { retailerName: 'Amazon UAE (AE)', countryCode: 'AE', currencyCode: 'AED', priceOriginal: 2149.00 }
    ]
  },
  {
    categoryCode: 'vr_ar',
    brand: 'Sony',
    modelName: 'PlayStation VR2 Headset Horizon Bundle',
    globalSku: 'SNY-PSVR2-BNDL',
    specs: { panel: '4K HDR OLED 2000x2040 per eye', haptics: 'Headset Haptic Feedback & Sense Controllers' },
    weightKg: 0.56,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 34500.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 549.99 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 599.99 }
    ]
  },
  {
    categoryCode: 'sim_racing',
    brand: 'Fanatec',
    modelName: 'ClubSport DD+ Direct Drive Wheel Base (15 Nm)',
    globalSku: 'FAN-CS-DDPLUS',
    specs: { torque: '15 Nm Direct Drive', compatibility: 'PS5 & PC', ffb: 'FullForce Technology' },
    weightKg: 9.80,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 89500.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 999.95 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 999.95 }
    ]
  },
  {
    categoryCode: 'sim_racing',
    brand: 'Logitech G',
    modelName: 'PRO Racing Wheel Direct Drive (11 Nm)',
    globalSku: 'LOG-PRO-WHEEL',
    specs: { motor: '11 Nm Direct Drive', technology: 'TRUEFORCE Feedback', quick_release: true },
    weightKg: 7.00,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 64999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 999.99 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 1099.00 }
    ]
  },

  // ===========================================================================
  // 8. CAMERAS, PREMIUM LENSES & DRONES
  // ===========================================================================
  {
    categoryCode: 'cameras',
    brand: 'Sony',
    modelName: 'Alpha 7R V Full-Frame Mirrorless (Body)',
    globalSku: 'SNY-ILCE-7RM5',
    specs: { sensor: '61.0 MP Exmor R BSI CMOS', ai_autofocus: true, video: '8K 24p / 4K 60p', ibis: '8-Stop IBIS' },
    weightKg: 0.723,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 189999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 3498.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 3799.00 },
      { retailerName: 'Amazon Japan (JP)', countryCode: 'JP', currencyCode: 'JPY', priceOriginal: 489800.00 }
    ]
  },
  {
    categoryCode: 'cameras',
    brand: 'Sony',
    modelName: 'Alpha 7S III Cinema & Video Full-Frame',
    globalSku: 'SNY-ILCE-7SM3',
    specs: { sensor: '12.1 MP BSI CMOS', iso: 'Up to 409600', video: '4K 120p 10-bit 4:2:2 All-Intra' },
    weightKg: 0.699,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 175000.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 3198.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 3599.00 }
    ]
  },
  {
    categoryCode: 'cameras',
    brand: 'Canon',
    modelName: 'EOS R5 Mark II Full-Frame Mirrorless (Body)',
    globalSku: 'CAN-EOS-R5M2',
    specs: { sensor: '45MP Stacked BSI CMOS', ai_eye_af: true, video: '8K 60p RAW internal' },
    weightKg: 0.738,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 225000.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 4299.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 4799.00 }
    ]
  },
  {
    categoryCode: 'cameras',
    brand: 'Nikon',
    modelName: 'Nikon Z8 Flagship Full-Frame (Body)',
    globalSku: 'NIK-Z8-BODY',
    specs: { sensor: '45.7 MP Stacked CMOS', electronic_shutter: true, video: '8.3K 60p N-RAW' },
    weightKg: 0.910,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 199999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 3696.95 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 3999.00 }
    ]
  },
  {
    categoryCode: 'lenses',
    brand: 'Sony',
    modelName: 'FE 70-200mm f/2.8 GM OSS II Telephoto',
    globalSku: 'SNY-SEL70200GM2',
    specs: { aperture: 'f/2.8 Constant', weight_reduction: '29% lighter (1045g)', optics: 'Nano AR Coating II' },
    weightKg: 1.045,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 134999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 2798.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 2999.00 },
      { retailerName: 'Amazon Japan (JP)', countryCode: 'JP', currencyCode: 'JPY', priceOriginal: 346500.00 }
    ]
  },
  {
    categoryCode: 'lenses',
    brand: 'Sony',
    modelName: 'FE 24-70mm f/2.8 GM II Standard Zoom',
    globalSku: 'SNY-SEL2470GM2',
    specs: { aperture: 'f/2.8 Constant', motors: '4 XD Linear Motors', filter_size: '82mm' },
    weightKg: 0.695,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 114999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 2298.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 2399.00 }
    ]
  },
  {
    categoryCode: 'lenses',
    brand: 'Canon',
    modelName: 'RF 70-200mm f/2.8 L IS USM Lens',
    globalSku: 'CAN-RF70200-28L',
    specs: { aperture: 'f/2.8', stabilization: '5-Stop Optical IS', series: 'Canon L-Series' },
    weightKg: 1.070,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 129999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 2599.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 2799.00 }
    ]
  },
  {
    categoryCode: 'action_cams',
    brand: 'DJI',
    modelName: 'Osmo Pocket 3 Creator Combo',
    globalSku: 'DJI-OP3-CREATOR',
    specs: { sensor: '1-inch CMOS', screen: '2-inch Rotatable OLED', mic: 'DJI Mic 2 Transmitter included' },
    weightKg: 0.179,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 36500.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 669.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 649.00 },
      { retailerName: 'Amazon UAE (AE)', countryCode: 'AE', currencyCode: 'AED', priceOriginal: 2249.00 }
    ]
  },
  {
    categoryCode: 'action_cams',
    brand: 'GoPro',
    modelName: 'HERO 13 Black Creator Edition',
    globalSku: 'GPR-H13-CREATOR',
    specs: { video: '5.3K 60fps', battery: 'Enduro Battery with Volta Grip', audio: 'Media Mod Included' },
    weightKg: 0.154,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 33500.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 599.99 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 629.99 }
    ]
  },
  {
    categoryCode: 'action_cams',
    brand: 'Insta360',
    modelName: 'Insta360 X4 8K 360 Action Camera',
    globalSku: 'INSTA-X4-8K',
    specs: { video: '8K 30fps 360 Capture', slow_motion: '4K 100fps', screen: '2.5 inch Corning Gorilla Glass' },
    weightKg: 0.203,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 29500.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 499.99 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 559.99 },
      { retailerName: 'Amazon UAE (AE)', countryCode: 'AE', currencyCode: 'AED', priceOriginal: 1899.00 }
    ]
  },
  {
    categoryCode: 'drones',
    brand: 'DJI',
    modelName: 'Mavic 3 Pro Fly More Combo (DJI RC Pro)',
    globalSku: 'DJI-MAV3PRO-RCPRO',
    specs: { cameras: 'Triple Camera (Hasselblad 4/3 CMOS + 2x Telephoto)', flight_time: '43 mins', range: '15 km' },
    weightKg: 0.958,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 169999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 3889.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 3499.00 },
      { retailerName: 'Amazon UAE (AE)', countryCode: 'AE', currencyCode: 'AED', priceOriginal: 12999.00 }
    ]
  },
  {
    categoryCode: 'drones',
    brand: 'DJI',
    modelName: 'Mini 4 Pro Fly More Combo Plus (DJI RC 2)',
    globalSku: 'DJI-MINI4P-FMC',
    specs: { weight: '<249g Ultra-light (Baggage Friendly)', sensing: 'Omnidirectional Obstacle Sensing', video: '4K 60fps HDR' },
    weightKg: 0.249,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 62500.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 1099.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 1129.00 },
      { retailerName: 'Amazon UAE (AE)', countryCode: 'AE', currencyCode: 'AED', priceOriginal: 4199.00 }
    ]
  },

  // ===========================================================================
  // 9. AUDIOPHILE HEADPHONES, DJ & HI-FI AUDIO
  // ===========================================================================
  {
    categoryCode: 'headphones',
    brand: 'Apple',
    modelName: 'AirPods Max (USB-C Edition) Midnight',
    globalSku: 'APL-APMAX-USBC',
    specs: { port: 'USB-C', anc: 'Pro Active Noise Cancellation', spatial_audio: 'Personalized Spatial Audio' },
    weightKg: 0.384,
    prices: [
      { retailerName: 'Apple Turkey', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 33999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 529.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 579.00 },
      { retailerName: 'Amazon Japan (JP)', countryCode: 'JP', currencyCode: 'JPY', priceOriginal: 84800.00 },
      { retailerName: 'Amazon UAE (AE)', countryCode: 'AE', currencyCode: 'AED', priceOriginal: 1899.00 }
    ]
  },
  {
    categoryCode: 'headphones',
    brand: 'Sony',
    modelName: 'WH-1000XM5 Wireless Noise Canceling',
    globalSku: 'SNY-WH1000XM5',
    specs: { processor: 'Integrated Processor V1', mics: '8 microphones', codec: 'LDAC Hi-Res Wireless' },
    weightKg: 0.250,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 18999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 398.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 349.00 },
      { retailerName: 'Amazon Japan (JP)', countryCode: 'JP', currencyCode: 'JPY', priceOriginal: 49500.00 },
      { retailerName: 'Amazon UAE (AE)', countryCode: 'AE', currencyCode: 'AED', priceOriginal: 1199.00 }
    ]
  },
  {
    categoryCode: 'headphones',
    brand: 'Focal',
    modelName: 'Bathys Hi-Fi Wireless ANC Headphones',
    globalSku: 'FOC-BATHYS-BLK',
    specs: { drivers: 'Aluminum/Magnesium dome made in France', dac: 'Integrated USB-DAC 24-bit 192kHz' },
    weightKg: 0.350,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 44500.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 699.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 699.00 }
    ]
  },
  {
    categoryCode: 'headphones',
    brand: 'Sennheiser',
    modelName: 'HD 800 S Reference Audiophile Open-Back',
    globalSku: 'SNN-HD800S',
    specs: { transducer: '56mm Ring Radiator', impedance: '300 Ohm', soundstage: 'Class-leading expansive' },
    weightKg: 0.330,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 89500.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 1499.95 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 1499.00 }
    ]
  },
  {
    categoryCode: 'pro_audio',
    brand: 'Pioneer DJ',
    modelName: 'CDJ-3000 Professional DJ Multi Player',
    globalSku: 'PIO-CDJ3000',
    specs: { processor: 'MPU-driven flagship audio', screen: '9-inch HD Touchscreen', audio: '96kHz/32-bit floating' },
    weightKg: 5.50,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 165000.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 2549.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 2699.00 }
    ]
  },
  {
    categoryCode: 'pro_audio',
    brand: 'Pioneer DJ',
    modelName: 'DJM-A9 4-Channel Professional DJ Mixer',
    globalSku: 'PIO-DJMA9',
    specs: { dac: 'ESS Technology 32-bit high quality', connectivity: 'Dual USB-B/USB-C, Bluetooth, WiFi' },
    weightKg: 10.20,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 179000.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 2699.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 2799.00 }
    ]
  },
  {
    categoryCode: 'pro_audio',
    brand: 'Universal Audio',
    modelName: 'Apollo Twin X USB DUO Heritage Edition',
    globalSku: 'UAD-APOLLO-TWINX',
    specs: { processing: 'DUO Core Realtime UAD DSP', conversion: 'Elite-class A/D and D/A (127 dB range)' },
    weightKg: 1.07,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 54999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 999.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 989.00 }
    ]
  },
  {
    categoryCode: 'speakers',
    brand: 'Devialet',
    modelName: 'Phantom I 108dB High-End Wireless Speaker',
    globalSku: 'DEV-PHANTOM1-108',
    specs: { power: '1100 Watts RMS', max_spl: '108 dB SPL at 1 meter', titanium_tweeter: true },
    weightKg: 11.40,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 195000.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 3200.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 3200.00 }
    ]
  },
  {
    categoryCode: 'speakers',
    brand: 'Bang & Olufsen',
    modelName: 'Beolit 20 Luxury Portable Bluetooth Speaker',
    globalSku: 'BO-BEOLIT-20',
    specs: { sound: 'True360 Sound Technology', charging: 'Built-in Qi Wireless Charging Pad' },
    weightKg: 2.70,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 34999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 599.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 549.00 }
    ]
  },

  // ===========================================================================
  // 10. PREMIUM PERSONAL CARE (Dyson, Braun, Philips Prestige)
  // ===========================================================================
  {
    categoryCode: 'personal_care',
    brand: 'Dyson',
    modelName: 'Airwrap Multi-Styler Complete Long',
    globalSku: 'DYS-AIRWRAP-LONG',
    specs: { motor: 'V9 Digital Motor', effect: 'Enhanced Coanda Airflow', styling: 'Curl, wave, smooth and dry' },
    weightKg: 0.61,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 34999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 599.99 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 549.00 },
      { retailerName: 'Amazon UAE (AE)', countryCode: 'AE', currencyCode: 'AED', priceOriginal: 1999.00 },
      { retailerName: 'Amazon Japan (JP)', countryCode: 'JP', currencyCode: 'JPY', priceOriginal: 63800.00 }
    ]
  },
  {
    categoryCode: 'personal_care',
    brand: 'Dyson',
    modelName: 'Supersonic Nural Intelligent Hair Dryer',
    globalSku: 'DYS-SUPER-NURAL',
    specs: { sensor: 'Scalp Protect Mode Time of Flight', motor: 'V9 digital motor', attachments: '5 styling tools' },
    weightKg: 0.68,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 28999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 499.99 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 449.00 },
      { retailerName: 'Amazon UAE (AE)', countryCode: 'AE', currencyCode: 'AED', priceOriginal: 1699.00 }
    ]
  },
  {
    categoryCode: 'personal_care',
    brand: 'Dyson',
    modelName: 'Airstrait Wet-to-Dry Straightener',
    globalSku: 'DYS-AIRSTRAIT',
    specs: { technology: 'No Hot Plates - High Pressure Air Blades', mode: 'Wet-to-dry with no heat damage' },
    weightKg: 0.99,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 31999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 499.99 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 499.00 },
      { retailerName: 'Amazon UAE (AE)', countryCode: 'AE', currencyCode: 'AED', priceOriginal: 1799.00 }
    ]
  },
  {
    categoryCode: 'personal_care',
    brand: 'Braun',
    modelName: 'Series 9 Pro+ 9577cc Electric Shaver',
    globalSku: 'BRN-S9PRO-PLUS',
    specs: { elements: '5 synchronized shaving elements', center: '6-in-1 SmartCare Center', pro_trimmer: true },
    weightKg: 0.45,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 24999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 379.99 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 389.00 }
    ]
  },
  {
    categoryCode: 'personal_care',
    brand: 'Philips',
    modelName: 'Series 9000 Prestige Shaver SP9860',
    globalSku: 'PHI-S9000-PRES',
    specs: { blades: 'NanoTech Precision Blades', sensor: 'BeardAdapt Sensor', pad: 'Qi Wireless Charging' },
    weightKg: 0.38,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 22500.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 349.99 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 339.00 }
    ]
  },
  {
    categoryCode: 'personal_care',
    brand: 'Philips',
    modelName: 'Lumea IPL Series 9900 Epilator BRI958',
    globalSku: 'PHI-LUMEA-9900',
    specs: { technology: 'SenseIQ SkinAI Technology', flashes: '450000 flashes', cordless: true },
    weightKg: 0.85,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 26500.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 499.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 479.00 }
    ]
  },

  // ===========================================================================
  // 11. SMART HOME ROBOTS & PROJECTORS
  // ===========================================================================
  {
    categoryCode: 'smart_home',
    brand: 'Roborock',
    modelName: 'S8 MaxV Ultra All-in-One Robot Vacuum',
    globalSku: 'ROB-S8MAXV-ULT',
    specs: { suction: '10000 Pa', dock: 'Auto Water & Dust Emptying, 60C Hot Water Washing', arm: 'FlexiArm Technology' },
    weightKg: 14.20,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 79999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 1799.99 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 1399.00 },
      { retailerName: 'Amazon UAE (AE)', countryCode: 'AE', currencyCode: 'AED', priceOriginal: 4899.00 }
    ]
  },
  {
    categoryCode: 'smart_home',
    brand: 'Dreame',
    modelName: 'Dreame X40 Ultra Robot Vacuum (12000 Pa)',
    globalSku: 'DRM-X40-ULTRA',
    specs: { suction: '12000 Pa Vormax', dock: '70C Hot Water Mop Washing', mop_removal: 'Auto Mop Detachment' },
    weightKg: 13.80,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 72999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 1499.99 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 1299.00 }
    ]
  },
  {
    categoryCode: 'smart_home',
    brand: 'Dyson',
    modelName: '360 Vis Nav Intelligent Robot Vacuum',
    globalSku: 'DYS-360-VISNAV',
    specs: { motor: 'Hyperdymium motor 110000 RPM', suction: '6x more suction than standard robots', vision: '360-degree vision SLAM' },
    weightKg: 4.50,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 64999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 1199.99 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 1299.00 }
    ]
  },
  {
    categoryCode: 'projectors',
    brand: 'Samsung',
    modelName: 'The Freestyle 2nd Gen Smart FHD Projector',
    globalSku: 'SAM-FREESTYLE2',
    specs: { resolution: '1080p FHD HDR10', angle: '180 Dynamic Angle', sound: '360-degree 5W speaker' },
    weightKg: 0.83,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 29999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 599.99 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 599.00 },
      { retailerName: 'Amazon UAE (AE)', countryCode: 'AE', currencyCode: 'AED', priceOriginal: 2199.00 }
    ]
  },
  {
    categoryCode: 'projectors',
    brand: 'XGIMI',
    modelName: 'Horizon Ultra 4K Dolby Vision Projector',
    globalSku: 'XGM-HORIZON-U4K',
    specs: { resolution: '4K UHD', brightness: '2300 ISO Lumens Dual Light', audio: 'Harman Kardon 24W' },
    weightKg: 5.20,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 89999.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 1599.99 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 1699.00 }
    ]
  },

  // ===========================================================================
  // 12. DESIGNER LUXURY GOODS, NICHE PERFUMES & LUXURY WATCHES
  // ===========================================================================
  {
    categoryCode: 'luxury_fashion',
    brand: 'Louis Vuitton',
    modelName: 'Neverfull MM Monogram Canvas Tote Bag',
    globalSku: 'LV-NEVERFULL-MM',
    specs: { material: 'Coated Canvas & Natural Cowhide Leather', dimensions: '31 x 28 x 14 cm', pouch: 'Removable zipped clutch' },
    weightKg: 0.70,
    prices: [
      { retailerName: 'Beymen (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 115000.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 1500.00 },
      { retailerName: 'Amazon UAE (AE)', countryCode: 'AE', currencyCode: 'AED', priceOriginal: 6900.00 }
    ]
  },
  {
    categoryCode: 'luxury_fashion',
    brand: 'Louis Vuitton',
    modelName: 'Speedy Bandoulière 25 Monogram Bag',
    globalSku: 'LV-SPEEDY-25',
    specs: { material: 'Monogram Canvas', strap: 'Adjustable shoulder strap for crossbody' },
    weightKg: 0.55,
    prices: [
      { retailerName: 'Beymen (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 105000.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 1450.00 },
      { retailerName: 'Amazon UAE (AE)', countryCode: 'AE', currencyCode: 'AED', priceOriginal: 6600.00 }
    ]
  },
  {
    categoryCode: 'luxury_fashion',
    brand: 'Gucci',
    modelName: 'GG Marmont Small Matelassé Shoulder Bag',
    globalSku: 'GUC-MARMONT-SM',
    specs: { leather: 'Matelassé chevron leather', hardware: 'Antique gold-toned Double G' },
    weightKg: 0.60,
    prices: [
      { retailerName: 'Beymen (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 119000.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 1750.00 },
      { retailerName: 'Amazon UAE (AE)', countryCode: 'AE', currencyCode: 'AED', priceOriginal: 7800.00 }
    ]
  },
  {
    categoryCode: 'luxury_fashion',
    brand: 'Prada',
    modelName: 'Prada Re-Edition 2005 Re-Nylon Bag',
    globalSku: 'PRA-RE2005-NYL',
    specs: { fabric: 'Regenerated nylon (ECONYL) with Saffiano leather trim', pouch: 'Removable pouch' },
    weightKg: 0.45,
    prices: [
      { retailerName: 'Beymen (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 89000.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 1350.00 },
      { retailerName: 'Amazon UAE (AE)', countryCode: 'AE', currencyCode: 'AED', priceOriginal: 5900.00 }
    ]
  },
  {
    categoryCode: 'perfumes_cosmetics',
    brand: 'Creed',
    modelName: 'Creed Aventus Eau de Parfum 100ml',
    globalSku: 'CRD-AVENTUS-100',
    specs: { volume: '100ml', family: 'Fruity Rich Woody', notes: 'Pineapple, Birch, Musk, Bergamot' },
    weightKg: 0.40,
    prices: [
      { retailerName: 'Beymen (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 18500.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 295.00 },
      { retailerName: 'Amazon UAE (AE)', countryCode: 'AE', currencyCode: 'AED', priceOriginal: 1299.00 }
    ]
  },
  {
    categoryCode: 'perfumes_cosmetics',
    brand: 'Maison Francis Kurkdjian',
    modelName: 'Baccarat Rouge 540 Extrait de Parfum 70ml',
    globalSku: 'MFK-BR540-EXT70',
    specs: { volume: '70ml', concentration: 'Extrait de Parfum', notes: 'Bitter Almond, Ambergris, Jasmine, Cedar' },
    weightKg: 0.35,
    prices: [
      { retailerName: 'Beymen (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 21500.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 345.00 },
      { retailerName: 'Amazon UAE (AE)', countryCode: 'AE', currencyCode: 'AED', priceOriginal: 1550.00 }
    ]
  },
  {
    categoryCode: 'perfumes_cosmetics',
    brand: 'Tom Ford',
    modelName: 'Private Blend Tobacco Vanille 100ml',
    globalSku: 'TF-TOBVAN-100',
    specs: { volume: '100ml', collection: 'Private Blend', notes: 'Tobacco Leaf, Vanilla, Cocoa, Spices' },
    weightKg: 0.40,
    prices: [
      { retailerName: 'Beymen (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 19999.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 335.00 },
      { retailerName: 'Amazon UAE (AE)', countryCode: 'AE', currencyCode: 'AED', priceOriginal: 1450.00 }
    ]
  },
  {
    categoryCode: 'perfumes_cosmetics',
    brand: 'La Mer',
    modelName: 'Crème de la Mer Moisturizing Cream 60ml',
    globalSku: 'LAMER-CREME-60',
    specs: { volume: '60ml', active: 'Miracle Broth Cell-Renewing Elixir', benefit: 'Deep hydration & barrier repair' },
    weightKg: 0.30,
    prices: [
      { retailerName: 'Beymen (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 17500.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 289.00 },
      { retailerName: 'Amazon UAE (AE)', countryCode: 'AE', currencyCode: 'AED', priceOriginal: 1250.00 }
    ]
  },
  {
    categoryCode: 'luxury_watches',
    brand: 'Tissot',
    modelName: 'PRX Powermatic 80 Automatic 40mm Blue',
    globalSku: 'TIS-PRX-PM80-BL',
    specs: { movement: 'Powermatic 80.111 (80-hour reserve)', case: '316L Stainless Steel 40mm', crystal: 'Sapphire' },
    weightKg: 0.138,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 32500.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 625.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 645.00 },
      { retailerName: 'Amazon Japan (JP)', countryCode: 'JP', currencyCode: 'JPY', priceOriginal: 82500.00 }
    ]
  },
  {
    categoryCode: 'luxury_watches',
    brand: 'Seiko',
    modelName: 'Prospex Speedtimer Solar Chronograph (SSC813)',
    globalSku: 'SEI-SPEED-SSC813',
    specs: { movement: 'Caliber V192 Solar Chronograph', dial: 'Seitona Panda Dial', crystal: 'Curved Sapphire' },
    weightKg: 0.160,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 31000.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 540.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 590.00 },
      { retailerName: 'Amazon Japan (JP)', countryCode: 'JP', currencyCode: 'JPY', priceOriginal: 68200.00 }
    ]
  },
  {
    categoryCode: 'luxury_watches',
    brand: 'Tag Heuer',
    modelName: 'Carrera Chronograph 39mm Glassbox Blue',
    globalSku: 'TH-CARRERA-39BL',
    specs: { movement: 'Calibre TH20-00 Automatic', power_reserve: '80h', crystal: 'Domed Glassbox Sapphire' },
    weightKg: 0.145,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 310000.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 5950.00 },
      { retailerName: 'Amazon Japan (JP)', countryCode: 'JP', currencyCode: 'JPY', priceOriginal: 825000.00 }
    ]
  },
  {
    categoryCode: 'luxury_watches',
    brand: 'Longines',
    modelName: 'HydroConquest 41mm Automatic Ceramic',
    globalSku: 'LNG-HYDRO-41BL',
    specs: { movement: 'Calibre L888 Automatic (72h reserve)', water_resistance: '300m / 30 bar', bezel: 'Ceramic' },
    weightKg: 0.180,
    prices: [
      { retailerName: 'Hepsiburada (TR)', countryCode: 'TR', currencyCode: 'TRY', priceOriginal: 89000.00 },
      { retailerName: 'Amazon US (US)', countryCode: 'US', currencyCode: 'USD', priceOriginal: 1550.00 },
      { retailerName: 'Amazon Germany (DE)', countryCode: 'DE', currencyCode: 'EUR', priceOriginal: 1650.00 }
    ]
  }
];
