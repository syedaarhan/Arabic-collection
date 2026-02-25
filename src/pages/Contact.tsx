import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen bg-brand-bg pt-24 pb-32">
      {/* Header band */}
      <div className="glass-band py-12 px-4 mb-20">
        <div className="max-w-7xl mx-auto text-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[10px] uppercase tracking-[0.5em] text-brand-gold font-medium mb-4 block"
          >
            Connect With Us
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif font-light text-brand-ink"
          >
            Visit Our <span className="italic text-brand-gold">Showroom</span>
          </motion.h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8 md:p-12"
          >
            <h2 className="text-2xl font-serif font-light text-brand-ink mb-10">Contact Information</h2>

            <div className="space-y-8">
              <ContactInfoItem
                icon={<MapPin size={18} />}
                label="Location"
                value="Robertsonpet Road, Swarna Nagar"
                sub="Kolar Gold Fields, Karnataka 563122"
              />
              <ContactInfoItem
                icon={<Phone size={18} />}
                label="Direct Line"
                value="+91 9481234567"
              />
              <ContactInfoItem
                icon={<Mail size={18} />}
                label="Inquiries"
                value="info@arabiccollection.com"
              />
              <ContactInfoItem
                icon={<Clock size={18} />}
                label="Atelier Hours"
                value="Mon – Sat: 10:30 AM – 9:30 PM"
                sub="Sunday: Closed for Curating"
              />
            </div>

            <div className="mt-12 pt-8 border-t border-black/6">
              <a
                href="https://wa.me/919481234567"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-3 w-full bg-[#25D366] text-white py-5 font-medium uppercase tracking-[0.2em] text-[10px] transition-all duration-400 hover:bg-[#1ab356] rounded-sm"
              >
                <MessageCircle size={17} />
                <span>WhatsApp Concierge</span>
              </a>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="overflow-hidden border border-black/8 h-[600px] lg:h-full min-h-[450px] shadow-luxury"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15546.54!2d78.26!3d12.96!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3badebee32efa543%3A0x8f409bd469863a8e!2sARABIC+COLLECTION!5e0!3m2!1sen!2sin!4v1740441600000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Arabic Collection Showroom Location"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function ContactInfoItem({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) {
  return (
    <div className="flex items-start gap-5 group">
      <div className="w-10 h-10 rounded-sm border border-brand-gold/20 bg-brand-gold/5 flex items-center justify-center shrink-0 text-brand-gold group-hover:bg-brand-gold group-hover:text-white transition-all duration-400">
        {icon}
      </div>
      <div>
        <h3 className="text-[10px] uppercase tracking-[0.2em] text-brand-muted/60 font-medium mb-1">{label}</h3>
        <p className="text-brand-ink font-serif text-base tracking-wide">{value}</p>
        {sub && <p className="text-brand-muted/60 text-xs mt-0.5 font-light tracking-wider">{sub}</p>}
      </div>
    </div>
  );
}
