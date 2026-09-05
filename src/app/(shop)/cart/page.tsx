import type { Metadata } from "next";
import Link from "next/link";

import { CartLineItem } from "@/components/shop/cart-line-item";
import { fetchCart, goToCheckout } from "@/lib/shopify/cart-actions";
import { formatMoney } from "@/lib/shopify/money";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Your bag",
  robots: { index: false },
};

// The cart is per-visitor and cookie-derived, so it must never be prerendered.
export const dynamic = "force-dynamic";

export default async function CartPage() {
  const cart = await fetchCart();

  if (!cart || cart.lines.length === 0) {
    return (
      <main className={styles.main}>
        <h1 className={styles.title}>Your bag</h1>
        <p className={styles.empty}>Your bag is empty.</p>
        <Link href="/collections/all" className={styles.link}>
          Continue shopping
        </Link>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Your bag</h1>

      <ul className={styles.lines}>
        {cart.lines.map((line) => (
          <CartLineItem key={line.id} line={line} />
        ))}
      </ul>

      <div className={styles.summary}>
        <dl className={styles.totals}>
          <div className={styles.totalRow}>
            <dt>Subtotal</dt>
            <dd>{formatMoney(cart.cost.subtotalAmount)}</dd>
          </div>
          {cart.cost.totalTaxAmount ? (
            <div className={styles.totalRow}>
              <dt>Tax</dt>
              <dd>{formatMoney(cart.cost.totalTaxAmount)}</dd>
            </div>
          ) : null}
          <div className={styles.totalRow} data-emphasis="true">
            <dt>Total</dt>
            <dd>{formatMoney(cart.cost.totalAmount)}</dd>
          </div>
        </dl>

        <p className={styles.note}>
          Shipping is calculated at checkout.
        </p>

        {/* Checkout is handed off to Shopify, so no payment data touches this app. */}
        <form action={goToCheckout}>
          <button type="submit" className={styles.checkout}>
            Checkout
          </button>
        </form>
      </div>
    </main>
  );
}
