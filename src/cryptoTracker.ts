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
