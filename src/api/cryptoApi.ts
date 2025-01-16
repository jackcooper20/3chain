export interface CryptoApiClient {
  fetchPrice(symbol: string): Promise<number>;
  fetchPriceHistory(
    symbol: string,
    period: string
  ): Promise<PriceHistoryEntry[]>;
  fetchBulkPrices(symbols: string[]): Promise<Record<string, number>>;
}

export class CoinGeckoApiClient implements CryptoApiClient {
  private readonly baseUrl = "https://api.coingecko.com/api/v3";

  async fetchPrice(symbol: string): Promise<number> {
    const response = await fetch(
      `${
        this.baseUrl
      }/simple/price?ids=${symbol.toLowerCase()}&vs_currencies=usd`
    );
    const data = await response.json();
    if (!data[symbol.toLowerCase()]) {
      throw new Error("Invalid cryptocurrency");
    }
    return data[symbol.toLowerCase()].usd;
  }

  async fetchPriceHistory(
    symbol: string,
    period: string
  ): Promise<PriceHistoryEntry[]> {
    const days = this.periodToDays(period);
    const response = await fetch(
      `${
        this.baseUrl
      }/coins/${symbol.toLowerCase()}/market_chart?vs_currency=usd&days=${days}`
    );
    const data = await response.json();

    return data.prices.map(([timestamp, price]: [number, number]) => ({
      timestamp: new Date(timestamp).toISOString(),
      price,
    }));
  }

  async fetchBulkPrices(symbols: string[]): Promise<Record<string, number>> {
    const ids = symbols.map((s) => s.toLowerCase()).join(",");
    const response = await fetch(
      `${this.baseUrl}/simple/price?ids=${ids}&vs_currencies=usd`
    );
    const data = await response.json();

    return Object.fromEntries(
      Object.entries(data).map(([key, value]: [string, any]) => [
        key.toUpperCase(),
        value.usd,
      ])
    );
  }

  private periodToDays(period: string): number {
    const periods: Record<string, number> = {
      "1d": 1,
      "7d": 7,
      "30d": 30,
      "90d": 90,
      "1y": 365,
    };
    return periods[period] || 1;
  }
}
