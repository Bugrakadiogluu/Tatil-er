'use client';

import React, { useState } from 'react';
import {
  Search,
  Plus,
  Check,
  Smartphone,
  Cpu,
  Gamepad2,
  Monitor,
  Mouse,
  Shirt,
  Tag,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Globe,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { Product, Destination } from '../lib/types';
import { api } from '../lib/api';

interface ProductCatalogProps {
  products: Product[];
  currentDestination: Destination | null;
  onAddToBasket: (productId: string) => void;
  basketProductIds: string[];
  onProductDiscovered?: (product: Product) => void;
}

const CATEGORY_TABS = [
  { code: 'all', label: 'Tüm Kategoriler', icon: Tag },
  { code: 'smartphones', label: 'Akıllı Telefonlar', icon: Smartphone },
  { code: 'gpus', label: 'Ekran Kartları', icon: Cpu },
  { code: 'consoles', label: 'Konsol & VR', icon: Gamepad2 },
  { code: 'monitors', label: 'Monitörler', icon: Monitor },
  { code: 'mice', label: 'Çevre Birimleri', icon: Mouse },
  { code: 'clothing', label: 'Lüks & Yaşam', icon: Shirt },
];

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  currentDestination,
  onAddToBasket,
  basketProductIds,
  onProductDiscovered,
}) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [discoveryStatus, setDiscoveryStatus] = useState<string | null>(null);

  const handleDiscoverProduct = async (term?: string) => {
    const q = (term || searchQuery).trim();
    if (!q) return;

    setIsDiscovering(true);
    setDiscoveryStatus(`"${q}" küresel mağazalardan (Amazon US, DE, JP, Currys, Sharaf DG) canlı taranıyor...`);

    try {
      const results = await api.discoverProduct(q);
      if (results && results.length > 0) {
        results.forEach((prod) => {
          if (onProductDiscovered) {
            onProductDiscovered(prod);
          }
        });
        setActiveCategory('all');
        setSearchQuery(q);
        setDiscoveryStatus(`✓ Başarılı: "${results[0].modelName}" uluslararası fiyat ve arbitraj verileriyle kataloğa eklendi!`);
        setTimeout(() => setDiscoveryStatus(null), 5000);
      } else {
        setDiscoveryStatus('Ürün bulunamadı. Lütfen model adını kontrol edin.');
      }
    } catch (err: any) {
      console.error('Discovery error:', err);
      setDiscoveryStatus('Uluslararası arama servisine bağlanılamadı.');
    } finally {
      setIsDiscovering(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      activeCategory === 'all' || p.categoryCode.toLowerCase() === activeCategory.toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      p.brand.toLowerCase().includes(q) ||
      p.modelName.toLowerCase().includes(q) ||
      p.globalSku.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Search & Category Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 max-w-full">
          {CATEGORY_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeCategory === tab.code;
            return (
              <button
                key={tab.code}
                onClick={() => setActiveCategory(tab.code)}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                    : 'bg-[#050813] text-slate-300 hover:text-white hover:bg-white/5 border border-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Global Search and Discovery Action Bar */}
        <div className="flex items-center space-x-2">
          <div className="relative min-w-[240px] flex-1 sm:flex-initial">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="iPhone, RTX 5090, Dyson, Sony..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  handleDiscoverProduct(searchQuery);
                }
              }}
              className="w-full bg-[#050813] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors font-medium"
            />
          </div>

          <button
            type="button"
            onClick={() => handleDiscoverProduct(searchQuery)}
            disabled={isDiscovering || !searchQuery.trim()}
            className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center space-x-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            title="Katalogda olmayan bir ürünü küresel mağazalardan canlı tara"
          >
            {isDiscovering ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
            ) : (
              <Globe className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span className="hidden sm:inline">Uluslararası Canlı Tara</span>
          </button>
        </div>
      </div>

      {/* Discovery Status Banner */}
      {discoveryStatus && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center space-x-2.5">
            {isDiscovering ? (
              <Loader2 className="w-4 h-4 animate-spin text-amber-400 shrink-0" />
            ) : (
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            )}
            <span>{discoveryStatus}</span>
          </div>
          {discoveryStatus.startsWith('✓') && (
            <span className="text-[10px] font-mono-data bg-amber-500/20 px-2 py-0.5 rounded-full text-amber-300">
              Canlı Arbitraj Aktif
            </span>
          )}
        </div>
      )}

      {/* Empty State with Quick International Discovery */}
      {filteredProducts.length === 0 && !isDiscovering && (
        <div className="glass-luxury rounded-3xl p-8 sm:p-12 text-center border border-white/10 shadow-2xl space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <Globe className="w-8 h-8" />
          </div>

          <div className="max-w-md mx-auto space-y-1.5">
            <h4 className="text-lg font-bold text-white">
              "{searchQuery || 'Aradığınız Ürün'}" Yerel Listede Bulunamadı
            </h4>
            <p className="text-xs text-slate-400">
              Bu ürünü uluslararası perakende devlerinde (Amazon US, MediaMarkt DE, Bic Camera JP, Sharaf DG UAE) canlı olarak aratabilir, gümrük ve vergi iadesiyle birlikte anında arbitraj sepetinize ekleyebilirsiniz.
            </p>
          </div>

          {searchQuery.trim() && (
            <div>
              <button
                type="button"
                onClick={() => handleDiscoverProduct(searchQuery)}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 hover:scale-105 transition-all inline-flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Uluslararası Canlı Ürün Tara: "{searchQuery}"</span>
              </button>
            </div>
          )}

          {/* Quick Suggestions */}
          <div className="pt-4 border-t border-white/5 max-w-lg mx-auto">
            <span className="text-[11px] text-slate-500 block mb-2 font-mono-data">
              Veya popüler yüksek arbitraj ürünlerini hemen keşfedin:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                'RTX 5090 Suprim',
                'Dyson Airstrait',
                'MacBook Pro 16 M4 Max',
                'Sony A7R V',
                'Apple Vision Pro',
                'PlayStation 5 Pro',
              ].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleDiscoverProduct(item)}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-amber-500/10 hover:border-amber-500/30 border border-white/5 text-slate-300 hover:text-amber-200 text-xs transition-colors font-medium"
                >
                  + {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const destCountry = currentDestination?.countryCode.toUpperCase() || 'JP';
          // Find matching foreign price in the current destination
          let foreign = product.abroadPrices.find(
            (ap) => ap.countryCode.toUpperCase() === destCountry
          );
          if (!foreign && product.abroadPrices.length > 0) {
            foreign = product.abroadPrices[0];
          }

          const abroadRawTry = foreign?.priceTryConverted || 0;
          const isPhone = product.categoryCode === 'smartphones';
          const imeiFee = isPhone ? 45614 : 0;
          const trtBandrol = isPhone ? Math.round(20 * 38.9) : product.categoryCode === 'monitors' ? Math.round(10 * 38.9) : 0;

          // Estimate VAT refund for preview
          let vatRefundPct = destCountry === 'JP' ? 10 : destCountry === 'DE' ? 12.5 : destCountry === 'AE' ? 4.25 : 0;
          const vatRefundTry = Math.round(abroadRawTry * (vatRefundPct / 100));

          const netLandedCostTry = Math.round(abroadRawTry - vatRefundTry + imeiFee + trtBandrol);
          const netSavingsTry = Math.round(product.domesticPriceTry - netLandedCostTry);
          const savingsPct = Math.round((netSavingsTry / product.domesticPriceTry) * 100);
          const isProfitable = netSavingsTry > 0;
          const inBasket = basketProductIds.includes(product.id);

          return (
            <div
              key={product.id}
              className="glass-panel rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-between glass-card-hover group"
            >
              <div>
                {/* Image & Badges */}
                <div className="relative h-44 w-full bg-slate-950/80 overflow-hidden border-b border-white/5">
                  <img
                    src={product.imageUrl}
                    alt={product.modelName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

                  {/* Brand & Category Badge */}
                  <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                    <span className="bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-lg border border-white/10">
                      {product.brand}
                    </span>
                    <span className="bg-amber-500/20 backdrop-blur-md text-amber-300 text-[10px] font-medium px-2 py-0.5 rounded-md border border-amber-500/30">
                      {product.categoryName}
                    </span>
                  </div>

                  {/* Savings / Arbitrage Pill */}
                  <div className="absolute top-3 right-3">
                    {isProfitable ? (
                      <span className="bg-emerald-500/90 text-slate-950 text-xs font-black px-2.5 py-1 rounded-lg shadow-lg flex items-center space-x-1">
                        <span>+{netSavingsTry.toLocaleString('tr-TR')} ₺ Kazanç</span>
                        <span className="text-[10px] font-bold opacity-80">(%{savingsPct})</span>
                      </span>
                    ) : (
                      <span className="bg-rose-500/80 text-white text-xs font-semibold px-2.5 py-1 rounded-lg">
                        Yurt Dışı Daha Pahalı
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h4 className="text-base font-bold text-white tracking-tight leading-snug line-clamp-2">
                    {product.modelName}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">Barkod / SKU: {product.globalSku}</p>

                  {/* Price Comparison Grid */}
                  <div className="mt-4 bg-[#050813] rounded-xl p-3.5 border border-white/5 space-y-2.5 text-xs">
                    {/* Turkey Domestic */}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Türkiye Satış Fiyatı:</span>
                      <span className="text-slate-200 font-mono font-bold">
                        {product.domesticPriceTry.toLocaleString('tr-TR')} ₺
                      </span>
                    </div>

                    {/* Abroad Retail */}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">
                        Yurt Dışı ({foreign?.retailerName}):
                      </span>
                      <span className="text-slate-200 font-mono">
                        {foreign?.priceOriginal.toLocaleString()} {foreign?.currencyCode} (~{abroadRawTry.toLocaleString('tr-TR')} ₺)
                      </span>
                    </div>

                    {/* Tax Refund */}
                    {vatRefundTry > 0 && (
                      <div className="flex items-center justify-between text-emerald-400">
                        <span className="flex items-center">
                          <Tag className="w-3 h-3 mr-1" /> Tax-Free KDV İadesi (%{vatRefundPct}):
                        </span>
                        <span className="font-mono font-semibold">
                          -{vatRefundTry.toLocaleString('tr-TR')} ₺
                        </span>
                      </div>
                    )}

                    {/* Customs / IMEI fee */}
                    {isPhone ? (
                      <div className="pt-2 border-t border-white/5 space-y-1">
                        <div className="flex items-center justify-between text-amber-400 font-medium text-[11px]">
                          <span className="flex items-center">
                            <AlertTriangle className="w-3 h-3 mr-1" /> TR IMEI Kayıt Harcı:
                          </span>
                          <span className="font-mono">+{imeiFee.toLocaleString('tr-TR')} ₺</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-400 text-[10px]">
                          <span>TRT Bandrol (€20):</span>
                          <span className="font-mono">+{trtBandrol.toLocaleString('tr-TR')} ₺</span>
                        </div>
                      </div>
                    ) : (
                      <div className="pt-1 text-[11px] text-amber-300 flex items-center">
                        <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                        <span>Yolcu Beraberi Muafiyeti (Gümrük Vergisi Muaf)</span>
                      </div>
                    )}

                    {/* Net Landed Cost */}
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between font-bold">
                      <span className="text-white">Net Son Maliyet:</span>
                      <span className="text-amber-400 font-mono text-sm">
                        {netLandedCostTry.toLocaleString('tr-TR')} ₺
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => onAddToBasket(product.id)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                    inBasket
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                  }`}
                >
                  {inBasket ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Arbitraj Sepetine Eklendi ✓</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Arbitraj Sepetine Ekle</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
