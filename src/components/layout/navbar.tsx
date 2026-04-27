'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import styles from './navbar.module.css';
import { Menu, X } from 'lucide-react';
import clsx from 'clsx';

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const links = [
    { href: '#work', label: 'Work' },
    { href: '#about', label: 'About' },
    { href: '#capabilities', label: 'Capabilities' },
    { href: '#writing', label: 'Writing' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <div className={styles.logo}>
          <a href="/" onClick={closeMenu}>
            <svg className={styles['logo-svg']} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 845.42 527.12">
              <g id="Layer_2" data-name="Layer 2">
                <g id="Layer_1-2" data-name="Layer 1">
                  <polygon 
                    id="Black" 
                    style={{ fill: '#10100E' }} 
                    points="629.37 527.12 549.44 386.65 527.73 415 527.73 527.12 0 527.12 0 0 527.73 0 527.73 134.24 629.11 0 845.42 0 666.04 234.3 834.93 527.12 629.37 527.12"
                  />
                  <polygon 
                    id="White" 
                    style={{ fill: '#FFFFE3' }} 
                    points="765.68 487.12 652.63 487.12 554.36 314.42 487.73 401.44 487.73 487.12 40 487.12 40 40 487.73 40 487.73 253.57 649.03 40 764.42 40 618.06 231.17 765.68 487.12"
                  />
                  <circle 
                    id="Red" 
                    style={{ fill: 'var(--accent)' }} 
                    cx="263.57" 
                    cy="263.56" 
                    r="156.57"
                  />
                </g>
              </g>
            </svg>
          </a>
        </div>

        <ul className={styles.links}>
          {links.map((link) => (
            <li key={link.href}><a href={link.href}>{link.label}</a></li>
          ))}
        </ul>

        <div 
          className={styles.status} 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title="Toggle theme"
        >
          {mounted && theme === 'dark' ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          ) : mounted ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          ) : (
            <div style={{ width: 14, height: 14 }}></div>
          )}
        </div>

        <button className={styles.burger} onClick={toggleMenu} aria-label="Toggle menu">
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <ul className={clsx(styles.mobileMenu, isMenuOpen && styles.mobileMenuOpen)}>
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href} onClick={closeMenu}>{link.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
