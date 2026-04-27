import Reveal from '../ui/reveal';
import styles from './writing.module.css';

const POSTS = [
  { cat: 'Engineering', date: 'Mar 2025', title: 'Architecting for Scale: How we handle 1M+ concurrent connections', excerpt: 'Deep dive into load balancing, horizontal scaling, and the engineering trade-offs required for high-availability systems.' },
  { cat: 'Backend', date: 'Feb 2025', title: 'The quest for sub-100ms latency in distributed systems', excerpt: 'Practical techniques for optimizing network paths, database queries, and caching layers to achieve high-performance APIs.' },
  { cat: 'Database', date: 'Jan 2025', title: 'When PostgreSQL isn’t enough: Moving to specialized datastores', excerpt: 'Analyzing when to supplement your relational database with Redis, ClickHouse, or ElasticSearch for specific workloads.' },
  { cat: 'SaaS', date: 'Dec 2024', title: 'Building Multi-tenant SaaS: Security, Isolation, and the Data Trap', excerpt: 'Lessons learned from implementing multi-tenancy: from row-level security to separate infrastructure silos.' },
];

export default function Writing() {
  return (
    <section className={styles['writing-section']} id="writing">
      <Reveal className="row label-bar">
        <div className="s-label">Writing</div>
        <div className="s-count">04 Posts</div>
      </Reveal>
      <div className="row">
        <div className={styles['writing-grid']}>
          {POSTS.map((post, i) => (
            <Reveal key={post.title} delay={i === 0 ? undefined : (`d${i}` as any)} className={styles['reveal-wrapper']}>
              <a href="#" className={styles['post-card']}>
                <div className={styles['post-meta']}><span className={styles['post-cat']}>{post.cat}</span>· {post.date}</div>
                <div className={styles['post-title']}>{post.title}</div>
                <p className={styles['post-excerpt']}>{post.excerpt}</p>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
