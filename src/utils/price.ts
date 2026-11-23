// Turns a price label such as "$29.99" or "Item total: $39.98" into the number 29.99 / 39.98.
export function parsePrice(text: string): number {
  const match = text.match(/\$(\d+(?:\.\d+)?)/);
  if (!match) {
    throw new Error(`No price found in "${text}"`);
  }
  return Number(match[1]);
}

// Adds prices and rounds to cents, avoiding floating-point results like 39.980000000000004.
export function sumPrices(prices: number[]): number {
  const total = prices.reduce((sum, price) => sum + price, 0);
  return Math.round(total * 100) / 100;
}
