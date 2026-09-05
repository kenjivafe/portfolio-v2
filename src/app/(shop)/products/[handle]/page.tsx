import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductPurchase } from "@/components/shop/product-purchase";
import { getAllProductHandles, getProduct } from "@/lib/shopify";

import styles from "./page.module.css";

type Params = { handle: string };

/**
 * Prerender every product at build time. Handles that appear after a build
 * still render on demand, because `dynamicParams` defaults to true.
 */
export async function generateStaticParams(): Promise<Params[]> {
  try {
    const handles = await getAllProductHandles();
    return handles.map((handle) => ({ handle }));
  } catch {
    // Without Shopify credentials the build should still succeed; pages then
    // render on demand instead of being prerendered.
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) return {};

  const title = product.seo.title ?? product.title;
  const description = product.seo.description ?? product.description;

  return {
    title,
    description,
    openGraph: product.featuredImage
      ? {
          title,
          description,
          images: [
            {
              url: product.featuredImage.url,
              width: product.featuredImage.width,
              height: product.featuredImage.height,
              alt: product.featuredImage.altText ?? product.title,
            },
          ],
        }
      : { title, description },
  };
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) notFound();

  // JSON-LD lets the product surface as a rich result in search.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images.map((image) => image.url),
    offers: {
      "@type": "AggregateOffer",
      availability: product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      lowPrice: product.priceRange.minVariantPrice.amount,
      highPrice: product.priceRange.maxVariantPrice.amount,
    },
  };

  return (
    <main className={styles.main}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/collections/all">Shop</Link>
        <span aria-hidden="true">/</span>
        <span>{product.title}</span>
      </nav>

      <div className={styles.layout}>
        <div className={styles.gallery}>
          {product.images.length > 0 ? (
            product.images.map((image, index) => (
              <Image
                key={image.url}
                src={image.url}
                alt={image.altText ?? product.title}
                width={image.width}
                height={image.height}
                className={styles.image}
                sizes="(max-width: 900px) 100vw, 55vw"
                priority={index === 0}
              />
            ))
          ) : (
            <div className={styles.imagePlaceholder} aria-hidden="true" />
          )}
        </div>

        <div className={styles.details}>
          <h1 className={styles.title}>{product.title}</h1>
          <ProductPurchase product={product} />
          <div
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
          />
        </div>
      </div>
    </main>
  );
}
