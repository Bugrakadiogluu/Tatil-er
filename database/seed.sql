-- =============================================================================
-- TRAVEL & CROSS-BORDER SHOPPING ARBITRAGE PLATFORM (ARBITRIP)
-- Seed Data (Realistic Baseline for Production Testing)
-- =============================================================================

-- Currencies
INSERT INTO currencies (code, name, symbol, decimal_digits) VALUES
('TRY', 'Turkish Lira', '₺', 2),
('USD', 'US Dollar', '$', 2),
('EUR', 'Euro', '€', 2),
('JPY', 'Japanese Yen', '¥', 0),
('GBP', 'British Pound', '£', 2),
('AED', 'UAE Dirham', 'AED', 2),
('GEL', 'Georgian Lari', '₾', 2)
ON CONFLICT (code) DO NOTHING;

-- Initial Exchange Rates (Relative to TRY)
INSERT INTO fx_rates (base_currency, target_currency, rate, provider) VALUES
('USD', 'TRY', 35.80, 'Frankfurter / CBRT'),
('EUR', 'TRY', 38.90, 'Frankfurter / CBRT'),
('JPY', 'TRY', 0.238, 'Frankfurter / CBRT'),
('GBP', 'TRY', 46.20, 'Frankfurter / CBRT'),
('AED', 'TRY', 9.75, 'Frankfurter / CBRT'),
('GEL', 'TRY', 13.10, 'Frankfurter / CBRT'),
('TRY', 'TRY', 1.00, 'Identity')
ON CONFLICT (base_currency, target_currency) DO UPDATE SET rate = EXCLUDED.rate, fetched_at = NOW();

-- Destinations
INSERT INTO destinations (city_name, country_name, country_code, primary_airport_code, secondary_airports, currency_code, flight_duration_hours, daily_cost_budget, daily_cost_moderate, daily_cost_luxury, avg_hotel_budget, avg_hotel_moderate, avg_hotel_luxury, image_url) VALUES
('Tokyo', 'Japan', 'JP', 'NRT', ARRAY['HND'], 'JPY', 11.5, 6500, 14000, 32000, 12000, 22000, 55000, 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80'),
('Berlin', 'Germany', 'DE', 'BER', ARRAY[]::varchar[], 'EUR', 3.2, 45, 95, 230, 75, 140, 320, 'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=1200&q=80'),
('Dubai', 'United Arab Emirates', 'AE', 'DXB', ARRAY['DWC'], 'AED', 4.5, 180, 420, 1100, 280, 600, 1600, 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80'),
('London', 'United Kingdom', 'GB', 'LHR', ARRAY['LGW', 'STN'], 'GBP', 4.1, 55, 125, 290, 95, 190, 450, 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80'),
('New York', 'United States', 'US', 'JFK', ARRAY['EWR', 'LGA'], 'USD', 10.5, 75, 160, 380, 140, 260, 650, 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80'),
('Tbilisi', 'Georgia', 'GE', 'TBS', ARRAY[]::varchar[], 'GEL', 2.2, 60, 140, 320, 80, 180, 420, 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1200&q=80')
ON CONFLICT DO NOTHING;

-- VAT & Tax-Free Rules
INSERT INTO vat_rules (country_code, country_name, standard_vat_rate, min_spend_amount, net_refund_pct_min, net_refund_pct_max, refund_operator, has_tourist_vat_refund, refund_process_type, notes) VALUES
('JP', 'Japan', 10.00, 5000, 10.00, 10.00, 'Point of Sale (Instant Store Exemption)', TRUE, 'instant_shop_deduction', 'Tourists show passport at cash register in authorized stores (Yodobashi, Bic Camera, Apple Store) and receive 10% instant deduction with zero admin fees.'),
('DE', 'Germany', 19.00, 50, 10.50, 14.50, 'Global Blue / Planet', TRUE, 'airport_customs_stamp', 'Requires export validation stamp at German / EU customs airport desk before dropping checked baggage or past passport control for hand carry.'),
('AE', 'United Arab Emirates', 5.00, 250, 4.25, 4.25, 'Planet Tax Free', TRUE, 'digital_validation', 'Digital validation kiosks at Dubai International Airport (DXB). 85% of total VAT amount is refunded minus 4.80 AED tag administration fee.'),
('GB', 'United Kingdom', 20.00, 0, 0.00, 0.00, 'None (Abolished)', FALSE, 'airport_customs_stamp', 'CRITICAL NOTE: Tourist VAT refund was abolished post-Brexit by the UK government. Overseas visitors pay full retail VAT without refund.'),
('US', 'United States', 0.00, 0, 0.00, 0.00, 'State Discretion (None for tourists)', FALSE, 'instant_shop_deduction', 'The US has no federal VAT. State sales tax (e.g. 8.875% in NY) cannot be refunded by international tourists. Tip: Delaware and Oregon have 0% state sales tax.'),
('GE', 'Georgia', 18.00, 200, 12.00, 14.00, 'Revenue Service of Georgia', TRUE, 'airport_customs_stamp', 'VAT refund desk at Tbilisi Airport (TBS) and Sarpi land border.')
ON CONFLICT (country_code) DO UPDATE SET 
    standard_vat_rate = EXCLUDED.standard_vat_rate, 
    net_refund_pct_max = EXCLUDED.net_refund_pct_max,
    notes = EXCLUDED.notes;

-- Turkish Customs & Import Regulatory Parameters (2025/2026 Fiscal Year)
INSERT INTO customs_regulations (target_country_code, category_code, personal_allowance_qty, imei_fee_try, trt_bandrol_fee_eur, requires_imei_registration, passenger_quota_rule, notes, effective_year) VALUES
('TR', 'smartphones', 1, 45614.00, 20.00, TRUE, '1 smartphone per passenger every 3 calendar years. Must be registered to the passenger’s own TC Kimlik via e-Devlet within 120 days.', 'IMEI registration fee set at 45,614 TRY for 2025/2026. TRT Bandrol is 20 EUR.', 2025),
('TR', 'gpus', 1, 0.00, 0.00, FALSE, 'Accompanied personal luggage allowance (single unit for personal use unboxed or personal equipment).', 'Exempt from customs duties when carried in accompanied personal baggage without commercial intent.', 2025),
('TR', 'consoles', 1, 0.00, 0.00, FALSE, '1 video game console per passenger in personal baggage.', 'Exempt from import tariff as personal entertainment gear.', 2025),
('TR', 'monitors', 1, 0.00, 10.00, FALSE, '1 computer display unit per passenger.', 'TRT Bandrol of 10 EUR applies to monitors with video input capability.', 2025),
('TR', 'mice', 2, 0.00, 0.00, FALSE, 'Up to 2 PC accessories per passenger.', 'Exempt from duties as personal peripheral accessories.', 2025),
('TR', 'clothing', 10, 0.00, 0.00, FALSE, 'Personal clothing items for traveler’s own use within reasonable luggage capacity.', 'Exempt from customs taxes as personal effects.', 2025)
ON CONFLICT (target_country_code, category_code, effective_year) DO UPDATE SET 
    imei_fee_try = EXCLUDED.imei_fee_try,
    notes = EXCLUDED.notes;

-- Product Categories
INSERT INTO product_categories (code, display_name, icon_name, description, sort_order) VALUES
('smartphones', 'Smartphones', 'smartphone', 'Flagship mobile devices with Turkish IMEI registration arbitrage', 1),
('gpus', 'Graphics Cards (GPUs)', 'cpu', 'High-end gaming and AI computing graphics cards', 2),
('consoles', 'Gaming Consoles', 'gamepad-2', 'Next-gen gaming systems and portable consoles', 3),
('monitors', 'Gaming Monitors', 'monitor', 'High-refresh QD-OLED and 4K displays', 4),
('mice', 'Gaming Mice & Peripherals', 'mouse', 'Pro esports wireless mice and mechanical accessories', 5),
('clothing', 'Branded Clothing & Luxury', 'shirt', 'Premium outdoor gear and designer apparel', 6)
ON CONFLICT (code) DO NOTHING;

-- Retailers
INSERT INTO retailers (name, country_code, currency_code, website_url, is_domestic, scraper_adapter) VALUES
('Hepsiburada (TR)', 'TR', 'TRY', 'https://www.hepsiburada.com', TRUE, 'hepsiburada_api'),
('Vatan Bilgisayar (TR)', 'TR', 'TRY', 'https://www.vatanbilgisayar.com', TRUE, 'vatan_scraper'),
('Apple Turkey', 'TR', 'TRY', 'https://www.apple.com/tr', TRUE, 'apple_official'),
('Beymen (TR)', 'TR', 'TRY', 'https://www.beymen.com', TRUE, 'beymen_scraper'),
('Yodobashi Camera (JP)', 'JP', 'JPY', 'https://www.yodobashi.com', FALSE, 'puppeteer_yodobashi'),
('Bic Camera (JP)', 'JP', 'JPY', 'https://www.biccamera.com', FALSE, 'biccamera_scraper'),
('MediaMarkt Germany (DE)', 'DE', 'EUR', 'https://www.mediamarkt.de', FALSE, 'mediamarkt_de'),
('Mindfactory (DE)', 'DE', 'EUR', 'https://www.mindfactory.de', FALSE, 'mindfactory_de'),
('Sharaf DG (UAE)', 'AE', 'AED', 'https://uae.sharaf-dg.com', FALSE, 'sharafdg_scraper'),
('Amazon UAE (AE)', 'AE', 'AED', 'https://www.amazon.ae', FALSE, 'amazon_paapi'),
('Currys (UK)', 'GB', 'GBP', 'https://www.currys.co.uk', FALSE, 'currys_scraper'),
('Best Buy (US)', 'US', 'USD', 'https://www.bestbuy.com', FALSE, 'bestbuy_api'),
('B&H Photo (US)', 'US', 'USD', 'https://www.bhphotovideo.com', FALSE, 'bhphoto_scraper'),
('Zoommer (GE)', 'GE', 'GEL', 'https://zoommer.ge', FALSE, 'zoommer_scraper')
ON CONFLICT DO NOTHING;

-- Canonical Products
DO $$
DECLARE
    cat_phone UUID;
    cat_gpu UUID;
    cat_console UUID;
    cat_monitor UUID;
    cat_mouse UUID;
    cat_cloth UUID;
    
    prod_iphone16pro UUID;
    prod_iphone16promax UUID;
    prod_s25ultra UUID;
    prod_rtx4080super UUID;
    prod_rtx4090 UUID;
    prod_ps5pro UUID;
    prod_aw3423dwf UUID;
    prod_gprox2 UUID;
    prod_arcteryx UUID;
    
    ret_apple_tr UUID;
    ret_hepsiburada UUID;
    ret_vatan UUID;
    ret_beymen UUID;
    ret_yodobashi UUID;
    ret_mediamarkt_de UUID;
    ret_sharaf_dg UUID;
    ret_bestbuy UUID;
    ret_zoommer UUID;
BEGIN
    SELECT id INTO cat_phone FROM product_categories WHERE code = 'smartphones';
    SELECT id INTO cat_gpu FROM product_categories WHERE code = 'gpus';
    SELECT id INTO cat_console FROM product_categories WHERE code = 'consoles';
    SELECT id INTO cat_monitor FROM product_categories WHERE code = 'monitors';
    SELECT id INTO cat_mouse FROM product_categories WHERE code = 'mice';
    SELECT id INTO cat_cloth FROM product_categories WHERE code = 'clothing';

    SELECT id INTO ret_apple_tr FROM retailers WHERE name = 'Apple Turkey';
    SELECT id INTO ret_hepsiburada FROM retailers WHERE name = 'Hepsiburada (TR)';
    SELECT id INTO ret_vatan FROM retailers WHERE name = 'Vatan Bilgisayar (TR)';
    SELECT id INTO ret_beymen FROM retailers WHERE name = 'Beymen (TR)';
    SELECT id INTO ret_yodobashi FROM retailers WHERE name = 'Yodobashi Camera (JP)';
    SELECT id INTO ret_mediamarkt_de FROM retailers WHERE name = 'MediaMarkt Germany (DE)';
    SELECT id INTO ret_sharaf_dg FROM retailers WHERE name = 'Sharaf DG (UAE)';
    SELECT id INTO ret_bestbuy FROM retailers WHERE name = 'Best Buy (US)';
    SELECT id INTO ret_zoommer FROM retailers WHERE name = 'Zoommer (GE)';

    -- 1. iPhone 16 Pro 256GB
    INSERT INTO products (category_id, brand, model_name, global_sku, specs, image_url, weight_kg)
    VALUES (cat_phone, 'Apple', 'iPhone 16 Pro 256GB', 'APL-IP16P-256', '{"storage": "256GB", "chip": "A18 Pro", "screen": "6.3 OLED"}'::jsonb, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80', 0.199)
    RETURNING id INTO prod_iphone16pro;

    -- 2. iPhone 16 Pro Max 256GB
    INSERT INTO products (category_id, brand, model_name, global_sku, specs, image_url, weight_kg)
    VALUES (cat_phone, 'Apple', 'iPhone 16 Pro Max 256GB', 'APL-IP16PM-256', '{"storage": "256GB", "chip": "A18 Pro", "screen": "6.9 OLED"}'::jsonb, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80', 0.227)
    RETURNING id INTO prod_iphone16promax;

    -- 3. NVIDIA RTX 4080 Super 16GB
    INSERT INTO products (category_id, brand, model_name, global_sku, specs, image_url, weight_kg)
    VALUES (cat_gpu, 'NVIDIA', 'GeForce RTX 4080 Super 16GB Founders/Strix', 'NV-RTX4080S-16', '{"vram": "16GB GDDR6X", "architecture": "Ada Lovelace", "tdp": "320W"}'::jsonb, 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80', 1.850)
    RETURNING id INTO prod_rtx4080super;

    -- 4. PlayStation 5 Pro
    INSERT INTO products (category_id, brand, model_name, global_sku, specs, image_url, weight_kg)
    VALUES (cat_console, 'Sony', 'PlayStation 5 Pro 2TB', 'SNY-PS5-PRO-2T', '{"storage": "2TB SSD", "gpu": "PSSR Enhanced 16.7 TFLOPS", "wifi": "Wi-Fi 7"}'::jsonb, 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80', 3.100)
    RETURNING id INTO prod_ps5pro;

    -- 5. Alienware AW3423DWF QD-OLED Monitor
    INSERT INTO products (category_id, brand, model_name, global_sku, specs, image_url, weight_kg)
    VALUES (cat_monitor, 'Dell Alienware', 'AW3423DWF 34" Curved QD-OLED', 'DEL-AW3423DWF', '{"size": "34 inch", "resolution": "3440x1440", "refresh": "165Hz", "panel": "QD-OLED"}'::jsonb, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80', 7.200)
    RETURNING id INTO prod_aw3423dwf;

    -- 6. Logitech G Pro X Superlight 2
    INSERT INTO products (category_id, brand, model_name, global_sku, specs, image_url, weight_kg)
    VALUES (cat_mouse, 'Logitech G', 'Pro X Superlight 2 Lightspeed', 'LOG-GPX2-BLK', '{"sensor": "Hero 2 32000 DPI", "weight": "60g", "polling": "4000Hz"}'::jsonb, 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80', 0.060)
    RETURNING id INTO prod_gprox2;

    -- 7. Arc'teryx Alpha SV Jacket
    INSERT INTO products (category_id, brand, model_name, global_sku, specs, image_url, weight_kg)
    VALUES (cat_cloth, 'Arc''teryx', 'Alpha SV Gore-Tex Pro Hardshell Jacket', 'ARC-ALPHASV-M', '{"material": "GORE-TEX PRO Most Rugged 100D", "weight": "485g", "use": "Severe Alpine"}'::jsonb, 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=600&q=80', 0.485)
    RETURNING id INTO prod_arcteryx;

    -- Prices for iPhone 16 Pro 256GB
    -- Domestic TR: 89,999 TRY
    INSERT INTO product_prices (product_id, retailer_id, price_original, currency_code, price_try_converted, in_stock)
    VALUES (prod_iphone16pro, ret_apple_tr, 89999.00, 'TRY', 89999.00, TRUE);
    -- Japan Yodobashi: 174,800 JPY (~41,600 TRY)
    INSERT INTO product_prices (product_id, retailer_id, price_original, currency_code, price_try_converted, in_stock)
    VALUES (prod_iphone16pro, ret_yodobashi, 174800.00, 'JPY', 41602.40, TRUE);
    -- Dubai Sharaf DG: 4,699 AED (~45,800 TRY)
    INSERT INTO product_prices (product_id, retailer_id, price_original, currency_code, price_try_converted, in_stock)
    VALUES (prod_iphone16pro, ret_sharaf_dg, 4699.00, 'AED', 45815.25, TRUE);
    -- Germany MediaMarkt: 1,329 EUR (~51,700 TRY)
    INSERT INTO product_prices (product_id, retailer_id, price_original, currency_code, price_try_converted, in_stock)
    VALUES (prod_iphone16pro, ret_mediamarkt_de, 1329.00, 'EUR', 51698.10, TRUE);

    -- Prices for iPhone 16 Pro Max 256GB
    -- Domestic TR: 99,999 TRY
    INSERT INTO product_prices (product_id, retailer_id, price_original, currency_code, price_try_converted, in_stock)
    VALUES (prod_iphone16promax, ret_apple_tr, 99999.00, 'TRY', 99999.00, TRUE);
    -- Japan Yodobashi: 189,800 JPY (~45,172 TRY)
    INSERT INTO product_prices (product_id, retailer_id, price_original, currency_code, price_try_converted, in_stock)
    VALUES (prod_iphone16promax, ret_yodobashi, 189800.00, 'JPY', 45172.40, TRUE);
    -- US Best Buy: $1,199.00 (~42,924 TRY)
    INSERT INTO product_prices (product_id, retailer_id, price_original, currency_code, price_try_converted, in_stock)
    VALUES (prod_iphone16promax, ret_bestbuy, 1199.00, 'USD', 42924.20, TRUE);

    -- Prices for RTX 4080 Super 16GB
    -- Domestic TR: 56,999 TRY (Vatan)
    INSERT INTO product_prices (product_id, retailer_id, price_original, currency_code, price_try_converted, in_stock)
    VALUES (prod_rtx4080super, ret_vatan, 56999.00, 'TRY', 56999.00, TRUE);
    -- Germany MediaMarkt: 1,079 EUR (~41,973 TRY)
    INSERT INTO product_prices (product_id, retailer_id, price_original, currency_code, price_try_converted, in_stock)
    VALUES (prod_rtx4080super, ret_mediamarkt_de, 1079.00, 'EUR', 41973.10, TRUE);
    -- Japan Yodobashi: 168,000 JPY (~39,984 TRY)
    INSERT INTO product_prices (product_id, retailer_id, price_original, currency_code, price_try_converted, in_stock)
    VALUES (prod_rtx4080super, ret_yodobashi, 168000.00, 'JPY', 39984.00, TRUE);
    -- US Best Buy: $999.99 (~35,800 TRY)
    INSERT INTO product_prices (product_id, retailer_id, price_original, currency_code, price_try_converted, in_stock)
    VALUES (prod_rtx4080super, ret_bestbuy, 999.99, 'USD', 35799.64, TRUE);

    -- Prices for PS5 Pro
    -- Domestic TR: 52,999 TRY (Hepsiburada)
    INSERT INTO product_prices (product_id, retailer_id, price_original, currency_code, price_try_converted, in_stock)
    VALUES (prod_ps5pro, ret_hepsiburada, 52999.00, 'TRY', 52999.00, TRUE);
    -- Japan Yodobashi: 119,980 JPY (~28,555 TRY)
    INSERT INTO product_prices (product_id, retailer_id, price_original, currency_code, price_try_converted, in_stock)
    VALUES (prod_ps5pro, ret_yodobashi, 119980.00, 'JPY', 28555.24, TRUE);
    -- Germany MediaMarkt: 799.99 EUR (~31,119 TRY)
    INSERT INTO product_prices (product_id, retailer_id, price_original, currency_code, price_try_converted, in_stock)
    VALUES (prod_ps5pro, ret_mediamarkt_de, 799.99, 'EUR', 31119.61, TRUE);

    -- Prices for Alienware AW3423DWF
    -- Domestic TR: 48,500 TRY (Hepsiburada)
    INSERT INTO product_prices (product_id, retailer_id, price_original, currency_code, price_try_converted, in_stock)
    VALUES (prod_aw3423dwf, ret_hepsiburada, 48500.00, 'TRY', 48500.00, TRUE);
    -- Germany MediaMarkt: 799.00 EUR (~31,081 TRY)
    INSERT INTO product_prices (product_id, retailer_id, price_original, currency_code, price_try_converted, in_stock)
    VALUES (prod_aw3423dwf, ret_mediamarkt_de, 799.00, 'EUR', 31081.10, TRUE);

    -- Prices for Logitech G Pro X Superlight 2
    -- Domestic TR: 6,499 TRY (Vatan)
    INSERT INTO product_prices (product_id, retailer_id, price_original, currency_code, price_try_converted, in_stock)
    VALUES (prod_gprox2, ret_vatan, 6499.00, 'TRY', 6499.00, TRUE);
    -- Japan Yodobashi: 22,000 JPY (~5,236 TRY)
    INSERT INTO product_prices (product_id, retailer_id, price_original, currency_code, price_try_converted, in_stock)
    VALUES (prod_gprox2, ret_yodobashi, 22000.00, 'JPY', 5236.00, TRUE);

    -- Prices for Arc'teryx Alpha SV
    -- Domestic TR: 44,950 TRY (Beymen)
    INSERT INTO product_prices (product_id, retailer_id, price_original, currency_code, price_try_converted, in_stock)
    VALUES (prod_arcteryx, ret_beymen, 44950.00, 'TRY', 44950.00, TRUE);
    -- Germany MediaMarkt/Outdoor: 650.00 EUR (~25,285 TRY)
    INSERT INTO product_prices (product_id, retailer_id, price_original, currency_code, price_try_converted, in_stock)
    VALUES (prod_arcteryx, ret_mediamarkt_de, 650.00, 'EUR', 25285.00, TRUE);
END $$;
