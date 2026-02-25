import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

interface ProductCardProps {
  id: number;
  title: string;
  category: string;
  image: string;
}

export default function ProductCard({ id, title, category, image }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group gpu"
    >
      <Link to={`/collections/${id}`} className="block">
        {/* Image container */}
        <div className="relative aspect-[3/4] overflow-hidden mb-4 shadow-luxury">
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Glass overlay on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col justify-between p-4">
            <div className="self-end translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-400 delay-75">
              <span className="text-[8px] uppercase tracking-widest text-white bg-brand-ink/60 backdrop-blur-md px-3 py-1.5 rounded-sm border border-white/10">
                View Details
              </span>
            </div>
            <div className="glass-morph p-3 rounded-sm border-brand-glass-border opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400 delay-100">
              <p className="text-[8px] uppercase tracking-[0.2em] text-brand-gold font-medium mb-0.5">{category}</p>
              <h3 className="text-xs font-serif text-brand-ink tracking-wide leading-snug line-clamp-2">{title}</h3>
            </div>
          </div>
        </div>

        {/* Info below image */}
        <div className="space-y-1.5 px-0.5">
          <p className="text-[9px] uppercase tracking-[0.25em] text-brand-gold font-medium">{category}</p>
          <h3 className="text-sm font-serif text-brand-ink tracking-wide leading-snug group-hover:text-brand-gold transition-colors duration-300">
            {title}
          </h3>
          <div className="w-0 h-px bg-brand-gold/55 group-hover:w-full transition-all duration-500" />
        </div>
      </Link>
    </motion.div>
  );
}
