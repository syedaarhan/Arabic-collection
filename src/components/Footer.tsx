import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Mail, MapPin, Phone } from 'lucide-react';
import logo from '../assets/favicon.png';

export default function Footer() {
  return (
    <footer className="bg-brand-ink text-white pt-20 pb-10 relative overflow-hidden">
      {/* Subtle top gold line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 overflow-hidden rounded-full border border-brand-gold/30 group-hover:border-brand-gold/70 transition-all duration-500">
                <img src={logo} alt="Logo" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500" />
              </div>
              <span className="text-base font-serif font-light tracking-widest text-white">
                ARABIC <span className="italic text-brand-gold">Collection</span>
              </span>
            </Link>
            <p className="text-white/40 text-[11px] uppercase tracking-[0.15em] leading-relaxed max-w-xs">
              Curating high-end traditional and contemporary luxury artifacts since 1995.
            </p>
          </div>

          {/* Portfolio */}
          <div>
            <h4 className="text-white/60 text-[9px] uppercase tracking-[0.35em] mb-6 font-medium">Portfolio</h4>
            <ul className="space-y-3">
              <FooterLink to="/collections?category=Clothes">Traditional Wear</FooterLink>
              <FooterLink to="/collections?category=Watches">Timepieces</FooterLink>
              <FooterLink to="/collections?category=Perfumes">Exotic Scents</FooterLink>
              <FooterLink to="/collections?category=Accessories">Accessories</FooterLink>
            </ul>
          </div>

          {/* Experience */}
          <div>
            <h4 className="text-white/60 text-[9px] uppercase tracking-[0.35em] mb-6 font-medium">Experience</h4>
            <ul className="space-y-3">
              <FooterLink to="/about">Our Legacy</FooterLink>
              <FooterLink to="/gallery">Gallery</FooterLink>
              <FooterLink to="/contact">Concierge</FooterLink>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-white/60 text-[9px] uppercase tracking-[0.35em] mb-6 font-medium">Connect</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-white/50 text-[11px] uppercase tracking-wide">
                <MapPin size={13} className="text-brand-gold shrink-0" />
                <span>KGF, Karnataka</span>
              </div>
              <div className="flex items-center gap-3 text-white/50 text-[11px] uppercase tracking-wide">
                <Phone size={13} className="text-brand-gold shrink-0" />
                <span>+91 9481234567</span>
              </div>
              <div className="flex items-center gap-5 pt-2">
                <a href="#" className="text-white/30 hover:text-brand-gold transition-colors"><Instagram size={17} /></a>
                <a href="#" className="text-white/30 hover:text-brand-gold transition-colors"><Facebook size={17} /></a>
                <a href="mailto:info@arabiccollection.com" className="text-white/30 hover:text-brand-gold transition-colors"><Mail size={17} /></a>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/20 text-[9px] uppercase tracking-[0.4em]">
            &copy; 2026 Arabic Collection. All Rights Reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-pulse" />
            <span className="text-white/30 text-[9px] uppercase tracking-[0.4em]">KGF Edition</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <li>
      <Link to={to} className="text-white/40 hover:text-white text-[11px] uppercase tracking-widest transition-colors duration-300 flex items-center gap-2 group">
        <span className="w-0 h-px bg-brand-gold group-hover:w-3 transition-all duration-300" />
        {children}
      </Link>
    </li>
  );
}
