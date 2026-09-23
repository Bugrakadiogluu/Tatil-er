import {
  BasketArbitrageCalculation,
  CustomsRegulationInfo,
  Destination,
  Product,
  ReverseArbitrageDeal,
  SingleProductArbitrage,
  TravelQuoteRequest,
  TravelQuoteResponse,
  VATRefundRule,
} from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || `HTTP error! status: ${res.status}`);
  }

  const json = await res.json();
  return json.data !== undefined ? json.data : json;
}

export const api = {
  getDestinations: (): Promise<Destination[]> => {
    return fetchJson<Destination[]>('/travel/destinations');
  },

  searchAirports: (query?: string): Promise<any[]> => {
    const q = query ? `?q=${encodeURIComponent(query)}` : '';
    return fetchJson<any[]>(`/travel/airports${q}`);
  },

  getTravelQuote: (req: TravelQuoteRequest): Promise<TravelQuoteResponse> => {
    return fetchJson<TravelQuoteResponse>('/travel/quote', {
      method: 'POST',
      body: JSON.stringify(req),
    });
  },

  getMarketTickers: (): Promise<any[]> => {
    return fetchJson<any[]>('/travel/ticker');
  },

  getProducts: (category?: string, query?: string): Promise<Product[]> => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (query) params.append('q', query);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return fetchJson<Product[]>(`/products${qs}`);
  },

  getProductById: (id: string): Promise<Product> => {
    return fetchJson<Product>(`/products/${id}`);
  },

  discoverProduct: (query: string): Promise<Product[]> => {
    return fetchJson<Product[]>('/products/discover', {
      method: 'POST',
      body: JSON.stringify({ query }),
    });
  },

  calculateSingleArbitrage: (
    productId: string,
    destination: string
  ): Promise<SingleProductArbitrage> => {
    return fetchJson<SingleProductArbitrage>(
      `/arbitrage/product/${productId}?destination=${destination}`
    );
  },

  calculateBasketArbitrage: (
    travel: TravelQuoteRequest,
    items: { productId: string; quantity: number }[]
  ): Promise<BasketArbitrageCalculation> => {
    return fetchJson<BasketArbitrageCalculation>('/arbitrage/basket', {
      method: 'POST',
      body: JSON.stringify({ travel, items }),
    });
  },

  getReverseArbitrageDeals: (productId: string): Promise<ReverseArbitrageDeal[]> => {
    return fetchJson<ReverseArbitrageDeal[]>(`/arbitrage/reverse/${productId}`);
  },

  getVatRules: (): Promise<VATRefundRule[]> => {
    return fetchJson<VATRefundRule[]>('/customs/vat-rules');
  },

  getCustomsRegulations: (): Promise<CustomsRegulationInfo> => {
    return fetchJson<CustomsRegulationInfo>('/customs/regulations');
  },
};
