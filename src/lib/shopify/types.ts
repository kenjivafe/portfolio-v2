/**
 * Types for the subset of the Shopify Storefront API this store uses.
 *
 * Shopify returns paginated relationships as `{ edges: [{ node }] }`. These
 * types model the *raw* shape returned by the API; `reshape*` helpers in
 * `./index.ts` flatten them into the shapes the UI actually renders.
 */

export type Money = {
  amount: string;
  currencyCode: string;
};

export type ShopifyImage = {
  url: string;
  altText: string | null;
  width: number;
  height: number;
};

export type SelectedOption = {
  name: string;
  value: string;
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: SelectedOption[];
  price: Money;
  compareAtPrice: Money | null;
};

export type ProductOption = {
  id: string;
  name: string;
  values: string[];
};

export type SEO = {
  title: string | null;
  description: string | null;
};

/** A product after `reshapeProduct` has flattened its connections. */
export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  availableForSale: boolean;
  options: ProductOption[];
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  variants: ProductVariant[];
  featuredImage: ShopifyImage | null;
  images: ShopifyImage[];
  seo: SEO;
  tags: string[];
  updatedAt: string;
};

export type Collection = {
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  seo: SEO;
  image: ShopifyImage | null;
  updatedAt: string;
};

export type CartLine = {
  id: string;
  quantity: number;
  cost: {
    totalAmount: Money;
  };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: SelectedOption[];
    product: {
      handle: string;
      title: string;
      featuredImage: ShopifyImage | null;
    };
  };
};

export type Cart = {
  id: string;
  /** Shopify-hosted checkout URL. Payments/tax/shipping stay on Shopify. */
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money | null;
  };
  lines: CartLine[];
};

/** Raw connection wrapper as returned by the Storefront API. */
export type Connection<T> = {
  edges: Array<{ node: T }>;
};

export type ShopifyProduct = Omit<Product, "variants" | "images"> & {
  variants: Connection<ProductVariant>;
  images: Connection<ShopifyImage>;
};

export type ShopifyCart = Omit<Cart, "lines"> & {
  lines: Connection<CartLine>;
};
