import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BannerItem } from '../../types';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  PhoneCall,
  MessageCircle,
  Pause,
  Play,
} from 'lucide-react';

interface BannerCarouselProps {
  banners: BannerItem[];
  onNavigate: (path: string) => void;
  onOpenLine?: (pkgName?: string) => void;
  autoPlayInterval?: number;
}

export const BannerCarousel: React.FC<BannerCarouselProps> = ({
  banners,
  onNavigate,
  onOpenLine,
  autoPlayInterval = 5500,
}) => {
  const activeBanners = banners.filter((b) => b.active);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const touchStartXRef = useRef<number | null>(null);

  // Auto-play timer
  useEffect(() => {
    if (activeBanners.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [activeBanners.length, isPaused, autoPlayInterval]);

  if (activeBanners.length === 0) {
    return null;
  }

  const currentBanner = activeBanners[currentIndex] || activeBanners[0];

  const renderDualColorTitle = (title: string) => {
    const words = title.trim().split(' ');
    if (words.length <= 1) {
      const mid = Math.ceil(title.length / 2);
      return (
        <>
          <span className="text-lime-300 drop-shadow-[0_2px_12px_rgba(190,242,100,0.3)]">{title.slice(0, mid)}</span>
          <span className="text-[#FF5500] drop-shadow-[0_2px_12px_rgba(255,85,0,0.4)]">{title.slice(mid)}</span>
        </>
      );
    }
    const mid = Math.ceil(words.length / 2);
    const firstHalf = words.slice(0, mid).join(' ');
    const secondHalf = words.slice(mid).join(' ');
    return (
      <>
        <span className="text-lime-300 drop-shadow-[0_2px_12px_rgba(190,242,100,0.3)]">{firstHalf}</span>{' '}
        <span className="text-[#FF5500] drop-shadow-[0_2px_12px_rgba(255,85,0,0.4)]">{secondHalf}</span>
      </>
    );
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  };

  const handleBannerClick = (banner: BannerItem) => {
    if (!banner.cta_link) return;

    if (banner.cta_link === '/apply' || banner.cta_link.includes('apply')) {
      window.open('https://line.me/ti/p/@aisfibrefanclub', '_blank');
      return;
    }

    if (banner.link_type === 'LINE' || banner.cta_link.includes('line.me')) {
      if (onOpenLine) {
        onOpenLine(banner.title);
      } else {
        window.open(banner.cta_link, '_blank');
      }
      return;
    }

    if (banner.link_type === 'PHONE' || banner.cta_link.startsWith('tel:')) {
      window.location.href = banner.cta_link;
      return;
    }

    if (banner.link_type === 'EXTERNAL' || banner.cta_link.startsWith('http')) {
      window.open(banner.cta_link, '_blank');
      return;
    }

    // Internal path
    onNavigate(banner.cta_link);
  };

  // Touch Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diff = touchStartXRef.current - e.changedTouches[0].clientX;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartXRef.current = null;
  };

  return (
    <div
      id="hero-banner-carousel"
      className="relative w-full overflow-hidden rounded-3xl bg-[#090e14] border border-white/10 shadow-2xl shadow-emerald-950/30 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Banner Slides Container */}
      <div className="relative min-h-[380px] sm:min-h-[460px] md:min-h-[500px] lg:min-h-[540px] flex items-center">
        {/* Background Image with Smooth AnimatePresence */}
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentBanner.id}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute inset-0 z-0"
          >
            {/* Image */}
            <img
              src={currentBanner.image}
              alt={currentBanner.title}
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />

            {/* Gradient Overlays for High-Contrast Text Legibility & Wallpaper Aesthetic */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#080d12] via-[#080d12]/85 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080d12] via-[#080d12]/40 to-transparent" />
            <div className="absolute inset-0 bg-radial-gradient from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
          </motion.div>
        </AnimatePresence>

        {/* Banner Content (Overlayed with Motion) */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 py-10 sm:py-16">
          <div className="max-w-2xl space-y-4 sm:space-y-6">
            {/* Badge Indicator */}
            {currentBanner.badge && (
              <motion.div
                key={`badge-${currentBanner.id}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs sm:text-sm font-semibold shadow-md backdrop-blur-md"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>{currentBanner.badge}</span>
              </motion.div>
            )}

            {/* Title */}
            <motion.h2
              key={`title-${currentBanner.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              onClick={() => handleBannerClick(currentBanner)}
              className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight cursor-pointer hover:opacity-90 transition-opacity drop-shadow-md"
            >
              {renderDualColorTitle(currentBanner.title)}
            </motion.h2>

            {/* Subtitle / Description */}
            {(currentBanner.subtitle || currentBanner.description) && (
              <motion.p
                key={`desc-${currentBanner.id}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-sm sm:text-base md:text-lg text-slate-200 line-clamp-3 leading-relaxed font-light drop-shadow"
              >
                {currentBanner.subtitle || currentBanner.description}
              </motion.p>
            )}

            {/* Action Buttons Row */}
            <motion.div
              key={`cta-${currentBanner.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2"
            >
              {currentBanner.cta_text && (
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  id="banner-cta-primary-btn"
                  onClick={() => handleBannerClick(currentBanner)}
                  className="px-6 py-3 sm:px-8 sm:py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-lime-400 to-orange-500 hover:from-emerald-300 hover:via-lime-300 hover:to-orange-400 text-slate-950 text-sm sm:text-base font-black flex items-center gap-2 transition-all shadow-xl shadow-orange-500/20 cursor-pointer"
                >
                  <span>{currentBanner.cta_text}</span>
                  {currentBanner.link_type === 'LINE' ? (
                    <MessageCircle className="w-4 h-4" />
                  ) : currentBanner.link_type === 'PHONE' ? (
                    <PhoneCall className="w-4 h-4" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                id="banner-check-coverage-btn"
                onClick={() => onNavigate('/check-area')}
                className="px-5 py-3 sm:px-6 sm:py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700/80 text-sm sm:text-base font-semibold backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>เช็คพื้นที่ติดตั้ง</span>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {activeBanners.length > 1 && (
        <>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            id="banner-prev-arrow-btn"
            onClick={handlePrev}
            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-slate-950/60 hover:bg-emerald-500 text-white hover:text-slate-950 border border-slate-700/60 backdrop-blur-md opacity-70 group-hover:opacity-100 transition-all shadow-lg cursor-pointer"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            id="banner-next-arrow-btn"
            onClick={handleNext}
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-slate-950/60 hover:bg-emerald-500 text-white hover:text-slate-950 border border-slate-700/60 backdrop-blur-md opacity-70 group-hover:opacity-100 transition-all shadow-lg cursor-pointer"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </motion.button>
        </>
      )}

      {/* Bottom Bar: Indicators & Controls */}
      <div className="absolute bottom-4 left-6 right-6 sm:bottom-6 sm:left-10 sm:right-10 z-30 flex items-center justify-between pointer-events-auto">
        {/* Slide Dots / Bars */}
        <div className="flex items-center gap-2">
          {activeBanners.map((_, idx) => {
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                }}
                className={`transition-all duration-300 rounded-full h-2 cursor-pointer ${
                  isCurrent
                    ? 'w-8 bg-emerald-400 shadow-md shadow-emerald-500/50'
                    : 'w-2 bg-slate-600/70 hover:bg-slate-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            );
          })}
        </div>

        {/* Counter & Pause/Play Toggle */}
        <div className="flex items-center gap-3">
          <div className="px-2.5 py-1 rounded-full bg-slate-950/70 border border-slate-800 text-[11px] font-mono text-slate-300 backdrop-blur-md">
            {currentIndex + 1} / {activeBanners.length}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsPaused(!isPaused);
            }}
            className="p-1.5 rounded-full bg-slate-950/70 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white backdrop-blur-md transition-colors cursor-pointer"
            title={isPaused ? 'เล่นสไลด์อัตโนมัติ' : 'หยุดสไลด์ชั่วคราว'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

