import "server-only";

import { shopifyFetch, TAGS } from "./client";
import {
  addToCartMutation,
  createCartMutation,
  getCartQuery,
  getCollectionProductsQuery,
  getCollectionQuery,
  getCollectionsQuery,
  getProductHandlesQuery,
  getProductQuery,
  getProductsQuery,
  removeFromCartMutation,
  updateCartMutation,
} from "./queries";
import type {
  Cart,
  Collection,
  Connection,
  Product,
  ShopifyCart,
  ShopifyProduct,
} from "./types";

function flatten<T>(connection: Connection<T> | null | undefined): T[] {
  return connection?.edges.map((edge) => edge.node) ?? [];
}

function reshapeProduct(product: ShopifyProduct | null): Product | null {
  if (!product) return null;
  return {
    ...product,
    variants: flatten(product.variants),
    images: flatten(product.images),
  };
}

function reshapeCart(cart: ShopifyCart | null): Cart | null {
  if (!cart) return null;
  return { ...cart, lines: flatten(cart.lines) };
}

/* ------------------------------------------------------------------ */
/* Catalog reads — cached and tag-invalidated                          */
/* ------------------------------------------------------------------ */

export async function getProduct(handle: string): Promise<Product | null> {
  const data = await shopifyFetch<{ product: ShopifyProduct | null }>({
    query: getProductQuery,
    variables: { handle },
    tags: [TAGS.products],
  });
  return reshapeProduct(data.product);
}

export async function getProducts({
  first = 24,
  sortKey,
  reverse,
  query,
}: {
  first?: number;
  sortKey?: string;
  reverse?: boolean;
  query?: string;
} = {}): Promise<Product[]> {
  const data = await shopifyFetch<{ products: Connection<ShopifyProduct> }>({
    query: getProductsQuery,
    variables: { first, sortKey, reverse, query },
    tags: [TAGS.products],
  });
  return flatten(data.products)
    .map((node) => reshapeProduct(node))
    .filter((p): p is Product => p !== null);
}

/**
 * Every product handle, paged out in full — used by `generateStaticParams`
 * so product pages prerender at build time.
 */
export async function getAllProductHandles(): Promise<string[]> {
  const handles: string[] = [];
  let after: string | null = null;

  do {
    const data: {
      products: {
        pageInfo: { hasNextPage: boolean; endCursor: string | null };
        edges: Array<{ node: { handle: string } }>;
      };
    } = await shopifyFetch({
      query: getProductHandlesQuery,
      variables: { first: 250, after },
      tags: [TAGS.products],
    });

    handles.push(...data.products.edges.map((edge) => edge.node.handle));
    after = data.products.pageInfo.hasNextPage ? data.products.pageInfo.endCursor : null;
  } while (after);

  return handles;
}

export async function getCollection(handle: string): Promise<Collection | null> {
  const data = await shopifyFetch<{ collection: Collection | null }>({
    query: getCollectionQuery,
    variables: { handle },
    tags: [TAGS.collections],
  });
  return data.collection;
}

export async function getCollections(first = 50): Promise<Collection[]> {
  const data = await shopifyFetch<{ collections: Connection<Collection> }>({
    query: getCollectionsQuery,
    variables: { first },
    tags: [TAGS.collections],
  });
  return flatten(data.collections);
}

export async function getCollectionProducts({
  handle,
  first = 24,
  sortKey,
  reverse,
}: {
  handle: string;
  first?: number;
  sortKey?: string;
  reverse?: boolean;
}): Promise<Product[]> {
  const data = await shopifyFetch<{
    collection: { products: Connection<ShopifyProduct> } | null;
  }>({
    query: getCollectionProductsQuery,
    variables: { handle, first, sortKey, reverse },
    tags: [TAGS.collections, TAGS.products],
  });

  return flatten(data.collection?.products)
    .map((node) => reshapeProduct(node))
    .filter((p): p is Product => p !== null);
}

/* ------------------------------------------------------------------ */
/* Cart — never cached, always per-request                             */
/* ------------------------------------------------------------------ */

export async function createCart(
  lines: Array<{ merchandiseId: string; quantity: number }> = [],
): Promise<Cart> {
  const data = await shopifyFetch<{
    cartCreate: { cart: ShopifyCart; userErrors: Array<{ message: string }> };
  }>({
    query: createCartMutation,
    variables: { lines },
    cache: "no-store",
  });
  return reshapeCart(data.cartCreate.cart)!;
}

export async function getCart(cartId: string): Promise<Cart | null> {
  const data = await shopifyFetch<{ cart: ShopifyCart | null }>({
    query: getCartQuery,
    variables: { cartId },
    cache: "no-store",
  });
  return reshapeCart(data.cart);
}

export async function addToCart(
  cartId: string,
  lines: Array<{ merchandiseId: string; quantity: number }>,
): Promise<Cart> {
  const data = await shopifyFetch<{
    cartLinesAdd: { cart: ShopifyCart };
  }>({
    query: addToCartMutation,
    variables: { cartId, lines },
    cache: "no-store",
  });
  return reshapeCart(data.cartLinesAdd.cart)!;
}

export async function updateCart(
  cartId: string,
  lines: Array<{ id: string; merchandiseId: string; quantity: number }>,
): Promise<Cart> {
  const data = await shopifyFetch<{
    cartLinesUpdate: { cart: ShopifyCart };
  }>({
    query: updateCartMutation,
    variables: { cartId, lines },
    cache: "no-store",
  });
  return reshapeCart(data.cartLinesUpdate.cart)!;
}

export async function removeFromCart(cartId: string, lineIds: string[]): Promise<Cart> {
  const data = await shopifyFetch<{
    cartLinesRemove: { cart: ShopifyCart };
  }>({
    query: removeFromCartMutation,
    variables: { cartId, lineIds },
    cache: "no-store",
  });
  return reshapeCart(data.cartLinesRemove.cart)!;
}

export { ShopifyError, TAGS } from "./client";
export type * from "./types";
