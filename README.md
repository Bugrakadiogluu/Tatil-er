# ✈️ TATİL'ER (Cross-Border Shopping Arbitrage & Holiday Funding Engine)
### Sınır Ötesi Alışveriş Arbitrajı & Akıllı Tatil Finansman Platformu

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14_App_Router-black?style=for-the-badge&logo=next.js" alt="Next.js 14" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-Backend_API-lightgrey?style=for-the-badge&logo=express" alt="Express.js" />
  <img src="https://img.shields.io/badge/Three.js-3D_Globe-orange?style=for-the-badge&logo=three.js" alt="Three.js" />
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-teal?style=for-the-badge&logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/Puppeteer-Stealth_Scraping-323330?style=for-the-badge&logo=puppeteer" alt="Puppeteer" />
  <img src="https://img.shields.io/badge/Docker-Compose_Ready-2496ED?style=for-the-badge&logo=docker" alt="Docker" />
</p>

> **"Alışveriş tasarrufunuzla tatilinizi bedavaya getirin."**  
> **TATİL'ER**, yurt dışından teknoloji (GPU, iPhone, MacBook, PS5 Pro, kamera vb.) ve lüks tüketim ürünleri satın aldığınızda elde ettiğiniz fiyat avantajını, gerçek zamanlı uçak bileti, otel konaklaması ve şehir yaşam masraflarıyla eşleştiren yeni nesil bir **ters arbitraj (reverse arbitrage)** motorudur.

---

## 📖 İçindekiler
- [🎯 Projenin Amacı & Ne İşe Yarar?](#-projenin-amacı--ne-işe-yarar)
- [🌟 Temel Özellikler](#-temel-özellikler)
- [📐 Sistem Mimarisi & Modüller](#-sistem-mimarisi--modüller)
- [⚖️ Gümrük & Tax-Free Mevzuat Motoru](#️-gümrük--tax-free-mevzuat-motoru)
- [🚀 Hızlı Başlangıç & Kurulum](#-hızlı-başlangıç--kurulum)
  - [Seçenek 1: Tek Tıkla Başlatma (.bat - Windows)](#seçenek-1-tek-tıkla-başlatma-bat---windows)
  - [Seçenek 2: Docker Compose ile](#seçenek-2-docker-compose-ile)
  - [Seçenek 3: Manuel Geliştirici Kurulumu](#seçenek-3-manuel-geliştirici-kurulumu)
- [🔑 Çevre Değişkenleri (.env Rehberi)](#-çevre-değişkenleri-env-rehberi)
- [📡 API Uç Noktaları (Endpoints)](#-api-uç-noktaları-endpoints)
- [🛡️ Güvenlik & Git'e Yükleme Rehberi](#️-güvenlik--gite-yükleme-rehberi)
- [🤝 Katkıda Bulunma & Lisans](#-katkıda-bulunma--lisans)

---

## 🎯 Projenin Amacı & Ne İşe Yarar?

Türkiye'deki yüksek vergi oranları, kur hareketleri ve teknoloji perakende kâr marjları sebebiyle üst segment ürünlerin (örneğin RTX 5090 ekran kartları, iPhone 16 Pro Max, MacBook Pro modelleri) yurt dışı fiyatları ile Türkiye fiyatları arasında ciddi bir makas bulunmaktadır.

Pek çok tüketici şu soruyu sormaktadır:  
> *"Yurt dışına kendim gidip bu ürünü alsam, bilet ve otel param bu kârdan çıkar mı? Hatta tatil bedavaya gelir mi?"*

**TATİL'ER tam olarak bu sorunun matematiksel, yasal ve operasyonel cevabını verir:**
1. **Canlı Fiyat Karşılaştırması:** 20 dünya merkezi ve 33 resmi perakendecideki fiyatları çeker.
2. **Net Vergisel Analiz:** Gidilen ülkenin turist KDV iadesini (Tax-Free) hesaplar; Türkiye girişindeki **45.614 ₺ IMEI harcı** ve **€20 TRT Bandrolünü** düşer.
3. **Uçuş & Yaşam Masrafları:** 81 il havalimanından kalkışlı gidiş-dönüş uçuş, otel ve Numbeo tabanlı yeme-içme/ulaşım giderlerini hesaplar.
4. **Ters Arbitraj Skoru:** Kalan kârla o şehirde kaç gün **Ekonomik**, **Normal** ve **Lüks** konforda **0 ₺ maliyetle tatil yapabileceğinizi** ve cebinize ne kadar harçlık kalacağını anında listeler.

---

## 🌟 Temel Özellikler

### 1. 🌍 Three.js ile 3D Geometrik Uçuş Küresi (Celestial Flight Globe)
- Gerçek dünya koordinatları ve yüksek çözünürlüklü dokularla modellenmiş interaktif 3D küre.
- Türkiye'nin 81 ilindeki sivil havalimanları ile 20 küresel destinasyon arasında animasyonlu parabolik uçuş yayları (Bezier curves).
- 60 FPS akıcı etkileşim, otomatik atmosfer parıltısı ve tıklanabilir rota düğümleri.

### 2. ✈️ 81 İl Havalimanı Koridoru & Canlı Bilet Entegrasyonu
- İstanbul (IST, SAW), Ankara (ESB), İzmir (ADB), Antalya (AYT)'nin yanı sıra Sivas, Erzincan, Samsun, Trabzon, Kars, Van dahil tüm Türkiye havalimanları entegredir.
- **Amadeus Self-Service API** (OAuth2 token caching mimarisi ile), **Google Flights (SerpApi)** ve **Skyscanner RapidAPI** üzerinden dinamik gidiş-dönüş fiyatlandırma.

### 3. 🏖️ "Tatili Bedavaya Getir" (3 Kademeli Ters Arbitraj Motoru)
- Satın almak istediğiniz ürünü seçtiğiniz an 20 destinasyonu paralel iş parçacıklarıyla (`Promise.all`) tarar.
- **Ekonomik:** Hostel/bütçe oteli + yerel yemekler ile kaç gün 0 ₺?
- **Standart / Normal:** 3-4 yıldızlı otel + restoran yemekleri ile kaç gün 0 ₺?
- **Lüks:** 5 yıldızlı otel + gurme harcamalar ile tatilin yüzde kaçı karşılanıyor?
- "Bu Fırsatla Tatili Başlat" butonuna tek tıkla sepetinize ekler ve rota planlayıcıyı ilgili ülkeye kilitler.

### 4. ⚖️ 2025/2026 T.C. Ticaret Bakanlığı & Gümrük Mevzuat Simülasyonu
- **Akıllı Telefonlar:** 45.614 ₺ IMEI harcı + €20 TRT Bandrolü otomatik düşülür. 3 takvim yılında 1 cihaz kotası denetlenir.
- **GPU / Konsol / Donanım:** Yolcu beraberi kişisel eşya muafiyeti kapsamında %0 gümrük vergisi uygulanır.
- **Monitörler:** €10 TRT Bandrol kesintisi yansıtılır.
- **Lüks Giyim / Aksesuar:** Ticari miktar dışındaki kişisel bavul muafiyeti işlenir.

### 5. 💶 Küresel Tax-Free KDV İade Operatörleri
- **Japonya:** %10 anında kasada düşen doğrudan turist muafiyeti.
- **Almanya & AB:** Global Blue ve Planet üzerinden fatura bazlı kademeli net KDV iadesi (~%12.5 net).
- **BAE (Dubai):** Planet Payment %85 KDV iade oranı.
- **İngiltere (UK):** Brexit sonrası turist KDV iadesi kaldırıldığı için otomatik %0 hesaplama.
- **ABD (US):** Eyalet satış vergisi (State Sales Tax) iade edilmediğinden %0 hesaplama.

### 6. 💱 Gerçek Zamanlı ECB Döviz Kuru Ticker
- Avrupa Merkez Bankası (ECB) ve Frankfurter API üzerinden TRY, USD, EUR, JPY, GBP, AED, GEL, SAR, SGD, CAD, SEK, PLN kurları periyodik olarak senkronize edilir.

---

## 📐 Sistem Mimarisi & Modüller

```
Tatil-er/
├── API/                        # Global Price Aggregator & Scraper Motoru
│   ├── src/
│   │   ├── scrapers/           # Puppeteer-Stealth, Got-Scraping ve Cheerio adaptörleri (Amazon, Yodobashi vb.)
│   │   ├── services/           # DB senkronizasyonu, ters arbitraj & katalog motoru
│   │   ├── scheduler/          # Cron tabanlı periyodik fiyat güncelleme
│   │   └── scripts/            # Seed ve canlı fiyat güncelleme betikleri
│   ├── catalog_seed.sql        # Genişletilmiş çoklu ülke ürün verisi
│   └── package.json
├── backend/                    # Core REST API (Node.js & Express)
│   ├── src/
│   │   ├── controllers/        # Arbitraj, seyahat, gümrük ve ürün denetleyicileri
│   │   ├── services/           # Amadeus, Google Flights, otel & gümrük servisleri
│   │   ├── middlewares/        # IP rate limiter, CORS, hata yakalama
│   │   ├── routes/             # REST API yönlendirmeleri (/api/v1/...)
│   │   └── server.ts           # Port: 4000 Express sunucusu
│   ├── Dockerfile
│   └── package.json
├── frontend/                   # Web İstemcisi (Next.js 14 App Router)
│   ├── src/
│   │   ├── app/                # Sayfa düzeni ve global stiller
│   │   ├── components/         # Three.js 3D Küre, Bütçe Sihirbazı, Sepet & Modallar
│   │   └── lib/                # API istemcisi ve TypeScript modelleri
│   ├── Dockerfile
│   └── package.json
├── database/                   # Veritabanı Şemaları & Tohum Veriler
│   ├── schema.sql              # Supabase PostgreSQL DDL (RLS & Tablolar)
│   └── seed.sql                # 117+ ürün, 33 mağaza, 20 ülke gümrük parametreleri
├── docker-compose.yml          # Postgres + Backend + Frontend tek komut orkestrasyonu
├── start-all.bat               # Windows tek tıkla başlatma betiği
├── .env.example                # Örnek çevre değişkenleri şablonu
└── README.md
```

---

## ⚖️ Gümrük & Tax-Free Mevzuat Motoru

TATİL'ER, mevzuat verilerini statik bırakmaz; 2025/2026 yılı T.C. Ticaret Bakanlığı tebliğleriyle tam uyumludur:

| Ürün Kategorisi | IMEI Harcı (2025/2026) | TRT Bandrolü | Yolcu Beraberi Muafiyet | Kotası & Yasal Uyarı |
|---|---|---|---|---|
| **Akıllı Telefon** | **45.614,00 ₺** | **€20 (~800 ₺)** | Muafiyet Dışı (Harca Tabi) | 3 takvim yılında 1 adet (Yolcunun T.C. kimliğine kayıtlı hatlarla) |
| **Ekran Kartı (GPU)** | 0 ₺ | 0 ₺ | **%0 (Tam Muaf)** | 1 adet kutulu kişisel donanım muafiyeti |
| **Oyun Konsolu (PS5)** | 0 ₺ | 0 ₺ | **%0 (Tam Muaf)** | 1 adet kişisel eğlence cihazı muafiyeti |
| **Monitör / Ekran** | 0 ₺ | **€10 (~400 ₺)** | Kısmi Muaf | 1 adet kişisel ekran (TRT Bandrolüne tabi) |
| **Lüks Giyim & Çanta** | 0 ₺ | 0 ₺ | **%0 (Tam Muaf)** | Ticari miktar ve mahiyet arz etmeyen kişisel giyim |

---

## 🚀 Hızlı Başlangıç & Kurulum

### Ön Gereksinimler
- **Node.js**: v18.0.0 veya üzeri ([İndir](https://nodejs.org/))
- **npm** veya **yarn**
- **Git** ([İndir](https://git-scm.com/))
- *(Opsiyonel)* **Docker & Docker Desktop** ([İndir](https://www.docker.com/))

---

### Seçenek 1: Tek Tıkla Başlatma (.bat - Windows)

Projeyi klonladıktan sonra kök dizindeki başlatma dosyalarını kullanabilirsiniz:
1. `backend` klasöründeki `.env.example` dosyasını `.env` olarak kopyalayın.
2. `frontend` klasöründeki `.env.example` dosyasını `.env.local` olarak kopyalayın.
3. Kök dizindeki `start-all.bat` dosyasına çift tıklayın.
   - Otomatik olarak Backend'i `http://localhost:4000`, Frontend'i `http://localhost:3000` portunda başlatacaktır.

---

### Seçenek 2: Docker Compose ile

Hiçbir paket kurmadan tek komutla PostgreSQL veritabanı, Backend ve Frontend'i ayağa kaldırabilirsiniz:

```bash
# 1. Projeyi klonlayın
git clone https://github.com/Bugrakadiogluu/Tatil-er.git
cd Tatil-er

# 2. Docker Compose ile inşa edin ve başlatın
docker compose up --build
```
- **Frontend Paneli:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:4000/api/v1](http://localhost:4000/api/v1)

---

### Seçenek 3: Manuel Geliştirici Kurulumu

#### 1. Backend Kurulumu:
```bash
cd backend

# Bağımlılıkları yükleyin
npm install

# .env dosyasını oluşturun
cp .env.example .env

# TypeScript kodunu derleyin
npm run build

# Geliştirme sunucusunu başlatın
npm run dev
```
Backend `http://localhost:4000` üzerinde çalışmaya başlayacaktır.

#### 2. Frontend Kurulumu:
Yeni bir terminal penceresi açın:
```bash
cd frontend

# Bağımlılıkları yükleyin
npm install

# .env dosyasını oluşturun
cp .env.example .env.local

# Next.js geliştirme sunucusunu başlatın
npm run dev
```
Tarayıcınızdan **[http://localhost:3000](http://localhost:3000)** adresine gidin.

#### 3. (Opsiyonel) Canlı Fiyat Toplayıcı (API / Scraper):
```bash
cd API

# Bağımlılıkları yükleyin
npm install

# Canlı fiyatları güncellemek veya test etmek için:
npm run test:scrape
```

---

## 🔑 Çevre Değişkenleri (.env Rehberi)

Projenin güvenliğini sağlamak için hassas anahtarlar `.env` dosyalarında tutulur ve `.gitignore` ile korunur.

### Backend `.env` Değişkenleri:

| Değişken | Açıklama | Varsayılan / Örnek | Gerekli mi? |
|---|---|---|---|
| `PORT` | Backend sunucu portu | `4000` | Evet |
| `NODE_ENV` | Çalışma ortamı (`development` / `production`) | `development` | Evet |
| `CORS_ORIGIN` | İzin verilen frontend adresi | `http://localhost:3000` | Evet |
| `SUPABASE_URL` | Supabase veritabanı URL'i | `https://xyz.supabase.co` | Canlı DB için |
| `SUPABASE_ANON_KEY` | Supabase genel anon anahtarı | `eyJhbGciOi...` | Canlı DB için |
| `AMADEUS_CLIENT_ID` | Amadeus API anahtarı ([Kayıt Ol](https://developers.amadeus.com/)) | `your_client_id` | Opsiyonel (Mock fallback var) |
| `AMADEUS_CLIENT_SECRET` | Amadeus API gizli anahtarı | `your_secret` | Opsiyonel |
| `AMADEUS_HOSTNAME` | Amadeus sunucu hostu | `test.api.amadeus.com` | Opsiyonel |
| `RAPIDAPI_KEY` | Skyscanner / Booking.com için RapidAPI Key | `your_key` | Opsiyonel |
| `SERPAPI_KEY` | Google Flights aramaları için SerpApi Key | `your_key` | Opsiyonel |
| `IMEI_FEE_TRY` | T.C. Resmi IMEI Kayıt Harcı | `45614.00` | Evet |
| `TRT_BANDROL_PHONE_EUR` | Telefon TRT Bandrol Harcı (EUR) | `20.00` | Evet |

### Frontend `.env.local` Değişkenleri:

| Değişken | Açıklama | Değer |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend REST API kök adresi | `http://localhost:4000/api/v1` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase URL | `https://xyz.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase Anon Key | `your_supabase_anon_key` |

---

## 📡 API Uç Noktaları (Endpoints)

| Metod | Uç Nokta | Açıklama |
|---|---|---|
| `GET` | `/api/v1/travel/destinations` | Desteklenen 20 küresel destinasyon ve yaşam maliyetleri |
| `POST` | `/api/v1/travel/quote` | 81 il havalimanından uçak + otel + günlük masraf teklifi |
| `GET` | `/api/v1/products` | 117+ ürünün Türkiye ve yurt dışı mağaza fiyatları |
| `GET` | `/api/v1/arbitrage/product/:id` | Tek ürün için detaylı vergi/gümrük ve net kâr hesabı |
| `POST` | `/api/v1/arbitrage/basket` | Çoklu sepet amortismanı ve tatil finansman ilerleme yüzdesi |
| `GET` | `/api/v1/arbitrage/reverse/:productId` | **"Tatili Bedavaya Getir"** 20 ülkelik ters arbitraj sıralaması |
| `GET` | `/api/v1/customs/vat-rules` | 20 ülkenin Tax-Free KDV iade oranları ve operatör bilgisi |
| `GET` | `/api/v1/customs/regulations` | 2025/2026 T.C. Gümrük kuralları ve IMEI parametreleri |

---

## 🛡️ Güvenlik & Git'e Yükleme Rehberi

Bu proje, açık kaynak olarak GitHub'da güvenle paylaşılacak şekilde mimarilendirilmiştir. **Hiçbir kaynak kod dosyasında açık API Key veya veritabanı şifresi bulunmamaktadır.**

### GitHub Deposu ile Senkronizasyon:

1. **Gizli Dosyaların Engellendiğini Doğrulayın:**
   ```bash
   git status
   ```
   > ⚠️ **DİKKAT:** Çıktıda `.env` veya `.env.local` dosyalarının **GÖRÜNMEDİĞİNDEN**, yalnızca `.env.example` dosyalarının göründüğünden emin olun. `.gitignore` yapılandırması bu dosyaları otomatik olarak engeller.

2. **Değişiklikleri Sahneye Ekleyin ve Commit Edin:**
   ```bash
   git add .
   git commit -m "feat: update documentation and components"
   ```

3. **GitHub Reposuna Gönderin:**
   ```bash
   git push origin main
   ```

---

## 🤝 Katkıda Bulunma & Lisans

1. Bu depoyu Fork'layın (`fork`).
2. Yeni bir özellik dalı açın (`git checkout -b feature/harika-ozellik`).
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Yeni özellik eklendi'`).
4. Dalınızı push edin (`git push origin feature/harika-ozellik`).
5. Bir **Pull Request (PR)** açın.

Bu proje **MIT Lisansı** ile lisanslanmıştır. Dilediğiniz gibi kullanabilir, geliştirebilir ve kendi projelerinizde referans alabilirsiniz.

---

<p align="center">
  Geliştirici: <b>Buğra Kadıoğlu</b> • <i>"Tatil Masraf Değil, Bir Fırsattır."</i>
</p>