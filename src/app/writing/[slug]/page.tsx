import { notFound } from 'next/navigation';
import { getPost, POSTS } from '@/lib/posts';
import Footer from '@/components/layout/footer';
import styles from './page.module.css';

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Kenji`,
    description: post.excerpt,
  };
}

export default async function WritingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const currentIndex = POSTS.findIndex((p) => p.slug === slug);
  const nextPost = POSTS[currentIndex + 1] ?? null;

  return (
    <main className="page">
      <article className={styles.article}>

        {/* ── Back ── */}
        <div className={styles.backRow}>
          <a href="/#writing" className={styles.back}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Writing
          </a>
        </div>

        {/* ── Header ── */}
        <header className={styles.header}>
          <div className={styles.meta}>
            <span className={styles.cat}>{post.cat}</span>
            <span className={styles.dot}>·</span>
            <span className={styles.date}>{post.date}</span>
            <span className={styles.dot}>·</span>
            <span className={styles.readTime}>{post.readTime}</span>
          </div>
          <h1 className={styles.title}>{post.title}</h1>
          <p className={styles.excerpt}>{post.excerpt}</p>
        </header>

        <div className={styles.divider} />

        {/* ── Body ── */}
        <div className={styles.body}>
          {post.content.map((section, i) => (
            <div key={i} className={styles.section}>
              {section.heading && (
                <h2 className={styles.sectionHeading}>{section.heading}</h2>
              )}
              <p className={styles.paragraph}>{section.body}</p>
            </div>
          ))}
        </div>

        <div className={styles.divider} />

        {/* ── Next post ── */}
        {nextPost ? (
          <div className={styles.nextPost}>
            <span className={styles.nextLabel}>Next</span>
            <a href={`/writing/${nextPost.slug}`} className={styles.nextLink}>
              <span className={styles.nextCat}>{nextPost.cat}</span>
              <span className={styles.nextTitle}>{nextPost.title}</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        ) : (
          <div className={styles.nextPost}>
            <span className={styles.nextLabel}>Done reading</span>
            <a href="/" className={styles.nextLink}>
              <span className={styles.nextTitle}>Back to home</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        )}
      </article>

      <Footer />
    </main>
  );
}
