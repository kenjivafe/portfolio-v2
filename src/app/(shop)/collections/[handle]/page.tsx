import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/shop/product-card";
import { getCollection, getCollectionProducts, getCollections, getProducts } from "@/lib/shopify";

import styles from "./page.module.css";

type Params = { handle: string };

/** `all` is a virtual collection listing the whole catalog. */
const ALL_HANDLE = "all";

export async function generateStaticParams(): Promise<Params[]> {
  try {
    const collections = await getCollections();
    return [{ handle: ALL_HANDLE }, ...collections.map((c) => ({ handle: c.handle }))];
  } catch {
    // Without Shopify credentials nothing can be prerendered; these routes
    // still resolve on demand because `dynamicParams` defaults to true.
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { handle } = await params;

  if (handle === ALL_HANDLE) {
    return { title: "Shop all", description: "Browse the full catalogue." };
  }

  const collection = await getCollection(handle);
  if (!collection) return {};

  return {
    title: collection.seo.title ?? collection.title,
    description: collection.seo.description ?? collection.description,
  };
}

export default async function CollectionPage({ params }: { params: Promise<Params> }) {
  const { handle } = await params;

  const isAll = handle === ALL_HANDLE;
  const collection = isAll ? null : await getCollection(handle);

  if (!isAll && !collection) notFound();

  const products = isAll
    ? await getProducts({ first: 48 })
    : await getCollectionProducts({ handle, first: 48 });

  const title = isAll ? "Shop all" : collection!.title;
  const description = isAll ? null : collection!.description;

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        {description ? <p className={styles.description}>{description}</p> : null}
      </header>

      {products.length > 0 ? (
        <div className={styles.grid}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className={styles.empty}>Nothing here yet. Check back soon.</p>
      )}
    </main>
  );
}
