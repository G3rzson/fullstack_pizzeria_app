export function priceFormatter(price: number): string {
  return price.toLocaleString("hu-HU", {
    style: "currency",
    currency: "HUF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}
