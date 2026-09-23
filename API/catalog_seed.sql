-- =============================================================================
-- TRAVEL & CROSS-BORDER ARBITRAGE (ARBITRIP)
-- Master Production Catalog Seed: Comprehensive High-Value Arbitrage Products
-- Version: 3.0.0 (Supabase Compatible)
-- =============================================================================

-- Ensure required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- 1. EXTENDED CATEGORIES
-- =============================================================================
INSERT INTO product_categories (code, display_name, icon_name, description, sort_order) VALUES
('smartphones', 'Smartphones & Flagships', 'smartphone', 'Flagship mobile phones with Turkish IMEI registration arbitrage', 1),
('smartwatches', 'Premium Smartwatches', 'watch', 'Apple Watch Ultra, Hermes, and Garmin professional multisport watches', 2),
('laptops', 'High-End Laptops', 'laptop', 'MacBook Pro M-Series, Razer Blade, Alienware, and ASUS ROG laptops', 3),
('gpus', 'Graphics Cards (GPUs)', 'cpu', 'High-end NVIDIA RTX and AMD Radeon desktop graphics cards', 4),
('cpus_motherboards', 'Processors & Motherboards', 'circuit-board', 'Intel i9, AMD Ryzen 9 flagship CPUs and enthusiast motherboards', 5),
('peripherals', 'Pro Gaming Peripherals', 'mouse', 'Esports lightweight mice, custom hall-effect keyboards', 6),
('monitors', 'OLED Gaming Monitors', 'monitor', 'QD-OLED 4K high-refresh displays for border crossing transport', 7),
('consoles', 'Gaming Consoles & Handhelds', 'gamepad-2', 'PS5 Pro, Xbox Series X, Switch OLED, and handheld gaming PCs', 8),
('vr_ar', 'VR & Spatial Computing', 'glasses', 'Apple Vision Pro, Meta Quest 3/Pro, and PS VR2 headsets', 9),
('sim_racing', 'Sim Racing Equipment', 'disc', 'Fanatec and Logitech direct-drive racing wheel bases and pedals', 10),
('cameras', 'Mirrorless Cameras (Body)', 'camera', 'Full-frame flagship mirrorless camera bodies (Sony, Canon, Nikon)', 11),
('lenses', 'Premium Camera Lenses', 'aperture', 'Sony G-Master, Canon RF L-Series professional optics', 12),
('action_cams', 'Action & 360 Cameras', 'video', 'GoPro Creator Editions, Insta360 8K, and DJI Pocket series', 13),
('drones', 'Professional Drones', 'navigation', 'DJI Mavic and Mini series Fly More combo packages', 14),
('headphones', 'Audiophile & ANC Headphones', 'headphones', 'AirPods Max, Sony XM5, Focal Bathys, and Sennheiser HD800S', 15),
('pro_audio', 'Pro DJ & Studio Audio', 'sliders', 'Pioneer CDJ-3000, DJM mixers, and Universal Audio interfaces', 16),
('speakers', 'Luxury Hi-Fi Speakers', 'volume-2', 'Devialet Phantom and Bang & Olufsen luxury portable audio', 17),
('personal_care', 'Premium Personal Care', 'sparkles', 'Dyson Airwrap, Supersonic, Airstrait, and Braun/Philips prestige shavers', 18),
('smart_home', 'Flagship Robot Vacuums', 'bot', 'Roborock S8 MaxV, Dreame X40 Ultra, and Dyson 360 robot cleaners', 19),
('projectors', 'Portable & 4K Projectors', 'tv', 'Samsung The Freestyle and XGIMI Horizon Ultra cinema projectors', 20),
('luxury_fashion', 'Designer Luxury Bags & Shoes', 'briefcase', 'Louis Vuitton, Gucci, Prada, and Balenciaga leather goods', 21),
('perfumes_cosmetics', 'Niche Perfumes & Skincare', 'droplet', 'Creed, Baccarat Rouge 540, Tom Ford Private Blend, and La Mer', 22),
('luxury_watches', 'Swiss & Luxury Timepieces', 'clock', 'Tissot PRX, Seiko Speedtimer, Tag Heuer Carrera, and Longines', 23)
ON CONFLICT (code) DO UPDATE SET 
    display_name = EXCLUDED.display_name,
    icon_name = EXCLUDED.icon_name,
    description = EXCLUDED.description,
    sort_order = EXCLUDED.sort_order;

-- =============================================================================
-- 2. CUSTOMS REGULATIONS & PERSONAL ALLOWANCES (TURKEY 2025/2026 FISCAL YEAR)
-- =============================================================================
INSERT INTO customs_regulations (target_country_code, category_code, personal_allowance_qty, imei_fee_try, trt_bandrol_fee_eur, requires_imei_registration, passenger_quota_rule, notes, effective_year) VALUES
('TR', 'smartphones', 1, 45614.00, 20.00, TRUE, '1 smartphone per passenger every 3 calendar years.', 'Must register IMEI via e-Devlet within 120 days.', 2025),
('TR', 'smartwatches', 1, 0.00, 0.00, FALSE, '1 personal smartwatch worn or unboxed in baggage.', 'Exempt from customs duties for personal tourist use.', 2025),
('TR', 'laptops', 1, 0.00, 0.00, FALSE, '1 portable personal computer per traveler.', 'Personal effects exemption applies to unboxed unit.', 2025),
('TR', 'gpus', 1, 0.00, 0.00, FALSE, '1 graphics card as personal computer component.', 'Exempt from duties in accompanied personal luggage.', 2025),
('TR', 'cpus_motherboards', 2, 0.00, 0.00, FALSE, 'Up to 2 personal PC components.', 'Personal luggage exemption applies.', 2025),
('TR', 'peripherals', 2, 0.00, 0.00, FALSE, 'Up to 2 PC accessories per passenger.', 'Exempt from duties.', 2025),
('TR', 'monitors', 1, 0.00, 10.00, FALSE, '1 personal display unit.', 'TRT Bandrol fee of 10 EUR applies to video input displays.', 2025),
('TR', 'consoles', 1, 0.00, 0.00, FALSE, '1 video game console per traveler.', 'Exempt from import tariff as personal entertainment gear.', 2025),
('TR', 'vr_ar', 1, 0.00, 0.00, FALSE, '1 VR/AR spatial headset.', 'Personal luggage allowance applies.', 2025),
('TR', 'sim_racing', 1, 0.00, 0.00, FALSE, '1 set of simulation controllers/wheel.', 'Personal use exemption.', 2025),
('TR', 'cameras', 1, 0.00, 0.00, FALSE, '1 camera body for personal artistic/tourist use.', 'Exempt from customs duty.', 2025),
('TR', 'lenses', 2, 0.00, 0.00, FALSE, 'Up to 2 optical lenses per passenger.', 'Personal camera equipment allowance.', 2025),
('TR', 'action_cams', 1, 0.00, 0.00, FALSE, '1 action camera set.', 'Personal effects exemption.', 2025),
('TR', 'drones', 1, 0.00, 0.00, FALSE, '1 drone under 500g (e.g. Mini 4 Pro) unboxed.', 'Drones over 500g require SHGM import permission.', 2025),
('TR', 'headphones', 2, 0.00, 0.00, FALSE, 'Up to 2 personal listening devices.', 'Exempt from customs taxes.', 2025),
('TR', 'pro_audio', 1, 0.00, 0.00, FALSE, '1 portable audio interface/player.', 'Personal musical equipment.', 2025),
('TR', 'speakers', 1, 0.00, 0.00, FALSE, '1 portable wireless speaker.', 'Exempt as personal luggage.', 2025),
('TR', 'personal_care', 2, 0.00, 0.00, FALSE, 'Up to 2 personal care styling tools.', 'Exempt from customs tariffs.', 2025),
('TR', 'smart_home', 1, 0.00, 0.00, FALSE, '1 robot vacuum in accompanied vehicle baggage.', 'Allowed for land border crossings within personal use limits.', 2025),
('TR', 'projectors', 1, 0.00, 10.00, FALSE, '1 portable projection device.', '10 EUR TRT Bandrol applies to video projectors.', 2025),
('TR', 'luxury_fashion', 3, 0.00, 0.00, FALSE, 'Personal wearing apparel and bags within normal traveler volume.', 'Duty free when tags are unboxed for personal use.', 2025),
('TR', 'perfumes_cosmetics', 3, 0.00, 0.00, FALSE, 'Up to 3 sealed bottles of perfume (max 600ml total).', 'Standard international tourist tax-free allowance.', 2025),
('TR', 'luxury_watches', 1, 0.00, 0.00, FALSE, '1 wristwatch worn on wrist during border crossing.', 'Wristwatches worn by traveler are completely duty-free.', 2025)
ON CONFLICT (target_country_code, category_code, effective_year) DO UPDATE SET 
    imei_fee_try = EXCLUDED.imei_fee_try,
    notes = EXCLUDED.notes;

-- =============================================================================
-- 3. GLOBAL RETAILERS REGISTER (EXPANDED TO ALL KEY REGIONAL HUBS)
-- =============================================================================
INSERT INTO retailers (name, country_code, currency_code, website_url, is_domestic, scraper_adapter, proxy_country_code) VALUES
('Apple Turkey', 'TR', 'TRY', 'https://www.apple.com/tr', TRUE, 'apple_official', 'TR'),
('Vatan Bilgisayar (TR)', 'TR', 'TRY', 'https://www.vatanbilgisayar.com', TRUE, 'vatan_scraper', 'TR'),
('Hepsiburada (TR)', 'TR', 'TRY', 'https://www.hepsiburada.com', TRUE, 'hepsiburada_api', 'TR'),
('Beymen (TR)', 'TR', 'TRY', 'https://www.beymen.com', TRUE, 'beymen_scraper', 'TR'),
('Sephora Turkey', 'TR', 'TRY', 'https://www.sephora.com.tr', TRUE, 'sephora_tr', 'TR'),
('Saat&Saat (TR)', 'TR', 'TRY', 'https://www.saatvesaat.com.tr', TRUE, 'saatvesaat_tr', 'TR'),

-- International Key Arbitrage Hubs
('Amazon Germany (DE)', 'DE', 'EUR', 'https://www.amazon.de', FALSE, 'amazon_paapi', 'DE'),
('MediaMarkt Germany (DE)', 'DE', 'EUR', 'https://www.mediamarkt.de', FALSE, 'generic_local', 'DE'),
('Amazon Japan (JP)', 'JP', 'JPY', 'https://www.amazon.co.jp', FALSE, 'amazon_paapi', 'JP'),
('Yodobashi Camera (JP)', 'JP', 'JPY', 'https://www.yodobashi.com', FALSE, 'puppeteer_yodobashi', 'JP'),
('Bic Camera (JP)', 'JP', 'JPY', 'https://www.biccamera.com', FALSE, 'biccamera_scraper', 'JP'),
('Amazon UAE (AE)', 'AE', 'AED', 'https://www.amazon.ae', FALSE, 'amazon_paapi', 'AE'),
('Sharaf DG (AE)', 'AE', 'AED', 'https://uae.sharaf-dg.com', FALSE, 'generic_local', 'AE'),
('Amazon US (US)', 'US', 'USD', 'https://www.amazon.com', FALSE, 'amazon_paapi', 'US'),
('Best Buy (US)', 'US', 'USD', 'https://www.bestbuy.com', FALSE, 'bestbuy_api', 'US'),
('B&H Photo (US)', 'US', 'USD', 'https://www.bhphotovideo.com', FALSE, 'bhphoto_scraper', 'US'),
('Amazon UK (GB)', 'GB', 'GBP', 'https://www.amazon.co.uk', FALSE, 'amazon_paapi', 'GB'),
('Currys (UK)', 'GB', 'GBP', 'https://www.currys.co.uk', FALSE, 'currys_scraper', 'GB'),
('Zoommer (GE)', 'GE', 'GEL', 'https://zoommer.ge', FALSE, 'generic_local', 'GE'),
('Gmarket (KR)', 'KR', 'KRW', 'http://www.gmarket.co.kr', FALSE, 'generic_local', 'KR'),
('Gigatron (RS)', 'RS', 'RSD', 'https://gigatron.rs', FALSE, 'generic_local', 'RS'),
('Alkosto (CO)', 'CO', 'COP', 'https://www.alkosto.com', FALSE, 'generic_local', 'CO'),
('Technodom (KZ)', 'KZ', 'KZT', 'https://www.technodom.kz', FALSE, 'generic_local', 'KZ')
ON CONFLICT (name) DO NOTHING;

-- =============================================================================
-- 4. CANONICAL PRODUCTS & REALISTIC BASELINE PRICING
-- =============================================================================

DO $$
DECLARE
    -- Categories
    c_phone UUID; c_watch UUID; c_laptop UUID; c_gpu UUID; c_cpu UUID;
    c_peri UUID; c_mon UUID; c_console UUID; c_vr UUID; c_sim UUID;
    c_cam UUID; c_lens UUID; c_actcam UUID; c_drone UUID; c_head UUID;
    c_proaud UUID; c_spk UUID; c_care UUID; c_home UUID; c_proj UUID;
    c_fash UUID; c_perf UUID; c_wat UUID;

    -- Retailers
    r_ap_tr UUID; r_vat_tr UUID; r_hep_tr UUID; r_bey_tr UUID; r_sep_tr UUID; r_saat_tr UUID;
    r_amz_de UUID; r_mm_de UUID; r_amz_jp UUID; r_yod_jp UUID; r_amz_ae UUID;
    r_sharaf_ae UUID; r_amz_us UUID; r_bb_us UUID; r_amz_uk UUID; r_zoom_ge UUID;

    -- Product IDs
    p_id UUID;
BEGIN
    -- Select Categories
    SELECT id INTO c_phone FROM product_categories WHERE code = 'smartphones';
    SELECT id INTO c_watch FROM product_categories WHERE code = 'smartwatches';
    SELECT id INTO c_laptop FROM product_categories WHERE code = 'laptops';
    SELECT id INTO c_gpu FROM product_categories WHERE code = 'gpus';
    SELECT id INTO c_cpu FROM product_categories WHERE code = 'cpus_motherboards';
    SELECT id INTO c_peri FROM product_categories WHERE code = 'peripherals';
    SELECT id INTO c_mon FROM product_categories WHERE code = 'monitors';
    SELECT id INTO c_console FROM product_categories WHERE code = 'consoles';
    SELECT id INTO c_vr FROM product_categories WHERE code = 'vr_ar';
    SELECT id INTO c_sim FROM product_categories WHERE code = 'sim_racing';
    SELECT id INTO c_cam FROM product_categories WHERE code = 'cameras';
    SELECT id INTO c_lens FROM product_categories WHERE code = 'lenses';
    SELECT id INTO c_actcam FROM product_categories WHERE code = 'action_cams';
    SELECT id INTO c_drone FROM product_categories WHERE code = 'drones';
    SELECT id INTO c_head FROM product_categories WHERE code = 'headphones';
    SELECT id INTO c_proaud FROM product_categories WHERE code = 'pro_audio';
    SELECT id INTO c_spk FROM product_categories WHERE code = 'speakers';
    SELECT id INTO c_care FROM product_categories WHERE code = 'personal_care';
    SELECT id INTO c_home FROM product_categories WHERE code = 'smart_home';
    SELECT id INTO c_proj FROM product_categories WHERE code = 'projectors';
    SELECT id INTO c_fash FROM product_categories WHERE code = 'luxury_fashion';
    SELECT id INTO c_perf FROM product_categories WHERE code = 'perfumes_cosmetics';
    SELECT id INTO c_wat FROM product_categories WHERE code = 'luxury_watches';

    -- Select Retailers
    SELECT id INTO r_ap_tr FROM retailers WHERE name = 'Apple Turkey';
    SELECT id INTO r_vat_tr FROM retailers WHERE name = 'Vatan Bilgisayar (TR)';
    SELECT id INTO r_hep_tr FROM retailers WHERE name = 'Hepsiburada (TR)';
    SELECT id INTO r_bey_tr FROM retailers WHERE name = 'Beymen (TR)';
    SELECT id INTO r_sep_tr FROM retailers WHERE name = 'Sephora Turkey';
    SELECT id INTO r_saat_tr FROM retailers WHERE name = 'Saat&Saat (TR)';

    SELECT id INTO r_amz_de FROM retailers WHERE name = 'Amazon Germany (DE)';
    SELECT id INTO r_mm_de FROM retailers WHERE name = 'MediaMarkt Germany (DE)';
    SELECT id INTO r_amz_jp FROM retailers WHERE name = 'Amazon Japan (JP)';
    SELECT id INTO r_yod_jp FROM retailers WHERE name = 'Yodobashi Camera (JP)';
    SELECT id INTO r_amz_ae FROM retailers WHERE name = 'Amazon UAE (AE)';
    SELECT id INTO r_sharaf_ae FROM retailers WHERE name = 'Sharaf DG (AE)';
    SELECT id INTO r_amz_us FROM retailers WHERE name = 'Amazon US (US)';
    SELECT id INTO r_bb_us FROM retailers WHERE name = 'Best Buy (US)';
    SELECT id INTO r_amz_uk FROM retailers WHERE name = 'Amazon UK (GB)';
    SELECT id INTO r_zoom_ge FROM retailers WHERE name = 'Zoommer (GE)';

    -- -------------------------------------------------------------------------
    -- HELPER MACRO FOR PRODUCT & MULTI-COUNTRY PRICES
    -- -------------------------------------------------------------------------

    -- 1. SMARTPHONES
    -- iPhone 16 Pro Max 1TB
    INSERT INTO products (category_id, brand, model_name, global_sku, specs, weight_kg)
    VALUES (c_phone, 'Apple', 'iPhone 16 Pro Max 1TB', 'APL-IP16PM-1TB', '{"storage": "1TB", "screen": "6.9 Super Retina XDR", "chip": "A18 Pro"}'::jsonb, 0.227)
    RETURNING id INTO p_id;
    INSERT INTO product_prices (product_id, retailer_id, price_original, currency_code, price_try_converted, in_stock) VALUES
    (p_id, r_ap_tr, 119999.00, 'TRY', 119999.00, true),
    (p_id, r_yod_jp, 249800.00, 'JPY', 59452.40, true),
    (p_id, r_amz_ae, 5999.00, 'AED', 58490.25, true),
    (p_id, r_amz_us, 1599.00, 'USD', 57244.20, true),
    (p_id, r_mm_de, 1899.00, 'EUR', 73871.10, true);

    -- Samsung Galaxy S25 Ultra 512GB
    INSERT INTO products (category_id, brand, model_name, global_sku, specs, weight_kg)
    VALUES (c_phone, 'Samsung', 'Galaxy S25 Ultra 512GB Titanium', 'SAM-S25U-512', '{"storage": "512GB", "screen": "6.8 Dynamic AMOLED 2X", "spen": true}'::jsonb, 0.219)
    RETURNING id INTO p_id;
    INSERT INTO product_prices (product_id, retailer_id, price_original, currency_code, price_try_converted, in_stock) VALUES
    (p_id, r_hep_tr, 84999.00, 'TRY', 84999.00, true),
    (p_id, r_amz_ae, 4499.00, 'AED', 43865.25, true),
    (p_id, r_amz_us, 1299.00, 'USD', 46504.20, true),
    (p_id, r_mm_de, 1399.00, 'EUR', 54421.10, true);

    -- Samsung Galaxy Z Fold 6 512GB
    INSERT INTO products (category_id, brand, model_name, global_sku, specs, weight_kg)
    VALUES (c_phone, 'Samsung', 'Galaxy Z Fold 6 512GB Foldable', 'SAM-ZFOLD6-512', '{"screen": "7.6 Foldable AMOLED", "storage": "512GB"}'::jsonb, 0.239)
    RETURNING id INTO p_id;
    INSERT INTO product_prices (product_id, retailer_id, price_original, currency_code, price_try_converted, in_stock) VALUES
    (p_id, r_hep_tr, 89999.00, 'TRY', 89999.00, true),
    (p_id, r_amz_ae, 5299.00, 'AED', 51665.25, true),
    (p_id, r_amz_us, 1599.99, 'USD', 57279.64, true);

    -- Google Pixel 9 Pro XL 256GB (High Arbitrage - No Official TR Sale)
    INSERT INTO products (category_id, brand, model_name, global_sku, specs, weight_kg)
    VALUES (c_phone, 'Google', 'Pixel 9 Pro XL 256GB Obsidian', 'GOOG-PIX9PXL-256', '{"chip": "Google Tensor G4", "screen": "6.8 Super Actua", "camera": "50MP Triple"}'::jsonb, 0.221)
    RETURNING id INTO p_id;
    INSERT INTO product_prices (product_id, retailer_id, price_original, currency_code, price_try_converted, in_stock) VALUES
    (p_id, r_hep_tr, 82500.00, 'TRY', 82500.00, true),
    (p_id, r_amz_de, 1099.00, 'EUR', 42751.10, true),
    (p_id, r_amz_us, 999.00, 'USD', 35764.20, true),
    (p_id, r_yod_jp, 177900.00, 'JPY', 42340.20, true);

    -- 2. SMARTWATCHES
    -- Apple Watch Ultra 2 Titanium
    INSERT INTO products (category_id, brand, model_name, global_sku, specs, weight_kg)
    VALUES (c_watch, 'Apple', 'Apple Watch Ultra 2 Titanium 49mm', 'APL-WAT-ULTRA2', '{"case": "Titanium 49mm", "cellular": true, "screen": "3000 nits"}'::jsonb, 0.061)
    RETURNING id INTO p_id;
    INSERT INTO product_prices (product_id, retailer_id, price_original, currency_code, price_try_converted, in_stock) VALUES
    (p_id, r_ap_tr, 49999.00, 'TRY', 49999.00, true),
    (p_id, r_amz_ae, 2749.00, 'AED', 26802.75, true),
    (p_id, r_yod_jp, 128800.00, 'JPY', 30654.40, true),
    (p_id, r_amz_us, 749.00, 'USD', 26814.20, true);

    -- Garmin MARQ Gen 2 Aviator
    INSERT INTO products (category_id, brand, model_name, global_sku, specs, weight_kg)
    VALUES (c_watch, 'Garmin', 'MARQ Aviator (Gen 2) Luxury Modern Tool Watch', 'GAR-MARQ2-AV', '{"case": "Grade 5 Titanium", "screen": "AMOLED Touch", "battery": "16 days"}'::jsonb, 0.084)
    RETURNING id INTO p_id;
    INSERT INTO product_prices (product_id, retailer_id, price_original, currency_code, price_try_converted, in_stock) VALUES
    (p_id, r_saat_tr, 129500.00, 'TRY', 129500.00, true),
    (p_id, r_amz_de, 2199.00, 'EUR', 85541.10, true),
    (p_id, r_amz_us, 2199.00, 'USD', 78724.20, true);

    -- 3. LAPTOPS
    -- MacBook Pro 16" M4 Max 64GB 1TB
    INSERT INTO products (category_id, brand, model_name, global_sku, specs, weight_kg)
    VALUES (c_laptop, 'Apple', 'MacBook Pro 16" M4 Max 64GB 1TB', 'APL-MBP16-M4MAX', '{"chip": "M4 Max 16-core CPU / 40-core GPU", "ram": "64GB", "ssd": "1TB"}'::jsonb, 2.140)
    RETURNING id INTO p_id;
    INSERT INTO product_prices (product_id, retailer_id, price_original, currency_code, price_try_converted, in_stock) VALUES
    (p_id, r_ap_tr, 184999.00, 'TRY', 184999.00, true),
    (p_id, r_amz_us, 3999.00, 'USD', 143164.20, true),
    (p_id, r_yod_jp, 554800.00, 'JPY', 132042.40, true),
    (p_id, r_amz_ae, 15499.00, 'AED', 151115.25, true);

    -- Razer Blade 16 OLED RTX 4090
    INSERT INTO products (category_id, brand, model_name, global_sku, specs, weight_kg)
    VALUES (c_laptop, 'Razer', 'Razer Blade 16 Dual-Mode Mini-LED RTX 4090', 'RZR-BLADE16-4090', '{"cpu": "i9-14900HX", "gpu": "RTX 4090 16GB", "ram": "32GB", "screen": "OLED 240Hz"}'::jsonb, 2.450)
    RETURNING id INTO p_id;
    INSERT INTO product_prices (product_id, retailer_id, price_original, currency_code, price_try_converted, in_stock) VALUES
    (p_id, r_vat_tr, 215000.00, 'TRY', 215000.00, true),
    (p_id, r_amz_us, 3799.99, 'USD', 136039.64, true),
    (p_id, r_mm_de, 3999.00, 'EUR', 155561.10, true);

    -- 4. GPUS & CPUS
    -- NVIDIA GeForce RTX 5090 32GB
    INSERT INTO products (category_id, brand, model_name, global_sku, specs, weight_kg)
    VALUES (c_gpu, 'NVIDIA', 'GeForce RTX 5090 32GB GDDR7 Flagship', 'NV-RTX5090-32', '{"vram": "32GB GDDR7", "architecture": "Blackwell", "power": "600W"}'::jsonb, 2.300)
    RETURNING id INTO p_id;
    INSERT INTO product_prices (product_id, retailer_id, price_original, currency_code, price_try_converted, in_stock) VALUES
    (p_id, r_vat_tr, 189999.00, 'TRY', 189999.00, true),
    (p_id, r_amz_de, 2699.00, 'EUR', 104991.10, true),
    (p_id, r_amz_us, 2499.00, 'USD', 89464.20, true),
    (p_id, r_yod_jp, 429800.00, 'JPY', 102292.40, true);

    -- AMD Ryzen 9 9950X Processor
    INSERT INTO products (category_id, brand, model_name, global_sku, specs, weight_kg)
    VALUES (c_cpu, 'AMD', 'Ryzen 9 9950X 16-Core 32-Thread 5.7GHz', 'AMD-R9-9950X', '{"cores": 16, "threads": 32, "socket": "AM5", "cache": "80MB"}'::jsonb, 0.150)
    RETURNING id INTO p_id;
    INSERT INTO product_prices (product_id, retailer_id, price_original, currency_code, price_try_converted, in_stock) VALUES
    (p_id, r_vat_tr, 33500.00, 'TRY', 33500.00, true),
    (p_id, r_amz_de, 589.00, 'EUR', 22912.10, true),
    (p_id, r_amz_us, 599.00, 'USD', 21444.20, true);

    -- 5. GAMING PERIPHERALS & MONITORS
    -- Wooting 60HE+ Custom Analog Keyboard
    INSERT INTO products (category_id, brand, model_name, global_sku, specs, weight_kg)
    VALUES (c_peri, 'Wooting', 'Wooting 60HE+ Hall Effect Analog Keyboard', 'WTG-60HE-PLUS', '{"switch": "Lekker Magnetic Hall Effect", "rapid_trigger": true}'::jsonb, 0.750)
    RETURNING id INTO p_id;
    INSERT INTO product_prices (product_id, retailer_id, price_original, currency_code, price_try_converted, in_stock) VALUES
    (p_id, r_hep_tr, 14500.00, 'TRY', 14500.00, true),
    (p_id, r_amz_de, 199.99, 'EUR', 7779.61, true),
    (p_id, r_amz_us, 189.99, 'USD', 6801.64, true);

    -- ASUS ROG Swift OLED PG32UCDM 32" 4K 240Hz
    INSERT INTO products (category_id, brand, model_name, global_sku, specs, weight_kg)
    VALUES (c_mon, 'ASUS ROG', 'Swift OLED PG32UCDM 32" 4K QD-OLED 240Hz', 'ASUS-PG32UCDM', '{"size": "32 inch", "panel": "QD-OLED 3rd Gen", "refresh": "240Hz", "response": "0.03ms"}'::jsonb, 7.800)
    RETURNING id INTO p_id;
    INSERT INTO product_prices (product_id, retailer_id, price_original, currency_code, price_try_converted, in_stock) VALUES
    (p_id, r_vat_tr, 74999.00, 'TRY', 74999.00, true),
    (p_id, r_mm_de, 1399.00, 'EUR', 54421.10, true),
    (p_id, r_amz_us, 1299.00, 'USD', 46504.20, true);

    -- 6. CONSOLES, VR & SIM RACING
    -- Apple Vision Pro 512GB
    INSERT INTO products (category_id, brand, model_name, global_sku, specs, weight_kg)
    VALUES (c_vr, 'Apple', 'Vision Pro Spatial Computer 512GB', 'APL-VISPRO-512', '{"displays": "Dual 4K Micro-OLED 23M Pixels", "chips": "M2 & R1", "storage": "512GB"}'::jsonb, 0.650)
    RETURNING id INTO p_id;
    INSERT INTO product_prices (product_id, retailer_id, price_original, currency_code, price_try_converted, in_stock) VALUES
    (p_id, r_hep_tr, 215000.00, 'TRY', 215000.00, true),
    (p_id, r_amz_us, 3699.00, 'USD', 132424.20, true),
    (p_id, r_yod_jp, 639800.00, 'JPY', 152272.40, true),
    (p_id, r_amz_de, 4299.00, 'EUR', 167231.10, true);

    -- Meta Quest 3 512GB
    INSERT INTO products (category_id, brand, model_name, global_sku, specs, weight_kg)
    VALUES (c_vr, 'Meta', 'Meta Quest 3 Mixed Reality Headset 512GB', 'META-QUEST3-512', '{"resolution": "4K+ Infinite Display", "processor": "Snapdragon XR2 Gen 2"}'::jsonb, 0.515)
    RETURNING id INTO p_id;
    INSERT INTO product_prices (product_id, retailer_id, price_original, currency_code, price_try_converted, in_stock) VALUES
    (p_id, r_hep_tr, 39999.00, 'TRY', 39999.00, true),
    (p_id, r_amz_de, 549.99, 'EUR', 21394.61, true),
    (p_id, r_amz_us, 499.99, 'USD', 17899.64, true);

    -- Valve Steam Deck OLED 1TB
    INSERT INTO products (category_id, brand, model_name, global_sku, specs, weight_kg)
    VALUES (c_console, 'Valve', 'Steam Deck OLED 1TB Handheld Gaming PC', 'VLV-DECK-OLED-1T', '{"screen": "7.4 HDR OLED 90Hz", "storage": "1TB NVMe", "apic": "6nm AMD APU"}'::jsonb, 0.640)
    RETURNING id INTO p_id;
    INSERT INTO product_prices (product_id, retailer_id, price_original, currency_code, price_try_converted, in_stock) VALUES
    (p_id, r_hep_tr, 48500.00, 'TRY', 48500.00, true),
    (p_id, r_amz_de, 679.00, 'EUR', 26413.10, true),
    (p_id, r_amz_us, 649.00, 'USD', 23234.20, true);

    -- Fanatec ClubSport DD+ Racing Wheel Base
    INSERT INTO products (category_id, brand, model_name, global_sku, specs, weight_kg)
    VALUES (c_sim, 'Fanatec', 'ClubSport DD+ Direct Drive Wheel Base (15 Nm)', 'FAN-CS-DDPLUS', '{"torque": "15 Nm Direct Drive", "compatibility": "PS5 & PC", "force_feedback": "FullForce"}'::jsonb, 9.800)
    RETURNING id INTO p_id;
    INSERT INTO product_prices (product_id, retailer_id, price_original, currency_code, price_try_converted, in_stock) VALUES
    (p_id, r_hep_tr, 89500.00, 'TRY', 89500.00, true),
    (p_id, r_amz_de, 999.95, 'EUR', 38898.05, true),
    (p_id, r_amz_us, 999.95, 'USD', 35798.21, true);

    -- 7. CAMERAS, LENSES & DRONES
    -- Sony A7R V Mirrorless Camera (Body)
    INSERT INTO products (category_id, brand, model_name, global_sku, specs, weight_kg)
    VALUES (c_cam, 'Sony', 'Alpha 7R V Full-Frame Mirrorless (Body)', 'SNY-ILCE-7RM5', '{"sensor": "61MP Exmor R BSI CMOS", "ai_af": true, "video": "8K 24p"}'::jsonb, 0.723)
    RETURNING id INTO p_id;
    INSERT INTO product_prices (product_id, retailer_id, price_original, currency_code, price_try_converted, in_stock) VALUES
    (p_id, r_hep_tr, 189999.00, 'TRY', 189999.00, true),
    (p_id, r_amz_us, 3498.00, 'USD', 125228.40, true),
    (p_id, r_yod_jp, 489800.00, 'JPY', 116572.40, true),
    (p_id, r_amz_de, 3799.00, 'EUR', 147781.10, true);

    -- Sony FE 70-200mm f/2.8 GM OSS II Lens
    INSERT INTO products (category_id, brand, model_name, global_sku, specs, weight_kg)
    VALUES (c_lens, 'Sony', 'FE 70-200mm f/2.8 GM OSS II Telephoto Lens', 'SNY-SEL70200GM2', '{"aperture": "f/2.8 constant", "weight": "1045g", "coating": "Nano AR II"}'::jsonb, 1.045)
    RETURNING id INTO p_id;
    INSERT INTO product_prices (product_id, retailer_id, price_original, currency_code, price_try_converted, in_stock) VALUES
    (p_id, r_hep_tr, 134999.00, 'TRY', 134999.00, true),
    (p_id, r_amz_us, 2798.00, 'USD', 100168.40, true),
    (p_id, r_yod_jp, 346500.00, 'JPY', 82467.00, true);

    -- DJI Mavic 3 Pro Fly More Combo
    INSERT INTO products (category_id, brand, model_name, global_sku, specs, weight_kg)
    VALUES (c_drone, 'DJI', 'Mavic 3 Pro Fly More Combo with RC Pro', 'DJI-MAV3PRO-FMC', '{"cameras": "Hasselblad Triple Camera System", "flight_time": "43 mins", "range": "15km"}'::jsonb, 0.958)
    RETURNING id INTO p_id;
    INSERT INTO product_prices (product_id, retailer_id, price_original, currency_code, price_try_converted, in_stock) VALUES
    (p_id, r_hep_tr, 149999.00, 'TRY', 149999.00, true),
    (p_id, r_amz_de, 2599.00, 'EUR', 101101.10, true),
    (p_id, r_amz_ae, 9899.00, 'AED', 96515.25, true),
    (p_id, r_amz_us, 2799.00, 'USD', 100204.20, true);

    -- DJI Osmo Pocket 3 Creator Combo
    INSERT INTO products (category_id, brand, model_name, global_sku, specs, weight_kg)
    VALUES (c_actcam, 'DJI', 'Osmo Pocket 3 Creator Combo 1-inch CMOS', 'DJI-OP3-CREATOR', '{"sensor": "1-inch CMOS", "screen": "2-inch Rotatable OLED", "mic": "DJI Mic 2 Transmitter Included"}'::jsonb, 0.179)
    RETURNING id INTO p_id;
    INSERT INTO product_prices (product_id, retailer_id, price_original, currency_code, price_try_converted, in_stock) VALUES
    (p_id, r_hep_tr, 36500.00, 'TRY', 36500.00, true),
    (p_id, r_amz_ae, 2249.00, 'AED', 21927.75, true),
    (p_id, r_amz_de, 649.00, 'EUR', 25246.10, true),
    (p_id, r_amz_us, 669.00, 'USD', 23950.20, true);

    -- 8. AUDIO & PERSONAL CARE
    -- Apple AirPods Max (USB-C)
    INSERT INTO products (category_id, brand, model_name, global_sku, specs, weight_kg)
    VALUES (c_head, 'Apple', 'AirPods Max (USB-C Edition) Midnight', 'APL-APMAX-USBC', '{"driver": "Apple-designed dynamic driver", "port": "USB-C", "anc": "Pro Active Noise Cancellation"}'::jsonb, 0.384)
    RETURNING id INTO p_id;
    INSERT INTO product_prices (product_id, retailer_id, price_original, currency_code, price_try_converted, in_stock) VALUES
    (p_id, r_ap_tr, 33999.00, 'TRY', 33999.00, true),
    (p_id, r_amz_ae, 1899.00, 'AED', 18515.25, true),
    (p_id, r_yod_jp, 84800.00, 'JPY', 20182.40, true),
    (p_id, r_amz_us, 529.00, 'USD', 18938.20, true);

    -- Sennheiser HD 800 S Audiophile Headphones
    INSERT INTO products (category_id, brand, model_name, global_sku, specs, weight_kg)
    VALUES (c_head, 'Sennheiser', 'HD 800 S Reference Audiophile Open-Back', 'SNN-HD800S', '{"transducer": "56mm Ring Radiator", "impedance": "300 Ohm", "made_in": "Germany"}'::jsonb, 0.330)
    RETURNING id INTO p_id;
    INSERT INTO product_prices (product_id, retailer_id, price_original, currency_code, price_try_converted, in_stock) VALUES
    (p_id, r_hep_tr, 89500.00, 'TRY', 89500.00, true),
    (p_id, r_amz_de, 1499.00, 'EUR', 58311.10, true),
    (p_id, r_amz_us, 1499.95, 'USD', 53698.21, true);

    -- Dyson Airwrap Multi-Styler Complete Long
    INSERT INTO products (category_id, brand, model_name, global_sku, specs, weight_kg)
    VALUES (c_care, 'Dyson', 'Airwrap Multi-Styler Complete Long (Strawberry Bronze)', 'DYS-AIRWRAP-LONG', '{"motor": "V9 Digital Motor", "barrels": "30mm & 40mm Long", "effect": "Coanda Airflow"}'::jsonb, 0.610)
    RETURNING id INTO p_id;
    INSERT INTO product_prices (product_id, retailer_id, price_original, currency_code, price_try_converted, in_stock) VALUES
    (p_id, r_hep_tr, 34999.00, 'TRY', 34999.00, true),
    (p_id, r_amz_de, 549.00, 'EUR', 21356.10, true),
    (p_id, r_amz_ae, 1999.00, 'AED', 19490.25, true),
    (p_id, r_yod_jp, 63800.00, 'JPY', 15184.40, true);

    -- Roborock S8 MaxV Ultra Robot Vacuum
    INSERT INTO products (category_id, brand, model_name, global_sku, specs, weight_kg)
    VALUES (c_home, 'Roborock', 'S8 MaxV Ultra All-in-One Robot Vacuum & Mop', 'ROB-S8MAXV-ULT', '{"suction": "10000 Pa", "dock": "Auto Water/Dust Emptying & Hot Water Washing", "flexiarm": true}'::jsonb, 14.200)
    RETURNING id INTO p_id;
    INSERT INTO product_prices (product_id, retailer_id, price_original, currency_code, price_try_converted, in_stock) VALUES
    (p_id, r_hep_tr, 79999.00, 'TRY', 79999.00, true),
    (p_id, r_mm_de, 1399.00, 'EUR', 54421.10, true),
    (p_id, r_amz_ae, 4899.00, 'AED', 47765.25, true);

    -- 9. LUXURY DESIGNER & TIMEPIECES
    -- Louis Vuitton Neverfull MM Monogram
    INSERT INTO products (category_id, brand, model_name, global_sku, specs, weight_kg)
    VALUES (c_fash, 'Louis Vuitton', 'Neverfull MM Monogram Canvas Tote Bag', 'LV-NEVERFULL-MM', '{"material": "Coated Canvas & Natural Cowhide Leather", "dimensions": "31 x 28 x 14 cm"}'::jsonb, 0.700)
    RETURNING id INTO p_id;
    INSERT INTO product_prices (product_id, retailer_id, price_original, currency_code, price_try_converted, in_stock) VALUES
    (p_id, r_bey_tr, 115000.00, 'TRY', 115000.00, true),
    (p_id, r_amz_de, 1500.00, 'EUR', 58350.00, true),
    (p_id, r_amz_ae, 6900.00, 'AED', 67275.00, true);

    -- Maison Francis Kurkdjian Baccarat Rouge 540 Extrait 70ml
    INSERT INTO products (category_id, brand, model_name, global_sku, specs, weight_kg)
    VALUES (c_perf, 'Maison Francis Kurkdjian', 'Baccarat Rouge 540 Extrait de Parfum 70ml', 'MFK-BR540-EXT70', '{"volume": "70ml", "type": "Extrait de Parfum", "scent": "Woody Amber Floral"}'::jsonb, 0.350)
    RETURNING id INTO p_id;
    INSERT INTO product_prices (product_id, retailer_id, price_original, currency_code, price_try_converted, in_stock) VALUES
    (p_id, r_bey_tr, 21500.00, 'TRY', 21500.00, true),
    (p_id, r_amz_de, 345.00, 'EUR', 13420.50, true),
    (p_id, r_amz_ae, 1550.00, 'AED', 15112.50, true);

    -- Tissot PRX Powermatic 80 Steel Blue 40mm
    INSERT INTO products (category_id, brand, model_name, global_sku, specs, weight_kg)
    VALUES (c_wat, 'Tissot', 'PRX Powermatic 80 Automatic 40mm Blue Dial', 'TIS-PRX-PM80-BL', '{"movement": "Powermatic 80.111 (80 hr reserve)", "case": "316L Stainless Steel 40mm", "crystal": "Sapphire"}'::jsonb, 0.138)
    RETURNING id INTO p_id;
    INSERT INTO product_prices (product_id, retailer_id, price_original, currency_code, price_try_converted, in_stock) VALUES
    (p_id, r_saat_tr, 32500.00, 'TRY', 32500.00, true),
    (p_id, r_amz_de, 645.00, 'EUR', 25090.50, true),
    (p_id, r_yod_jp, 82500.00, 'JPY', 19635.00, true),
    (p_id, r_amz_us, 625.00, 'USD', 22375.00, true);

    -- Tag Heuer Carrera Chronograph 39mm Glassbox
    INSERT INTO products (category_id, brand, model_name, global_sku, specs, weight_kg)
    VALUES (c_wat, 'Tag Heuer', 'Carrera Chronograph 39mm Glassbox Blue', 'TH-CARRERA-39BL', '{"movement": "Calibre TH20-00 Automatic", "case": "Steel 39mm", "power_reserve": "80h"}'::jsonb, 0.145)
    RETURNING id INTO p_id;
    INSERT INTO product_prices (product_id, retailer_id, price_original, currency_code, price_try_converted, in_stock) VALUES
    (p_id, r_saat_tr, 310000.00, 'TRY', 310000.00, true),
    (p_id, r_amz_de, 5950.00, 'EUR', 231455.00, true),
    (p_id, r_yod_jp, 825000.00, 'JPY', 196350.00, true);

END $$;

-- =============================================================================
-- 5. RELOAD RLS & ENSURE WRITE ACCESS FOR THE AGGREGATOR
-- =============================================================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE retailers ENABLE ROW LEVEL SECURITY;
ALTER TABLE currencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE fx_rates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public write products" ON products;
CREATE POLICY "Public write products" ON products FOR ALL USING (true);

DROP POLICY IF EXISTS "Public write product_prices" ON product_prices;
CREATE POLICY "Public write product_prices" ON product_prices FOR ALL USING (true);

DROP POLICY IF EXISTS "Public write retailers" ON retailers;
CREATE POLICY "Public write retailers" ON retailers FOR ALL USING (true);

DROP POLICY IF EXISTS "Public write currencies" ON currencies;
CREATE POLICY "Public write currencies" ON currencies FOR ALL USING (true);

DROP POLICY IF EXISTS "Public write fx_rates" ON fx_rates;
CREATE POLICY "Public write fx_rates" ON fx_rates FOR ALL USING (true);

ALTER FUNCTION fn_sync_product_price_from_snapshot() SECURITY DEFINER;
