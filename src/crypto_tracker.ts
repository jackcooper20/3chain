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

type CryptoQuote = {
  USD: {
    price: number;
    percent_change_1h: number;
    percent_change_24h: number;
    percent_change_7d: number;
    market_cap: number;
  };
};

type CryptoInfo = {
  name: string;
  symbol: string;
  quote: CryptoQuote;
};

const portfolioCryptos: string[] = ["BTC", "ETH", "DOGE"]; // Example crypto symbols

// Placeholder function to fetch crypto data for a given symbol
function getCryptoData(symbol: string): CryptoInfo | null {
  // Implementation of this function should return data or null if not found
  return null;
}

function getCryptoPrices(): string {
  const cryptoData: CryptoInfo[] = [];
  
  // Fetch data for each crypto symbol in the portfolio
  for (const cryptoSymbol of portfolioCryptos) {
    const cryptoInfo = getCryptoData(cryptoSymbol);
    if (cryptoInfo) {
      cryptoData.push(cryptoInfo);
    }
  }

  let response = "";

  // Generate response string for each crypto
  for (const crypto of cryptoData) {
    const { name, symbol } = crypto;
    const { price, percent_change_1h, percent_change_24h, percent_change_7d, market_cap } = crypto.quote.USD;

    response += `${name} (${symbol}):\n`;
    response += `Current Price: $${price.toFixed(2)}\n`;
    response += `Percent Change (1 hour): ${percent_change_1h.toFixed(2)}%\n`;
    response += `Percent Change (24 hours): ${percent_change_24h.toFixed(2)}%\n`;
    response += `Percent Change (7 days): ${percent_change_7d.toFixed(2)}%\n`;
    response += `Market Cap: $${market_cap.toFixed(2)}\n\n`;
  }

  return response;
}
