import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { MapPin, ArrowLeft } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/collections/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data));
  }, [id]);

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg text-brand-ink pt-24">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto mb-5" />
        <p className="text-[10px] uppercase tracking-[0.2em] text-brand-gold">Retrieving Masterpiece...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-bg pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <Link
          to="/collections"
          className="group inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-brand-muted hover:text-brand-gold transition-colors mb-16"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
          Back to Collections
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28 items-start">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9 }}
            className="relative"
          >
            <div className="aspect-[4/5] overflow-hidden shadow-luxury relative">
              <img
                src={product.image || 'https://images.unsplash.com/photo-1590736961642-03d7e80046d7?auto=format&fit=crop&q=80&w=1000'}
                alt={product.title}
                className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-1000"
              />
            </div>
            {/* Design accents */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 border border-brand-gold/15 -z-10" />
            <div className="absolute -top-6 -left-6 w-20 h-20 border border-brand-gold/10 -z-10" />
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="flex flex-col pt-4"
          >
            <span className="text-[10px] uppercase tracking-[0.5em] text-brand-gold font-medium mb-6">
              {product.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-light text-brand-ink mb-6 leading-tight tracking-tight">
              {product.title}
            </h1>
            <div className="w-10 h-px bg-brand-gold/50 mb-8" />

            <p className="text-brand-muted leading-relaxed mb-12 text-sm md:text-base font-light tracking-wide">
              {product.description}
            </p>

            {/* Provenance card */}
            <div className="glass-card p-8 border border-black/6">
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-brand-gold font-medium mb-6">Provenance & Availability</h3>

              <div className="flex items-center gap-4 text-brand-ink mb-6">
                <div className="w-9 h-9 rounded-sm border border-brand-gold/20 bg-brand-gold/5 flex items-center justify-center shrink-0">
                  <MapPin size={16} className="text-brand-gold" />
                </div>
                <span className="text-sm font-serif tracking-wide">{product.availabilityStatus || 'Available In Store Only'}</span>
              </div>

              <p className="text-[11px] text-brand-muted/60 leading-relaxed mb-8 tracking-wide">
                This piece is exclusively showcased at our KGF showroom in Robertsonpet, Kolar Gold Fields. We invite you to experience it in person.
              </p>

              <Link
                to="/contact"
                className="group relative block w-full text-center bg-brand-ink text-white py-4 uppercase tracking-[0.3em] text-[10px] font-medium hover:bg-brand-gold transition-all duration-500 overflow-hidden"
              >
                <span className="relative z-10">Request Private Viewing</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
