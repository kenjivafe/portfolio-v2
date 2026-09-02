import styles from './hero.module.css';
import { getCachedContributions } from '@/lib/get-cached-contributions';
import { GITHUB_USERNAME, countContributionsThisYear } from '@/lib/github';

export default async function Hero() {
  const contributions = await getCachedContributions(GITHUB_USERNAME);
  const commitsThisYear = contributions.length
    ? countContributionsThisYear(contributions).toLocaleString('en')
    : '—';

  return (
    <div className={styles['hero-wrap']}>
      <div className={`row ${styles['eyebrow-row']} anim a1`}>
        <div className={styles['eyebrow-label']}>Software Engineer & Builder</div>
        <div className={styles['eyebrow-right']}>Available</div>
      </div>

      <div className={`row ${styles['name-row']}`}>
        <h1 className={`${styles.name} anim a2`}>Kenji<span className={styles.dot}>.</span></h1>
      </div>

      <div className={`row ${styles['body-row']}`}>
        <div className={styles['desc-col']}>
          <p className={`${styles.desc} anim a3`}>
            I build precise, thoughtful digital products — from scalable backend architectures to fluid user interfaces. Focused on crafting software that feels effortless and intentional.
          </p>
          <div className={`${styles.actions} anim a4`}>
            <a href="#work" className="btn btn-dark">View Work ↗</a>
            <a href="#contact" className="btn btn-ghost">Get in touch</a>
          </div>
        </div>
        <div className={`${styles['right-col']} anim a5`}>
          <div className={styles.stat}>
            <div className={styles['stat-num']}>5<sup>+</sup></div>
            <div className={styles['stat-label']}>Years experience</div>
          </div>
          <div className={styles.stat}>
            <div className={styles['stat-num']}>10<sup>+</sup></div>
            <div className={styles['stat-label']}>Unfinished Side Projects</div>
          </div>
          <div className={styles.stat}>
            <div className={styles['stat-num']}>{commitsThisYear}</div>
            <div className={styles['stat-label']}>Commits this year</div>
          </div>
          <div className={styles.stat}>
            <div className={styles['stat-num']}>100<sup>%</sup></div>
            <div className={styles['stat-label']}>Model Quota Used</div>
          </div>
        </div>
      </div>
    </div>
  );
}
