@echo off
chcp 65001 >nul
title Arbitrip - Küresel Fiyat Takip ve Arbitraj Sistemi

:MENU
cls
echo =============================================================================
echo   ARBITRIP - KURESEL FIYAT AGGREGATOR VE ARBITRAJ YONETIM MERKEZI
echo =============================================================================
echo.
echo  Lutfen yapmak istediginiz islemi secin:
echo.
echo   [1] Hizli Fiyat Guncelleme (En Karli 15 Arbitraj Urununu Tara)
echo   [2] Kapsamli Fiyat Guncelleme (Tum Veritabanindaki Urunleri Tara)
echo   [3] Ozel Bir Urunun Fiyatlarini Canli Tara (Orn: RTX 5090, iPhone 16 Pro)
echo   [4] Urun Arbitraj Raporunu Goruntule (En Ucuz Ulkeler, Vergi Iadesi, Net Kar)
echo   [5] Master Katalog Urunlerini Supabase'e Yeniden Yukle (Seed)
echo   [6] Otomatik Gece Servisini Baslat (02:00 - 05:00 UTC Daemon)
echo   [7] Cikis
echo.
echo =============================================================================
set /p choice="Seciminiz (1-7): "

if "%choice%"=="1" goto QUICK_UPDATE
if "%choice%"=="2" goto FULL_UPDATE
if "%choice%"=="3" goto CUSTOM_DISCOVERY
if "%choice%"=="4" goto ARBITRAGE_REPORT
if "%choice%"=="5" goto SEED_CATALOG
if "%choice%"=="6" goto DAEMON_START
if "%choice%"=="7" goto EXIT

echo.
echo Hatali secim! Lutfen 1 ile 7 arasinda bir numara girin.
timeout /t 2 >nul
goto MENU

:QUICK_UPDATE
cls
echo =============================================================================
echo   [1] HIZLI FIYAT GUNCELLEMESI BASLATILIYOR (Top 15 Arbitraj Urunu)
echo =============================================================================
echo.
call npx tsx src/scripts/updatePrices.ts --limit 15
echo.
echo Guncelleme tamamlandi.
pause
goto MENU

:FULL_UPDATE
cls
echo =============================================================================
echo   [2] KAPSAMLI FIYAT GUNCELLEMESI BASLATILIYOR (Tum Veritabani)
echo =============================================================================
echo.
echo DIKKAT: Bu islem katalogdaki tum urunleri ulke magazalarinda tarayacaktir.
set /p confirm="Devam etmek istiyor musunuz? (E/H): "
if /i not "%confirm%"=="E" goto MENU
echo.
call npx tsx src/scripts/updatePrices.ts --all
echo.
echo Kapsamli guncelleme tamamlandi.
pause
goto MENU

:CUSTOM_DISCOVERY
cls
echo =============================================================================
echo   [3] CANLI KURESEL MAGAZA TARAMASI
echo =============================================================================
echo.
set /p prodQuery="Fiyatini aratmak istediginiz urun adi (orn: PlayStation 5 Pro): "
if "%prodQuery%"=="" goto MENU
echo.
echo "%prodQuery%" urunu tum dunya magazalarinda araniyor...
call npx tsx src/index.ts --discover "%prodQuery%"
echo.
pause
goto MENU

:ARBITRAGE_REPORT
cls
echo =============================================================================
echo   [4] KURESEL ARBITRAJ VE KARLILIK RAPORU
echo =============================================================================
echo.
set /p repQuery="Raporunu gormek istediginiz urun (orn: iPhone 16 Pro Max): "
if "%repQuery%"=="" goto MENU
echo.
call npx tsx src/index.ts --arbitrage "%repQuery%"
echo.
pause
goto MENU

:SEED_CATALOG
cls
echo =============================================================================
echo   [5] MASTER KATALOG YUKLEME MOTORU (Supabase Seed)
echo =============================================================================
echo.
echo 85+ yuksek arbitrajli teknoloji ve luks tuketim urunu Supabase veritabanina yazilacak.
set /p confirmSeed="Devam edilsin mi? (E/H): "
if /i not "%confirmSeed%"=="E" goto MENU
echo.
call npx tsx src/scripts/seedCatalog.ts
echo.
pause
goto MENU

:DAEMON_START
cls
echo =============================================================================
echo   [6] OTOMATIK CRON DAEMON SERVISI
echo =============================================================================
echo.
echo Servis acik kaldigi surece her gece 02:00 - 05:00 UTC saatleri arasinda
echo otomatik fiyat taramasi ve guncellemesi gerceklestirilecektir.
echo Servisi durdurmak icin pencereyi kapatabilir veya Ctrl+C yapabilirsiniz.
echo.
call npx tsx src/index.ts
pause
goto MENU

:EXIT
cls
echo Arbitrip sisteminden cikiliyor. Iyi gunler!
timeout /t 2 >nul
exit /b 0
