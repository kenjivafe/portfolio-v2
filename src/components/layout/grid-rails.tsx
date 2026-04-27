'use client';

import styles from './grid-rails.module.css';

export default function GridRails() {
  return (
    <div className={styles['grid-rails']}>
      <div className={styles.inner}></div>
    </div>
  );
}
