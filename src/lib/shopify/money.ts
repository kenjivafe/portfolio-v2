import type { Money } from "./types";

/**
 * Formats a Storefront API money value. Shopify returns `amount` as a decimal
 * string, which must not be parsed into a float for arithmetic — this is
 * display only.
 */
export function formatMoney(money: Money, locale = "en-US"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: money.currencyCode,
  }).format(Number(money.amount));
}

/** True when the product is discounted relative to its compare-at price. */
export function isOnSale(price: Money, compareAtPrice: Money | null): boolean {
  if (!compareAtPrice) return false;
  return Number(compareAtPrice.amount) > Number(price.amount);
}
