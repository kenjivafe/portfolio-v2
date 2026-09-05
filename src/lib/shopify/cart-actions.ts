"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { addToCart, createCart, getCart, removeFromCart, updateCart } from ".";
import type { Cart } from "./types";

const CART_COOKIE = "cartId";
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

/**
 * Reads the current cart, if the visitor has one.
 *
 * Returns null rather than creating a cart, so that merely rendering a page
 * does not mint an empty cart in Shopify for every visitor. Carts are created
 * lazily on the first add.
 */
export async function fetchCart(): Promise<Cart | null> {
  const cartId = (await cookies()).get(CART_COOKIE)?.value;
  if (!cartId) return null;

  try {
    return await getCart(cartId);
  } catch {
    // A stale or deleted cart id should not take the page down.
    return null;
  }
}

export type CartActionState = { error: string | null };

export async function addItem(
  _prevState: CartActionState,
  formData: FormData,
): Promise<CartActionState> {
  const merchandiseId = formData.get("merchandiseId");
  const quantityRaw = formData.get("quantity");

  if (typeof merchandiseId !== "string" || !merchandiseId) {
    return { error: "Please choose an option before adding to the bag." };
  }

  const quantity = Number(quantityRaw ?? 1);
  if (!Number.isInteger(quantity) || quantity < 1) {
    return { error: "Quantity must be a whole number of at least 1." };
  }

  const cookieStore = await cookies();
  const existingCartId = cookieStore.get(CART_COOKIE)?.value;

  try {
    if (existingCartId) {
      // The stored cart may have been completed or expired on Shopify's side;
      // fall through to creating a fresh one if the add fails.
      try {
        await addToCart(existingCartId, [{ merchandiseId, quantity }]);
        revalidatePath("/cart");
        return { error: null };
      } catch {
        // fall through to create
      }
    }

    const cart = await createCart([{ merchandiseId, quantity }]);
    cookieStore.set(CART_COOKIE, cart.id, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: CART_COOKIE_MAX_AGE,
    });
  } catch {
    return { error: "We could not add that to your bag. Please try again." };
  }

  revalidatePath("/cart");
  return { error: null };
}

export async function updateItemQuantity(
  _prevState: CartActionState,
  formData: FormData,
): Promise<CartActionState> {
  const lineId = formData.get("lineId");
  const merchandiseId = formData.get("merchandiseId");
  const quantity = Number(formData.get("quantity"));

  if (typeof lineId !== "string" || typeof merchandiseId !== "string") {
    return { error: "That cart line is no longer valid." };
  }
  if (!Number.isInteger(quantity) || quantity < 0) {
    return { error: "Quantity must be a whole number." };
  }

  const cartId = (await cookies()).get(CART_COOKIE)?.value;
  if (!cartId) return { error: "Your bag has expired. Please add the item again." };

  try {
    // Shopify treats a zero-quantity update as a no-op, so remove explicitly.
    if (quantity === 0) {
      await removeFromCart(cartId, [lineId]);
    } else {
      await updateCart(cartId, [{ id: lineId, merchandiseId, quantity }]);
    }
  } catch {
    return { error: "We could not update your bag. Please try again." };
  }

  revalidatePath("/cart");
  return { error: null };
}

export async function removeItem(
  _prevState: CartActionState,
  formData: FormData,
): Promise<CartActionState> {
  const lineId = formData.get("lineId");
  if (typeof lineId !== "string") {
    return { error: "That cart line is no longer valid." };
  }

  const cartId = (await cookies()).get(CART_COOKIE)?.value;
  if (!cartId) return { error: "Your bag has expired." };

  try {
    await removeFromCart(cartId, [lineId]);
  } catch {
    return { error: "We could not remove that item. Please try again." };
  }

  revalidatePath("/cart");
  return { error: null };
}

/**
 * Hands the visitor off to Shopify's hosted checkout, which keeps payments,
 * tax, and shipping entirely out of this app's scope.
 */
export async function goToCheckout(): Promise<void> {
  const cart = await fetchCart();
  if (!cart || cart.lines.length === 0) {
    redirect("/cart");
  }
  redirect(cart.checkoutUrl);
}
