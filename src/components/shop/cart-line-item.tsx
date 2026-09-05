"use client";

import { useActionState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  removeItem,
  updateItemQuantity,
  type CartActionState,
} from "@/lib/shopify/cart-actions";
import { formatMoney } from "@/lib/shopify/money";
import type { CartLine } from "@/lib/shopify/types";

import styles from "./cart-line-item.module.css";

const EMPTY: CartActionState = { error: null };

export function CartLineItem({ line }: { line: CartLine }) {
  const [updateState, updateAction] = useActionState(updateItemQuantity, EMPTY);
  const [removeState, removeAction] = useActionState(removeItem, EMPTY);

  const image = line.merchandise.product.featuredImage;
  // Shopify emits "Default Title" for products without real variants.
  const variantLabel =
    line.merchandise.title === "Default Title" ? null : line.merchandise.title;
  const error = updateState.error ?? removeState.error;

  return (
    <li className={styles.row}>
      <Link href={`/products/${line.merchandise.product.handle}`} className={styles.thumb}>
        {image ? (
          <Image
            src={image.url}
            alt={image.altText ?? line.merchandise.product.title}
            width={image.width}
            height={image.height}
            className={styles.image}
            sizes="96px"
          />
        ) : (
          <span className={styles.placeholder} aria-hidden="true" />
        )}
      </Link>

      <div className={styles.info}>
        <Link href={`/products/${line.merchandise.product.handle}`} className={styles.name}>
          {line.merchandise.product.title}
        </Link>
        {variantLabel ? <p className={styles.variant}>{variantLabel}</p> : null}

        <div className={styles.controls}>
          <form action={updateAction} className={styles.quantityForm}>
            <input type="hidden" name="lineId" value={line.id} />
            <input type="hidden" name="merchandiseId" value={line.merchandise.id} />
            <label htmlFor={`qty-${line.id}`} className={styles.srOnly}>
              Quantity for {line.merchandise.product.title}
            </label>
            <input
              id={`qty-${line.id}`}
              type="number"
              name="quantity"
              min={1}
              defaultValue={line.quantity}
              className={styles.quantity}
            />
            <button type="submit" className={styles.textButton}>
              Update
            </button>
          </form>

          <form action={removeAction}>
            <input type="hidden" name="lineId" value={line.id} />
            <button type="submit" className={styles.textButton}>
              Remove
            </button>
          </form>
        </div>

        {error ? (
          <p role="alert" className={styles.error}>
            {error}
          </p>
        ) : null}
      </div>

      <p className={styles.lineTotal}>{formatMoney(line.cost.totalAmount)}</p>
    </li>
  );
}
