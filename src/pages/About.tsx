import React from 'react';
import { motion } from 'motion/react';

export default function About() {
  return (
    <div className="min-h-screen bg-brand-bg pt-24 pb-32">
      {/* Header band */}
      <div className="glass-band py-12 px-4 mb-20">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-[10px] uppercase tracking-[0.5em] text-brand-gold font-medium mb-4 block">Our Story</span>
          <h1 className="text-4xl md:text-6xl font-serif font-light text-brand-ink">
            A Legacy of <span className="italic text-brand-gold">Excellence</span>
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28 items-center">

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="aspect-[4/5] overflow-hidden shadow-luxury">
              <img
                src="https://images.unsplash.com/photo-1590736961642-03d7e80046d7?auto=format&fit=crop&q=80&w=1000"
                alt="Heritage"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-brand-gold/8 blur-[60px] -z-10" />
            <div className="absolute -top-6 -left-6 w-32 h-32 border border-brand-gold/15 -z-10" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex flex-col"
          >
            <span className="text-[10px] uppercase tracking-[0.4em] text-brand-gold font-medium mb-8">
              Our Heritage & Legacy
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-light text-brand-ink mb-8 leading-tight tracking-tight">
              Perceived Through Time.<br />
              <span className="italic text-brand-gold">Rooted in KGF.</span>
            </h2>

            <div className="w-10 h-px bg-brand-gold/40 mb-10" />

            <div className="space-y-6 text-brand-muted leading-relaxed text-sm md:text-base font-light">
              <p>
                Founded with a deep-rooted passion for preserving the rich tapestry of Arabic culture while embracing the clean lines of modern luxury, Arabic Collection is more than a boutique — it is a sanctuary of taste located in the historic Kolar Gold Fields.
              </p>
              <p>
                We curate the finest traditional garments, luxury timepieces from independent watchmakers, rare fragrances, and hand-selected accessories. Every artifact in our collection is chosen to reflect sophistication, heritage, and timeless allure.
              </p>
              <p>
                Our vision in KGF is to provide a curated experience where history meets modern aesthetics, creating a dialogue between the past and the present for our discerning clientele in Karnataka and beyond.
              </p>
            </div>

            {/* Stats */}
            <div className="mt-14 grid grid-cols-2 gap-10 border-t border-black/6 pt-10">
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <h4 className="font-serif text-4xl text-brand-ink mb-2 tracking-tighter">1995</h4>
                <p className="text-[10px] uppercase tracking-[0.2em] text-brand-gold font-medium">Boutique Established</p>
              </motion.div>
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                <h4 className="font-serif text-4xl text-brand-ink mb-2 tracking-tighter">Gold</h4>
                <p className="text-[10px] uppercase tracking-[0.2em] text-brand-gold font-medium">KGF Service Standards</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
