"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { addItem, type CartActionState } from "@/lib/shopify/cart-actions";
import type { ProductVariant } from "@/lib/shopify/types";

import styles from "./add-to-cart.module.css";

function SubmitButton({ disabled, label }: { disabled: boolean; label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={styles.button} disabled={disabled || pending}>
      {pending ? "Adding…" : label}
    </button>
  );
}

export function AddToCart({ variant }: { variant: ProductVariant | undefined }) {
  const [state, formAction] = useActionState<CartActionState, FormData>(addItem, {
    error: null,
  });

  const soldOut = !variant?.availableForSale;

  return (
    <form action={formAction} className={styles.form}>
      <input type="hidden" name="merchandiseId" value={variant?.id ?? ""} />
      <input type="hidden" name="quantity" value="1" />
      <SubmitButton
        disabled={!variant || soldOut}
        label={soldOut ? "Sold out" : "Add to bag"}
      />
      {state.error ? (
        <p role="alert" className={styles.error}>
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
