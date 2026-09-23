'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '../components/Header';
import { FlightGlobeCanvas } from '../components/FlightGlobeCanvas';
import { TripPlanner } from '../components/TripPlanner';
import { TravelCostSummary } from '../components/TravelCostSummary';
import { ProductCatalog } from '../components/ProductCatalog';
import { ArbitrageBasket } from '../components/ArbitrageBasket';
import { ReverseArbitrageFinder } from '../components/ReverseArbitrageFinder';
import { CustomsInfoModal } from '../components/CustomsInfoModal';
import {
  BasketArbitrageCalculation,
  Destination,
  Product,
  TravelQuoteResponse,
  TravelStyle,
  VATRefundRule,
} from '../lib/types';
import { api } from '../lib/api';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'planner' | 'reverse' | 'customs'>('planner');
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [originAirport, setOriginAirport] = useState('IST');
  const [durationDays, setDurationDays] = useState(4);
  const [travelStyle, setTravelStyle] = useState<TravelStyle>('moderate');

  // Dates (2 weeks ahead default)
  const today = new Date();
  const defaultDep = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const defaultRet = new Date(today.getTime() + 18 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const [departureDate, setDepartureDate] = useState(defaultDep);
  const [returnDate, setReturnDate] = useState(defaultRet);

  // Data states
  const [travelQuote, setTravelQuote] = useState<TravelQuoteResponse | null>(null);
  const [isTravelLoading, setIsTravelLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  // Start with empty basket so no hardcoded test IDs trigger 500 error before user selects items
  const [basketItems, setBasketItems] = useState<{ productId: string; quantity: number }[]>([]);
  const [basketCalculation, setBasketCalculation] = useState<BasketArbitrageCalculation | null>(null);
  const [isBasketLoading, setIsBasketLoading] = useState(false);

  // Customs & VAT state
  const [vatRules, setVatRules] = useState<VATRefundRule[]>([]);
  const [isCustomsModalOpen, setIsCustomsModalOpen] = useState(false);

  // 1. Initial Data Loading
  useEffect(() => {
    // Load destinations
    api
      .getDestinations()
      .then((dests) => {
        setDestinations(dests);
        if (dests.length > 0) {
          setSelectedDestination(dests[0]); // Tokyo by default
        }
      })
      .catch((err) => console.error('Failed to load destinations:', err));

    // Load products
    api
      .getProducts()
      .then((prods) => setProducts(prods))
      .catch((err) => console.error('Failed to load products:', err));

    // Load VAT rules
    api
      .getVatRules()
      .then((rules) => setVatRules(rules))
      .catch((err) => console.error('Failed to load VAT rules:', err));
  }, []);

  // 2. Fetch Travel Quote when destination, dates, or travel style change
  const refreshTravelQuote = useCallback(async () => {
    if (!selectedDestination) return;
    setIsTravelLoading(true);

    try {
      const quote = await api.getTravelQuote({
        originAirport,
        destinationAirport: selectedDestination.primaryAirportCode,
        departureDate,
        returnDate,
        durationDays,
        travelStyle,
      });
      setTravelQuote(quote);
    } catch (err) {
      console.error('Failed to get travel quote:', err);
    } finally {
      setIsTravelLoading(false);
    }
  }, [selectedDestination, originAirport, departureDate, returnDate, durationDays, travelStyle]);

  useEffect(() => {
    refreshTravelQuote();
  }, [refreshTravelQuote]);

  // 3. Recalculate Basket Arbitrage when basket items or travel parameters change
  useEffect(() => {
    if (!selectedDestination || basketItems.length === 0) {
      setBasketCalculation(null);
      return;
    }

    setIsBasketLoading(true);
    api
      .calculateBasketArbitrage(
        {
          originAirport,
          destinationAirport: selectedDestination.primaryAirportCode,
          departureDate,
          returnDate,
          durationDays,
          travelStyle,
        },
        basketItems
      )
      .then((calc) => {
        setBasketCalculation(calc);
      })
      .catch((err) => {
        console.error('Failed to calculate basket arbitrage:', err);
      })
      .finally(() => {
        setIsBasketLoading(false);
      });
  }, [selectedDestination, originAirport, departureDate, returnDate, durationDays, travelStyle, basketItems]);

  // Dynamic Date and Duration Handlers to keep days and dates synchronized
  const handleDepartureDateChange = (newDep: string) => {
    setDepartureDate(newDep);
    if (!newDep) return;
    const d1 = new Date(newDep);
    const d2 = new Date(returnDate);
    if (isNaN(d1.getTime())) return;

    if (isNaN(d2.getTime()) || d2.getTime() <= d1.getTime()) {
      const newRet = new Date(d1.getTime() + durationDays * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];
      setReturnDate(newRet);
    } else {
      const diffDays = Math.max(1, Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)));
      setDurationDays(diffDays);
    }
  };

  const handleReturnDateChange = (newRet: string) => {
    setReturnDate(newRet);
    if (!newRet) return;
    const d1 = new Date(departureDate);
    const d2 = new Date(newRet);
    if (isNaN(d2.getTime())) return;

    if (isNaN(d1.getTime()) || d2.getTime() <= d1.getTime()) {
      const adjustedRet = new Date(d1.getTime() + 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];
      setReturnDate(adjustedRet);
      setDurationDays(1);
    } else {
      const diffDays = Math.max(1, Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)));
      setDurationDays(diffDays);
    }
  };

  const handleDurationChange = (days: number) => {
    const validDays = Math.max(1, days);
    setDurationDays(validDays);
    const d1 = new Date(departureDate);
    if (!isNaN(d1.getTime())) {
      const newRet = new Date(d1.getTime() + validDays * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];
      setReturnDate(newRet);
    }
  };

  const handleProductDiscovered = (newProduct: Product) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === newProduct.id);
      if (exists) return prev;
      return [newProduct, ...prev];
    });
  };

  // Basket Handlers
  const handleAddToBasket = (productId: string) => {
    setBasketItems((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.filter((item) => item.productId !== productId);
      } else {
        return [...prev, { productId, quantity: 1 }];
      }
    });
  };

  const handleRemoveFromBasket = (productId: string) => {
    setBasketItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setBasketItems((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity } : item))
    );
  };

  const handleSelectDeal = (airportCode: string, productId: string) => {
    // 1. Automatically add product to basket if not already there
    if (productId) {
      setBasketItems((prev) => {
        if (prev.some((item) => item.productId === productId)) {
          return prev;
        }
        return [...prev, { productId, quantity: 1 }];
      });
    }

    // 2. Set the destination
    const found = destinations.find((d) => d.primaryAirportCode === airportCode);
    if (found) {
      setSelectedDestination(found);
    }

    // 3. Switch to planner tab so the basket calculation and route are immediately active
    setActiveTab('planner');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#03050a] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenCustomsModal={() => setIsCustomsModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {activeTab === 'planner' && (
          <>
            {/* 3D Celestial Flight Globe Canvas (Hero Experience) */}
            <section>
              <FlightGlobeCanvas
                originAirport={originAirport}
                selectedDestinationAirport={selectedDestination?.primaryAirportCode || 'NRT'}
                onSelectDestination={(code) => handleSelectDeal(code, '')}
              />
            </section>

            {/* Step 1: Trip Planner & Route Selection */}
            <section>
              <TripPlanner
                destinations={destinations}
                selectedDestination={selectedDestination}
                onSelectDestination={setSelectedDestination}
                originAirport={originAirport}
                onChangeOrigin={setOriginAirport}
                durationDays={durationDays}
                onChangeDuration={handleDurationChange}
                travelStyle={travelStyle}
                onChangeTravelStyle={setTravelStyle}
                departureDate={departureDate}
                onChangeDepartureDate={handleDepartureDateChange}
                returnDate={returnDate}
                onChangeReturnDate={handleReturnDateChange}
                isLoading={isTravelLoading}
              />
            </section>

            {/* Travel Cost Summary */}
            <section>
              <TravelCostSummary quote={travelQuote} isLoading={isTravelLoading} />
            </section>

            {/* Arbitrage Basket & Holiday Offset Meter (Sticky/Prominent) */}
            <section>
              <ArbitrageBasket
                calculation={basketCalculation}
                basketItems={basketItems}
                products={products}
                onRemoveItem={handleRemoveFromBasket}
                onUpdateQuantity={handleUpdateQuantity}
                isLoading={isBasketLoading}
              />
            </section>

            {/* Product Catalog */}
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
                <div>
                  <div className="text-[10px] uppercase font-mono-data tracking-widest text-amber-400/80 mb-0.5">
                    SINIR ÖTESİ ARBİTRAJ KATALOĞU
                  </div>
                  <h3 className="text-xl sm:text-2xl font-editorial tracking-wide text-white">
                    {selectedDestination?.cityName || 'Yurt Dışı'} Alışveriş & Fiyat Arbitrajı
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 font-mono-data">
                    Türkiye perakende fiyatları ile {selectedDestination?.cityName} mağaza fiyatları, tax-free KDV iadesi ve gümrük harçları
                  </p>
                </div>
              </div>

              <ProductCatalog
                products={products}
                currentDestination={selectedDestination}
                onAddToBasket={handleAddToBasket}
                basketProductIds={basketItems.map((b) => b.productId)}
                onProductDiscovered={handleProductDiscovered}
              />
            </section>
          </>
        )}

        {activeTab === 'reverse' && (
          <ReverseArbitrageFinder
            products={products}
            onSelectDeal={handleSelectDeal}
            onAddToBasket={handleAddToBasket}
            basketProductIds={basketItems.map((b) => b.productId)}
          />
        )}

        {activeTab === 'customs' && (
          <div className="space-y-6">
            <div className="glass-luxury rounded-3xl p-8 border border-white/10 shadow-2xl">
              <div className="text-[10px] uppercase font-mono-data tracking-widest text-amber-400/80 mb-1">
                MEVZUAT & YASAL ZIRH
              </div>
              <h2 className="text-2xl sm:text-3xl font-editorial text-white mb-2 tracking-wide">
                Gümrük Mevzuatı & Uluslararası Tax-Free Rehberi
              </h2>
              <p className="text-xs text-slate-400 mb-6 font-mono-data">
                Yurt dışı havalimanı vergi iade masası prosedürleri ve T.C. Ticaret Bakanlığı 2025/2026 yolcu beraberi muafiyet kuralları.
              </p>
              <CustomsInfoModal
                isOpen={true}
                onClose={() => setActiveTab('planner')}
                vatRules={vatRules}
              />
            </div>
          </div>
        )}
      </main>

      {/* Floating Customs Modal */}
      <CustomsInfoModal
        isOpen={isCustomsModalOpen}
        onClose={() => setIsCustomsModalOpen(false)}
        vatRules={vatRules}
      />

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#020307] py-10 px-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300 font-editorial font-bold text-xs">
              T
            </div>
            <span className="font-editorial text-slate-300 tracking-wider">
              TATİL'ER • Küresel Arbitraj & Uçuş Koridorları
            </span>
          </div>
          <div className="font-mono-data text-[11px] text-slate-500 text-center sm:text-right">
            Live Providers: Google Flights (SerpApi), Booking.com, European Central Bank (ECB), T.C. Ticaret Bakanlığı.
          </div>
        </div>
      </footer>
    </div>
  );
}
