-- =============================================================================
-- TRAVEL & CROSS-BORDER SHOPPING ARBITRAGE PLATFORM (ARBITRIP)
-- PostgreSQL Database Schema (Supabase Compatible)
-- Version: 1.0.0
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- 1. CURRENCIES & EXCHANGE RATES
-- =============================================================================

CREATE TABLE IF NOT EXISTS currencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(3) NOT NULL UNIQUE,       -- e.g. TRY, USD, EUR, JPY, GBP, AED, GEL
    name VARCHAR(50) NOT NULL,
    symbol VARCHAR(8) NOT NULL,
    decimal_digits INT DEFAULT 2,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fx_rates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    base_currency VARCHAR(3) NOT NULL REFERENCES currencies(code),
    target_currency VARCHAR(3) NOT NULL REFERENCES currencies(code),
    rate NUMERIC(18, 6) NOT NULL,
    provider VARCHAR(50) DEFAULT 'Frankfurter / ECB',
    fetched_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_base_target_pair UNIQUE (base_currency, target_currency)
);

CREATE INDEX idx_fx_rates_pair ON fx_rates(base_currency, target_currency);

-- =============================================================================
-- 2. DESTINATIONS & TRAVEL COSTS
-- =============================================================================

CREATE TABLE IF NOT EXISTS destinations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city_name VARCHAR(100) NOT NULL,
    country_name VARCHAR(100) NOT NULL,
    country_code VARCHAR(2) NOT NULL,       -- ISO 3166-1 alpha-2: JP, DE, AE, US, GB, GE, etc.
    primary_airport_code VARCHAR(3) NOT NULL, -- IATA code: NRT, BER, DXB, JFK, LHR, TBS
    secondary_airports VARCHAR(3)[],         -- Additional airports: e.g. HND, SXF, DWC, LGW
    currency_code VARCHAR(3) NOT NULL REFERENCES currencies(code),
    flight_duration_hours NUMERIC(4, 1) DEFAULT 4.0,
    daily_cost_budget NUMERIC(12, 2) NOT NULL,    -- In local currency
    daily_cost_moderate NUMERIC(12, 2) NOT NULL,  -- In local currency
    daily_cost_luxury NUMERIC(12, 2) NOT NULL,    -- In local currency
    avg_hotel_budget NUMERIC(12, 2) NOT NULL,     -- Per night in local currency
    avg_hotel_moderate NUMERIC(12, 2) NOT NULL,   -- Per night in local currency
    avg_hotel_luxury NUMERIC(12, 2) NOT NULL,     -- Per night in local currency
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_destinations_airport ON destinations(primary_airport_code);
CREATE INDEX idx_destinations_country ON destinations(country_code);

-- =============================================================================
-- 3. TAX-FREE & CUSTOMS REGULATIONS
-- =============================================================================

CREATE TABLE IF NOT EXISTS vat_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country_code VARCHAR(2) NOT NULL UNIQUE,
    country_name VARCHAR(100) NOT NULL,
    standard_vat_rate NUMERIC(5, 2) NOT NULL,      -- e.g. 19.00 for Germany, 10.00 for Japan
    min_spend_amount NUMERIC(12, 2) DEFAULT 0,    -- Minimum spend requirement in local currency
    net_refund_pct_min NUMERIC(5, 2) NOT NULL,    -- After refund agent cut (Global Blue / Planet)
    net_refund_pct_max NUMERIC(5, 2) NOT NULL,
    refund_operator VARCHAR(100) DEFAULT 'Global Blue / Planet Tax Free',
    has_tourist_vat_refund BOOLEAN DEFAULT TRUE,  -- False for UK (post-Brexit), US (no federal VAT)
    refund_process_type VARCHAR(50) DEFAULT 'airport_customs_stamp', -- 'instant_shop_deduction', 'airport_customs_stamp', 'digital_validation'
    notes TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS customs_regulations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    target_country_code VARCHAR(2) NOT NULL DEFAULT 'TR', -- Defaulting to Turkey customs
    category_code VARCHAR(50) NOT NULL,                   -- 'smartphones', 'gpus', 'consoles', 'monitors', 'mice', 'clothing'
    personal_allowance_qty INT DEFAULT 1,
    imei_fee_try NUMERIC(12, 2) DEFAULT 0,                -- Current Turkish IMEI Registration Fee
    trt_bandrol_fee_eur NUMERIC(8, 2) DEFAULT 0,          -- TRT Bandrol fee in EUR
    requires_imei_registration BOOLEAN DEFAULT FALSE,
    passenger_quota_rule TEXT,                            -- e.g. "1 device per passenger every 3 calendar years"
    customs_declaration_threshold_try NUMERIC(12, 2) DEFAULT 150000.00,
    effective_year INT DEFAULT 2025,
    notes TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_customs_category_year UNIQUE (target_country_code, category_code, effective_year)
);

-- =============================================================================
-- 4. E-COMMERCE CATALOG & MULTI-REGIONAL PRICING
-- =============================================================================

CREATE TABLE IF NOT EXISTS product_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL UNIQUE,       -- 'smartphones', 'gpus', 'consoles', 'monitors', 'mice', 'clothing'
    display_name VARCHAR(100) NOT NULL,
    icon_name VARCHAR(50) DEFAULT 'package',
    description TEXT,
    sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES product_categories(id) ON DELETE RESTRICT,
    brand VARCHAR(100) NOT NULL,
    model_name VARCHAR(150) NOT NULL,
    global_sku VARCHAR(100),
    ean_upc VARCHAR(50),
    specs JSONB DEFAULT '{}'::jsonb,
    image_url TEXT,
    weight_kg NUMERIC(6, 3) DEFAULT 0.5,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_sku ON products(global_sku);
CREATE INDEX idx_products_brand ON products(brand);

CREATE TABLE IF NOT EXISTS retailers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    country_code VARCHAR(2) NOT NULL,
    currency_code VARCHAR(3) NOT NULL REFERENCES currencies(code),
    website_url TEXT,
    logo_url TEXT,
    is_domestic BOOLEAN DEFAULT FALSE,   -- True for Turkish merchants (Hepsiburada, Vatan, etc.)
    scraper_adapter VARCHAR(50),         -- 'amazon_paapi', 'bestbuy_api', 'puppeteer_yodobashi', 'generic_cheerio'
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS product_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    retailer_id UUID NOT NULL REFERENCES retailers(id) ON DELETE CASCADE,
    price_original NUMERIC(14, 2) NOT NULL,
    currency_code VARCHAR(3) NOT NULL REFERENCES currencies(code),
    price_try_converted NUMERIC(14, 2) NOT NULL,
    in_stock BOOLEAN DEFAULT TRUE,
    product_url TEXT,
    last_scraped_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_product_retailer UNIQUE (product_id, retailer_id)
);

CREATE INDEX idx_product_prices_lookup ON product_prices(product_id, retailer_id);
CREATE INDEX idx_product_prices_stock ON product_prices(in_stock);

-- =============================================================================
-- 5. USER ARBITRAGE SEARCHES & ITINERARY BASKETS
-- =============================================================================

CREATE TABLE IF NOT EXISTS arbitrage_trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_session_id VARCHAR(100),
    origin_airport VARCHAR(3) NOT NULL DEFAULT 'IST',
    destination_id UUID NOT NULL REFERENCES destinations(id),
    departure_date DATE NOT NULL,
    return_date DATE NOT NULL,
    duration_days INT NOT NULL,
    travel_style VARCHAR(20) DEFAULT 'moderate', -- 'budget', 'moderate', 'luxury'
    flight_cost_try NUMERIC(12, 2) NOT NULL,
    hotel_cost_try NUMERIC(12, 2) NOT NULL,
    daily_living_cost_try NUMERIC(12, 2) NOT NULL,
    total_trip_cost_try NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS arbitrage_basket_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL REFERENCES arbitrage_trips(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    abroad_retailer_id UUID NOT NULL REFERENCES retailers(id),
    domestic_retailer_id UUID NOT NULL REFERENCES retailers(id),
    abroad_price_original NUMERIC(14, 2) NOT NULL,
    abroad_currency VARCHAR(3) NOT NULL,
    abroad_price_try NUMERIC(14, 2) NOT NULL,
    domestic_price_try NUMERIC(14, 2) NOT NULL,
    net_vat_refund_try NUMERIC(14, 2) DEFAULT 0,
    imei_fee_try NUMERIC(14, 2) DEFAULT 0,
    trt_bandrol_fee_try NUMERIC(14, 2) DEFAULT 0,
    net_savings_try NUMERIC(14, 2) NOT NULL,
    quantity INT DEFAULT 1
);

-- =============================================================================
-- 6. VIEWS FOR FAST ARBITRAGE LOOKUPS
-- =============================================================================

CREATE OR REPLACE VIEW v_active_product_arbitrage AS
SELECT 
    p.id AS product_id,
    p.brand,
    p.model_name,
    c.code AS category_code,
    c.display_name AS category_name,
    dom_ret.name AS domestic_retailer,
    dom_price.price_try_converted AS domestic_price_try,
    abroad_ret.name AS abroad_retailer,
    abroad_ret.country_code AS abroad_country_code,
    dest.city_name AS abroad_city,
    abroad_price.price_original AS abroad_price_original,
    abroad_price.currency_code AS abroad_currency,
    abroad_price.price_try_converted AS abroad_price_try,
    -- Tax refund calculations
    COALESCE(vr.net_refund_pct_max, 0) AS vat_refund_pct,
    ROUND(
        CASE 
            WHEN vr.has_tourist_vat_refund THEN (abroad_price.price_try_converted * (COALESCE(vr.net_refund_pct_max, 0) / 100.0))
            ELSE 0 
        END, 2
    ) AS vat_refund_try,
    -- Customs fees
    COALESCE(cr.imei_fee_try, 0) AS imei_fee_try,
    COALESCE(cr.trt_bandrol_fee_eur, 0) AS trt_bandrol_eur,
    -- Net abroad landed cost
    ROUND(
        (abroad_price.price_try_converted) 
        - (CASE WHEN vr.has_tourist_vat_refund THEN (abroad_price.price_try_converted * (COALESCE(vr.net_refund_pct_max, 0) / 100.0)) ELSE 0 END)
        + (COALESCE(cr.imei_fee_try, 0))
    , 2) AS net_abroad_cost_try,
    -- Net arbitrage savings
    ROUND(
        dom_price.price_try_converted - (
            (abroad_price.price_try_converted) 
            - (CASE WHEN vr.has_tourist_vat_refund THEN (abroad_price.price_try_converted * (COALESCE(vr.net_refund_pct_max, 0) / 100.0)) ELSE 0 END)
            + (COALESCE(cr.imei_fee_try, 0))
        )
    , 2) AS net_savings_try
FROM products p
JOIN product_categories c ON p.category_id = c.id
JOIN product_prices dom_price ON p.id = dom_price.product_id
JOIN retailers dom_ret ON dom_price.retailer_id = dom_ret.id AND dom_ret.is_domestic = TRUE
JOIN product_prices abroad_price ON p.id = abroad_price.product_id
JOIN retailers abroad_ret ON abroad_price.retailer_id = abroad_ret.id AND abroad_ret.is_domestic = FALSE
LEFT JOIN destinations dest ON abroad_ret.country_code = dest.country_code
LEFT JOIN vat_rules vr ON abroad_ret.country_code = vr.country_code
LEFT JOIN customs_regulations cr ON c.code = cr.category_code AND cr.target_country_code = 'TR';

-- =============================================================================
-- 7. TRIGGERS & AUTOMATION
-- =============================================================================

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_destinations_updated BEFORE UPDATE ON destinations FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_products_updated BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_currencies_updated BEFORE UPDATE ON currencies FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- =============================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES FOR SUPABASE
-- =============================================================================

ALTER TABLE currencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE fx_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE vat_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE customs_regulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE retailers ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE arbitrage_trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE arbitrage_basket_items ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Public read currencies" ON currencies FOR SELECT USING (true);
CREATE POLICY "Public read fx_rates" ON fx_rates FOR SELECT USING (true);
CREATE POLICY "Public read destinations" ON destinations FOR SELECT USING (true);
CREATE POLICY "Public read vat_rules" ON vat_rules FOR SELECT USING (true);
CREATE POLICY "Public read customs_regulations" ON customs_regulations FOR SELECT USING (true);
CREATE POLICY "Public read product_categories" ON product_categories FOR SELECT USING (true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read retailers" ON retailers FOR SELECT USING (true);
CREATE POLICY "Public read product_prices" ON product_prices FOR SELECT USING (true);
CREATE POLICY "Public read arbitrage_trips" ON arbitrage_trips FOR SELECT USING (true);
CREATE POLICY "Public insert arbitrage_trips" ON arbitrage_trips FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read arbitrage_basket_items" ON arbitrage_basket_items FOR SELECT USING (true);
CREATE POLICY "Public insert arbitrage_basket_items" ON arbitrage_basket_items FOR INSERT WITH CHECK (true);
