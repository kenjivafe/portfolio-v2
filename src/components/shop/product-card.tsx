import Image from "next/image";
import Link from "next/link";

import { formatMoney } from "@/lib/shopify/money";
import type { Product } from "@/lib/shopify/types";

import styles from "./product-card.module.css";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.handle}`} className={styles.card}>
      <div className={styles.imageWrap}>
        {product.featuredImage ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText ?? product.title}
            width={product.featuredImage.width}
            height={product.featuredImage.height}
            className={styles.image}
            sizes="(max-width: 600px) 50vw, (max-width: 1000px) 33vw, 25vw"
          />
        ) : (
          <div className={styles.placeholder} aria-hidden="true" />
        )}
        {!product.availableForSale ? (
          <span className={styles.badge}>Sold out</span>
        ) : null}
      </div>
      <h2 className={styles.title}>{product.title}</h2>
      <p className={styles.price}>{formatMoney(product.priceRange.minVariantPrice)}</p>
    </Link>
  );
}
