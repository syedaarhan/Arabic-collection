import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import logo from '../assets/favicon.png';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setIsOpen(false), [location]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center pointer-events-none px-4 pt-4">

      {/* ── Floating pill navbar ── */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className={`w-full max-w-5xl pointer-events-auto transition-all duration-500 rounded-2xl ${scrolled
          ? 'glass-navbar shadow-[0_8px_40px_rgba(0,0,0,0.12)]'
          : 'glass-navbar shadow-[0_4px_20px_rgba(0,0,0,0.07)]'
          }`}
      >
        <div className="flex items-center justify-between px-5 py-3.5">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="relative w-8 h-8 overflow-hidden rounded-full border border-brand-gold/30 bg-brand-bg group-hover:border-brand-gold/70 transition-all duration-400">
              <img
                src={logo}
                alt="Arabic Collection Logo"
                className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-600"
              />
            </div>
            <span className="text-[13px] font-serif font-light tracking-[0.12em] text-brand-ink">
              ARABIC <span className="italic text-brand-gold">Collection</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-7">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/collections">Collections</NavLink>
            <NavLink to="/gallery">Gallery</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </div>
          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-brand-ink hover:text-brand-gold transition-colors pointer-events-auto"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-5xl mt-2 glass-morph rounded-2xl overflow-hidden pointer-events-auto"
          >
            <div className="px-6 py-5 flex flex-col gap-1">
              <MobileNavLink to="/">Home</MobileNavLink>
              <MobileNavLink to="/collections">Collections</MobileNavLink>
              <MobileNavLink to="/gallery">Gallery</MobileNavLink>
              <MobileNavLink to="/about">About</MobileNavLink>
              <MobileNavLink to="/contact">Contact</MobileNavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  const active = useLocation().pathname === to;
  return (
    <Link to={to} className="relative group overflow-hidden pb-0.5">
      <span className={`text-[10px] uppercase tracking-[0.2em] font-medium transition-colors duration-300 ${active ? 'text-brand-gold' : 'text-brand-ink/55 group-hover:text-brand-ink'
        }`}>
        {children}
      </span>
      <div className={`absolute bottom-0 left-0 h-px bg-brand-gold transition-all duration-350 ${active ? 'w-full' : 'w-0 group-hover:w-full'
        }`} />
    </Link>
  );
}

function MobileNavLink({ to, children }: { to: string; children: React.ReactNode }) {
  const active = useLocation().pathname === to;
  return (
    <Link
      to={to}
      className={`text-[10px] uppercase tracking-[0.3em] font-medium py-3 px-2 border-b border-black/5 transition-colors last:border-0 ${active ? 'text-brand-gold' : 'text-brand-ink/60 hover:text-brand-gold'
        }`}
    >
      {children}
    </Link>
  );
}
