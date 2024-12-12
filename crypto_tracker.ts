import axios from 'axios';
import { CRYPTO_APIKEY } from './constants';

const API_KEY = CRYPTO_APIKEY;
const BASE_URL = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest';

const portfolioCryptos: string[] = [
  'BTC', 'ETH', 'DOT', 'AXS', 'MATIC', 'GALA', 'ALU', 'PBR', 'UFO',
  'SHIB', 'ARB', 'DERC', 'FTM', 'LTC', 'PHA'
];

interface CryptoData {
  [key: string]: any; // Adjust this according to the API response structure
}

async function getCryptoData(symbol: string): Promise<CryptoData | null> {
  const headers = {
    Accept: 'application/json',
    'X-CMC_PRO_API_KEY': API_KEY,
  };

  const params = {
    symbol,
  };

  try {
    const response = await axios.get(BASE_URL, { headers, params });
    return response.data.data[symbol];
  } catch (error) {
    console.error(`Error retrieving data for ${symbol}:`, error);
    return null;
  }
}
