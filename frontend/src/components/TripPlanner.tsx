'use client';

import React, { useState, useEffect } from 'react';
import {
  Plane,
  Clock,
  MapPin,
  Search,
  Check,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import { Destination, TravelStyle } from '../lib/types';
import { api } from '../lib/api';

interface AirportOption {
  code: string;
  name: string;
  cityName: string;
  countryName: string;
}

const POPULAR_DEFAULT_AIRPORTS: AirportOption[] = [
  { code: 'IST', name: 'Istanbul Havalimanı', cityName: 'Istanbul', countryName: 'Turkey' },
  { code: 'SAW', name: 'Sabiha Gökçen Havalimanı', cityName: 'Istanbul', countryName: 'Turkey' },
  { code: 'ESB', name: 'Esenboğa Havalimanı', cityName: 'Ankara', countryName: 'Turkey' },
  { code: 'ADB', name: 'Adnan Menderes Havalimanı', cityName: 'Izmir', countryName: 'Turkey' },
  { code: 'AYT', name: 'Antalya Havalimanı', cityName: 'Antalya', countryName: 'Turkey' },
  { code: 'VAS', name: 'Sivas Nuri Demirağ Havalimanı', cityName: 'Sivas', countryName: 'Turkey' },
  { code: 'SZF', name: 'Samsun Çarşamba Havalimanı', cityName: 'Samsun', countryName: 'Turkey' },
  { code: 'ERC', name: 'Erzincan Yıldırım Akbulut Havalimanı', cityName: 'Erzincan', countryName: 'Turkey' },
  { code: 'ERZ', name: 'Erzurum Havalimanı', cityName: 'Erzurum', countryName: 'Turkey' },
  { code: 'TZX', name: 'Trabzon Havalimanı', cityName: 'Trabzon', countryName: 'Turkey' },
  { code: 'ASR', name: 'Kayseri Havalimanı', cityName: 'Kayseri', countryName: 'Turkey' },
  { code: 'KYA', name: 'Konya Havalimanı', cityName: 'Konya', countryName: 'Turkey' },
  { code: 'MLX', name: 'Malatya Havalimanı', cityName: 'Malatya', countryName: 'Turkey' },
  { code: 'VAN', name: 'Van Ferit Melen Havalimanı', cityName: 'Van', countryName: 'Turkey' },
  { code: 'DIY', name: 'Diyarbakır Havalimanı', cityName: 'Diyarbakır', countryName: 'Turkey' },
  { code: 'COV', name: 'Çukurova Uluslararası Havalimanı', cityName: 'Adana / Mersin', countryName: 'Turkey' },
  { code: 'GZT', name: 'Gaziantep Havalimanı', cityName: 'Gaziantep', countryName: 'Turkey' },
  { code: 'DLM', name: 'Dalaman Havalimanı', cityName: 'Muğla / Dalaman', countryName: 'Turkey' },
  { code: 'BJV', name: 'Milas-Bodrum Havalimanı', cityName: 'Bodrum', countryName: 'Turkey' },
  { code: 'BER', name: 'Berlin Brandenburg Havalimanı', cityName: 'Berlin', countryName: 'Germany' },
  { code: 'DXB', name: 'Dubai Uluslararası Havalimanı', cityName: 'Dubai', countryName: 'UAE' },
  { code: 'NRT', name: 'Narita Uluslararası Havalimanı', cityName: 'Tokyo', countryName: 'Japan' },
  { code: 'LHR', name: 'Heathrow Havalimanı', cityName: 'London', countryName: 'UK' },
  { code: 'JFK', name: 'John F. Kennedy Havalimanı', cityName: 'New York', countryName: 'USA' },
];

function normalizeStr(text: string): string {
  if (!text) return '';
  return text
    .replace(/İ/g, 'I')
    .replace(/ı/g, 'i')
    .replace(/Ş/g, 'S')
    .replace(/ş/g, 's')
    .replace(/Ğ/g, 'G')
    .replace(/ğ/g, 'g')
    .replace(/Ü/g, 'U')
    .replace(/ü/g, 'u')
    .replace(/Ö/g, 'O')
    .replace(/ö/g, 'o')
    .replace(/Ç/g, 'C')
    .replace(/ç/g, 'c')
    .toLowerCase()
    .trim();
}

interface TripPlannerProps {
  destinations: Destination[];
  selectedDestination: Destination | null;
  onSelectDestination: (dest: Destination) => void;
  originAirport: string;
  onChangeOrigin: (origin: string) => void;
  durationDays: number;
  onChangeDuration: (days: number) => void;
  travelStyle: TravelStyle;
  onChangeTravelStyle: (style: TravelStyle) => void;
  departureDate: string;
  onChangeDepartureDate: (date: string) => void;
  returnDate: string;
  onChangeReturnDate: (date: string) => void;
  isLoading: boolean;
}

export const TripPlanner: React.FC<TripPlannerProps> = ({
  destinations,
  selectedDestination,
  onSelectDestination,
  originAirport,
  onChangeOrigin,
  durationDays,
  onChangeDuration,
  travelStyle,
  onChangeTravelStyle,
  departureDate,
  onChangeDepartureDate,
  returnDate,
  onChangeReturnDate,
  isLoading,
}) => {
  const [isAirportDropdownOpen, setIsAirportDropdownOpen] = useState(false);
  const [airportQuery, setAirportQuery] = useState('');
  const [airportOptions, setAirportOptions] = useState<AirportOption[]>(POPULAR_DEFAULT_AIRPORTS);
  const [isSearchingAirports, setIsSearchingAirports] = useState(false);
  const [showAllRoutes, setShowAllRoutes] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSearchingAirports(true);
      api
        .searchAirports(airportQuery)
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setAirportOptions(data);
          } else {
            // Instant local fallback
            const cleanQ = normalizeStr(airportQuery);
            const filtered = POPULAR_DEFAULT_AIRPORTS.filter(
              (a) =>
                normalizeStr(a.code).includes(cleanQ) ||
                normalizeStr(a.cityName).includes(cleanQ) ||
                normalizeStr(a.countryName).includes(cleanQ) ||
                normalizeStr(a.name).includes(cleanQ)
            );
            setAirportOptions(filtered);
          }
        })
        .catch(() => {
          // In case backend is offline, do local filter
          const cleanQ = normalizeStr(airportQuery);
          const filtered = POPULAR_DEFAULT_AIRPORTS.filter(
            (a) =>
              normalizeStr(a.code).includes(cleanQ) ||
              normalizeStr(a.cityName).includes(cleanQ) ||
              normalizeStr(a.countryName).includes(cleanQ) ||
              normalizeStr(a.name).includes(cleanQ)
          );
          setAirportOptions(filtered);
        })
        .finally(() => {
          setIsSearchingAirports(false);
        });
    }, 200);

    return () => clearTimeout(timer);
  }, [airportQuery]);

  const currentAirport =
    airportOptions.find((a) => a.code === originAirport) ||
    POPULAR_DEFAULT_AIRPORTS.find((a) => a.code === originAirport) || {
      code: originAirport,
      cityName: originAirport === 'IST' ? 'Istanbul' : originAirport,
      name: 'Selected Airport',
    };

  return (
    <div className="glass-luxury rounded-3xl p-6 sm:p-8 shadow-2xl relative border border-white/10 overflow-visible z-20">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/5">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-300 border border-amber-500/20">
            <Plane className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono-data tracking-widest text-amber-400/80 mb-0.5">
              ROTA MİMARİSİ · KORİDOR BELİRLEME
            </div>
            <h2 className="text-xl sm:text-2xl font-editorial tracking-wide text-white">
              Seyahat Rotası & Kalkış Meydanı
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Türkiye'nin 81 ilindeki tüm havalimanlarından dünya merkezlerine canlı uçuş ve tatil planlaması
            </p>
          </div>
        </div>

        {selectedDestination && (
          <div className="flex items-center space-x-2 text-xs bg-white/5 border border-white/10 text-amber-200/90 px-3.5 py-1.5 rounded-full font-mono-data">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Tahmini Uçuş: ~{selectedDestination.flightDurationHours} saat</span>
          </div>
        )}
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 overflow-visible">
        {/* 1. Global Searchable Origin Airport */}
        <div className="relative z-50">
          <label className="block text-xs font-mono-data text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Kalkış Havalimanı</span>
            <span className="text-[10px] text-amber-400/80 font-bold">81 İl & IATA</span>
          </label>

          <button
            type="button"
            onClick={() => setIsAirportDropdownOpen(!isAirportDropdownOpen)}
            className="w-full bg-[#050813] border border-white/10 hover:border-amber-400/50 rounded-2xl px-4 py-3 text-sm text-white flex items-center justify-between transition-all duration-300 text-left shadow-inner"
          >
            <div className="truncate">
              <span className="font-mono-data font-bold text-amber-400 mr-2">[{originAirport}]</span>
              <span className="text-slate-200 font-medium">{currentAirport.cityName}</span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
          </button>

          {/* Searchable Airport Modal / Dropdown */}
          {isAirportDropdownOpen && (
            <div className="absolute top-full left-0 w-full sm:min-w-[360px] mt-2 z-50 bg-[#060a17] border border-amber-500/30 rounded-2xl shadow-2xl p-3 backdrop-blur-2xl">
              <div className="relative mb-2.5">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Havalimanı veya şehir (Sivas, Samsun, IST...)"
                  value={airportQuery}
                  onChange={(e) => setAirportQuery(e.target.value)}
                  className="w-full bg-[#03050a] border border-white/10 rounded-xl pl-9 pr-9 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  autoFocus
                />
                {isSearchingAirports && (
                  <Loader2 className="w-3.5 h-3.5 text-amber-400 absolute right-3.5 top-3 animate-spin" />
                )}
              </div>

              <div className="max-h-56 overflow-y-auto space-y-1 pr-1">
                {airportOptions.length === 0 ? (
                  <div className="py-4 px-3 text-center text-xs text-slate-400">
                    Havalimanı bulunamadı. Şehir veya 3 harfli IATA kodu deneyin (örn: Antalya, IST, JFK).
                  </div>
                ) : (
                  airportOptions.map((opt) => {
                    const isSelected = opt.code === originAirport;
                    return (
                      <button
                        key={`${opt.code}-${opt.cityName}`}
                        type="button"
                        onClick={() => {
                          onChangeOrigin(opt.code);
                          setIsAirportDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-amber-500/20 text-amber-200 font-bold border border-amber-500/30'
                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <div className="truncate">
                          <strong className="font-mono-data text-amber-400 mr-2">[{opt.code}]</strong>
                          <span>{opt.cityName}, {opt.countryName}</span>
                          <span className="text-[10px] text-slate-500 block truncate">{opt.name}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 ml-1" />}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
          {isAirportDropdownOpen && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsAirportDropdownOpen(false)}
            />
          )}
        </div>

        {/* 2. Destination Selector */}
        <div>
          <label className="block text-xs font-mono-data text-slate-300 uppercase tracking-wider mb-2">
            Hedef Alışveriş Şehri
          </label>
          <select
            value={selectedDestination?.primaryAirportCode || ''}
            onChange={(e) => {
              const found = destinations.find((d) => d.primaryAirportCode === e.target.value);
              if (found) onSelectDestination(found);
            }}
            className="w-full bg-[#050813] border border-white/10 hover:border-amber-400/50 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 transition-all duration-300 font-medium"
          >
            {destinations.map((d) => (
              <option key={d.id} value={d.primaryAirportCode}>
                {d.cityName}, {d.countryName} ({d.primaryAirportCode}) • {d.currencyCode}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Departure & Return Dates */}
        <div>
          <label className="block text-xs font-mono-data text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Tarih Aralığı</span>
            <span className="text-amber-400 font-bold font-mono-data text-[11px]">
              {durationDays} Gün ({Math.max(1, durationDays - 1)} Gece)
            </span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={departureDate}
              onChange={(e) => onChangeDepartureDate(e.target.value)}
              className="w-full bg-[#050813] border border-white/10 rounded-2xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono-data"
            />
            <input
              type="date"
              value={returnDate}
              onChange={(e) => onChangeReturnDate(e.target.value)}
              className="w-full bg-[#050813] border border-white/10 rounded-2xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono-data"
            />
          </div>

          {/* Quick Duration Preset Pills */}
          <div className="grid grid-cols-4 gap-1.5 mt-2">
            {[
              { label: '3 Gün', days: 3 },
              { label: '1 Hafta', days: 7 },
              { label: '2 Hafta', days: 14 },
              { label: '1 Ay', days: 30 },
            ].map((preset) => (
              <button
                key={preset.days}
                type="button"
                onClick={() => onChangeDuration(preset.days)}
                className={`py-1 text-[10px] rounded-lg font-mono-data transition-all text-center border ${
                  durationDays === preset.days
                    ? 'bg-amber-500/20 text-amber-200 border-amber-500/40 font-bold shadow-sm'
                    : 'bg-white/5 text-slate-400 border-white/5 hover:text-white hover:bg-white/10'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Travel Style */}
        <div>
          <label className="block text-xs font-mono-data text-slate-300 uppercase tracking-wider mb-2">
            Konfor Seviyesi
          </label>
          <div className="grid grid-cols-3 gap-1 p-1 bg-[#050813] rounded-2xl border border-white/10">
            {(['budget', 'moderate', 'luxury'] as TravelStyle[]).map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => onChangeTravelStyle(style)}
                className={`py-2 text-xs font-medium rounded-xl capitalize transition-all duration-300 ${
                  travelStyle === style
                    ? 'bg-gradient-to-r from-amber-500/30 to-amber-600/30 text-amber-200 border border-amber-500/40 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {style === 'budget' ? 'Ekonomik' : style === 'moderate' ? 'Standart' : 'Lüks'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Destination Quick-Pills */}
      <div className="mt-5 pt-4 border-t border-white/5 flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400 font-mono-data mr-1 flex items-center">
          <MapPin className="w-3.5 h-3.5 mr-1.5 text-amber-400" /> Popüler Rotalar:
        </span>
        {(showAllRoutes
          ? destinations
          : destinations.filter(
              (d) =>
                ['NRT', 'BER', 'DXB', 'LHR', 'JFK', 'TBS'].includes(d.primaryAirportCode) ||
                d.primaryAirportCode === selectedDestination?.primaryAirportCode
            )
        ).map((d) => {
          const isSelected = selectedDestination?.primaryAirportCode === d.primaryAirportCode;
          return (
            <button
              key={d.id}
              onClick={() => onSelectDestination(d)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-300 flex items-center space-x-1.5 border ${
                isSelected
                  ? 'bg-amber-500/20 text-amber-200 border-amber-500/40 shadow-sm scale-105 font-bold'
                  : 'bg-white/5 text-slate-300 border-white/5 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>{d.cityName}</span>
              <span className="text-[10px] opacity-75 font-mono-data">[{d.primaryAirportCode}]</span>
            </button>
          );
        })}

        {destinations.length > 6 && (
          <button
            type="button"
            onClick={() => setShowAllRoutes(!showAllRoutes)}
            className="px-3 py-1.5 rounded-xl text-xs font-mono-data text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all font-semibold"
          >
            {showAllRoutes ? 'Daha Az Göster ↑' : `+${destinations.length - 6} Diğer Rota ▾`}
          </button>
        )}
      </div>
    </div>
  );
};
