-- =============================================================================
-- TRAVEL & CROSS-BORDER SHOPPING ARBITRAGE PLATFORM (ARBITRIP)
-- Extension Schema: Global Price Aggregator Time-Series Engine
-- Version: 2.0.0 (Supabase & PostgreSQL 15+ Compatible)
-- =============================================================================

-- Ensure required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- 1. COUNTRY RETAILERS & SCRAPING TARGET MAPPINGS
-- =============================================================================

-- Enhanced Retailers view / table metadata
-- Extends the base `retailers` table with proxy and anti-bot configuration
ALTER TABLE retailers 
ADD COLUMN IF NOT EXISTS proxy_country_code VARCHAR(2),
ADD COLUMN IF NOT EXISTS requires_headless BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS rate_limit_per_min INT DEFAULT 30,
ADD COLUMN IF NOT EXISTS default_headers JSONB DEFAULT '{}'::jsonb;

-- Update existing retailers with proxy countries
UPDATE retailers SET proxy_country_code = country_code WHERE proxy_country_code IS NULL;

-- Product <-> Retailer URL and SKU Mapping Table
-- Represents specific product endpoints across 130 countries
CREATE TABLE IF NOT EXISTS product_retailer_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    retailer_id UUID NOT NULL REFERENCES retailers(id) ON DELETE CASCADE,
    product_url TEXT NOT NULL,
    retailer_sku VARCHAR(100),              -- ASIN for Amazon, JAN for Japan, EAN for EU
    custom_selector_price TEXT,             -- Optional custom CSS selector override
    custom_selector_stock TEXT,             -- Optional custom stock selector override
    is_monitored BOOLEAN DEFAULT TRUE,
    priority INT DEFAULT 1,                 -- 1: High (Daily), 2: Medium (Every 2 days), 3: Low
    last_scraped_at TIMESTAMPTZ,
    last_scrape_status VARCHAR(20) DEFAULT 'PENDING', -- 'SUCCESS', 'FAILED', 'CAPTCHA', 'OUT_OF_STOCK'
    scrape_error_count INT DEFAULT 0,
    last_error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_product_retailer_mapping UNIQUE (product_id, retailer_id)
);

CREATE INDEX IF NOT EXISTS idx_prm_active ON product_retailer_mappings(is_monitored, priority) WHERE is_monitored = TRUE;
CREATE INDEX IF NOT EXISTS idx_prm_retailer ON product_retailer_mappings(retailer_id);
CREATE INDEX IF NOT EXISTS idx_prm_product ON product_retailer_mappings(product_id);

-- =============================================================================
-- 2. TIME-SERIES PRICE SNAPSHOTS (PARTITIONED)
-- =============================================================================

-- Master Table for Daily Price Snapshots
-- Partitioned by RANGE on `scraped_at` to guarantee O(1) ingestion and partition pruning
CREATE TABLE IF NOT EXISTS price_snapshots (
    id UUID DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    retailer_id UUID NOT NULL REFERENCES retailers(id) ON DELETE CASCADE,
    price_original NUMERIC(14, 2) NOT NULL,
    currency_code VARCHAR(3) NOT NULL REFERENCES currencies(code),
    price_try_converted NUMERIC(14, 2) NOT NULL,
    in_stock BOOLEAN NOT NULL DEFAULT TRUE,
    discount_pct NUMERIC(5, 2) DEFAULT 0.00,
    raw_title TEXT,
    seller_name VARCHAR(150),
    response_time_ms INT,
    engine_used VARCHAR(30) DEFAULT 'cheerio', -- 'cheerio_got' or 'puppeteer_stealth'
    scraped_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id, scraped_at)
) PARTITION BY RANGE (scraped_at);

-- -----------------------------------------------------------------------------
-- Pre-Generated Partitions (2025 - 2027)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS price_snapshots_y2025m01 PARTITION OF price_snapshots
    FOR VALUES FROM ('2025-01-01 00:00:00+00') TO ('2025-02-01 00:00:00+00');

CREATE TABLE IF NOT EXISTS price_snapshots_y2025m02 PARTITION OF price_snapshots
    FOR VALUES FROM ('2025-02-01 00:00:00+00') TO ('2025-03-01 00:00:00+00');

CREATE TABLE IF NOT EXISTS price_snapshots_y2025m03 PARTITION OF price_snapshots
    FOR VALUES FROM ('2025-03-01 00:00:00+00') TO ('2025-04-01 00:00:00+00');

CREATE TABLE IF NOT EXISTS price_snapshots_y2025m04 PARTITION OF price_snapshots
    FOR VALUES FROM ('2025-04-01 00:00:00+00') TO ('2025-05-01 00:00:00+00');

CREATE TABLE IF NOT EXISTS price_snapshots_y2025m05 PARTITION OF price_snapshots
    FOR VALUES FROM ('2025-05-01 00:00:00+00') TO ('2025-06-01 00:00:00+00');

CREATE TABLE IF NOT EXISTS price_snapshots_y2025m06 PARTITION OF price_snapshots
    FOR VALUES FROM ('2025-06-01 00:00:00+00') TO ('2025-07-01 00:00:00+00');

CREATE TABLE IF NOT EXISTS price_snapshots_y2025m07 PARTITION OF price_snapshots
    FOR VALUES FROM ('2025-07-01 00:00:00+00') TO ('2025-08-01 00:00:00+00');

CREATE TABLE IF NOT EXISTS price_snapshots_y2025m08 PARTITION OF price_snapshots
    FOR VALUES FROM ('2025-08-01 00:00:00+00') TO ('2025-09-01 00:00:00+00');

CREATE TABLE IF NOT EXISTS price_snapshots_y2025m09 PARTITION OF price_snapshots
    FOR VALUES FROM ('2025-09-01 00:00:00+00') TO ('2025-10-01 00:00:00+00');

CREATE TABLE IF NOT EXISTS price_snapshots_y2025m10 PARTITION OF price_snapshots
    FOR VALUES FROM ('2025-10-01 00:00:00+00') TO ('2025-11-01 00:00:00+00');

CREATE TABLE IF NOT EXISTS price_snapshots_y2025m11 PARTITION OF price_snapshots
    FOR VALUES FROM ('2025-11-01 00:00:00+00') TO ('2025-12-01 00:00:00+00');

CREATE TABLE IF NOT EXISTS price_snapshots_y2025m12 PARTITION OF price_snapshots
    FOR VALUES FROM ('2025-12-01 00:00:00+00') TO ('2026-01-01 00:00:00+00');

CREATE TABLE IF NOT EXISTS price_snapshots_y2026m01 PARTITION OF price_snapshots
    FOR VALUES FROM ('2026-01-01 00:00:00+00') TO ('2026-02-01 00:00:00+00');

CREATE TABLE IF NOT EXISTS price_snapshots_y2026m02 PARTITION OF price_snapshots
    FOR VALUES FROM ('2026-02-01 00:00:00+00') TO ('2026-03-01 00:00:00+00');

CREATE TABLE IF NOT EXISTS price_snapshots_y2026m03 PARTITION OF price_snapshots
    FOR VALUES FROM ('2026-03-01 00:00:00+00') TO ('2026-04-01 00:00:00+00');

CREATE TABLE IF NOT EXISTS price_snapshots_y2026m04 PARTITION OF price_snapshots
    FOR VALUES FROM ('2026-04-01 00:00:00+00') TO ('2026-05-01 00:00:00+00');

CREATE TABLE IF NOT EXISTS price_snapshots_y2026m05 PARTITION OF price_snapshots
    FOR VALUES FROM ('2026-05-01 00:00:00+00') TO ('2026-06-01 00:00:00+00');

CREATE TABLE IF NOT EXISTS price_snapshots_y2026m06 PARTITION OF price_snapshots
    FOR VALUES FROM ('2026-06-01 00:00:00+00') TO ('2026-07-01 00:00:00+00');

CREATE TABLE IF NOT EXISTS price_snapshots_y2026m07 PARTITION OF price_snapshots
    FOR VALUES FROM ('2026-07-01 00:00:00+00') TO ('2026-08-01 00:00:00+00');

CREATE TABLE IF NOT EXISTS price_snapshots_y2026m08 PARTITION OF price_snapshots
    FOR VALUES FROM ('2026-08-01 00:00:00+00') TO ('2026-09-01 00:00:00+00');

CREATE TABLE IF NOT EXISTS price_snapshots_y2026m09 PARTITION OF price_snapshots
    FOR VALUES FROM ('2026-09-01 00:00:00+00') TO ('2026-10-01 00:00:00+00');

CREATE TABLE IF NOT EXISTS price_snapshots_y2026m10 PARTITION OF price_snapshots
    FOR VALUES FROM ('2026-10-01 00:00:00+00') TO ('2026-11-01 00:00:00+00');

CREATE TABLE IF NOT EXISTS price_snapshots_y2026m11 PARTITION OF price_snapshots
    FOR VALUES FROM ('2026-11-01 00:00:00+00') TO ('2026-12-01 00:00:00+00');

CREATE TABLE IF NOT EXISTS price_snapshots_y2026m12 PARTITION OF price_snapshots
    FOR VALUES FROM ('2026-12-01 00:00:00+00') TO ('2027-01-01 00:00:00+00');

-- Default fallback partition for future dates
CREATE TABLE IF NOT EXISTS price_snapshots_default PARTITION OF price_snapshots DEFAULT;

-- -----------------------------------------------------------------------------
-- Optimized Time-Series Indexes on Partitioned Table
-- -----------------------------------------------------------------------------

-- 1. Composite B-Tree: Essential for product price trends & sparkline charts
CREATE INDEX IF NOT EXISTS idx_snapshots_composite_lookup 
ON price_snapshots (product_id, retailer_id, scraped_at DESC);

-- 2. BRIN Index: Blazing-fast temporal range scans (95% smaller than B-Tree)
CREATE INDEX IF NOT EXISTS idx_snapshots_brin_scraped_at 
ON price_snapshots USING BRIN (scraped_at);

-- 3. Partial Index: Fast alerting on out-of-stock events
CREATE INDEX IF NOT EXISTS idx_snapshots_out_of_stock 
ON price_snapshots (retailer_id, scraped_at DESC) 
WHERE in_stock = FALSE;

-- =============================================================================
-- 3. AUTOMATED TRIGGER: REAL-TIME SYNC TO `product_prices`
-- =============================================================================

-- Function: Automatically syncs new snapshot to the hot `product_prices` cache
-- and recalculates TRY conversion using latest `fx_rates` if not provided.
CREATE OR REPLACE FUNCTION fn_sync_product_price_from_snapshot()
RETURNS TRIGGER AS $$
DECLARE
    v_fx_rate NUMERIC(18, 6) := 1.0;
    v_converted_try NUMERIC(14, 2);
    v_product_url TEXT;
BEGIN
    -- 1. Resolve FX Rate if converted TRY price is missing or zero
    IF NEW.price_try_converted IS NULL OR NEW.price_try_converted = 0 THEN
        IF NEW.currency_code = 'TRY' THEN
            v_converted_try := NEW.price_original;
        ELSE
            SELECT rate INTO v_fx_rate 
            FROM fx_rates 
            WHERE base_currency = NEW.currency_code AND target_currency = 'TRY'
            LIMIT 1;

            IF v_fx_rate IS NULL THEN
                v_fx_rate := 1.0;
            END IF;
            v_converted_try := ROUND(NEW.price_original * v_fx_rate, 2);
        END IF;
    ELSE
        v_converted_try := NEW.price_try_converted;
    END IF;

    -- 2. Fetch mapped product URL if available
    SELECT product_url INTO v_product_url 
    FROM product_retailer_mappings 
    WHERE product_id = NEW.product_id AND retailer_id = NEW.retailer_id
    LIMIT 1;

    -- 3. Upsert into hot `product_prices` table
    INSERT INTO product_prices (
        product_id,
        retailer_id,
        price_original,
        currency_code,
        price_try_converted,
        in_stock,
        product_url,
        last_scraped_at
    )
    VALUES (
        NEW.product_id,
        NEW.retailer_id,
        NEW.price_original,
        NEW.currency_code,
        v_converted_try,
        NEW.in_stock,
        COALESCE(v_product_url, ''),
        NEW.scraped_at
    )
    ON CONFLICT (product_id, retailer_id) DO UPDATE SET
        price_original = EXCLUDED.price_original,
        currency_code = EXCLUDED.currency_code,
        price_try_converted = EXCLUDED.price_try_converted,
        in_stock = EXCLUDED.in_stock,
        product_url = COALESCE(EXCLUDED.product_url, product_prices.product_url),
        last_scraped_at = EXCLUDED.last_scraped_at;

    -- 4. Update status on mapping table
    UPDATE product_retailer_mappings
    SET 
        last_scraped_at = NEW.scraped_at,
        last_scrape_status = CASE WHEN NEW.in_stock THEN 'SUCCESS' ELSE 'OUT_OF_STOCK' END,
        scrape_error_count = 0,
        last_error_message = NULL,
        updated_at = NOW()
    WHERE product_id = NEW.product_id AND retailer_id = NEW.retailer_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to master partitioned table
DROP TRIGGER IF EXISTS trg_price_snapshot_sync ON price_snapshots;
CREATE TRIGGER trg_price_snapshot_sync
AFTER INSERT ON price_snapshots
FOR EACH ROW
EXECUTE FUNCTION fn_sync_product_price_from_snapshot();

-- =============================================================================
-- 4. ANALYTICAL FUNCTION: FAST TIME-SERIES PRICE HISTORY
-- =============================================================================

CREATE OR REPLACE FUNCTION get_price_history_timeseries(
    p_product_id UUID,
    p_retailer_id UUID,
    p_days INT DEFAULT 30
)
RETURNS TABLE (
    scrape_date DATE,
    closing_price_original NUMERIC(14, 2),
    closing_price_try NUMERIC(14, 2),
    currency_code VARCHAR(3),
    min_price_try NUMERIC(14, 2),
    max_price_try NUMERIC(14, 2),
    was_in_stock BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        DATE(ps.scraped_at) AS scrape_date,
        (ARRAY_AGG(ps.price_original ORDER BY ps.scraped_at DESC))[1] AS closing_price_original,
        (ARRAY_AGG(ps.price_try_converted ORDER BY ps.scraped_at DESC))[1] AS closing_price_try,
        (ARRAY_AGG(ps.currency_code ORDER BY ps.scraped_at DESC))[1] AS currency_code,
        MIN(ps.price_try_converted) AS min_price_try,
        MAX(ps.price_try_converted) AS max_price_try,
        BOOL_OR(ps.in_stock) AS was_in_stock
    FROM price_snapshots ps
    WHERE ps.product_id = p_product_id
      AND ps.retailer_id = p_retailer_id
      AND ps.scraped_at >= NOW() - (p_days || ' days')::INTERVAL
    GROUP BY DATE(ps.scraped_at)
    ORDER BY scrape_date ASC;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- 5. SEED TARGET MAPPINGS FOR ACTIVE PRODUCTS
-- =============================================================================

-- Populate sample URL mappings for active products across retailers
DO $$
DECLARE
    p_ps5 UUID;
    p_ip16p UUID;
    p_rtx4080 UUID;
    r_amazon_ae UUID;
    r_yodobashi UUID;
    r_mediamarkt UUID;
    r_bestbuy UUID;
    r_vatan UUID;
    r_hepsi UUID;
BEGIN
    SELECT id INTO p_ps5 FROM products WHERE model_name LIKE 'PlayStation 5 Pro%' LIMIT 1;
    SELECT id INTO p_ip16p FROM products WHERE model_name LIKE 'iPhone 16 Pro 256GB%' LIMIT 1;
    SELECT id INTO p_rtx4080 FROM products WHERE model_name LIKE 'GeForce RTX 4080 Super%' LIMIT 1;

    SELECT id INTO r_amazon_ae FROM retailers WHERE name LIKE 'Amazon UAE%' LIMIT 1;
    SELECT id INTO r_yodobashi FROM retailers WHERE name LIKE 'Yodobashi Camera%' LIMIT 1;
    SELECT id INTO r_mediamarkt FROM retailers WHERE name LIKE 'MediaMarkt Germany%' LIMIT 1;
    SELECT id INTO r_bestbuy FROM retailers WHERE name LIKE 'Best Buy%' LIMIT 1;
    SELECT id INTO r_vatan FROM retailers WHERE name LIKE 'Vatan Bilgisayar%' LIMIT 1;
    SELECT id INTO r_hepsi FROM retailers WHERE name LIKE 'Hepsiburada%' LIMIT 1;

    -- PS5 Pro Targets
    IF p_ps5 IS NOT NULL AND r_amazon_ae IS NOT NULL THEN
        INSERT INTO product_retailer_mappings (product_id, retailer_id, product_url, retailer_sku)
        VALUES (p_ps5, r_amazon_ae, 'https://www.amazon.ae/dp/B0DFV295Q5', 'B0DFV295Q5')
        ON CONFLICT (product_id, retailer_id) DO NOTHING;
    END IF;

    IF p_ps5 IS NOT NULL AND r_yodobashi IS NOT NULL THEN
        INSERT INTO product_retailer_mappings (product_id, retailer_id, product_url, retailer_sku)
        VALUES (p_ps5, r_yodobashi, 'https://www.yodobashi.com/product/100000001008681285/', '100000001008681285')
        ON CONFLICT (product_id, retailer_id) DO NOTHING;
    END IF;

    IF p_ps5 IS NOT NULL AND r_mediamarkt IS NOT NULL THEN
        INSERT INTO product_retailer_mappings (product_id, retailer_id, product_url, retailer_sku)
        VALUES (p_ps5, r_mediamarkt, 'https://www.mediamarkt.de/de/product/_sony-playstationr5-pro-2953282.html', '2953282')
        ON CONFLICT (product_id, retailer_id) DO NOTHING;
    END IF;

    -- iPhone 16 Pro Targets
    IF p_ip16p IS NOT NULL AND r_amazon_ae IS NOT NULL THEN
        INSERT INTO product_retailer_mappings (product_id, retailer_id, product_url, retailer_sku)
        VALUES (p_ip16p, r_amazon_ae, 'https://www.amazon.ae/dp/B0DGJ74Y4Q', 'B0DGJ74Y4Q')
        ON CONFLICT (product_id, retailer_id) DO NOTHING;
    END IF;

    IF p_ip16p IS NOT NULL AND r_yodobashi IS NOT NULL THEN
        INSERT INTO product_retailer_mappings (product_id, retailer_id, product_url, retailer_sku)
        VALUES (p_ip16p, r_yodobashi, 'https://www.yodobashi.com/product/100000001008694082/', '100000001008694082')
        ON CONFLICT (product_id, retailer_id) DO NOTHING;
    END IF;
END $$;

-- =============================================================================
-- 6. ROW LEVEL SECURITY (RLS) FOR SUPABASE
-- =============================================================================

ALTER TABLE product_retailer_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read product_retailer_mappings" ON product_retailer_mappings FOR SELECT USING (true);
CREATE POLICY "Public write product_retailer_mappings" ON product_retailer_mappings FOR ALL USING (true);
CREATE POLICY "Public read price_snapshots" ON price_snapshots FOR SELECT USING (true);
CREATE POLICY "Public write price_snapshots" ON price_snapshots FOR ALL USING (true);

-- Allow inserting new auto-discovered retailers and updating prices
DROP POLICY IF EXISTS "Public write retailers" ON retailers;
CREATE POLICY "Public write retailers" ON retailers FOR ALL USING (true);

DROP POLICY IF EXISTS "Public write product_prices" ON product_prices;
CREATE POLICY "Public write product_prices" ON product_prices FOR ALL USING (true);

DROP POLICY IF EXISTS "Public write products" ON products;
CREATE POLICY "Public write products" ON products FOR ALL USING (true);

DROP POLICY IF EXISTS "Public write product_categories" ON product_categories;
CREATE POLICY "Public write product_categories" ON product_categories FOR ALL USING (true);
