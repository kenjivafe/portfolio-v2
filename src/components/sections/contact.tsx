'use client';

import { useLanyard } from '@/hooks/use-lanyard';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import Reveal from '../ui/reveal';
import styles from './contact.module.css';

const LINKS = [
  { type: 'GitHub', val: 'kenjivafe', href: 'https://github.com/kenjivafe', slug: 'github' },
  { type: 'Twitter / X', val: '@kenjivafe', href: 'https://twitter.com/kenjivafe', slug: 'x' },
  { type: 'LinkedIn', val: 'kenji-von-ashley', href: 'https://linkedin.com/in/kenji-von-ashley', slug: 'linkedin' },
];

export default function Contact() {
  const { data: lanyard } = useLanyard();
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const timer = setInterval(() => {
      const phTime = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' }));
      setTime(format(phTime, 'HH:mm:ss'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className={styles['contact-section']} id="contact">
      <Reveal className="row label-bar">
        <div className="s-label">Contact</div>
      </Reveal>
      
      <div className="row">
        <Reveal className={styles['contact-left']}>
          <h2 className={styles['contact-heading']}>
            Let's build<br /><span className={styles.accent}>together.</span>
          </h2>
          <p className={styles['contact-sub']}>Open to freelance projects, full-time roles, and interesting collaborations. If it's worth building, let's talk.</p>
        </Reveal>

        <Reveal delay="d2" className={styles['contact-right']}>
          <div className={styles['status-hub']}>
            <div className={styles['status-item']}>
              <span className={styles['status-label']}>Local Time</span>
              <span className={styles['status-val']}>{time || '00:00:00'} (GMT+8)</span>
            </div>
            <div className={styles['status-item']}>
              <span className={styles['status-label']}>Status</span>
              <div className={styles['status-indicator-wrap']}>
                <div className={`${styles['status-dot']} ${lanyard?.discord_status === 'online' ? styles.online : styles.offline}`} />
                <span className={styles['status-val']}>
                  {lanyard?.discord_status === 'online' ? 'Available' : 'Likely Resting'}
                </span>
              </div>
            </div>
          </div>

          <div className={styles['email-wrap']}>
            <span className={styles['cl-type']}>Direct Email</span>
            <a href="mailto:kenjivafe@gmail.com" className={styles['email-link']}>
              kenjivafe@gmail.com
              <span className={styles['email-arrow']}>↗</span>
            </a>
          </div>

          <div className={styles['social-grid']}>
            {LINKS.map(link => (
              <a key={link.type} href={link.href} target="_blank" rel="noopener noreferrer" className={styles['social-link']}>
                <img 
                  src={`https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/${link.slug}.svg`} 
                  alt={link.type}
                  className={styles['social-icon']}
                />
                <div className={styles['social-text']}>
                  <span className={styles['cl-type']}>{link.type}</span>
                  <span className={styles['social-val']}>{link.val}</span>
                </div>
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
