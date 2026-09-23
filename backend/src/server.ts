import { createApp } from './app';
import { config } from './config';

const app = createApp();

const server = app.listen(config.port, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Holliday Arbitrage Backend Gateway Running!`);
  console.log(`📡 Port: ${config.port}`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);
  console.log(`🔗 Healthcheck: http://localhost:${config.port}/health`);
  console.log(`✈️ Travel API: http://localhost:${config.port}/api/v1/travel/destinations`);
  console.log(`🛍️ Products API: http://localhost:${config.port}/api/v1/products`);
  console.log(`⚖️ Arbitrage API: http://localhost:${config.port}/api/v1/arbitrage/product/prod-iphone16pro?destination=NRT`);
  console.log(`=======================================================`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
