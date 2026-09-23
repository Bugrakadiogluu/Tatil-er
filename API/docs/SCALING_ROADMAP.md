# Strategic Scaling Roadmap: Global Price Aggregator API (130 Countries)

## 1. Executive Summary & Scale Dimensions

Monitoring retail prices across **130 countries** for a cross-border arbitrage engine (Arbitrip) requires tracking thousands of canonical SKUs against hundreds of local e-commerce retailers, Amazon regional domains, and localized retail chains.

### Key Operational Metrics
- **Geographies**: 130 countries (Americas, Europe, MENA, APAC, CIS, Africa).
- **Target Catalog**: ~1,000 canonical high-arbitrage products (iPhones, GPUs, Consoles, Luxury goods).
- **Retailer Endpoints**: ~400 unique retail domains (Amazon, Yodobashi, MediaMarkt, Bic Camera, Best Buy, Sharaf DG, etc.).
- **Daily Ingestion Volume**: ~100,000 price snapshots per day (~36.5M/year).
- **Execution Window**: Strictly **02:00 to 05:00 AM UTC** (180-minute window).
- **Required Throughput**: $\frac{100,000 \text{ jobs}}{10,800 \text{ seconds}} \approx 9.25 \text{ requests/second}$ globally.

---

## 2. Distributed Architecture (BullMQ + Redis)

At 130-country scale, running cron timers and scrapers inside a single Node.js process is an anti-pattern. If a container crashes, scheduled in-memory timers are lost, and concurrency cannot scale horizontally.

```mermaid
flowchart TD
    subgraph Master ["Master Scheduler Pod"]
        MasterCron["Autonomous Scheduler\n(0 2 * * * UTC)"] --> JobGenerator["Target Generator\n(Reads Supabase Targets)"]
        JobGenerator --> RedisCluster[("Redis Cluster / AWS ElastiCache\n(BullMQ Queues)")]
    end

    subgraph QueuePartitions ["BullMQ Regional Queue Shards"]
        RedisCluster --> QueueAMER["Queue: AMER\n(US, CA, BR, MX)"]
        RedisCluster --> QueueEMEA["Queue: EMEA\n(DE, UK, FR, AE, TR)"]
        RedisCluster --> QueueAPAC["Queue: APAC\n(JP, KR, SG, AU)"]
    end

    subgraph WorkerFleet ["Horizontal Worker Fleet (Kubernetes / ECS)"]
        QueueAMER --> Worker1["Worker Pod 1\n(Cheerio / Puppeteer)"]
        QueueEMEA --> Worker2["Worker Pod 2\n(Cheerio / Puppeteer)"]
        QueueAPAC --> Worker3["Worker Pod 3\n(Cheerio / Puppeteer)"]
    end

    subgraph Proxies ["Multi-Country Residential Proxy Grid"]
        Worker1 --> BrightData["Bright Data / ScraperAPI\n(Geo-Targeted Residential IPs)"]
        Worker2 --> BrightData
        Worker3 --> BrightData
    end

    subgraph Database ["PostgreSQL (Supabase)"]
        Worker1 --> Ingest["Batch Ingestion API"]
        Worker2 --> Ingest
        Worker3 --> Ingest
        Ingest --> Snapshots[("price_snapshots\n(Partitioned)")]
    end
```

### Queue Implementation Details
1. **Sharded Queues by Region/Domain**:
   - Rather than one monolithic queue, jobs are partitioned by domain group: `queue:amazon`, `queue:apac-retailers`, `queue:emea-retailers`.
2. **Domain Rate Limiting with BullMQ Token Buckets**:
   ```typescript
   // Guarantees maximum 1 request every 2.5 seconds per retailer domain
   const worker = new Worker('queue:amazon', async (job) => {
     return await ScrapingEngine.scrapeTarget(job.data);
   }, {
     limiter: {
       max: 1,
       duration: 2500
     },
     concurrency: 5
   });
   ```
3. **Randomized Delay Generation**:
   When enqueuing at 02:00 AM UTC, jobs are injected with randomized delays:
   ```typescript
   const randomDelayMs = Math.floor(Math.random() * (160 * 60 * 1000));
   await queue.add('scrape-job', targetData, { delay: randomDelayMs, attempts: 3, backoff: { type: 'exponential', delay: 5000 } });
   ```

---

## 3. Anti-Bot & IP Ban Mitigation Strategy

### Cheerio vs. Puppeteer-Stealth: The Decision Matrix

| Metric | Cheerio + `got-scraping` (Tier 1) | Puppeteer-Stealth (Tier 2) |
| :--- | :--- | :--- |
| **Memory Footprint** | ~20 - 35 MB per worker | ~350 - 600 MB per instance |
| **Latency** | 200 ms - 600 ms | 3,000 ms - 8,000 ms |
| **Proxy Bandwidth** | ~50 KB (HTML only) | ~1.5 MB - 5 MB (Full DOM) |
| **Cost per 10k Scrapes** | ~$0.30 (Residential Data) | ~$15.00 - $30.00 |
| **Anti-Bot Capabilities** | Spoofs TLS JA3/JA4, HTTP/2 frames | Executes JS challenges, Cloudflare Turnstile, Canvas |
| **Usage Target** | **85% - 90% of requests** | **10% - 15% of requests** |

> **Architectural Rule**: Always attempt Tier 1 first. Only escalate to Puppeteer-Stealth if HTTP response status is 403/429/503 or HTML contains anti-bot markers ("Robot Check", "cf-browser-verification", "ddg-challenge").

### Proxy Strategy for 130 Countries
1. **ISO 3166-1 Country Pinning**:
   - Never use generic global datacenter proxies.
   - Bright Data / Oxylabs allows country-targeted residential routing via username flags:
     `http://customer-xyz-zone-residential-country-jp:pass@pr.brightdata.com:22225`
   - E.g., scraping Yodobashi must originate from an authentic Tokyo residential IP; scraping MediaMarkt Germany must originate from a German residential IP.
2. **Sticky Sessions vs. Rotating IPs**:
   - **Product Page Scraping (Stateless)**: Use rotating residential proxies (new IP per request).
   - **Cart / Multi-Step Validation (Stateful)**: Use sticky sessions (`session-id-12345`) held for 5 minutes.
3. **Bandwidth Optimization in Headless Browsers**:
   - Block heavy assets to save 85% bandwidth costs and boost speed 4x:
   ```typescript
   await page.setRequestInterception(true);
   page.on('request', (req) => {
     if (['image', 'stylesheet', 'font', 'media'].includes(req.resourceType())) {
       req.abort();
     } else {
       req.continue();
     }
   });
   ```

---

## 4. Docker & Chromium Memory Leak Elimination

Running headless Chromium inside Docker containers at high volume is notoriously susceptible to resource exhaustion. Here are the mandatory enterprise fixes:

### 1. The Zombie Chrome Process Problem (PID 1)
When Node.js launches Chromium sub-processes, dead browser child processes turn into "zombies" if Node does not reap them. Over 3 hours, thousands of zombies exhaust Linux PID limits.
- **Fix**: Use `dumb-init` or `tini` as the Docker entrypoint.

### 2. `/dev/shm` Shared Memory Starvation
Docker defaults `/dev/shm` (shared memory) to 64MB. Chrome relies heavily on `/dev/shm` for UI rendering. When it runs out, Chrome crashes with `TargetCloseError: Protocol error (Target.sendMessage): Target closed`.
- **Fix**: Add `--disable-dev-shm-usage` flag to Puppeteer AND set `shm_size: 2gb` in `docker-compose.yml`.

### 3. Chromium DOM & V8 Heap Accumulation
Even with `page.close()`, Chromium does not release all allocated memory back to the OS.
- **Fix**: **Lifecycle Recycling**. Close and recreate the browser process every 50 pages or 15 minutes of operation.

---

## 5. Production Dockerfile & Deployment Config

### `Dockerfile`
```dockerfile
FROM node:20-bullseye-slim

# Install Chromium dependencies and dumb-init
RUN apt-get update && apt-get install -y \
    dumb-init \
    chromium \
    fonts-ipafont-gothic \
    fonts-wqy-zenhei \
    fonts-thai-tlwg \
    fonts-kacst \
    fonts-freefont-ttf \
    libxss1 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
    NODE_ENV=production

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist/ ./dist/

# Use dumb-init as PID 1 to reap zombie Chromium processes
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "--max-old-space-size=2048", "dist/index.js"]
```

### `docker-compose.yml`
```yaml
version: '3.8'

services:
  redis:
    image: redis:7-alpine
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  scraper-worker:
    build: .
    restart: on-failure
    shm_size: '2gb' # Critical: Prevents Chromium shared memory crashes
    deploy:
      replicas: 4 # Scale to 4 worker pods for concurrent 130-country processing
    environment:
      - NODE_ENV=production
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
      - CRON_SCHEDULE=0 2 * * *
      - SCRAPER_WINDOW_MINUTES=180
      - MAX_CONCURRENT_REQUESTS=10
    depends_on:
      - redis

volumes:
  redis_data:
```
