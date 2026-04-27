'use client';

import { useState, useEffect, useRef } from 'react';
import Reveal from '../ui/reveal';
import styles from './work.module.css';

const PROJECTS = [
  { 
    id: 'rigko', 
    num: '01', 
    name: 'Rigko', 
    desc: 'Custom PC Configuration & Logistics SaaS', 
    tags: ['Next.js', 'System Design', 'E-commerce'], 
    year: '2026', 
    href: 'https://rigko.com',
    img: '/featured-works/rigko.png' 
  },
  { 
    id: 'gymcentrix', 
    num: '02', 
    name: 'Gymcentrix', 
    desc: 'Enterprise Gym Management & Analytics Platform', 
    tags: ['SaaS', 'PostgreSQL', 'Real-time'], 
    year: '2026', 
    href: 'https://gymcentrix.vercel.app',
    img: '/featured-works/gymcentrix.png' 
  },
  { 
    id: 'gritdp', 
    num: '03', 
    name: 'Grit Digital Performance', 
    desc: 'Sports Data Infrastructure & Team Management', 
    tags: ['Backend', 'API Design', 'Infrastructure'], 
    year: '2026', 
    href: 'https://gritdp.com',
    img: '/featured-works/gritdp.png' 
  },
  { 
    id: 'resq-link', 
    num: '04', 
    name: 'RESQ-Link', 
    desc: 'Real-time Emergency Dispatch & Event Response', 
    tags: ['Real-time', 'Event-Driven', 'Mapping'], 
    year: '2025', 
    href: 'https://resq-link-kappa.vercel.app',
    img: '/featured-works/resq-link.png' 
  },
];

export default function Work() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className={styles['work-section']} id="work" ref={containerRef}>
      <Reveal className="row label-bar">
        <div className="s-label">Selected Work</div>
        <div className="s-count">04 Projects</div>
      </Reveal>
      
      <div className="row">
        <div className={styles['work-list']}>
          {PROJECTS.map((proj, i) => (
            <Reveal key={proj.id} delay={i === 0 ? undefined : (`d${i}` as any)} className={styles['reveal-wrapper']}>
              <a 
                href={proj.href} 
                target="_blank"
                rel="noopener noreferrer"
                className={styles['proj-row']}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <span className={styles['proj-num']}>{proj.num}</span>
                <div className={styles['proj-info']}>
                  <div className={styles['proj-name']}>{proj.name}</div>
                  <div className={styles['proj-desc']}>{proj.desc}</div>
                </div>
                <div className={styles['proj-tags-year']}>
                  <div className={styles['proj-tags']}>
                    {proj.tags.map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}
                  </div>
                  <span className={styles['proj-year']}>{proj.year}</span>
                </div>
                <span className={styles['proj-arrow']}>↗</span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Floating Image Preview */}
      <div 
        className={styles['hover-preview']}
        style={{ 
          left: '50%',
          top: mousePos.y,
          transform: `translate(-50%, -50%)`,
          opacity: hoveredIdx !== null ? 1 : 0,
          scale: hoveredIdx !== null ? 1 : 0.8,
        }}
      >
        {PROJECTS.map((proj, i) => (
          <div 
            key={proj.id}
            className={styles['preview-img-wrap']}
            style={{ 
              opacity: hoveredIdx === i ? 1 : 0,
              transform: `translateY(${hoveredIdx === i ? 0 : 20}px)`
            }}
          >
            <img src={proj.img} alt={proj.name} className={styles['preview-img']} />
          </div>
        ))}
      </div>
    </section>
  );
}
