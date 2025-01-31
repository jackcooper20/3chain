interface PriceHistoryEntry {
  timestamp: string;
  price: number;
}

type AlertCondition = "above" | "below";

interface PriceAlert {
  price: number;
  condition: AlertCondition;
}

export class CryptoTracker {
  private trackedCryptos: string[] = [];
  private priceAlerts: Map<string, PriceAlert[]> = new Map();

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

  removePriceAlert(
    symbol: string,
    price: number,
    condition: AlertCondition
  ): void {
    const alerts = this.priceAlerts.get(symbol);
    if (!alerts) return;

    const filteredAlerts = alerts.filter(
      (alert) => !(alert.price === price && alert.condition === condition)
    );
    this.priceAlerts.set(symbol, filteredAlerts);
  }

  getPriceAlertsByCondition(
    symbol: string,
    condition: AlertCondition
  ): PriceAlert[] {
    const alerts = this.getPriceAlerts(symbol);
    return alerts.filter((alert) => alert.condition === condition);
  }

  clearAllAlerts(symbol: string): void {
    this.priceAlerts.delete(symbol);
  }

  async calculateAveragePrice(symbol: string, period: string): Promise<number> {
    const history = await this.getPriceHistory(symbol, period);
    if (history.length === 0) return 0;

    const sum = history.reduce((acc, entry) => acc + entry.price, 0);
    return sum / history.length;
  }

  // These methods would be implemented to call actual APIs
  protected async fetchPrice(symbol: string): Promise<number> {
    throw new Error("Not implemented");
  }

  protected async fetchPriceHistory(
    symbol: string,
    period: string
  ): Promise<PriceHistoryEntry[]> {
    throw new Error("Not implemented");
  }

  protected async fetchBulkPrices(
    symbols: string[]
  ): Promise<Record<string, number>> {
    throw new Error("Not implemented");
  }
}
