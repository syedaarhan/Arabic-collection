import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/gallery')
      .then((res) => res.json())
      .then((data) => setImages(data));
  }, []);

  return (
    <div className="min-h-screen bg-brand-bg pt-24 pb-32">
      {/* Header band */}
      <div className="glass-band py-12 px-4 mb-16">
        <div className="max-w-7xl mx-auto text-center">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[10px] uppercase tracking-[0.5em] text-brand-gold font-medium mb-4 block"
          >
            Visual Narrative
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif font-light text-brand-ink"
          >
            The Atelier <span className="italic text-brand-gold">Gallery</span>
          </motion.h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          layout
          className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
        >
          {images.map((img: any, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              onClick={() => setSelectedImage(img.image)}
              className="break-inside-avoid relative group cursor-pointer overflow-hidden shadow-luxury border border-black/5"
            >
              <img
                src={img.image}
                alt={`Gallery item ${i + 1}`}
                className="w-full h-auto object-cover transition-all duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-brand-ink/20 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-center justify-center">
                <span className="text-[9px] uppercase tracking-[0.4em] text-white border border-white/40 px-5 py-2 bg-brand-ink/40 backdrop-blur-sm">
                  Expand
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {images.length === 0 && (
          <div className="text-center py-32 glass-card">
            <p className="text-brand-muted/50 uppercase tracking-[0.2em] text-xs">The gallery is currently being curated.</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-ink/90 backdrop-blur-xl p-4 md:p-16 cursor-zoom-out"
          >
            <button
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors p-2"
              onClick={() => setSelectedImage(null)}
            >
              <X size={28} />
            </button>
            <motion.img
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              src={selectedImage}
              className="max-w-full max-h-full object-contain shadow-2xl"
              alt="Expanded gallery view"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
