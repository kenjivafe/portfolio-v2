import "server-only";

/**
 * Thin Storefront API client.
 *
 * Uses `fetch` cache tags rather than `use cache`, because `use cache`
 * requires `cacheComponents: true` in next.config and this app has not
 * migrated to Cache Components. Tags are invalidated from the Shopify
 * webhook route at `app/api/revalidate`.
 */

export const TAGS = {
  products: "shopify-products",
  collections: "shopify-collections",
} as const;

const API_VERSION = process.env.SHOPIFY_STOREFRONT_API_VERSION ?? "2026-07";

/** Thrown for transport, HTTP, and GraphQL-level failures alike. */
export class ShopifyError extends Error {
  readonly query: string | undefined;
  readonly cause: unknown;

  constructor(message: string, options?: { query?: string; cause?: unknown }) {
    super(message);
    this.name = "ShopifyError";
    this.query = options?.query;
    this.cause = options?.cause;
  }
}

function endpoint(): string {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  if (!domain) {
    throw new ShopifyError(
      "SHOPIFY_STORE_DOMAIN is not set. Copy .env.example to .env.local and fill it in.",
    );
  }
  // Accept the domain with or without a scheme so either form in .env works.
  const host = domain.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return `https://${host}/api/${API_VERSION}/graphql.json`;
}

function accessToken(): string {
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  if (!token) {
    throw new ShopifyError(
      "SHOPIFY_STOREFRONT_ACCESS_TOKEN is not set. Copy .env.example to .env.local and fill it in.",
    );
  }
  return token;
}

type GraphQLResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

export async function shopifyFetch<T>({
  query,
  variables,
  tags,
  cache,
  revalidate,
}: {
  query: string;
  variables?: Record<string, unknown>;
  /** Cache tags to attach. Omit for cart calls, which must never be cached. */
  tags?: string[];
  cache?: RequestCache;
  revalidate?: number;
}): Promise<T> {
  let response: Response;

  try {
    response = await fetch(endpoint(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": accessToken(),
      },
      body: JSON.stringify({ query, variables }),
      cache,
      ...(tags || revalidate !== undefined
        ? { next: { ...(tags ? { tags } : {}), ...(revalidate !== undefined ? { revalidate } : {}) } }
        : {}),
    });
  } catch (cause) {
    throw new ShopifyError("Could not reach the Shopify Storefront API.", { query, cause });
  }

  if (!response.ok) {
    // Read the body for context; Shopify puts useful detail in 4xx responses.
    const body = await response.text().catch(() => "");
    throw new ShopifyError(
      `Shopify responded ${response.status} ${response.statusText}. ${body.slice(0, 500)}`,
      { query },
    );
  }

  const json = (await response.json()) as GraphQLResponse<T>;

  if (json.errors?.length) {
    throw new ShopifyError(json.errors.map((e) => e.message).join("; "), { query });
  }

  if (!json.data) {
    throw new ShopifyError("Shopify returned no data.", { query });
  }

  return json.data;
}
