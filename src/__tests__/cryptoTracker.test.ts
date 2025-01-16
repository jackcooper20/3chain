import { describe, expect, test, jest } from "@jest/globals";
import { CryptoTracker } from "../cryptoTracker";

describe("CryptoTracker", () => {
  let cryptoTracker: CryptoTracker;

  beforeEach(() => {
    cryptoTracker = new CryptoTracker();
  });

  test("should initialize with empty tracked cryptocurrencies", () => {
    expect(cryptoTracker.getTrackedCryptos()).toEqual([]);
  });

  test("should add cryptocurrency to tracking list", () => {
    cryptoTracker.addCrypto("BTC");
    expect(cryptoTracker.getTrackedCryptos()).toContain("BTC");
  });

  test("should remove cryptocurrency from tracking list", () => {
    cryptoTracker.addCrypto("ETH");
    cryptoTracker.removeCrypto("ETH");
    expect(cryptoTracker.getTrackedCryptos()).not.toContain("ETH");
  });

  test("should get current price for a cryptocurrency", async () => {
    const mockPrice = 50000;
    jest.spyOn(cryptoTracker, "fetchPrice").mockResolvedValue(mockPrice);

    const price = await cryptoTracker.getPrice("BTC");
    expect(price).toBe(mockPrice);
  });

  test("should throw error for invalid cryptocurrency", async () => {
    await expect(cryptoTracker.getPrice("INVALID")).rejects.toThrow(
      "Invalid cryptocurrency"
    );
  });

  test("should get price history for a cryptocurrency", async () => {
    const mockHistory = [
      { timestamp: "2024-03-20", price: 50000 },
      { timestamp: "2024-03-21", price: 51000 },
    ];
    jest
      .spyOn(cryptoTracker, "fetchPriceHistory")
      .mockResolvedValue(mockHistory);

    const history = await cryptoTracker.getPriceHistory("BTC", "1d");
    expect(history).toEqual(mockHistory);
  });

  test("should calculate price change percentage", () => {
    const oldPrice = 50000;
    const newPrice = 55000;
    const expectedChange = 10; // 10% increase

    const change = cryptoTracker.calculatePriceChange(oldPrice, newPrice);
    expect(change).toBe(expectedChange);
  });

  test("should get multiple crypto prices simultaneously", async () => {
    const mockPrices = {
      BTC: 50000,
      ETH: 3000,
    };
    jest.spyOn(cryptoTracker, "fetchBulkPrices").mockResolvedValue(mockPrices);

    cryptoTracker.addCrypto("BTC");
    cryptoTracker.addCrypto("ETH");

    const prices = await cryptoTracker.getAllPrices();
    expect(prices).toEqual(mockPrices);
  });

  test("should set price alert", () => {
    cryptoTracker.setPriceAlert("BTC", 60000, "above");
    const alerts = cryptoTracker.getPriceAlerts("BTC");

    expect(alerts).toContainEqual({
      price: 60000,
      condition: "above",
    });
  });

  test("should check if price alert is triggered", () => {
    cryptoTracker.setPriceAlert("BTC", 60000, "above");

    expect(cryptoTracker.isPriceAlertTriggered("BTC", 65000)).toBe(true);
    expect(cryptoTracker.isPriceAlertTriggered("BTC", 55000)).toBe(false);
  });
});
