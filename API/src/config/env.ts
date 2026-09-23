import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  SUPABASE_URL: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  SUPABASE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '',
  
  CRON_SCHEDULE: process.env.CRON_SCHEDULE || '0 2 * * *',
  SCRAPER_WINDOW_MINUTES: parseInt(process.env.SCRAPER_WINDOW_MINUTES || '180', 10), // 3 hours window: 02:00 to 05:00 UTC
  
  PROXY: {
    PROVIDER: (process.env.PROXY_PROVIDER || 'brightdata') as 'brightdata' | 'scraperapi' | 'oxylabs' | 'direct',
    HOST: process.env.PROXY_HOST || '',
    PORT: parseInt(process.env.PROXY_PORT || '22225', 10),
    USERNAME: process.env.PROXY_USERNAME || '',
    PASSWORD: process.env.PROXY_PASSWORD || '',
    SCRAPER_API_KEY: process.env.SCRAPER_API_KEY || '',
  },

  SCRAPING: {
    MAX_CONCURRENT_REQUESTS: parseInt(process.env.MAX_CONCURRENT_REQUESTS || '5', 10),
    PER_DOMAIN_DELAY_MS: parseInt(process.env.PER_DOMAIN_DELAY_MS || '2500', 10),
    HEADLESS_MODE: process.env.HEADLESS_MODE !== 'false',
    MAX_PAGES_PER_BROWSER: parseInt(process.env.MAX_BROWSER_PAGES_PER_INSTANCE || '50', 10),
  }
};
