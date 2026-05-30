import Reveal from '../ui/reveal';
import styles from './writing.module.css';
import { POSTS } from '@/lib/posts';

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
            <Reveal key={post.slug} delay={i === 0 ? undefined : (`d${i}` as any)} className={styles['reveal-wrapper']}>
              <a href={`/writing/${post.slug}`} className={styles['post-card']}>
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
