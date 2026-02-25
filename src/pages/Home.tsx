import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const FeaturedArtifacts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/collections?featured=true')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setProducts(data.slice(0, 4));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 opacity-50">
      {[1, 2, 3, 4].map(i => <div key={i} className="aspect-[3/4] bg-brand-ink/5 animate-pulse rounded-sm" />)}
    </div>
  );

  if (products.length === 0) return (
    <div className="text-center py-20 border border-brand-gold/10 rounded-sm">
      <p className="text-[10px] uppercase tracking-widest text-brand-muted/40">The vault is currently awaiting new arrivals</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
      {products.map((item: any) => (
        <ProductCard key={item.id} {...item} />
      ))}
    </div>
  );
};

export default function Home() {
  const { scrollY } = useScroll();

  // Scroll-driven parallax (motion values — no re-renders)
  const bgY = useTransform(scrollY, [0, 600], [0, 140]);
  const textY = useTransform(scrollY, [0, 400], [0, -60]);
  const heroOpacity = useTransform(scrollY, [0, 320], [1, 0]);

  // Mouse parallax using motion values — bypasses React re-renders entirely
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);
  const mouseX = useSpring(rawMouseX, { stiffness: 60, damping: 20, mass: 0.5 });
  const mouseY = useSpring(rawMouseY, { stiffness: 60, damping: 20, mass: 0.5 });

  // Card 3D tilt (subtle)
  const cardRotateX = useTransform(mouseY, [-1, 1], [1.5, -1.5]);
  const cardRotateY = useTransform(mouseX, [-1, 1], [-1.5, 1.5]);

  // Ornamentation layer (opposite drift)
  const ornamentX = useTransform(mouseX, [-1, 1], [15, -15]);
  const ornamentY = useTransform(mouseY, [-1, 1], [10, -10]);



  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      rawMouseX.set((e.clientX / window.innerWidth - 0.5) * 2);
      rawMouseY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [rawMouseX, rawMouseY]);

  return (
    <div className="min-h-screen bg-brand-bg">

      {/* ── Hero ── */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">

        {/* Parallax background */}
        <motion.div
          style={{ y: bgY }}
          initial={{ scale: 1.12, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-brand-bg/50 via-brand-bg/15 to-brand-bg" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-bg/25 via-transparent to-brand-bg/25" />
        </motion.div>

        {/* Floating ornamental layer — motion value driven, zero re-renders */}
        <motion.div
          style={{ x: ornamentX, y: ornamentY }}
          className="absolute inset-0 z-[1] pointer-events-none"
        >
          <div className="absolute top-[24%] left-[7%] w-px h-24 bg-gradient-to-b from-transparent via-brand-gold/25 to-transparent" />
          <div className="absolute top-[24%] right-[7%] w-px h-24 bg-gradient-to-b from-transparent via-brand-gold/25 to-transparent" />
          <div className="absolute top-[calc(24%-1px)] left-[7%] w-5 h-px bg-brand-gold/25" />
          <div className="absolute top-[calc(24%-1px)] right-[7%] w-5 h-px bg-brand-gold/25" />
          <div className="absolute bottom-[24%] left-[9%] w-14 h-14 border border-brand-gold/12 rounded-full" />
          <div className="absolute top-[30%] right-[11%] w-9 h-9 border border-brand-gold/12 rotate-45" />
        </motion.div>

        {/* Hero content */}
        <motion.div
          style={{ y: textY, opacity: heroOpacity }}
          className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-16 md:pt-20"
        >
          {/* 3D-tilting glass card — motion value driven */}
          <motion.div
            style={{ rotateX: cardRotateX, rotateY: cardRotateY, transformPerspective: 1200 }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="glass-hero px-8 md:px-20 py-12 md:py-20 relative overflow-hidden"
          >
            {/* Animated shimmer */}
            <motion.div
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
              className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/6 to-transparent skew-x-12 pointer-events-none"
            />

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, delay: 0.9 }}
              className="w-14 h-px bg-gradient-to-r from-transparent via-brand-gold to-transparent mx-auto mb-7"
            />

            <motion.span
              initial={{ opacity: 0, letterSpacing: '0.05em' }}
              animate={{ opacity: 1, letterSpacing: '0.45em' }}
              transition={{ duration: 2, delay: 0.8 }}
              className="block text-[10px] md:text-[11px] uppercase font-medium text-brand-gold mb-7 text-glow"
            >
              Established in KGF · SHAID
            </motion.span>

            <h1 className="text-5xl md:text-8xl font-serif font-light mb-7 tracking-tighter leading-[0.9] text-brand-ink">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.1 }}
                className="inline-block"
              >
                The{" "}
                <span className="italic font-normal text-brand-muted">
                  {"Arabic".split("").map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.1, delay: 1.2 + i * 0.1 }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
              </motion.span>
              <br />
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 2.0 }}
                className="text-brand-gold select-none relative inline-block mt-2"
              >
                {"Collection".split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.1, delay: 2.1 + i * 0.1 }}
                  >
                    {char}
                  </motion.span>
                ))}

                {/* Blinking Cursor */}
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{
                    duration: 0.8,
                    repeat: 4,
                    delay: 2.1,
                    ease: "linear"
                  }}
                  className="inline-block w-[2px] h-[0.8em] bg-brand-gold ml-1 align-middle"
                />

                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.5, delay: 4.0 }}
                  className="absolute -bottom-2 left-0 h-px bg-gradient-to-r from-brand-gold via-brand-gold/50 to-transparent"
                />
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.7 }}
              className="text-sm md:text-base font-light mb-9 tracking-wider text-brand-muted max-w-md mx-auto leading-relaxed"
            >
              Where ancestral heritage meets the avant-garde of modern luxury — curated in Kolar Gold Fields.
            </motion.p>

            {/* Heritage stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 2 }}
              className="flex items-center justify-center gap-5 mb-9"
            >
              {[
                { label: 'Est.', value: '2020' },
                { label: 'City', value: 'KGF' },
                { label: 'State', value: 'Karnataka' },
                { label: 'Nation', value: 'India' },
              ].map((stat, i) => (
                <div key={stat.label} className="flex items-center gap-5">
                  <div className="text-center">
                    <div className="text-[7px] uppercase tracking-[0.3em] text-brand-muted/40 mb-0.5">{stat.label}</div>
                    <div className="text-[9px] uppercase tracking-[0.2em] text-brand-gold font-medium">{stat.value}</div>
                  </div>
                  {i < 3 && <div className="w-px h-4 bg-brand-ink/10" />}
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <Link
                to="/collections"
                className="group relative px-10 py-3.5 overflow-hidden border border-brand-gold/50 hover:border-brand-gold transition-all duration-400"
              >
                <div className="absolute inset-0 bg-brand-gold translate-y-full group-hover:translate-y-0 transition-transform duration-400" />
                <span className="relative text-[10px] uppercase tracking-[0.4em] text-brand-ink group-hover:text-white transition-colors duration-400">
                  Explore Collection
                </span>
              </Link>
              <Link
                to="/about"
                className="group text-[10px] uppercase tracking-[0.4em] text-brand-muted hover:text-brand-ink transition-colors duration-300 relative py-2"
              >
                Our Legacy
                <div className="absolute bottom-0 left-0 w-0 h-px bg-brand-gold group-hover:w-full transition-all duration-400" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, delay: 2.7 }}
              className="w-14 h-px bg-gradient-to-r from-transparent via-brand-gold to-transparent mx-auto mt-9"
            />
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5"
        >
          <span className="text-[7px] uppercase tracking-[0.5em] text-brand-muted/35">Scroll to Discover</span>
          <div className="relative w-px h-14 bg-brand-ink/6 overflow-hidden">
            <motion.div
              animate={{ y: ['-100%', '100%'] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-gold to-transparent"
            />
          </div>
        </motion.div>
      </section>

      {/* ── Featured Treasures (Dynamic) ── */}
      <section className="py-28 px-4 bg-white/40">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-[10px] uppercase tracking-[0.5em] text-brand-gold font-medium mb-4 block">Selected for You</span>
            <h2 className="text-4xl md:text-6xl font-serif font-light text-brand-ink mb-5">
              Featured <span className="italic text-brand-gold">Artifacts</span>
            </h2>
            <div className="w-10 h-px bg-brand-gold/40 mx-auto" />
          </motion.div>

          <FeaturedArtifacts />

          <div className="text-center mt-20">
            <Link
              to="/collections"
              className="text-[10px] uppercase tracking-[0.4em] text-brand-muted hover:text-brand-ink transition-colors group flex items-center justify-center gap-3"
            >
              <span>View All Treasures</span>
              <div className="w-6 h-px bg-brand-gold group-hover:w-12 transition-all duration-500" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Featured Categories ── */}
      <section className="py-28 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            className="text-center mb-20"
          >
            <span className="text-[10px] uppercase tracking-[0.5em] text-brand-gold font-medium mb-4 block">Curated Collections</span>
            <h2 className="text-4xl md:text-6xl font-serif font-light text-brand-ink mb-5">
              Bespoke <span className="italic text-brand-gold">Excellence</span>
            </h2>
            <div className="w-10 h-px bg-brand-gold/40 mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Clothes', img: '1549439602-43ebca23d7af', desc: 'Traditional & Contemporary Wear' },
              { name: 'Watches', img: '1524592094714-0f0654e359f3', desc: 'Rare Timepieces' },
              { name: 'Perfumes', img: '1541643600914-78b084683601', desc: 'Exotic Arabian Scents' },
            ].map(({ name, img, desc }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.12, duration: 0.7 }}
              >
                <Link
                  to={`/collections?category=${name}`}
                  className="group relative h-[480px] overflow-hidden block shadow-luxury transition-transform duration-500 hover:-translate-y-2"
                >
                  <img
                    src={`https://images.unsplash.com/photo-${img}?auto=format&fit=crop&q=75&w=900`}
                    alt={name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 scale-105 group-hover:scale-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/70 via-brand-ink/15 to-transparent" />
                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <p className="text-white/55 text-[8px] uppercase tracking-[0.4em] mb-1.5 font-medium">{desc}</p>
                    <h3 className="text-white text-3xl font-serif font-light tracking-tight mb-2.5">{name}</h3>
                    <div className="overflow-hidden h-4">
                      <span className="text-brand-gold-light text-[8px] uppercase tracking-[0.4em] block translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                        View Archive →
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
