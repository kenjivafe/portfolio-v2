import crypto from "node:crypto";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import { TAGS } from "@/lib/shopify/client";

/**
 * Shopify webhook receiver: invalidates catalog cache tags when products or
 * collections change, so the storefront reflects admin edits without a redeploy.
 *
 * Point Shopify webhooks (products/*, collections/*) at this route and set
 * SHOPIFY_WEBHOOK_SECRET to the signing secret Shopify shows for them.
 */

/** Maps a Shopify webhook topic to the cache tags it should invalidate. */
function tagsForTopic(topic: string): string[] {
  if (topic.startsWith("products/")) return [TAGS.products];
  if (topic.startsWith("collections/")) return [TAGS.collections];
  return [];
}

function isValidSignature(rawBody: string, signature: string, secret: string): boolean {
  const expected = crypto.createHmac("sha256", secret).update(rawBody, "utf8").digest("base64");

  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(signature);

  // timingSafeEqual throws on length mismatch, so compare lengths first.
  if (expectedBuffer.length !== receivedBuffer.length) return false;
  return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
}

export async function POST(request: Request): Promise<NextResponse> {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("SHOPIFY_WEBHOOK_SECRET is not set; refusing to revalidate.");
    return NextResponse.json({ revalidated: false }, { status: 500 });
  }

  const signature = request.headers.get("x-shopify-hmac-sha256");
  const topic = request.headers.get("x-shopify-topic") ?? "";

  // The raw body is required for HMAC verification — do not parse it first.
  const rawBody = await request.text();

  if (!signature || !isValidSignature(rawBody, signature, secret)) {
    return NextResponse.json({ revalidated: false }, { status: 401 });
  }

  const tags = tagsForTopic(topic);
  if (tags.length === 0) {
    // Acknowledge unhandled topics so Shopify does not retry them.
    return NextResponse.json({ revalidated: false, topic });
  }

  // Next 16 requires a cacheLife profile as the second argument.
  for (const tag of tags) {
    revalidateTag(tag, "max");
  }

  return NextResponse.json({ revalidated: true, topic, tags });
}
