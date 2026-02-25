import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const categories = ['All', 'Clothes', 'Watches', 'Perfumes', 'Belts', 'Accessories'];

export default function Collections() {
  const [collections, setCollections] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    if (cat && categories.includes(cat)) {
      setActiveCategory(cat);
    }
  }, [location]);

  useEffect(() => {
    const url = activeCategory === 'All'
      ? '/api/collections'
      : `/api/collections?category=${activeCategory}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => setCollections(data));
  }, [activeCategory]);

  const filteredCollections = collections.filter((item: any) => {
    const query = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-brand-bg pt-24">
      {/* Page Header */}
      <div className="glass-band py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[10px] uppercase tracking-[0.5em] text-brand-gold font-medium mb-4 block"
          >
            The Inventory
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif font-light text-brand-ink mb-4"
          >
            Curated <span className="italic text-brand-gold">Treasures</span>
          </motion.h1>
          <div className="w-10 h-px bg-brand-gold/40 mx-auto" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-5 items-start md:items-center justify-between mb-14">
          <div className="relative w-full md:max-w-sm group">
            <input
              type="text"
              placeholder="Search artifacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-black/10 py-3.5 px-10 text-sm text-brand-ink focus:outline-none focus:border-brand-gold/60 focus:ring-2 focus:ring-brand-gold/10 transition-all placeholder:text-brand-muted/40 rounded-sm"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted/40 group-focus-within:text-brand-gold transition-colors" size={16} />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-[9px] uppercase tracking-[0.2em] px-5 py-2.5 border transition-all duration-300 whitespace-nowrap rounded-sm ${activeCategory === cat
                  ? 'border-brand-gold bg-brand-gold text-white'
                  : 'border-black/10 bg-white text-brand-muted/70 hover:text-brand-ink hover:border-brand-gold/40'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          <AnimatePresence mode="popLayout">
            {filteredCollections.map((item: any) => (
              <ProductCard key={item.id} {...item} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredCollections.length === 0 && (
          <div className="text-center py-32 glass-card">
            <p className="text-brand-muted/50 uppercase tracking-[0.2em] text-xs">No artifacts matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
