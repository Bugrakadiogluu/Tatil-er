import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',

  // Amadeus API Credentials
  amadeus: {
    clientId: process.env.AMADEUS_CLIENT_ID || '',
    clientSecret: process.env.AMADEUS_CLIENT_SECRET || '',
    hostname: process.env.AMADEUS_HOSTNAME || 'test.api.amadeus.com',
  },

  // RapidAPI (Skyscanner Flights & Booking.com)
  rapidApi: {
    key: process.env.RAPIDAPI_KEY || '',
    host: process.env.RAPIDAPI_HOST || 'flights-sky.p.rapidapi.com',
  },
  rapidApiHotel: {
    key: process.env.RAPIDAPI_KEY || '',
    host: process.env.RAPIDAPI_HOTEL_HOST || 'booking-com15.p.rapidapi.com',
  },

  // SerpApi (Google Flights)
  serpApi: {
    key: process.env.SERPAPI_KEY || '',
  },

  // Supabase / Database
  database: {
    supabaseUrl: process.env.SUPABASE_URL || '',
    supabaseKey: process.env.SUPABASE_ANON_KEY || '',
    connectionString: process.env.DATABASE_URL || '',
  },

  // Exchange Rates & Defaults
  fx: {
    updateIntervalMinutes: parseInt(process.env.FX_UPDATE_INTERVAL_MINUTES || '60', 10),
  },

  // Turkish Customs Regulations Defaults (2025/2026)
  customsTR: {
    imeiFeeTry: parseFloat(process.env.IMEI_FEE_TRY || '45614.00'),
    trtBandrolEurPhone: parseFloat(process.env.TRT_BANDROL_PHONE_EUR || '20.00'),
    trtBandrolEurMonitor: parseFloat(process.env.TRT_BANDROL_MONITOR_EUR || '10.00'),
    maxPhonesPerTrip: 1,
    yearsBetweenPhoneImports: 3,
  }
};
