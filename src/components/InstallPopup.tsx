import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, X, Share } from 'lucide-react';

export default function InstallPopup() {
    const [show, setShow] = useState(false);
    const [platform, setPlatform] = useState<'android' | 'ios' | 'other'>('other');
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

    useEffect(() => {
        // Detect Platform
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIOS = /iphone|ipad|ipod/.test(userAgent);
        const isAndroid = /android/.test(userAgent);

        if (isIOS) setPlatform('ios');
        else if (isAndroid) setPlatform('android');

        // Handle Android/Chrome Prompt
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            // Show popup after a short delay
            setTimeout(() => setShow(true), 3000);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Handle iOS/Safari Manual Guidance (Show once if not standalone)
        const isStandalone = (window.navigator as any).standalone || window.matchMedia('(display-mode: standalone)').matches;
        if (isIOS && !isStandalone) {
            setTimeout(() => setShow(true), 4000);
        }

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') setShow(false);
        setDeferredPrompt(null);
    };

    if (!show) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-6 left-4 right-4 z-[100] md:left-auto md:right-8 md:w-80"
            >
                <div className="glass-card p-6 shadow-2xl border-brand-gold/20 flex flex-col gap-4 relative">
                    <button
                        onClick={() => setShow(false)}
                        className="absolute top-3 right-3 text-brand-muted/40 hover:text-brand-ink transition-colors"
                    >
                        <X size={16} />
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-brand-ink p-2 border border-brand-gold/30 shrink-0">
                            <img src="/assets/logo.png" alt="App Icon" className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <h3 className="text-sm font-serif font-medium text-brand-ink">Arabic Collection</h3>
                            <p className="text-[10px] text-brand-muted uppercase tracking-widest">Install Mobile App</p>
                        </div>
                    </div>

                    <p className="text-[11px] text-brand-ink/70 leading-relaxed">
                        {platform === 'ios'
                            ? "Experience the full luxury. Tap the Share button and select 'Add to Home Screen' to install."
                            : "Install our boutique app for a faster, immersive browsing experience."}
                    </p>

                    {platform === 'ios' ? (
                        <div className="flex items-center justify-center gap-2 py-2 border-t border-black/5 mt-1 animate-pulse">
                            <Share size={18} className="text-brand-gold" />
                            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-brand-gold">Guide Active</span>
                        </div>
                    ) : (
                        <button
                            onClick={handleInstall}
                            className="w-full bg-brand-ink text-white py-3 text-[10px] uppercase tracking-[0.2em] font-medium rounded-sm hover:bg-brand-gold transition-all duration-300 flex items-center justify-center gap-2 group"
                        >
                            <Download size={14} className="group-hover:translate-y-0.5 transition-transform" />
                            Install Now
                        </button>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
