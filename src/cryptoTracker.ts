interface PriceHistoryEntry {
  timestamp: string;
  price: number;
}

type AlertCondition = "above" | "below";

interface PriceAlert {
  price: number;
  condition: AlertCondition;
}

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

export interface AlertNotifier {
  notify(message: string): Promise<void>;
}

export class EmailAlertNotifier implements AlertNotifier {
  constructor(private readonly emailAddress: string) {}

  async notify(message: string): Promise<void> {
    // Implementation would send an actual email
    console.log(`Sending email to ${this.emailAddress}: ${message}`);
  }
}

export class SlackAlertNotifier implements AlertNotifier {
  constructor(private readonly webhookUrl: string) {}

  async notify(message: string): Promise<void> {
    // Implementation would send a Slack message
    console.log(`Sending Slack notification: ${message}`);
  }
}

export class CryptoTracker {
  private trackedCryptos: string[] = [];
  private priceAlerts: Map<string, PriceAlert[]> = new Map();
  private notifiers: AlertNotifier[] = [];

  constructor(
    private readonly apiClient: CryptoApiClient = new CoinGeckoApiClient()
  ) {}

  addNotifier(notifier: AlertNotifier): void {
    this.notifiers.push(notifier);
  }

  getTrackedCryptos(): string[] {
    return this.trackedCryptos;
  }

  addCrypto(symbol: string): void {
    if (!this.trackedCryptos.includes(symbol)) {
      this.trackedCryptos.push(symbol);
    }
  }

  removeCrypto(symbol: string): void {
    this.trackedCryptos = this.trackedCryptos.filter(
      (crypto) => crypto !== symbol
    );
  }

  async getPrice(symbol: string): Promise<number> {
    // Implementation would call an actual crypto API
    return this.fetchPrice(symbol);
  }

  async getPriceHistory(
    symbol: string,
    period: string
  ): Promise<PriceHistoryEntry[]> {
    // Implementation would call an actual crypto API
    return this.fetchPriceHistory(symbol, period);
  }

  calculatePriceChange(oldPrice: number, newPrice: number): number {
    return ((newPrice - oldPrice) / oldPrice) * 100;
  }

  async getAllPrices(): Promise<Record<string, number>> {
    // Implementation would call an actual crypto API
    return this.fetchBulkPrices(this.trackedCryptos);
  }

  setPriceAlert(
    symbol: string,
    price: number,
    condition: AlertCondition
  ): void {
    if (!this.priceAlerts.has(symbol)) {
      this.priceAlerts.set(symbol, []);
    }
    this.priceAlerts.get(symbol)?.push({ price, condition });
  }

  getPriceAlerts(symbol: string): PriceAlert[] {
    return this.priceAlerts.get(symbol) || [];
  }

  isPriceAlertTriggered(symbol: string, currentPrice: number): boolean {
    const alerts = this.getPriceAlerts(symbol);
    return alerts.some((alert) => {
      if (alert.condition === "above") {
        return currentPrice > alert.price;
      }
      return currentPrice < alert.price;
    });
  }

  // These methods would be implemented to call actual APIs
  protected async fetchPrice(symbol: string): Promise<number> {
    return this.apiClient.fetchPrice(symbol);
  }

  protected async fetchPriceHistory(
    symbol: string,
    period: string
  ): Promise<PriceHistoryEntry[]> {
    return this.apiClient.fetchPriceHistory(symbol, period);
  }

  protected async fetchBulkPrices(
    symbols: string[]
  ): Promise<Record<string, number>> {
    return this.apiClient.fetchBulkPrices(symbols);
  }

  async checkAlerts(): Promise<void> {
    const prices = await this.getAllPrices();

    for (const [symbol, price] of Object.entries(prices)) {
      if (this.isPriceAlertTriggered(symbol, price)) {
        const alerts = this.getPriceAlerts(symbol);
        for (const alert of alerts) {
          const message = `Alert: ${symbol} price is ${alert.condition} ${alert.price} (Current: ${price})`;
          await Promise.all(
            this.notifiers.map((notifier) => notifier.notify(message))
          );
        }
      }
    }
  }
}
