'use client';

import { useEffect, useState, useRef } from 'react';
import styles from './custom-cursor.module.css';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isBig, setIsBig] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + 'px';
        cursorRef.current.style.top = e.clientY + 'px';
      }
    };

    const handleMouseEnter = () => setIsBig(true);
    const handleMouseLeave = () => setIsBig(false);

    document.addEventListener('mousemove', moveCursor);

    // Initial setup for existing elements
    const updateListeners = () => {
      const targets = document.querySelectorAll('a, button, .skill-cell, .post-card, .gh-cell');
      targets.forEach(el => {
        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
      });
    };

    updateListeners();

    // Re-run if content changes (simplistic approach)
    const observer = new MutationObserver(updateListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      observer.disconnect();
      const targets = document.querySelectorAll('a, button, .skill-cell, .post-card, .gh-cell');
      targets.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  return (
    <div 
      ref={cursorRef} 
      className={`${styles.cursor} ${isBig ? styles.big : ''}`}
      id="cursor"
    />
  );
}
