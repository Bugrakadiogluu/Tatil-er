'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, MapPin, Plane, ArrowRight, CheckCircle2, ShoppingBag, ShieldCheck, Check } from 'lucide-react';
import { Product, ReverseArbitrageDeal } from '../lib/types';
import { api } from '../lib/api';

interface ReverseArbitrageFinderProps {
  products: Product[];
  onSelectDeal: (airportCode: string, productId: string) => void;
  onAddToBasket?: (productId: string) => void;
  basketProductIds?: string[];
}

export const ReverseArbitrageFinder: React.FC<ReverseArbitrageFinderProps> = ({
  products,
  onSelectDeal,
  onAddToBasket,
  basketProductIds = [],
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(
    products[0]?.id || 'prod-iphone16pro'
  );
  const [deals, setDeals] = useState<ReverseArbitrageDeal[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedProductId) return;

    let isMounted = true;
    setLoading(true);

    api
      .getReverseArbitrageDeals(selectedProductId)
      .then((data) => {
        if (isMounted) {
          setDeals(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load reverse arbitrage deals:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedProductId]);

  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const isInBasket = selectedProduct ? basketProductIds.includes(selectedProduct.id) : false;
  const isPhone = selectedProduct?.categoryCode === 'smartphones';

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="glass-luxury rounded-3xl p-6 sm:p-10 border border-white/10 relative overflow-hidden shadow-2xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-mono-data mb-3.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>REVERSE ARBITRAGE · TATİLİ BEDAVAYA GETİR MOTORU</span>
          </div>
          <h3 className="text-2xl sm:text-4xl font-editorial tracking-wide text-white leading-tight">
            "Bu Ürünün Alışveriş Kârıyla Hangi Ülkede Kaç Gün Bedava Tatil Yapabilirim?"
          </h3>
          <p className="text-sm text-slate-300 mt-2.5 leading-relaxed">
            Almak istediğiniz ürünü seçin. Yurt dışı mağaza fiyatı, <strong>Tax-Free KDV iadesi</strong> ve telefon ise <strong>45.614 ₺ Türkiye IMEI kayıt harcı ile TRT bandrolü</strong> düşüldükten sonra kalan net kazancınızla; uçak biletiniz ve <strong>Ekonomik, Normal veya Lüks</strong> konaklama ile kaç gün 0 ₺ bedavaya tatil yapabileceğinizi canlı hesaplayalım.
          </p>
        </div>

        {/* Product Selector Dropdown */}
        <div className="mt-8 max-w-lg">
          <label className="block text-xs font-mono-data uppercase tracking-wider text-slate-400 mb-2">
            Hedef Ürününüzü Seçin (117+ Canlı Ürün)
          </label>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="w-full bg-[#050813] border border-white/10 hover:border-amber-400/50 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-amber-400 font-medium transition-all shadow-inner"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.brand} {p.modelName} (TR: {p.domesticPriceTry.toLocaleString('tr-TR')} ₺)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Target Product Specs & Direct Add-To-Basket Snapshot */}
      {selectedProduct && (
        <div className="glass-luxury rounded-2xl p-5 border border-white/10 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <img
                src={selectedProduct.imageUrl}
                alt={selectedProduct.modelName}
                className="w-16 h-16 rounded-xl object-cover bg-slate-950 border border-white/10 shrink-0"
              />
              <div>
                <div className="text-[10px] font-mono-data text-amber-400 uppercase tracking-widest">
                  {selectedProduct.brand} • {selectedProduct.categoryName}
                </div>
                <div className="text-lg font-bold text-white tracking-tight">{selectedProduct.modelName}</div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Türkiye Satış Fiyatı:{' '}
                  <strong className="text-white font-mono-data">
                    {selectedProduct.domesticPriceTry.toLocaleString('tr-TR')} ₺
                  </strong>
                </div>
              </div>
            </div>

            {/* Quick Add to Basket Button */}
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => onAddToBasket && onAddToBasket(selectedProduct.id)}
                className={`w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-mono-data font-bold transition-all flex items-center justify-center space-x-2 ${
                  isInBasket
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                    : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-lg shadow-amber-500/20'
                }`}
              >
                {isInBasket ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Bu Ürün Sepetinizde Eklidir ✓</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Bu Ürünü Doğrudan Sepete Ekle</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Tax / IMEI notice */}
          <div className="p-3 bg-[#03050a]/80 rounded-xl border border-white/5 text-xs text-slate-300 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              {isPhone ? (
                <>
                  Telefon kategorisinde <strong>45.614 ₺ IMEI Kayıt Harcı</strong> ve <strong>TRT Bandrolü (€20)</strong> hesaplamalara birebir dahil edilmiştir. Vergi iadesi ile birlikte Türkiye fiyatı arasındaki net fark, tatil bütçenizi oluşturur.
                </>
              ) : (
                <>
                  Bu ürün kategorisinde IMEI harcı gerekmez! Yolcu beraberi muafiyeti sayesinde yurt dışı mağaza fiyatı ve Tax-Free iadesiyle elde edilen net tasarruf doğrudan tatil masraflarınıza aktarılır.
                </>
              )}
            </span>
          </div>
        </div>
      )}

      {/* Ranked Destinations Grid with 3 Comfort Tiers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-mono-data uppercase tracking-wider text-slate-400">
            En Çok Bedava Tatil Sağlayan Ülkeler & Konfor Seviyesi Sınıflandırması
          </h4>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass-luxury rounded-3xl p-6 h-64 animate-pulse bg-slate-900/40" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {deals.map((deal, idx) => {
              const maxDays = deal.maxFreeDaysBudget || deal.maxFreeDays || 0;
              const isFree = deal.isTripFree || maxDays > 0;

              return (
                <div
                  key={deal.destination.id}
                  className={`rounded-3xl p-6 sm:p-7 border transition-all duration-300 flex flex-col justify-between ${
                    isFree
                      ? 'glass-luxury-gold'
                      : 'glass-luxury hover:border-white/20'
                  }`}
                >
                  <div>
                    {/* Destination Title & Primary Badge */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center space-x-3.5">
                        <div className="w-9 h-9 rounded-xl bg-amber-400/10 text-amber-300 flex items-center justify-center font-editorial font-bold text-sm border border-amber-400/20">
                          #{idx + 1}
                        </div>
                        <div>
                          <h5 className="text-lg font-editorial text-white flex items-center tracking-wide">
                            {deal.destination.cityName}, {deal.destination.countryName}
                          </h5>
                          <span className="text-xs text-slate-400 font-mono-data">
                            [{deal.destination.primaryAirportCode}] • {deal.destination.currencyCode} • Uçuş: ~{deal.destination.flightDurationHours} saat
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-mono-data font-bold ${
                            isFree
                              ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                              : 'bg-white/10 text-slate-300 border border-white/10'
                          }`}
                        >
                          {maxDays > 0
                            ? `MAX ${maxDays} GÜN BEDAVA`
                            : `%${deal.fundingPercentage} Karşılanıyor`}
                        </span>
                      </div>
                    </div>

                    {/* Prominent Deal Verdict Banner */}
                    <div
                      className={`p-3 rounded-2xl text-xs font-medium mb-4 border flex items-center space-x-2.5 ${
                        isFree
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                          : 'bg-white/5 border-white/10 text-slate-300'
                      }`}
                    >
                      <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
                      <span>{deal.dealVerdict}</span>
                    </div>

                    {/* 3 Comfort Tiers Classification: Ekonomik, Normal, Lüks */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-4">
                      {/* 🟢 Ekonomik */}
                      <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-[10px] font-mono-data font-bold text-emerald-400">
                            <span>🟢 Ekonomik</span>
                            <span>~{(deal.dailyCostBudgetTry || 1500).toLocaleString('tr-TR')} ₺/g</span>
                          </div>
                          <div className="text-base font-black font-mono-data text-emerald-300 mt-1">
                            {deal.maxFreeDaysBudget > 0 ? `${deal.maxFreeDaysBudget} Gün Bedava` : '0 Gün'}
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                            Hostel/Oda + Metro Kartı & Sokak Lezzetleri
                          </p>
                        </div>
                        {deal.remainingPocketMoneyBudgetTry > 0 && (
                          <div className="mt-2 pt-1.5 border-t border-emerald-500/20 text-[9px] text-emerald-300 font-mono-data">
                            +{deal.remainingPocketMoneyBudgetTry.toLocaleString('tr-TR')} ₺ Harçlık
                          </div>
                        )}
                      </div>

                      {/* 🟡 Normal / Standart */}
                      <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-500/30 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-[10px] font-mono-data font-bold text-amber-400">
                            <span>🟡 Normal</span>
                            <span>~{(deal.dailyCostModerateTry || 3000).toLocaleString('tr-TR')} ₺/g</span>
                          </div>
                          <div className="text-base font-black font-mono-data text-amber-300 mt-1">
                            {deal.maxFreeDaysModerate > 0 ? `${deal.maxFreeDaysModerate} Gün Bedava` : '0 Gün'}
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                            3-4★ Butik Otel + Kafe/Restoran & Şehir İçi Ulaşım
                          </p>
                        </div>
                        {deal.remainingPocketMoneyModerateTry > 0 && (
                          <div className="mt-2 pt-1.5 border-t border-amber-500/20 text-[9px] text-amber-300 font-mono-data">
                            +{deal.remainingPocketMoneyModerateTry.toLocaleString('tr-TR')} ₺ Harçlık
                          </div>
                        )}
                      </div>

                      {/* 🟣 Lüks */}
                      <div className="p-3 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-[10px] font-mono-data font-bold text-purple-400">
                            <span>🟣 Lüks</span>
                            <span>~{(deal.dailyCostLuxuryTry || 7000).toLocaleString('tr-TR')} ₺/g</span>
                          </div>
                          <div className="text-base font-black font-mono-data text-purple-300 mt-1">
                            {deal.maxFreeDaysLuxury > 0 ? `${deal.maxFreeDaysLuxury} Gün Bedava` : '0 Gün'}
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                            5★ Lüks Otel + Fine Dining & Özel VIP Transfer
                          </p>
                        </div>
                        {deal.remainingPocketMoneyLuxuryTry > 0 && (
                          <div className="mt-2 pt-1.5 border-t border-purple-500/20 text-[9px] text-purple-300 font-mono-data">
                            +{deal.remainingPocketMoneyLuxuryTry.toLocaleString('tr-TR')} ₺ Harçlık
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Financial Summary Strip */}
                    <div className="grid grid-cols-3 gap-2 p-3 bg-[#03050a]/80 rounded-2xl border border-white/5 text-center text-xs mb-5 shadow-inner">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-mono-data truncate">Net Ürün Kârı</span>
                        <span className="font-bold text-amber-300 font-mono-data text-xs">
                          +{deal.arbitrage.netSavingsTry.toLocaleString('tr-TR')} ₺
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-mono-data truncate">Gidiş-Dönüş Uçuş</span>
                        <span className="font-bold text-slate-200 font-mono-data text-xs">
                          {deal.travelEstimate.flightPriceTry > 0
                            ? `${deal.travelEstimate.flightPriceTry.toLocaleString('tr-TR')} ₺`
                            : 'Canlı Bilet'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-mono-data truncate">Kalan Tatil Bütçesi</span>
                        <span
                          className={`font-bold font-mono-data text-xs ${
                            deal.savingsAfterFlightTry > 0 ? 'text-emerald-400' : 'text-slate-400'
                          }`}
                        >
                          {deal.savingsAfterFlightTry > 0
                            ? `+${Math.round(deal.savingsAfterFlightTry).toLocaleString('tr-TR')} ₺`
                            : `${Math.round(deal.savingsAfterFlightTry).toLocaleString('tr-TR')} ₺`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* One-Click Action: Add to Basket & Start Deal */}
                  <button
                    onClick={() => onSelectDeal(deal.destination.primaryAirportCode, selectedProduct?.id || '')}
                    className="w-full py-3 px-4 rounded-2xl text-xs font-mono-data font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20"
                  >
                    <span>Bu Ürünü Sepete Ekle & {deal.destination.cityName} Tatilini Başlat</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
