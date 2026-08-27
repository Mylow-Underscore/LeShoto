"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COLORS, NAV_LINKS } from '@/constants';

interface NavbarProps {
  loading?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ loading = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={!loading ? { y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className='max-md:h-14 w-full md:h-16 w-full'
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          background: 'rgba(10,10,15,0.9)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid ' + COLORS.border,
        }}
      >
        <a href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontWeight: 900, fontSize: 20, letterSpacing: '0.05em', color: COLORS.white }}>
            LE SHOTO<span style={{ color: COLORS.accent }}>.</span>
          </span>
        </a>

        <div className="max-md:hidden md:flex cursor-pointer p-2 gap-6 items-center">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              style={{
                color: COLORS.muted,
                textDecoration: 'none',
                fontSize: 13,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontWeight: 600,
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.accent)}
              onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.muted)}
            >
              {l.label}
            </a>
          ))}
          <a
            href="/compte"
            className='transition-opacity duration-350 hover:opacity-85'
            style={{
              background: COLORS.accent,
              color: COLORS.white,
              padding: '10px 20px',
              borderRadius: 4,
              textDecoration: 'none',
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: '0.1em',
            }}
          >
            Compte
          </a>
        </div>

        <div
          className="max-md:flex cursor-pointer p-2 md:hidden"
          onClick={toggleMenu}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={COLORS.white}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="h-full"
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              width: '80%',
              maxWidth: '300px',
              backgroundColor: COLORS.deepInk,
              zIndex: 990,
              padding: '100px 30px',
              borderLeft: '1px solid ' + COLORS.border,
            }}
          >
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {NAV_LINKS.map((l, i) => (
                <li key={i} style={{ marginBottom: 32 }}>
                  <a
                    href={l.href}
                    style={{ color: COLORS.white, textDecoration: 'none', fontSize: 18, fontWeight: 600 }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              <li style={{ marginTop: 40 }}>
                <a
                  href="/compte"
                  style={{ 
                    color: COLORS.white,
                    background: COLORS.accent,
                    fontSize: 18,
                    fontWeight: 700,
                    padding: '10px 20px',
                    borderRadius: 4,
                    textDecoration: 'none',
                    letterSpacing: '0.1em',
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Mon Compte
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};