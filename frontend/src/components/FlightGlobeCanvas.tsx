'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import type { GlobeMethods } from 'react-globe.gl';
import { Navigation, RotateCw, Moon, Sun, Compass, Sparkles } from 'lucide-react';

interface FlightGlobeCanvasProps {
  originAirport: string;
  selectedDestinationAirport: string;
  onSelectDestination?: (airportCode: string) => void;
  className?: string;
}

interface AirportCoord {
  code: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
}

const AIRPORTS: Record<string, AirportCoord> = {
  IST: { code: 'IST', name: 'Istanbul Havalimanı', city: 'Istanbul', country: 'Türkiye', lat: 41.2753, lon: 28.7519 },
  SAW: { code: 'SAW', name: 'Sabiha Gökçen Havalimanı', city: 'Istanbul', country: 'Türkiye', lat: 40.8986, lon: 29.3092 },
  ESB: { code: 'ESB', name: 'Esenboğa Havalimanı', city: 'Ankara', country: 'Türkiye', lat: 40.1281, lon: 32.9951 },
  ADB: { code: 'ADB', name: 'Adnan Menderes Havalimanı', city: 'Izmir', country: 'Türkiye', lat: 38.2924, lon: 27.1570 },
  AYT: { code: 'AYT', name: 'Antalya Havalimanı', city: 'Antalya', country: 'Türkiye', lat: 36.8987, lon: 30.8005 },
  VAS: { code: 'VAS', name: 'Sivas Nuri Demirağ Havalimanı', city: 'Sivas', country: 'Türkiye', lat: 39.8139, lon: 36.9036 },
  SZF: { code: 'SZF', name: 'Samsun Çarşamba Havalimanı', city: 'Samsun', country: 'Türkiye', lat: 41.2586, lon: 36.5484 },
  ERC: { code: 'ERC', name: 'Erzincan Yıldırım Akbulut Havalimanı', city: 'Erzincan', country: 'Türkiye', lat: 39.7103, lon: 39.5261 },
  ERZ: { code: 'ERZ', name: 'Erzurum Havalimanı', city: 'Erzurum', country: 'Türkiye', lat: 39.9567, lon: 41.1703 },
  TZX: { code: 'TZX', name: 'Trabzon Havalimanı', city: 'Trabzon', country: 'Türkiye', lat: 40.9951, lon: 39.7897 },
  ASR: { code: 'ASR', name: 'Kayseri Havalimanı', city: 'Kayseri', country: 'Türkiye', lat: 38.7704, lon: 35.4954 },
  COV: { code: 'COV', name: 'Çukurova Havalimanı', city: 'Adana/Mersin', country: 'Türkiye', lat: 36.9033, lon: 35.0642 },
  GZT: { code: 'GZT', name: 'Gaziantep Havalimanı', city: 'Gaziantep', country: 'Türkiye', lat: 36.9472, lon: 37.4786 },
  DLM: { code: 'DLM', name: 'Dalaman Havalimanı', city: 'Muğla/Dalaman', country: 'Türkiye', lat: 36.7131, lon: 28.7925 },
  BJV: { code: 'BJV', name: 'Milas-Bodrum Havalimanı', city: 'Bodrum', country: 'Türkiye', lat: 37.2506, lon: 27.6644 },
  DIY: { code: 'DIY', name: 'Diyarbakır Havalimanı', city: 'Diyarbakır', country: 'Türkiye', lat: 37.8939, lon: 40.2010 },
  VAN: { code: 'VAN', name: 'Van Ferit Melen Havalimanı', city: 'Van', country: 'Türkiye', lat: 38.4682, lon: 43.3323 },
  NRT: { code: 'NRT', name: 'Narita International', city: 'Tokyo', country: 'Japonya', lat: 35.7720, lon: 140.3929 },
  BER: { code: 'BER', name: 'Berlin Brandenburg', city: 'Berlin', country: 'Almanya', lat: 52.3667, lon: 13.5033 },
  DXB: { code: 'DXB', name: 'Dubai International', city: 'Dubai', country: 'BAE', lat: 25.2532, lon: 55.3657 },
  LHR: { code: 'LHR', name: 'Heathrow Airport', city: 'Londra', country: 'İngiltere', lat: 51.4700, lon: -0.4543 },
  JFK: { code: 'JFK', name: 'John F. Kennedy', city: 'New York', country: 'ABD', lat: 40.6413, lon: -73.7781 },
  TBS: { code: 'TBS', name: 'Tbilisi International', city: 'Tiflis', country: 'Gürcistan', lat: 41.6692, lon: 44.9547 },
  MAD: { code: 'MAD', name: 'Barajas Airport', city: 'Madrid', country: 'İspanya', lat: 40.4983, lon: -3.5676 },
  FCO: { code: 'FCO', name: 'Fiumicino Airport', city: 'Roma', country: 'İtalya', lat: 41.8003, lon: 12.2389 },
  AMS: { code: 'AMS', name: 'Schiphol Airport', city: 'Amsterdam', country: 'Hollanda', lat: 52.3105, lon: 4.7683 },
  RUH: { code: 'RUH', name: 'King Khalid Airport', city: 'Riyad', country: 'Suudi Arabistan', lat: 24.9576, lon: 46.6988 },
  SIN: { code: 'SIN', name: 'Changi Airport', city: 'Singapur', country: 'Singapur', lat: 1.3644, lon: 103.9915 },
  YYZ: { code: 'YYZ', name: 'Pearson Airport', city: 'Toronto', country: 'Kanada', lat: 43.6777, lon: -79.6248 },
  ARN: { code: 'ARN', name: 'Arlanda Airport', city: 'Stockholm', country: 'İsveç', lat: 59.6498, lon: 17.9238 },
  WAW: { code: 'WAW', name: 'Chopin Airport', city: 'Varşova', country: 'Polonya', lat: 52.1672, lon: 20.9679 },
  BRU: { code: 'BRU', name: 'Brussels Airport', city: 'Brüksel', country: 'Belçika', lat: 50.9010, lon: 4.4856 },
  CAI: { code: 'CAI', name: 'Cairo International Airport', city: 'Kahire', country: 'Mısır', lat: 30.1219, lon: 31.4056 },
  MEX: { code: 'MEX', name: 'Benito Juárez International', city: 'Mexico City', country: 'Meksika', lat: 19.4361, lon: -99.0719 },
  GRU: { code: 'GRU', name: 'Guarulhos International', city: 'Sao Paulo', country: 'Brezilya', lat: -23.4356, lon: -46.4731 },
  BOM: { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj', city: 'Mumbai', country: 'Hindistan', lat: 19.0896, lon: 72.8656 },
  JNB: { code: 'JNB', name: 'O. R. Tambo International', city: 'Johannesburg', country: 'Güney Afrika', lat: -26.1367, lon: 28.2411 },
};

// Luxury Preloading Skeleton
const GlobePreloader: React.FC = () => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#03050a] z-20 space-y-4">
    <div className="relative">
      <div className="w-16 h-16 rounded-full border-2 border-amber-500/20 border-t-amber-400 animate-spin" />
      <div className="absolute inset-0 flex items-center justify-center">
        <Compass className="w-6 h-6 text-amber-400 animate-pulse" />
      </div>
    </div>
    <div className="text-center space-y-1">
      <div className="text-sm font-editorial tracking-wider text-white">
        Gerçek Dünya Modeli & Canlı Uçuş Koridorları Hazırlanıyor
      </div>
      <div className="text-[11px] font-mono-data text-amber-400/80">
        NASA Topoğrafik Atlas & 3D WebGL Başlatılıyor...
      </div>
    </div>
  </div>
);

// Dynamically import react-globe.gl with SSR disabled
const Globe = dynamic(() => import('react-globe.gl'), {
  ssr: false,
  loading: () => <GlobePreloader />,
});

export const FlightGlobeCanvas: React.FC<FlightGlobeCanvasProps> = ({
  originAirport,
  selectedDestinationAirport,
  onSelectDestination,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeMethods | undefined>(undefined);

  const [dimensions, setDimensions] = useState({ width: 800, height: 480 });
  const [isReady, setIsReady] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [mapTheme, setMapTheme] = useState<'night' | 'day'>('night');

  const origin = AIRPORTS[originAirport] || AIRPORTS.IST;
  const destination = AIRPORTS[selectedDestinationAirport] || AIRPORTS.NRT;

  // Responsive container sizing
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Calculate Great Circle Distance in KM
  const calculateDistanceKm = useCallback((a: AirportCoord, b: AirportCoord) => {
    const R = 6371;
    const dLat = ((b.lat - a.lat) * Math.PI) / 180;
    const dLon = ((b.lon - a.lon) * Math.PI) / 180;
    const lat1 = (a.lat * Math.PI) / 180;
    const lat2 = (b.lat * Math.PI) / 180;
    const sin1 = Math.sin(dLat / 2);
    const sin2 = Math.sin(dLon / 2);
    const aVal = sin1 * sin1 + Math.cos(lat1) * Math.cos(lat2) * sin2 * sin2;
    const c = 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1 - aVal));
    return Math.round(R * c);
  }, []);

  const distanceKm = calculateDistanceKm(origin, destination);

  // Flight Arcs Data (Origin ➔ Destination)
  const arcsData = useMemo(() => {
    return [
      {
        startLat: origin.lat,
        startLng: origin.lon,
        endLat: destination.lat,
        endLng: destination.lon,
        color: ['#e5c378', '#38bdf8'],
        name: `${origin.city} (${origin.code}) ✈ ${destination.city} (${destination.code})`,
      },
    ];
  }, [origin, destination]);

  // Rings Data (Radar pulse on Origin & Destination)
  const ringsData = useMemo(() => {
    return [
      {
        lat: origin.lat,
        lng: origin.lon,
        maxR: 3.5,
        propagationSpeed: 1.4,
        repeatPeriod: 1400,
        color: () => '#38bdf8',
      },
      {
        lat: destination.lat,
        lng: destination.lon,
        maxR: 4.8,
        propagationSpeed: 1.8,
        repeatPeriod: 1200,
        color: () => '#e5c378',
      },
    ];
  }, [origin, destination]);

  // City Labels with 3D Pins
  const labelsData = useMemo(() => {
    return Object.values(AIRPORTS).map((apt) => {
      const isSelected = apt.code === destination.code;
      const isOrigin = apt.code === origin.code;
      return {
        code: apt.code,
        text: `${apt.city} [${apt.code}]`,
        lat: apt.lat,
        lng: apt.lon,
        size: isSelected ? 1.6 : isOrigin ? 1.4 : 1.0,
        color: isSelected ? '#e5c378' : isOrigin ? '#38bdf8' : '#94a3b8',
        dotRadius: isSelected ? 0.8 : isOrigin ? 0.6 : 0.4,
      };
    });
  }, [origin, destination]);

  // Smooth Camera transition when active route changes
  useEffect(() => {
    if (!globeRef.current) return;

    // Center camera on the midpoint of the active flight corridor
    const midLat = (origin.lat + destination.lat) / 2;
    // Handle wrap-around meridian
    let midLon = (origin.lon + destination.lon) / 2;
    if (Math.abs(origin.lon - destination.lon) > 180) {
      midLon = (midLon + 180) % 360;
    }

    globeRef.current.pointOfView(
      {
        lat: midLat,
        lng: midLon,
        altitude: 2.1,
      },
      1400
    );
  }, [origin, destination]);

  // Setup auto-rotate on OrbitControls
  useEffect(() => {
    if (!globeRef.current) return;
    try {
      const controls = globeRef.current.controls();
      if (controls) {
        controls.autoRotate = autoRotate;
        controls.autoRotateSpeed = 0.6;
        controls.enableZoom = true;
      }
    } catch (e) {
      // Ignored if controls are not yet initialized
    }
  }, [autoRotate, isReady]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[460px] sm:h-[520px] lg:h-[580px] rounded-3xl overflow-hidden glass-luxury border border-white/10 ${className}`}
    >
      {/* 3D Real Earth Globe */}
      <Globe
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        globeImageUrl={
          mapTheme === 'night'
            ? '/textures/earth-night.jpg'
            : '/textures/earth-blue-marble.jpg'
        }
        bumpImageUrl="/textures/earth-topology.png"
        backgroundColor="rgba(0,0,0,0)"
        showAtmosphere={true}
        atmosphereColor={mapTheme === 'night' ? '#38bdf8' : '#60a5fa'}
        atmosphereAltitude={0.16}
        // Flight Arcs
        arcsData={arcsData}
        arcColor="color"
        arcAltitude={0.3}
        arcStroke={2.2}
        arcDashLength={0.4}
        arcDashGap={0.6}
        arcDashInitialGap={0}
        arcDashAnimateTime={2000}
        // Rings
        ringsData={ringsData}
        ringColor="color"
        ringMaxRadius="maxR"
        ringPropagationSpeed="propagationSpeed"
        ringRepeatPeriod="repeatPeriod"
        // Labels
        labelsData={labelsData}
        labelLat="lat"
        labelLng="lng"
        labelText="text"
        labelSize="size"
        labelColor="color"
        labelDotRadius="dotRadius"
        labelAltitude={0.015}
        onLabelClick={(label: any) => {
          if (label?.code) {
            setAutoRotate(false);
            onSelectDestination?.(label.code);
          }
        }}
        onGlobeReady={() => setIsReady(true)}
      />

      {/* Editorial Telemetry HUD Overlay (Top-Left) */}
      <div className="absolute top-6 left-6 z-10 space-y-2 pointer-events-none">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-mono-data text-amber-300">
          <Navigation className="w-3.5 h-3.5 animate-pulse text-amber-400" />
          <span>GERÇEK DÜNYA · 3D UÇUŞ KORİDORU</span>
        </div>

        <div className="flex items-baseline space-x-3">
          <h2 className="text-2xl sm:text-3xl font-editorial tracking-wide text-white drop-shadow-md">
            {origin.city} <span className="text-amber-400">✈</span> {destination.city}
          </h2>
          <span className="text-xs font-mono-data text-slate-300">
            [{origin.code} ➔ {destination.code}]
          </span>
        </div>

        <div className="flex items-center space-x-4 text-xs font-mono-data text-slate-300 drop-shadow">
          <span>Mesafe: <strong className="text-amber-300 font-bold">{distanceKm.toLocaleString('tr-TR')} km</strong></span>
          <span>•</span>
          <span>Yüzey: <strong className="text-slate-100">{mapTheme === 'night' ? 'Gece Şehir Işıkları' : 'Detaylı Atlas'}</strong></span>
          <span>•</span>
          <span>Stratosfer Kavis: <strong className="text-amber-300">320 km</strong></span>
        </div>
      </div>

      {/* Destination Quick Selector Chips (Bottom-Left) */}
      <div className="absolute bottom-5 left-6 right-6 z-10 flex items-center space-x-2 overflow-x-auto no-scrollbar pointer-events-auto py-1 pr-4">
        <span className="text-[10px] font-mono-data text-amber-400 uppercase tracking-wider shrink-0 bg-black/70 px-2.5 py-1.5 rounded-xl border border-amber-500/20 backdrop-blur-md flex items-center">
          <Sparkles className="w-3 h-3 text-amber-400 mr-1.5 inline shrink-0" />
          <span>Canlı Rotalar:</span>
        </span>
        {Object.values(AIRPORTS)
          .filter(
            (a) =>
              a.code !== originAirport &&
              ![
                'IST',
                'SAW',
                'ESB',
                'ADB',
                'AYT',
                'VAS',
                'SZF',
                'ERC',
                'ERZ',
                'TZX',
                'ASR',
                'COV',
                'GZT',
                'DLM',
                'BJV',
                'DIY',
                'VAN',
              ].includes(a.code)
          )
          .map((apt) => {
            const isSelected = apt.code === selectedDestinationAirport;
            return (
              <button
                key={apt.code}
                onClick={() => {
                  setAutoRotate(false);
                  onSelectDestination?.(apt.code);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono-data transition-all duration-300 flex items-center space-x-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-amber-500/30 text-amber-200 border border-amber-400/60 shadow-lg shadow-amber-500/20 scale-105 font-bold'
                    : 'bg-[#050813]/80 text-slate-300 hover:text-white hover:bg-slate-800/90 border border-white/10 backdrop-blur-md'
                }`}
              >
                <span>{apt.code}</span>
                <span className="text-[10px] opacity-75">({apt.city})</span>
              </button>
            );
          })}
      </div>

      {/* Interactive Controls (Top-Right): Day/Night & Auto-Rotate */}
      <div className="absolute top-6 right-6 z-10 flex items-center space-x-2">
        {/* Day/Night Theme Toggle */}
        <button
          onClick={() => setMapTheme(mapTheme === 'night' ? 'day' : 'night')}
          className="p-2.5 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 text-xs text-amber-300 transition-all duration-300 flex items-center space-x-1.5 shadow-lg"
          title={mapTheme === 'night' ? 'Gündüz Atlasına Geç' : 'Gece Işıklarına Geç'}
        >
          {mapTheme === 'night' ? (
            <>
              <Moon className="w-4 h-4 text-amber-300" />
              <span className="text-[10px] font-mono-data hidden sm:inline">Gece</span>
            </>
          ) : (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="text-[10px] font-mono-data hidden sm:inline">Gündüz</span>
            </>
          )}
        </button>

        {/* Orbit Auto-Rotate Toggle */}
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`p-2.5 rounded-xl backdrop-blur-md border text-xs transition-all duration-300 flex items-center space-x-1.5 shadow-lg ${
            autoRotate
              ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
              : 'bg-black/60 text-slate-400 hover:text-white border-white/10'
          }`}
          title={autoRotate ? 'Serbest Dönüşü Durdur (Fareyle Döndür)' : 'Serbest Dönüşü Başlat'}
        >
          <RotateCw className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '12s' }} />
          <span className="text-[10px] font-mono-data hidden sm:inline">
            {autoRotate ? 'Dönüyor' : 'Sabit'}
          </span>
        </button>
      </div>

      {/* Atmospheric Ambient Lighting / Vignette Gradients */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#03050a] via-transparent to-[#03050a]/40" />
    </div>
  );
};
