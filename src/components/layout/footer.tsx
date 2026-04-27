'use client';

import { useRef, useState, useEffect } from 'react';
import styles from './footer.module.css';

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!footerRef.current) return;
      const rect = footerRef.current.getBoundingClientRect();
      
      // Calculate mouse position relative to the CENTER of the footer
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const offsetX = e.clientX - centerX;
      const offsetY = e.clientY - centerY;
      
      setMousePos({ x: offsetX, y: offsetY });
    };

    const footer = footerRef.current;
    if (footer) {
      footer.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      if (footer) {
        footer.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  return (
    <footer 
      ref={footerRef} 
      className={styles['footer-row']}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        '--mouse-offset-x': `${mousePos.x}px`,
        '--mouse-offset-y': `${mousePos.y}px`,
        '--mask-opacity': isHovered ? 1 : 0
      } as React.CSSProperties}
    >
      <div className={styles['text-container']}>
        {/* Base Layer (Outline) */}
        <h1 className={styles['big-text']}>
          KENJI <span className={styles['hide-mobile']}>VON ASHLEY</span>
        </h1>
        
        {/* Accent Layer (Revealed by Mask) */}
        <h1 className={`${styles['big-text']} ${styles['accent-layer']}`}>
          KENJI <span className={styles['hide-mobile']}>VON ASHLEY</span>
        </h1>
      </div>
    </footer>
  );
}
