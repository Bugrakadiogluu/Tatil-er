'use client';

import React, { useState, useEffect } from 'react';
import {
  Plane,
  ShoppingBag,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Info,
  Radio,
  Activity,
  Layers,
} from 'lucide-react';
import { MarketTicker } from '../lib/types';
import { api } from '../lib/api';

interface HeaderProps {
  activeTab: 'planner' | 'reverse' | 'customs';
  onTabChange: (tab: 'planner' | 'reverse' | 'customs') => void;
  onOpenCustomsModal: () => void;
}

const DEFAULT_TICKERS: MarketTicker[] = [
  { symbol: 'USD/TRY', name: 'Amerikan Doları', rate: 35.85, formattedRate: '35.85 ₺', change24h: '+0.28%', isPositive: true },
  { symbol: 'EUR/TRY', name: 'Euro', rate: 38.92, formattedRate: '38.92 ₺', change24h: '+0.41%', isPositive: true },
  { symbol: 'GBP/TRY', name: 'İngiliz Sterlini', rate: 46.25, formattedRate: '46.25 ₺', change24h: '+0.35%', isPositive: true },
  { symbol: '100 JPY/TRY', name: 'Japon Yeni (100¥)', rate: 23.80, formattedRate: '23.80 ₺', change24h: '-0.15%', isPositive: false },
  { symbol: 'CHF/TRY', name: 'İsviçre Frangı', rate: 41.20, formattedRate: '41.20 ₺', change24h: '+0.22%', isPositive: true },
  { symbol: 'AED/TRY', name: 'BAE Dirhemi', rate: 9.76, formattedRate: '9.76 ₺', change24h: '+0.25%', isPositive: true },
  { symbol: 'SAR/TRY', name: 'Suudi Riyali', rate: 9.55, formattedRate: '9.55 ₺', change24h: '+0.19%', isPositive: true },
  { symbol: 'CAD/TRY', name: 'Kanada Doları', rate: 26.10, formattedRate: '26.10 ₺', change24h: '-0.08%', isPositive: false },
  { symbol: 'AUD/TRY', name: 'Avustralya Doları', rate: 23.80, formattedRate: '23.80 ₺', change24h: '+0.31%', isPositive: true },
  { symbol: 'GEL/TRY', name: 'Gürcistan Larisi', rate: 13.15, formattedRate: '13.15 ₺', change24h: '+0.14%', isPositive: true },
  { symbol: 'QAR/TRY', name: 'Katar Riyali', rate: 9.84, formattedRate: '9.84 ₺', change24h: '+0.27%', isPositive: true },
  { symbol: 'PLN/TRY', name: 'Polonya Zlotisi', rate: 9.15, formattedRate: '9.15 ₺', change24h: '+0.11%', isPositive: true },
  { symbol: 'SEK/TRY', name: 'İsveç Kronu', rate: 3.42, formattedRate: '3.42 ₺', change24h: '-0.04%', isPositive: false },
  { symbol: 'ALTIN (Gram)', name: 'Gram Altın', rate: 3065, formattedRate: '3,065 ₺', change24h: '+0.65%', isPositive: true },
  { symbol: 'BTC/USD', name: 'Bitcoin', rate: 64250, formattedRate: '$64,250', change24h: '+1.82%', isPositive: true },
];

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenCustomsModal,
}) => {
  const [tickers, setTickers] = useState<MarketTicker[]>(DEFAULT_TICKERS);
  const [showAllTickers, setShowAllTickers] = useState(false);

  useEffect(() => {
    let isMounted = true;
    api
      .getMarketTickers()
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setTickers(data);
        }
      })
      .catch(() => {
        // Keeps DEFAULT_TICKERS fallback
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <header className="border-b border-surface-border bg-surface/90 backdrop-blur-md sticky top-0 z-40">
      {/* Top Borsa / TradingView Market Ticker Tape */}
      <div className="bg-slate-950 border-b border-white/10 py-2 px-3 text-xs overflow-hidden shadow-inner">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Live Indicator Badge */}
          <div className="flex items-center space-x-2 shrink-0 pr-3 border-r border-white/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 flex items-center">
              CANLI BORSA / FX
            </span>
          </div>

          {/* Scrolling / Sliding Currency Ticker Strip (15 pairs) */}
          <div className="flex-1 overflow-x-auto no-scrollbar flex items-center space-x-3 py-0.5 scroll-smooth">
            {tickers.map((t) => (
              <div
                key={t.symbol}
                className="flex items-center space-x-1.5 bg-slate-900/90 border border-white/5 hover:border-cyan-500/40 px-2.5 py-1 rounded-lg shrink-0 transition-colors cursor-pointer group"
                title={`${t.name}: ${t.formattedRate}`}
              >
                <span className="font-mono text-[11px] font-bold text-slate-300 group-hover:text-cyan-300">
                  {t.symbol}
                </span>
                <span className="font-mono text-[11px] font-semibold text-white">
                  {t.formattedRate}
                </span>
                <span
                  className={`flex items-center text-[10px] font-bold font-mono px-1 py-0.2 rounded ${
                    t.isPositive
                      ? 'text-emerald-400 bg-emerald-950/60'
                      : 'text-rose-400 bg-rose-950/60'
                  }`}
                >
                  {t.isPositive ? (
                    <TrendingUp className="w-2.5 h-2.5 mr-0.5 inline" />
                  ) : (
                    <TrendingDown className="w-2.5 h-2.5 mr-0.5 inline" />
                  )}
                  {t.change24h}
                </span>
              </div>
            ))}
          </div>

          {/* Quick Customs & Regulations Trigger */}
          <div className="shrink-0 pl-2">
            <button
              onClick={onOpenCustomsModal}
              className="flex items-center space-x-1.5 text-amber-400 hover:text-amber-300 transition-colors bg-amber-950/50 border border-amber-700/50 px-3 py-1 rounded-full text-[11px]"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span className="font-semibold hidden sm:inline">2025/2026 IMEI:</span>
              <strong className="font-mono font-bold">45,614 ₺</strong>
              <Info className="w-3 h-3 ml-0.5 opacity-75" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <div
          className="flex items-center space-x-3.5 cursor-pointer select-none group"
          onClick={() => onTabChange('planner')}
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-200/20 via-white/5 to-slate-900 border border-amber-400/30 flex items-center justify-center shadow-lg shadow-black/40 group-hover:border-amber-400/60 transition-all duration-300">
            <span className="font-editorial text-lg text-amber-300 font-bold">T</span>
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="text-xl font-editorial tracking-wider text-white">
                TATİL'ER
              </span>
              <span className="text-[9px] uppercase font-mono-data tracking-widest px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20">
                KÜRESEL ARBİTRAJ
              </span>
            </div>
            <p className="text-[11px] font-mono-data text-slate-400">
              Canlı Uçuş Koridorları • Konaklama • Tatilini Bedavaya Getir
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <nav className="flex items-center space-x-1.5 p-1 rounded-2xl glass-luxury border border-white/10">
          <button
            onClick={() => onTabChange('reverse')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
              activeTab === 'reverse'
                ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-200 border border-amber-500/40 shadow-lg shadow-amber-500/10'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Tatilimi Bedavaya Getir</span>
          </button>

          <button
            onClick={() => onTabChange('planner')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
              activeTab === 'planner'
                ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-200 border border-amber-500/40 shadow-lg shadow-amber-500/10'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Seyahat & Arbitraj Planlayıcı</span>
          </button>

          <button
            onClick={() => onTabChange('customs')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
              activeTab === 'customs'
                ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-200 border border-amber-500/40 shadow-lg shadow-amber-500/10'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Gümrük & Tax-Free</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
