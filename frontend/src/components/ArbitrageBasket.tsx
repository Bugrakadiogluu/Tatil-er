'use client';

import React from 'react';
import {
  ShoppingBag,
  Trash2,
  Sparkles,
  Plane,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { BasketArbitrageCalculation, Product } from '../lib/types';

interface ArbitrageBasketProps {
  calculation: BasketArbitrageCalculation | null;
  basketItems: { productId: string; quantity: number }[];
  products: Product[];
  onRemoveItem: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  isLoading: boolean;
}

export const ArbitrageBasket: React.FC<ArbitrageBasketProps> = ({
  calculation,
  basketItems,
  products,
  onRemoveItem,
  onUpdateQuantity,
  isLoading,
}) => {
  if (basketItems.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-8 text-center border border-white/10">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto mb-3 border border-cyan-500/20">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-white mb-1">Arbitraj Sepetiniz Henüz Boş</h4>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Aşağıdaki listeden ürün ekleyebilir veya kendi Amazon API'nizi bağladığınızda ürünleri sepete atarak alışveriş kazancınızın yurt dışı tatilinizi nasıl bedavaya getirdiğini canlı görebilirsiniz.
        </p>
      </div>
    );
  }

  const summary = calculation?.summary;
  const fundingPct = summary?.tripFundedPercentage || 0;
  const isFreeTrip = summary?.isTripFree || false;
  const netProfit = summary?.netArbitrageProfitTry || 0;

  return (
    <div className="glass-panel-glow rounded-2xl p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white tracking-tight">
              Sınır Ötesi Alışveriş Arbitraj & Tatil Motoru
            </h3>
            <p className="text-xs text-slate-300">
              {calculation?.destinationCity || 'Hedef Şehir'} seyahat ve tatil masraflarınıza karşı hesaplanan net alışveriş kazancı
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono bg-white/5 border border-white/10 px-3 py-1 rounded-full text-slate-300">
            Sepette {basketItems.length} Ürün
          </span>
        </div>
      </div>

      {/* Visual Vacation Funding Progress Bar */}
      <div className="bg-slate-950/70 rounded-2xl p-6 border border-white/10 relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Plane className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-bold text-white uppercase tracking-wider">
              Tatil Finansman Oranı:
            </span>
          </div>
          <span
            className={`text-2xl font-black font-mono ${
              isFreeTrip ? 'text-emerald-400' : 'text-cyan-400'
            }`}
          >
            %{fundingPct}
          </span>
        </div>

        {/* Progress bar container */}
        <div className="w-full h-4 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/10 relative">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              isFreeTrip
                ? 'bg-gradient-to-r from-cyan-500 via-emerald-400 to-green-300 shadow-lg shadow-emerald-500/50'
                : 'bg-gradient-to-r from-cyan-600 to-cyan-400'
            }`}
            style={{ width: `${Math.min(100, Math.max(5, fundingPct))}%` }}
          />
        </div>

        {/* Status Callout */}
        <div className="mt-4 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {isFreeTrip ? (
            <div className="flex items-center space-x-2 text-emerald-300 text-sm font-bold">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>
                🎉 TEBRİKLER! TATİLİNİZ TAMAMEN BEDAVAYA GELDİ! Tüm tatil masraflarınız karşılandı ve cebinize{' '}
                <strong className="text-white font-mono underline decoration-emerald-400 decoration-2">
                  +{netProfit.toLocaleString('tr-TR')} ₺
                </strong>{' '}
                net nakit kalıyor!
              </span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-slate-300 text-xs sm:text-sm">
              <TrendingUp className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                Alışverişiniz{' '}
                <strong className="text-cyan-300 font-mono">
                  {summary?.totalGrossSavingsTry.toLocaleString('tr-TR')} ₺
                </strong>
                {' '}tasarruf sağlıyor; uçak, otel ve yeme-içme masraflarından cebinizden sadece{' '}
                <strong className="text-rose-400 font-mono">
                  {Math.abs(netProfit).toLocaleString('tr-TR')} ₺
                </strong>{' '}
                kalıyor!
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Sepet Detayları & Ürün Dökümü</h4>
        {calculation?.items.map((item) => (
          <div
            key={item.productId}
            className="bg-slate-900/80 rounded-xl p-4 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex items-center space-x-3 min-w-[240px]">
              <img
                src={item.imageUrl}
                alt={item.modelName}
                className="w-12 h-12 rounded-lg object-cover bg-slate-950 border border-white/10 shrink-0"
              />
              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                  {item.brand} • {item.categoryName}
                </span>
                <h5 className="text-sm font-bold text-white line-clamp-1">{item.modelName}</h5>
                <span className="text-[11px] text-slate-400 font-mono">
                  TR: {item.domesticPriceTry.toLocaleString('tr-TR')} ₺ vs {item.abroadCity}:{' '}
                  {item.netLandedCostAbroadTry.toLocaleString('tr-TR')} ₺ (Tüm Vergiler Dahil Son Maliyet)
                </span>
              </div>
            </div>

            {/* Customs / IMEI alert */}
            {item.customsAlert && (
              <div className="text-[11px] text-amber-300/90 bg-amber-950/40 border border-amber-900/40 px-3 py-1.5 rounded-lg max-w-xs">
                {item.customsAlert}
              </div>
            )}

            {/* Quantity and Subtotal Savings */}
            <div className="flex items-center space-x-6 justify-between md:justify-end">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400">Adet:</span>
                <select
                  value={item.quantity}
                  onChange={(e) => onUpdateQuantity(item.productId, parseInt(e.target.value, 10))}
                  className="bg-slate-950 border border-white/10 text-white rounded-lg px-2 py-1 text-xs font-mono focus:outline-none focus:border-cyan-500"
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-400">Net Kazanç:</div>
                <div className="text-sm font-black text-emerald-400 font-mono">
                  +{item.subtotalNetSavingsTry.toLocaleString('tr-TR')} ₺
                </div>
              </div>

              <button
                onClick={() => onRemoveItem(item.productId)}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-white/5 rounded-lg transition-colors"
                title="Ürünü sepetten çıkar"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Final Totals Summary Bar */}
      <div className="pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div className="bg-slate-900/50 p-3 rounded-xl border border-white/5">
          <div className="text-[11px] text-slate-400 uppercase tracking-wider">Türkiye Satış Tutarı</div>
          <div className="text-base font-bold text-white font-mono mt-0.5">
            {summary?.totalDomesticCostTry.toLocaleString('tr-TR')} ₺
          </div>
        </div>

        <div className="bg-slate-900/50 p-3 rounded-xl border border-white/5">
          <div className="text-[11px] text-slate-400 uppercase tracking-wider">Yurt Dışı Son Maliyet</div>
          <div className="text-base font-bold text-cyan-400 font-mono mt-0.5">
            {summary?.totalAbroadLandedCostTry.toLocaleString('tr-TR')} ₺
          </div>
        </div>

        <div className="bg-slate-900/50 p-3 rounded-xl border border-white/5">
          <div className="text-[11px] text-slate-400 uppercase tracking-wider">Toplam Tatil Maliyeti</div>
          <div className="text-base font-bold text-amber-400 font-mono mt-0.5">
            {summary?.totalTravelCostTry.toLocaleString('tr-TR')} ₺
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-950/80 to-slate-900 p-3 rounded-xl border border-emerald-500/30">
          <div className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider">
            Net Arbitraj & Tatil Bakiyesi
          </div>
          <div
            className={`text-base font-black font-mono mt-0.5 ${
              isFreeTrip ? 'text-emerald-300' : 'text-slate-200'
            }`}
          >
            {netProfit >= 0 ? `+${netProfit.toLocaleString('tr-TR')} ₺` : `${netProfit.toLocaleString('tr-TR')} ₺`}
          </div>
        </div>
      </div>
    </div>
  );
};
