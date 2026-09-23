import axios from 'axios';
import { config } from '../config';

export interface AirportItem {
  code: string;
  name: string;
  cityName: string;
  countryName: string;
  countryCode: string;
  isPopular?: boolean;
  photoUri?: string;
}

export const GLOBAL_AIRPORTS: AirportItem[] = [
  // Turkey Hubs & Regional Civil Airports
  { code: 'IST', name: 'Istanbul Havalimanı', cityName: 'Istanbul', countryName: 'Turkey', countryCode: 'TR', isPopular: true },
  { code: 'SAW', name: 'Sabiha Gökçen Havalimanı', cityName: 'Istanbul', countryName: 'Turkey', countryCode: 'TR', isPopular: true },
  { code: 'ESB', name: 'Esenboğa Havalimanı', cityName: 'Ankara', countryName: 'Turkey', countryCode: 'TR', isPopular: true },
  { code: 'ADB', name: 'Adnan Menderes Havalimanı', cityName: 'Izmir', countryName: 'Turkey', countryCode: 'TR', isPopular: true },
  { code: 'AYT', name: 'Antalya Havalimanı', cityName: 'Antalya', countryName: 'Turkey', countryCode: 'TR', isPopular: true },
  { code: 'VAS', name: 'Sivas Nuri Demirağ Havalimanı', cityName: 'Sivas', countryName: 'Turkey', countryCode: 'TR', isPopular: true },
  { code: 'SZF', name: 'Samsun Çarşamba Havalimanı', cityName: 'Samsun', countryName: 'Turkey', countryCode: 'TR', isPopular: true },
  { code: 'ERC', name: 'Erzincan Yıldırım Akbulut Havalimanı', cityName: 'Erzincan', countryName: 'Turkey', countryCode: 'TR', isPopular: true },
  { code: 'ERZ', name: 'Erzurum Havalimanı', cityName: 'Erzurum', countryName: 'Turkey', countryCode: 'TR', isPopular: true },
  { code: 'TZX', name: 'Trabzon Havalimanı', cityName: 'Trabzon', countryName: 'Turkey', countryCode: 'TR', isPopular: true },
  { code: 'ASR', name: 'Kayseri Havalimanı', cityName: 'Kayseri', countryName: 'Turkey', countryCode: 'TR', isPopular: true },
  { code: 'KYA', name: 'Konya Havalimanı', cityName: 'Konya', countryName: 'Turkey', countryCode: 'TR', isPopular: true },
  { code: 'MLX', name: 'Malatya Havalimanı', cityName: 'Malatya', countryName: 'Turkey', countryCode: 'TR', isPopular: true },
  { code: 'VAN', name: 'Van Ferit Melen Havalimanı', cityName: 'Van', countryName: 'Turkey', countryCode: 'TR', isPopular: true },
  { code: 'DIY', name: 'Diyarbakır Havalimanı', cityName: 'Diyarbakır', countryName: 'Turkey', countryCode: 'TR', isPopular: true },
  { code: 'GZT', name: 'Gaziantep Havalimanı', cityName: 'Gaziantep', countryName: 'Turkey', countryCode: 'TR', isPopular: true },
  { code: 'COV', name: 'Çukurova Uluslararası Havalimanı', cityName: 'Adana / Mersin', countryName: 'Turkey', countryCode: 'TR', isPopular: true },
  { code: 'ADA', name: 'Adana Şakirpaşa Havalimanı', cityName: 'Adana', countryName: 'Turkey', countryCode: 'TR' },
  { code: 'HTY', name: 'Hatay Havalimanı', cityName: 'Hatay', countryName: 'Turkey', countryCode: 'TR' },
  { code: 'GNY', name: 'Şanlıurfa GAP Havalimanı', cityName: 'Şanlıurfa', countryName: 'Turkey', countryCode: 'TR' },
  { code: 'MQM', name: 'Mardin Aziz Sancar Havalimanı', cityName: 'Mardin', countryName: 'Turkey', countryCode: 'TR' },
  { code: 'BAL', name: 'Batman Havalimanı', cityName: 'Batman', countryName: 'Turkey', countryCode: 'TR' },
  { code: 'KCM', name: 'Kahramanmaraş Havalimanı', cityName: 'Kahramanmaraş', countryName: 'Turkey', countryCode: 'TR' },
  { code: 'AJI', name: 'Ağrı Ahmed-i Hani Havalimanı', cityName: 'Ağrı', countryName: 'Turkey', countryCode: 'TR' },
  { code: 'KSG', name: 'Kars Harakani Havalimanı', cityName: 'Kars', countryName: 'Turkey', countryCode: 'TR' },
  { code: 'IGL', name: 'Iğdır Şehit Bülent Aydın Havalimanı', cityName: 'Iğdır', countryName: 'Turkey', countryCode: 'TR' },
  { code: 'MZH', name: 'Amasya Merzifon Havalimanı', cityName: 'Amasya', countryName: 'Turkey', countryCode: 'TR' },
  { code: 'DLM', name: 'Dalaman Havalimanı', cityName: 'Muğla / Dalaman', countryName: 'Turkey', countryCode: 'TR' },
  { code: 'BJV', name: 'Milas-Bodrum Havalimanı', cityName: 'Bodrum', countryName: 'Turkey', countryCode: 'TR' },
  { code: 'DNZ', name: 'Denizli Çardak Havalimanı', cityName: 'Denizli', countryName: 'Turkey', countryCode: 'TR' },
  { code: 'EDO', name: 'Balıkesir Koca Seyit Havalimanı', cityName: 'Edremit / Balıkesir', countryName: 'Turkey', countryCode: 'TR' },
  { code: 'RZV', name: 'Rize-Artvin Havalimanı', cityName: 'Rize', countryName: 'Turkey', countryCode: 'TR' },
  { code: 'OGU', name: 'Ordu-Giresun Havalimanı', cityName: 'Ordu / Giresun', countryName: 'Turkey', countryCode: 'TR' },
  { code: 'NAV', name: 'Nevşehir Kapadokya Havalimanı', cityName: 'Nevşehir', countryName: 'Turkey', countryCode: 'TR' },
  { code: 'TEQ', name: 'Tekirdağ Çorlu Havalimanı', cityName: 'Tekirdağ', countryName: 'Turkey', countryCode: 'TR' },
  { code: 'ONQ', name: 'Zonguldak Çaycuma Havalimanı', cityName: 'Zonguldak', countryName: 'Turkey', countryCode: 'TR' },
  { code: 'CKZ', name: 'Çanakkale Havalimanı', cityName: 'Çanakkale', countryName: 'Turkey', countryCode: 'TR' },
  { code: 'KFS', name: 'Kastamonu Havalimanı', cityName: 'Kastamonu', countryName: 'Turkey', countryCode: 'TR' },
  { code: 'NOP', name: 'Sinop Havalimanı', cityName: 'Sinop', countryName: 'Turkey', countryCode: 'TR' },
  { code: 'USQ', name: 'Uşak Havalimanı', cityName: 'Uşak', countryName: 'Turkey', countryCode: 'TR' },
  { code: 'AOE', name: 'Eskişehir Hasan Polatkan Havalimanı', cityName: 'Eskişehir', countryName: 'Turkey', countryCode: 'TR' },
  { code: 'GZP', name: 'Gazipaşa Alanya Havalimanı', cityName: 'Alanya', countryName: 'Turkey', countryCode: 'TR' },
  { code: 'YKO', name: 'Yüksekova Selahaddin Eyyubi Havalimanı', cityName: 'Hakkari', countryName: 'Turkey', countryCode: 'TR' },
  { code: 'NKT', name: 'Şırnak Şerafettin Elçi Havalimanı', cityName: 'Şırnak', countryName: 'Turkey', countryCode: 'TR' },

  // Japan
  { code: 'NRT', name: 'Narita International Airport', cityName: 'Tokyo', countryName: 'Japan', countryCode: 'JP', isPopular: true },
  { code: 'HND', name: 'Haneda Airport', cityName: 'Tokyo', countryName: 'Japan', countryCode: 'JP', isPopular: true },
  { code: 'KIX', name: 'Kansai International Airport', cityName: 'Osaka', countryName: 'Japan', countryCode: 'JP' },

  // Germany & Central Europe
  { code: 'BER', name: 'Berlin Brandenburg Airport', cityName: 'Berlin', countryName: 'Germany', countryCode: 'DE', isPopular: true },
  { code: 'FRA', name: 'Frankfurt Airport', cityName: 'Frankfurt', countryName: 'Germany', countryCode: 'DE', isPopular: true },
  { code: 'MUC', name: 'Munich Airport', cityName: 'Munich', countryName: 'Germany', countryCode: 'DE', isPopular: true },
  { code: 'HAM', name: 'Hamburg Airport', cityName: 'Hamburg', countryName: 'Germany', countryCode: 'DE' },
  { code: 'DUS', name: 'Düsseldorf Airport', cityName: 'Düsseldorf', countryName: 'Germany', countryCode: 'DE' },
  { code: 'VIE', name: 'Vienna International Airport', cityName: 'Vienna', countryName: 'Austria', countryCode: 'AT', isPopular: true },
  { code: 'ZRH', name: 'Zurich Airport', cityName: 'Zurich', countryName: 'Switzerland', countryCode: 'CH', isPopular: true },
  { code: 'GVA', name: 'Geneva Airport', cityName: 'Geneva', countryName: 'Switzerland', countryCode: 'CH' },
  { code: 'WAW', name: 'Warsaw Chopin Airport', cityName: 'Warsaw', countryName: 'Poland', countryCode: 'PL', isPopular: true },
  { code: 'PRG', name: 'Václav Havel Airport', cityName: 'Prague', countryName: 'Czechia', countryCode: 'CZ', isPopular: true },
  { code: 'BUD', name: 'Budapest Ferenc Liszt Airport', cityName: 'Budapest', countryName: 'Hungary', countryCode: 'HU' },

  // United Arab Emirates & Middle East
  { code: 'DXB', name: 'Dubai International Airport', cityName: 'Dubai', countryName: 'United Arab Emirates', countryCode: 'AE', isPopular: true },
  { code: 'DWC', name: 'Al Maktoum International Airport', cityName: 'Dubai', countryName: 'United Arab Emirates', countryCode: 'AE' },
  { code: 'AUH', name: 'Zayed International Airport', cityName: 'Abu Dhabi', countryName: 'United Arab Emirates', countryCode: 'AE', isPopular: true },
  { code: 'DOH', name: 'Hamad International Airport', cityName: 'Doha', countryName: 'Qatar', countryCode: 'QA', isPopular: true },
  { code: 'RUH', name: 'King Khalid International Airport', cityName: 'Riyadh', countryName: 'Saudi Arabia', countryCode: 'SA' },
  { code: 'JED', name: 'King Abdulaziz International Airport', cityName: 'Jeddah', countryName: 'Saudi Arabia', countryCode: 'SA' },

  // United Kingdom & Ireland
  { code: 'LHR', name: 'Heathrow Airport', cityName: 'London', countryName: 'United Kingdom', countryCode: 'GB', isPopular: true },
  { code: 'LGW', name: 'Gatwick Airport', cityName: 'London', countryName: 'United Kingdom', countryCode: 'GB', isPopular: true },
  { code: 'STN', name: 'Stansted Airport', cityName: 'London', countryName: 'United Kingdom', countryCode: 'GB' },
  { code: 'MAN', name: 'Manchester Airport', cityName: 'Manchester', countryName: 'United Kingdom', countryCode: 'GB' },
  { code: 'EDI', name: 'Edinburgh Airport', cityName: 'Edinburgh', countryName: 'United Kingdom', countryCode: 'GB' },
  { code: 'DUB', name: 'Dublin Airport', cityName: 'Dublin', countryName: 'Ireland', countryCode: 'IE', isPopular: true },

  // United States & Canada
  { code: 'JFK', name: 'John F. Kennedy International Airport', cityName: 'New York', countryName: 'United States', countryCode: 'US', isPopular: true },
  { code: 'EWR', name: 'Newark Liberty International Airport', cityName: 'New York / Newark', countryName: 'United States', countryCode: 'US', isPopular: true },
  { code: 'LGA', name: 'LaGuardia Airport', cityName: 'New York', countryName: 'United States', countryCode: 'US' },
  { code: 'LAX', name: 'Los Angeles International Airport', cityName: 'Los Angeles', countryName: 'United States', countryCode: 'US', isPopular: true },
  { code: 'SFO', name: 'San Francisco International Airport', cityName: 'San Francisco', countryName: 'United States', countryCode: 'US', isPopular: true },
  { code: 'ORD', name: 'O\'Hare International Airport', cityName: 'Chicago', countryName: 'United States', countryCode: 'US', isPopular: true },
  { code: 'MIA', name: 'Miami International Airport', cityName: 'Miami', countryName: 'United States', countryCode: 'US', isPopular: true },
  { code: 'BOS', name: 'Boston Logan International Airport', cityName: 'Boston', countryName: 'United States', countryCode: 'US' },
  { code: 'YYZ', name: 'Toronto Pearson International Airport', cityName: 'Toronto', countryName: 'Canada', countryCode: 'CA', isPopular: true },
  { code: 'YVR', name: 'Vancouver International Airport', cityName: 'Vancouver', countryName: 'Canada', countryCode: 'CA' },

  // Western & Southern Europe
  { code: 'CDG', name: 'Charles de Gaulle Airport', cityName: 'Paris', countryName: 'France', countryCode: 'FR', isPopular: true },
  { code: 'ORY', name: 'Orly Airport', cityName: 'Paris', countryName: 'France', countryCode: 'FR' },
  { code: 'NCE', name: 'Nice Côte d\'Azur Airport', cityName: 'Nice', countryName: 'France', countryCode: 'FR' },
  { code: 'AMS', name: 'Amsterdam Airport Schiphol', cityName: 'Amsterdam', countryName: 'Netherlands', countryCode: 'NL', isPopular: true },
  { code: 'BRU', name: 'Brussels Airport', cityName: 'Brussels', countryName: 'Belgium', countryCode: 'BE' },
  { code: 'FCO', name: 'Leonardo da Vinci–Fiumicino Airport', cityName: 'Rome', countryName: 'Italy', countryCode: 'IT', isPopular: true },
  { code: 'MXP', name: 'Milan Malpensa Airport', cityName: 'Milan', countryName: 'Italy', countryCode: 'IT', isPopular: true },
  { code: 'BGY', name: 'Orio al Serio Airport (Milan Bergamo)', cityName: 'Milan', countryName: 'Italy', countryCode: 'IT' },
  { code: 'MAD', name: 'Adolfo Suárez Madrid–Barajas Airport', cityName: 'Madrid', countryName: 'Spain', countryCode: 'ES', isPopular: true },
  { code: 'BCN', name: 'Josep Tarradellas Barcelona-El Prat Airport', cityName: 'Barcelona', countryName: 'Spain', countryCode: 'ES', isPopular: true },
  { code: 'LIS', name: 'Humberto Delgado Airport', cityName: 'Lisbon', countryName: 'Portugal', countryCode: 'PT', isPopular: true },
  { code: 'ATH', name: 'Athens International Airport', cityName: 'Athens', countryName: 'Greece', countryCode: 'GR', isPopular: true },

  // Georgia & Caucasus
  { code: 'TBS', name: 'Tbilisi International Airport', cityName: 'Tbilisi', countryName: 'Georgia', countryCode: 'GE', isPopular: true },
  { code: 'BUS', name: 'Batumi International Airport', cityName: 'Batumi', countryName: 'Georgia', countryCode: 'GE', isPopular: true },
  { code: 'GYD', name: 'Heydar Aliyev International Airport', cityName: 'Baku', countryName: 'Azerbaijan', countryCode: 'AZ', isPopular: true },

  // Asia Pacific
  { code: 'SIN', name: 'Singapore Changi Airport', cityName: 'Singapore', countryName: 'Singapore', countryCode: 'SG', isPopular: true },
  { code: 'ICN', name: 'Incheon International Airport', cityName: 'Seoul', countryName: 'South Korea', countryCode: 'KR', isPopular: true },
  { code: 'BKK', name: 'Suvarnabhumi Airport', cityName: 'Bangkok', countryName: 'Thailand', countryCode: 'TH', isPopular: true },
  { code: 'HKG', name: 'Hong Kong International Airport', cityName: 'Hong Kong', countryName: 'Hong Kong', countryCode: 'HK', isPopular: true },
  { code: 'SYD', name: 'Sydney Kingsford Smith Airport', cityName: 'Sydney', countryName: 'Australia', countryCode: 'AU', isPopular: true },
];

function normalizeText(text: string): string {
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
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export class AirportService {
  public static async searchAirports(query?: string): Promise<AirportItem[]> {
    if (!query || query.trim().length === 0) {
      return GLOBAL_AIRPORTS.filter((a) => a.isPopular);
    }

    const cleanQ = normalizeText(query);

    // 1. Instant local match
    const localMatches = GLOBAL_AIRPORTS.filter((a) => {
      return (
        normalizeText(a.code).includes(cleanQ) ||
        normalizeText(a.cityName).includes(cleanQ) ||
        normalizeText(a.countryName).includes(cleanQ) ||
        normalizeText(a.name).includes(cleanQ)
      );
    });

    // 2. If RapidAPI key is configured, also query live RapidAPI bookingcom/auto-complete
    if (config.rapidApi.key && query.trim().length >= 2) {
      try {
        const url = `https://${config.rapidApi.host}/bookingcom/auto-complete`;
        const response = await axios.get(url, {
          headers: {
            'x-rapidapi-host': config.rapidApi.host,
            'x-rapidapi-key': config.rapidApi.key,
          },
          params: { query: query.trim() },
          timeout: 4000,
        });

        const rawList = response.data?.data;
        if (Array.isArray(rawList)) {
          const liveAirports: AirportItem[] = rawList
            .filter((item: any) => item.type === 'AIRPORT' || item.type === 'CITY')
            .map((item: any) => {
              // Extract standard 3-letter IATA code if available
              const cleanCode = item.code?.replace(/\.(AIRPORT|CITY)$/i, '') || item.city || item.code;
              return {
                code: cleanCode.toUpperCase(),
                name: item.name || `${item.cityName || ''} Airport`,
                cityName: item.cityName || item.name || 'City',
                countryName: item.countryName || item.country || 'Global',
                countryCode: item.country || 'GL',
                photoUri: item.photoUri,
                isPopular: false,
              };
            });

          // Merge without duplicates by code
          const seen = new Set<string>();
          const combined: AirportItem[] = [];

          for (const item of [...localMatches, ...liveAirports]) {
            if (!seen.has(item.code)) {
              seen.add(item.code);
              combined.push(item);
            }
          }

          return combined.slice(0, 25);
        }
      } catch (err: any) {
        console.warn(`[AirportService] RapidAPI auto-complete note: ${err.message}`);
      }
    }

    return localMatches.slice(0, 25);
  }

  public static getAirportByCode(code: string): AirportItem | null {
    const target = code.toUpperCase().trim();
    return GLOBAL_AIRPORTS.find((a) => a.code === target) || null;
  }
}

