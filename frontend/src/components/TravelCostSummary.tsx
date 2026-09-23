'use client';

import React, { useState, useEffect } from 'react';
import {
  Plane,
  Building2,
  Utensils,
  Wallet,
  CheckCircle2,
  Compass,
  ExternalLink,
  Star,
  MapPin,
  ChevronDown,
  ChevronUp,
  Train,
  Coffee,
  Sparkles,
  Ticket,
  Info,
  Globe,
} from 'lucide-react';
import { TravelQuoteResponse, TravelStyle } from '../lib/types';

interface TravelCostSummaryProps {
  quote: TravelQuoteResponse | null;
  isLoading: boolean;
}

export const TravelCostSummary: React.FC<TravelCostSummaryProps> = ({ quote, isLoading }) => {
  const [showHotelsList, setShowHotelsList] = useState(true);
  const [showLivingDetails, setShowLivingDetails] = useState(true);
  const [selectedTierFilter, setSelectedTierFilter] = useState<'all' | TravelStyle>('all');

  useEffect(() => {
    if (quote?.travelStyle) {
      setSelectedTierFilter(quote.travelStyle);
    }
  }, [quote?.travelStyle]);

  if (isLoading) {
    return (
      <div className="glass-panel rounded-2xl p-6 border border-white/10 animate-pulse">
        <div className="h-6 w-48 bg-slate-800 rounded mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-28 bg-slate-800/60 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!quote) return null;

  const living = quote.breakdown.living;
  const days = quote.durationDays;
  const foodTotalTry = living.dailyFoodTry * days;
  const transitTotalTry = living.dailyTransportTry * days;
  const entertainmentDailyTry = living.dailyEntertainmentTry || Math.round(living.totalDailyTry * 0.25);
  const entertainmentTotalTry = entertainmentDailyTry * days;
  const allFeaturedHotels = quote.featuredHotels || [];

  const filteredHotels = allFeaturedHotels.filter((hotel) => {
    if (selectedTierFilter === 'all') return true;
    if (selectedTierFilter === 'budget') return hotel.stars <= 3;
    if (selectedTierFilter === 'moderate') return hotel.stars === 3 || hotel.stars === 4;
    if (selectedTierFilter === 'luxury') return hotel.stars >= 4;
    return true;
  });

  return (
    <div className="glass-luxury rounded-3xl p-6 sm:p-8 border border-white/10 relative space-y-6 shadow-2xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-5 border-b border-white/5 gap-4">
        <div>
          <div className="text-[10px] uppercase font-mono-data tracking-widest text-amber-400/80 mb-0.5">
            FİNANSAL TELEMETRİ · CANLI VERİ ENTEGRASYONU
          </div>
          <h3 className="text-xl sm:text-2xl font-editorial tracking-wide text-white">
            {quote.destinationCity}, {quote.destinationCountry} Seyahat Masraf Analizi
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 font-mono-data">
            {quote.durationDays} Gün ({quote.breakdown.hotel.nights} Gece) • Konfor: <span className="text-amber-300 font-semibold">{quote.travelStyle}</span>
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="flex items-center text-xs font-mono-data text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-full shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
            Google Flights & SerpApi Canlı
          </span>
        </div>
      </div>

      {/* 5-Column Travel Cost Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* 1. Uçak */}
        <div className="bg-[#050813] rounded-2xl p-5 border border-white/10 hover:border-amber-400/30 transition-all duration-300 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span className="font-mono-data uppercase tracking-wider flex items-center text-slate-300 text-[11px]">
                <Plane className="w-3.5 h-3.5 mr-1.5 text-amber-400" /> Uçak Bileti
              </span>
            </div>
            <div className="text-2xl font-black text-white font-mono-data">
              {quote.flightPriceTry.toLocaleString('tr-TR')}{' '}
              <span className="text-xs font-normal text-slate-400">₺</span>
            </div>
            <div className="text-xs text-amber-300/90 mt-1 truncate font-medium">
              {quote.breakdown.flight.airline}
            </div>
          </div>

          {/* Skyscanner & Google Flights Outbound Redirect Links */}
          <div className="pt-3 border-t border-white/5 mt-4 flex flex-col space-y-1.5">
            {quote.googleFlightsLink && (
              <a
                href={quote.googleFlightsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-1.5 px-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[11px] font-mono-data font-semibold flex items-center justify-center space-x-1.5 transition-colors border border-amber-500/30"
              >
                <span>Google Flights'ta Aç</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {quote.flightDeepLink && (
              <a
                href={quote.flightDeepLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-slate-400 hover:text-white text-center transition-colors font-mono-data"
              >
                Skyscanner Alternatifi →
              </a>
            )}
          </div>
        </div>

        {/* 2. Otel & Konaklama */}
        <div className="bg-[#050813] rounded-2xl p-5 border border-white/10 hover:border-amber-400/30 transition-all duration-300 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span className="font-mono-data uppercase tracking-wider flex items-center text-slate-300 text-[11px]">
                <Building2 className="w-3.5 h-3.5 mr-1.5 text-amber-400" /> Konaklama
              </span>
              <span className="text-[10px] font-mono-data text-slate-400">{quote.breakdown.hotel.nights} Gece</span>
            </div>
            <div className="text-2xl font-black text-white font-mono-data">
              {quote.hotelPriceTry.toLocaleString('tr-TR')}{' '}
              <span className="text-xs font-normal text-slate-400">₺</span>
            </div>
            <div className="text-xs text-slate-400 mt-1 truncate">
              {quote.breakdown.hotel.tierDescription}
            </div>
          </div>

          {/* Booking.com Direct Outbound Deep-Link */}
          <div className="pt-3 border-t border-white/5 mt-4">
            {quote.hotelDeepLink && (
              <a
                href={quote.hotelDeepLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-1.5 px-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 text-[11px] font-mono-data font-semibold flex items-center justify-center space-x-1.5 transition-colors border border-blue-500/30"
              >
                <span>Booking.com'da Canlı Gör</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* 3. Yeme-İçme & Ulaşım */}
        <div className="bg-[#050813] rounded-2xl p-5 border border-white/10 hover:border-amber-400/30 transition-all duration-300 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span className="font-mono-data uppercase tracking-wider flex items-center text-slate-300 text-[11px]">
                <Utensils className="w-3.5 h-3.5 mr-1.5 text-amber-400" /> Yeme & Ulaşım
              </span>
              <span className="text-[10px] font-mono-data text-slate-400">{quote.durationDays} Gün</span>
            </div>
            <div className="text-2xl font-black text-white font-mono-data">
              {(foodTotalTry + transitTotalTry).toLocaleString('tr-TR')}{' '}
              <span className="text-xs font-normal text-slate-400">₺</span>
            </div>
          </div>
          <div className="text-xs text-slate-400 mt-2 truncate">
            Restoranlar, kafeler & metro
          </div>
        </div>

        {/* 4. Eğlence, Müze & Aktiviteler */}
        <div className="bg-[#050813] rounded-2xl p-5 border border-white/10 hover:border-amber-400/30 transition-all duration-300 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span className="font-mono-data uppercase tracking-wider flex items-center text-slate-300 text-[11px]">
                <Compass className="w-3.5 h-3.5 mr-1.5 text-amber-400" /> Eğlence & Gezi
              </span>
              <span className="text-[10px] text-amber-400/80 font-mono-data">Aktiviteler</span>
            </div>
            <div className="text-2xl font-black text-white font-mono-data">
              {entertainmentTotalTry.toLocaleString('tr-TR')}{' '}
              <span className="text-xs font-normal text-slate-400">₺</span>
            </div>
          </div>
          <div className="text-xs text-slate-400 mt-2 truncate">
            Müzeler, turlar & gece hayatı
          </div>
        </div>

        {/* 5. Toplam Seyahat Maliyeti Hedefi */}
        <div className="glass-luxury-gold rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between shadow-2xl">
          <div>
            <div className="flex items-center justify-between text-amber-300 text-xs mb-2 font-mono-data uppercase tracking-wider">
              <span className="flex items-center">
                <Wallet className="w-3.5 h-3.5 mr-1.5 text-amber-400" /> Toplam Tatil
              </span>
              <span className="bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full text-[10px] font-bold">
                Hedef
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono-data">
              {quote.totalTravelCostTry.toLocaleString('tr-TR')}{' '}
              <span className="text-sm font-normal text-amber-200/80">₺</span>
            </div>
          </div>
          <div className="text-xs text-amber-200/80 mt-3 pt-3 border-t border-amber-400/20 font-medium">
            Alışveriş kazancıyla sıfırlanacak tutar
          </div>
        </div>
      </div>

      {/* Featured Real Hotels Accordion & Direct Reservation Section */}
      {allFeaturedHotels.length > 0 && (
        <div className="pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 px-3 rounded-xl bg-slate-900/60 border border-white/5">
            <button
              type="button"
              onClick={() => setShowHotelsList(!showHotelsList)}
              className="flex items-center text-xs font-bold text-slate-300 hover:text-white transition-colors"
            >
              <Building2 className="w-4 h-4 mr-2 text-cyan-400" />
              <span>{quote.destinationCity} Gerçek Otelleri & Rezervasyon (Booking.com)</span>
              {showHotelsList ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
            </button>

            {/* Auto & Manual Star / Price Filter Pills */}
            <div className="flex items-center space-x-1.5 self-start sm:self-auto">
              <span className="text-[10px] text-slate-500 font-medium mr-1 hidden md:inline">Yıldız & Fiyat Filtresi:</span>
              {(['all', 'budget', 'moderate', 'luxury'] as const).map((tier) => {
                const isActive = selectedTierFilter === tier;
                const label =
                  tier === 'all'
                    ? `Tümü (${allFeaturedHotels.length})`
                    : tier === 'budget'
                    ? 'Ekonomik (2-3★)'
                    : tier === 'moderate'
                    ? 'Standart (3-4★)'
                    : 'Lüks (4-5★)';
                return (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => {
                      setSelectedTierFilter(tier);
                      setShowHotelsList(true);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all border ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                        : 'bg-white/5 text-slate-400 border-white/5 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Booking.com Live Total Inventory Banner */}
          <div className="mt-2.5 px-3.5 py-2.5 rounded-xl bg-blue-950/40 border border-blue-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center space-x-2 text-xs text-blue-200">
              <Building2 className="w-4 h-4 text-blue-400 shrink-0" />
              <span>
                <strong>{quote.destinationCity}</strong> bölgesi için{' '}
                {allFeaturedHotels.length > 0 ? (
                  <>canlı API üzerinden <strong>{allFeaturedHotels.length} seçkin otel</strong> listelenmiştir.</>
                ) : (
                  <>Booking.com üzerindeki tüm tesisleri ve canlı oda fiyatlarını incelemek için aşağıdaki bağlantıyı kullanabilirsiniz.</>
                )}
              </span>
            </div>
            {quote.hotelDeepLink && (
              <a
                href={quote.hotelDeepLink}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
              >
                <span>Booking.com'da Canlı Gör</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {showHotelsList && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
              {filteredHotels.length === 0 ? (
                <div className="col-span-3 py-6 px-4 text-center text-xs text-slate-300 bg-slate-900/60 rounded-xl border border-white/5 space-y-2">
                  <p className="font-semibold text-white">Bu kategoride canlı otel listesi henüz yüklenmedi.</p>
                  <p className="text-slate-400 text-[11px]">
                    API kotası veya anlık ağ yanıtına bağlı olarak canlı oteller listelenemediğinde, yukarıdaki <strong>Booking.com'da Canlı Gör</strong> butonunu kullanarak seçtiğiniz tarihlerdeki tüm tesisleri anında inceleyebilirsiniz.
                  </p>
                </div>
              ) : (
                filteredHotels.map((hotel) => (
                <div
                  key={hotel.id}
                  className="bg-slate-900 rounded-xl border border-white/10 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="h-32 w-full relative overflow-hidden bg-slate-950">
                      <img
                        src={hotel.imageUrl}
                        alt={hotel.name}
                        className="w-full h-full object-cover opacity-85"
                      />
                      <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-cyan-300 border border-white/10 flex items-center">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400 mr-1" />
                        <span>{hotel.stars} Yıldız</span>
                      </div>
                      <div className="absolute top-2 right-2 bg-blue-600/90 text-white font-mono font-bold px-2 py-0.5 rounded text-[10px]">
                        ★ {hotel.ratingScore}/10
                      </div>
                    </div>

                    <div className="p-3.5 space-y-1">
                      <h5 className="font-bold text-sm text-white line-clamp-1">{hotel.name}</h5>
                      <p className="text-[11px] text-slate-400 line-clamp-1 flex items-center">
                        <MapPin className="w-3 h-3 mr-1 text-slate-500 shrink-0" />
                        {hotel.address}
                      </p>
                      <p className="text-[11px] text-emerald-400/90 italic pt-1">{hotel.reviewSummary}</p>
                    </div>
                  </div>

                  <div className="p-3.5 pt-0 border-t border-white/5 mt-2 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block">Gecelik</span>
                      <strong className="text-sm font-mono text-cyan-300">
                        {hotel.nightlyPriceTry.toLocaleString('tr-TR')} ₺
                      </strong>
                    </div>

                    <a
                      href={hotel.bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] flex items-center space-x-1 shadow-md transition-colors"
                    >
                      <span>Booking'de Rezerve Et</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))
              )}
            </div>
          )}
        </div>
      )}

      {/* 3. Comprehensive Harcama Detayları & Dahil Olan Hizmetler (City Living & Activities Guide) */}
      <div className="pt-2 border-t border-white/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 px-3 rounded-xl bg-slate-900/60 border border-white/5">
          <button
            type="button"
            onClick={() => setShowLivingDetails(!showLivingDetails)}
            className="flex items-center text-xs font-bold text-slate-300 hover:text-white transition-colors"
          >
            <Utensils className="w-4 h-4 mr-2 text-amber-400" />
            <span>{quote.destinationCity} Harcama Detayları & Dahil Olan Hizmetler Rehberi</span>
            {showLivingDetails ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
          </button>

          <span className="text-[11px] font-mono-data text-amber-300/80 self-start sm:self-auto">
            {quote.durationDays} Günlük Yaşam Bütçesi: {(foodTotalTry + transitTotalTry + entertainmentTotalTry).toLocaleString('tr-TR')} ₺
          </span>
        </div>

        {showLivingDetails && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 1. Gıda & Yeme-İçme Detayı */}
              <div className="bg-[#050813] rounded-2xl p-5 border border-white/10 hover:border-amber-400/30 transition-all flex flex-col justify-between shadow-lg">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                        <Utensils className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Yeme & İçme (Gıda)</h4>
                        <span className="text-[10px] text-slate-400 font-mono-data">3 Öğün & İçecekler</span>
                      </div>
                    </div>
                    <div className="text-right font-mono-data">
                      <div className="text-xs font-bold text-amber-400">
                        {foodTotalTry.toLocaleString('tr-TR')} ₺
                      </div>
                      <span className="text-[10px] text-slate-500">
                        Günlük {living.dailyFoodTry.toLocaleString('tr-TR')} ₺
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs text-slate-300">
                    <div className="flex items-start space-x-2">
                      <span className="text-amber-400 text-sm leading-none">•</span>
                      <div>
                        <strong className="text-white">Kahvaltı (~%20):</strong>
                        <p className="text-[11px] text-slate-400">
                          Kruvasan, kahve dükkanları, yerel fırınlar veya geleneksel sabah büfesi (~{Math.round(living.dailyFoodTry * 0.20).toLocaleString('tr-TR')} ₺/gün).
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <span className="text-amber-400 text-sm leading-none">•</span>
                      <div>
                        <strong className="text-white">Öğle Yemeği (~%35):</strong>
                        <p className="text-[11px] text-slate-400">
                          Şehir içi bistrolar, ramen/tapas barları, otantik sokak lezzetleri (~{Math.round(living.dailyFoodTry * 0.35).toLocaleString('tr-TR')} ₺/gün).
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <span className="text-amber-400 text-sm leading-none">•</span>
                      <div>
                        <strong className="text-white">Akşam Yemeği (~%45):</strong>
                        <p className="text-[11px] text-slate-400">
                          Oturmalı yerel akşam yemeği, spesiyaller, tatlı ve içecek deneyimi (~{Math.round(living.dailyFoodTry * 0.45).toLocaleString('tr-TR')} ₺/gün).
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 mt-4 space-y-1.5">
                  <a
                    href={`https://www.numbeo.com/cost-of-living/in/${encodeURIComponent(quote.destinationCity)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-1.5 px-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[11px] font-mono-data font-semibold flex items-center justify-center space-x-1.5 transition-colors border border-amber-500/30"
                  >
                    <span>Numbeo Canlı Şehir Fiyat Endeksi</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href={`https://www.tripadvisor.com/Search?q=${encodeURIComponent(quote.destinationCity + ' restaurants')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-slate-400 hover:text-white text-center block transition-colors font-mono-data"
                  >
                    TripAdvisor Popüler Restoranları İncele →
                  </a>
                </div>
              </div>

              {/* 2. Şehir İçi Ulaşım & Transfer */}
              <div className="bg-[#050813] rounded-2xl p-5 border border-white/10 hover:border-amber-400/30 transition-all flex flex-col justify-between shadow-lg">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                        <Train className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Şehir İçi Ulaşım</h4>
                        <span className="text-[10px] text-slate-400 font-mono-data">Havalimanı & Metro</span>
                      </div>
                    </div>
                    <div className="text-right font-mono-data">
                      <div className="text-xs font-bold text-blue-400">
                        {transitTotalTry.toLocaleString('tr-TR')} ₺
                      </div>
                      <span className="text-[10px] text-slate-500">
                        Günlük {living.dailyTransportTry.toLocaleString('tr-TR')} ₺
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs text-slate-300">
                    <div className="flex items-start space-x-2">
                      <span className="text-blue-400 text-sm leading-none">•</span>
                      <div>
                        <strong className="text-white">Havalimanı Ekspres:</strong>
                        <p className="text-[11px] text-slate-400">
                          Havalimanı ↔ Şehir Merkezi gidiş-dönüş hızlı tren / ekspres havaş bileti.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <span className="text-blue-400 text-sm leading-none">•</span>
                      <div>
                        <strong className="text-white">Sınırsız Günlük Kart:</strong>
                        <p className="text-[11px] text-slate-400">
                          Tüm metro hatları, tramvaylar ve belediye otobüslerinde sınırsız seyahat kartı (Suica/Pasmo, MetroCard vb.).
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <span className="text-blue-400 text-sm leading-none">•</span>
                      <div>
                        <strong className="text-white">Taksi / Uber Rezervi:</strong>
                        <p className="text-[11px] text-slate-400">
                          Gece dönüşleri veya yorucu alışveriş günleri için kısa mesafe taksi / e-scooter bütçesi.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 mt-4 space-y-1.5">
                  <a
                    href={`https://www.google.com/maps/search/${encodeURIComponent(quote.destinationCity + ' metro transit station')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-1.5 px-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 text-[11px] font-mono-data font-semibold flex items-center justify-center space-x-1.5 transition-colors border border-blue-500/30"
                  >
                    <span>Google Maps Şehir Ulaşım Haritası</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <span className="text-[10px] text-slate-500 text-center block font-mono-data">
                    Tüm metro ve otobüs hatları dahil
                  </span>
                </div>
              </div>

              {/* 3. Kültür, Müze & Gezi Aktiviteleri */}
              <div className="bg-[#050813] rounded-2xl p-5 border border-white/10 hover:border-amber-400/30 transition-all flex flex-col justify-between shadow-lg">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                        <Compass className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Kültür & Aktiviteler</h4>
                        <span className="text-[10px] text-slate-400 font-mono-data">Müze, Seyir & Turlar</span>
                      </div>
                    </div>
                    <div className="text-right font-mono-data">
                      <div className="text-xs font-bold text-emerald-400">
                        {entertainmentTotalTry.toLocaleString('tr-TR')} ₺
                      </div>
                      <span className="text-[10px] text-slate-500">
                        Günlük {entertainmentDailyTry.toLocaleString('tr-TR')} ₺
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs text-slate-300">
                    <div className="flex items-start space-x-2">
                      <span className="text-emerald-400 text-sm leading-none">•</span>
                      <div>
                        <strong className="text-white">Müze & Sanat Galerisi:</strong>
                        <p className="text-[11px] text-slate-400">
                          {quote.destinationCity} şehrinin simge müzeleri ve tarihi anıtlarına giriş biletleri.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <span className="text-emerald-400 text-sm leading-none">•</span>
                      <div>
                        <strong className="text-white">Panoramik Seyir Kuleleri:</strong>
                        <p className="text-[11px] text-slate-400">
                          Şehri kuşbakışı izleyebileceğiniz ünlü seyir kulesi ve teras biletleri (Shibuya Sky, Burj Khalifa vb.).
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <span className="text-emerald-400 text-sm leading-none">•</span>
                      <div>
                        <strong className="text-white">Şehir Turları & Parklar:</strong>
                        <p className="text-[11px] text-slate-400">
                          Rehberli tarihi yürüyüşler, botanik bahçeler ve yerel kültürel deneyimler.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 mt-4 space-y-1.5">
                  <a
                    href={`https://www.tripadvisor.com/Search?q=${encodeURIComponent(quote.destinationCity + ' attractions')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-1.5 px-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-[11px] font-mono-data font-semibold flex items-center justify-center space-x-1.5 transition-colors border border-emerald-500/30"
                  >
                    <span>TripAdvisor Popüler Gezilecek Yerler</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href={`https://www.getyourguide.com/s/?q=${encodeURIComponent(quote.destinationCity)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-slate-400 hover:text-white text-center block transition-colors font-mono-data"
                  >
                    GetYourGuide Bilet & Şehir Turları →
                  </a>
                </div>
              </div>
            </div>

            {/* Live Financial Normalization Notice */}
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center space-x-3 text-xs text-slate-400">
              <Info className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Seyahat süreniz (<strong className="text-white">{quote.durationDays} gün / {quote.breakdown.hotel.nights} gece</strong>) boyunca tüm konaklama, gıda, şehir içi ulaşım ve aktivite kalemleri, TCMB canlı döviz kurları ve Numbeo Küresel Şehir Yaşam Maliyeti Endeksi baz alınarak otomatik olarak hesaplanmaktadır.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
