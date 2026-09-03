import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PackageItem } from '../../types';
import { PackageCard } from '../common/PackageCard';
import {
  Flame,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Play,
  Pause,
  Layers,
} from 'lucide-react';

interface FeaturedPackagesCarouselProps {
  packages: PackageItem[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onApply: (pkg?: PackageItem) => void;
  onViewDetails: (pkg: PackageItem) => void;
  onOpenLine: (pkg?: PackageItem | string) => void;
  onNavigate: (path: string, params?: any) => void;
  loading?: boolean;
}

export const FeaturedPackagesCarousel: React.FC<FeaturedPackagesCarouselProps> = ({
  packages,
  activeTab = 'ALL',
  onTabChange,
  onApply,
  onViewDetails,
  onOpenLine,
  onNavigate,
  loading = false,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isUserInteracting, setIsUserInteracting] = useState(false);

  // Filter packages based on activeTab. 'ALL' includes all packages.
  const displayedPackages = packages.filter((pkg) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'HOT') return pkg.category === 'POPULAR' || pkg.id.includes('bb24') || pkg.id.includes('lite');
    if (activeTab === 'BROADBAND24') return pkg.category === 'BROADBAND24' || pkg.name.includes('Broadband 24');
    if (activeTab === 'ENTERTAINMENT') return pkg.tvIncluded || pkg.category === 'ENTERTAINMENT';
    if (activeTab === 'POWER4') return pkg.category === 'POWER4' || pkg.name.includes('POWER4') || pkg.name.includes('Smart Gang');
    if (activeTab === 'CONDO') return pkg.category === 'CONDO' || pkg.name.includes('Condo');
    return true;
  });

  const checkScrollPosition = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 15);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 15);

    const item = el.querySelector<HTMLElement>('.package-slide-item');
    const step = item ? item.offsetWidth + 18 : el.clientWidth * 0.8;
    const currentIndex = Math.round(scrollLeft / step);
    setActiveIndex(Math.max(0, Math.min(currentIndex, displayedPackages.length - 1)));
  }, [displayedPackages.length]);

  // Scroll smoothly by direction
  const handleScroll = useCallback((direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const item = el.querySelector<HTMLElement>('.package-slide-item');
    const step = item ? item.offsetWidth + 18 : el.clientWidth * 0.8;

    if (direction === 'right') {
      const isAtEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 20;
      if (isAtEnd) {
        // Loop back smoothly to the beginning
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollTo({ left: el.scrollLeft + step, behavior: 'smooth' });
      }
    } else {
      const isAtStart = el.scrollLeft <= 20;
      if (isAtStart) {
        // Jump to end
        el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' });
      } else {
        el.scrollTo({ left: el.scrollLeft - step, behavior: 'smooth' });
      }
    }
  }, []);

  const scrollToSlide = (index: number) => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const item = el.querySelector<HTMLElement>('.package-slide-item');
    const step = item ? item.offsetWidth + 18 : el.clientWidth * 0.8;

    el.scrollTo({
      left: index * step,
      behavior: 'smooth',
    });
  };

  // Auto-scroll loop effect with pause on hover/interaction
  useEffect(() => {
    if (!isAutoPlay || isUserInteracting || displayedPackages.length <= 1) return;

    const interval = setInterval(() => {
      handleScroll('right');
    }, 4000); // 4-second auto slide

    return () => clearInterval(interval);
  }, [isAutoPlay, isUserInteracting, displayedPackages.length, handleScroll]);

  // Reset scroll and re-attach listeners on activeTab changes
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    el.scrollTo({ left: 0, behavior: 'smooth' });
    checkScrollPosition();

    el.addEventListener('scroll', checkScrollPosition, { passive: true });
    window.addEventListener('resize', checkScrollPosition);

    return () => {
      el.removeEventListener('scroll', checkScrollPosition);
      window.removeEventListener('resize', checkScrollPosition);
    };
  }, [activeTab, checkScrollPosition]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative" id="featured-packages-section">
      {/* Header with Title, Auto-Slide indicator, and Navigation Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold mb-2">
            <Flame className="w-3.5 h-3.5" />
            <span>AIS 3BB FIBRE 3 PROMOTIONS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-snug sm:leading-normal">
            <span className="text-lime-300 drop-shadow-[0_2px_12px_rgba(190,242,100,0.3)]">🔥 รวมแพ็กเกจทุกโปรโมชั่น</span>{' '}
            <span className="text-[#FF5500] drop-shadow-[0_2px_12px_rgba(255,85,0,0.4)]">แห่งปี 2026</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 sm:mt-2.5 leading-relaxed max-w-2xl">
            รวมทุกโปรโมชั่นเน็ตบ้านไฟเบอร์ออพติก สปีดแรงเต็มพิกัด คุ้มค่าที่สุด สไลด์เลือกดูได้ทันที
          </p>
        </div>

        {/* Carousel Action Bar (Navigation Buttons) */}
        <div className="flex items-center justify-between md:justify-end gap-3 flex-wrap">
          <button
            onClick={() => onNavigate('/packages')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors py-2 px-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40"
          >
            <span>ดูทั้งหมด ({packages.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Previous / Next Manual Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleScroll('left')}
              aria-label="Previous slide"
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all border bg-slate-900/90 text-white border-slate-700 hover:border-emerald-500 hover:bg-emerald-950/60 hover:text-emerald-400 shadow-md hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() => handleScroll('right')}
              aria-label="Next slide"
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all border bg-slate-900/90 text-white border-slate-700 hover:border-emerald-500 hover:bg-emerald-950/60 hover:text-emerald-400 shadow-md hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Tabs (Includes ALL as first option) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-thin scrollbar-thumb-slate-800">
        <button
          onClick={() => onTabChange('ALL')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
            activeTab === 'ALL'
              ? 'bg-gradient-to-r from-emerald-400 via-lime-400 to-orange-500 text-slate-950 border-transparent font-black shadow-lg shadow-orange-500/20'
              : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
          }`}
        >
          🌟 รวมทุกโปรโมชั่น ({packages.length})
        </button>
        <button
          onClick={() => onTabChange('HOT')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
            activeTab === 'HOT'
              ? 'bg-gradient-to-r from-emerald-400 via-lime-400 to-orange-500 text-slate-950 border-transparent font-black shadow-lg shadow-orange-500/20'
              : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
          }`}
        >
          🔥 แพ็กเกจยอดนิยม (Hot)
        </button>
        <button
          onClick={() => onTabChange('BROADBAND24')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
            activeTab === 'BROADBAND24'
              ? 'bg-gradient-to-r from-emerald-400 via-lime-400 to-orange-500 text-slate-950 border-transparent font-black shadow-lg shadow-orange-500/20'
              : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
          }`}
        >
          🏠 Broadband 24 (เน็ตอย่างเดียว)
        </button>
        <button
          onClick={() => onTabChange('ENTERTAINMENT')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
            activeTab === 'ENTERTAINMENT'
              ? 'bg-gradient-to-r from-emerald-400 via-lime-400 to-orange-500 text-slate-950 border-transparent font-black shadow-lg shadow-orange-500/20'
              : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
          }`}
        >
          📺 เน็ต + กล่อง PLAYBOX
        </button>
        <button
          onClick={() => onTabChange('POWER4')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
            activeTab === 'POWER4'
              ? 'bg-gradient-to-r from-emerald-400 via-lime-400 to-orange-500 text-slate-950 border-transparent font-black shadow-lg shadow-orange-500/20'
              : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
          }`}
        >
          📱 POWER4 (เน็ตบ้าน + ซิม 5G)
        </button>
        <button
          onClick={() => onTabChange('CONDO')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
            activeTab === 'CONDO'
              ? 'bg-gradient-to-r from-emerald-400 via-lime-400 to-orange-500 text-slate-950 border-transparent font-black shadow-lg shadow-orange-500/20'
              : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
          }`}
        >
          🏢 คอนโด & หอพัก (269.-)
        </button>
      </div>

      {/* Carousel Container with Smooth Motion & Equal Heights */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[620px] rounded-3xl bg-slate-900 border border-slate-800" />
          ))}
        </div>
      ) : displayedPackages.length === 0 ? (
        <div className="py-12 text-center text-slate-400 bg-slate-900/40 rounded-3xl border border-slate-800">
          ไม่พบแพ็กเกจในหมวดหมู่นี้
        </div>
      ) : (
        <div
          className="relative group"
          onMouseEnter={() => setIsUserInteracting(true)}
          onMouseLeave={() => setIsUserInteracting(false)}
          onTouchStart={() => setIsUserInteracting(true)}
          onTouchEnd={() => {
            // resume after 3 seconds of touch end
            setTimeout(() => setIsUserInteracting(false), 3000);
          }}
        >
          {/* Edge Left Gradient Fade for visual polish */}
          {canScrollLeft && (
            <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-14 bg-gradient-to-r from-slate-950/90 to-transparent z-10 pointer-events-none rounded-l-3xl transition-opacity duration-300" />
          )}

          {/* Edge Right Gradient Fade */}
          {canScrollRight && (
            <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-14 bg-gradient-to-l from-slate-950/90 to-transparent z-10 pointer-events-none rounded-r-3xl transition-opacity duration-300" />
          )}

          {/* Floating Left Button (for desktop ease of use) */}
          <button
            onClick={() => handleScroll('left')}
            aria-label="Slide Left"
            className="hidden lg:flex absolute -left-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-slate-900/95 border-2 border-emerald-500/50 hover:border-emerald-400 text-white items-center justify-center shadow-xl shadow-black/60 hover:bg-emerald-950 hover:scale-110 active:scale-95 transition-all duration-200"
          >
            <ChevronLeft className="w-6 h-6 text-emerald-300" />
          </button>

          {/* Floating Right Button */}
          <button
            onClick={() => handleScroll('right')}
            aria-label="Slide Right"
            className="hidden lg:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-slate-900/95 border-2 border-emerald-500/50 hover:border-emerald-400 text-white items-center justify-center shadow-xl shadow-black/60 hover:bg-emerald-950 hover:scale-110 active:scale-95 transition-all duration-200"
          >
            <ChevronRight className="w-6 h-6 text-emerald-300" />
          </button>

          {/* Horizontal Scroll Track - Equal Height Cards */}
          <div
            ref={scrollContainerRef}
            className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-5 pt-1.5 px-1 scrollbar-none no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {displayedPackages.map((pkg, idx) => (
              <div
                key={pkg.id}
                className="package-slide-item shrink-0 snap-start w-[76vw] sm:w-[260px] md:w-[275px] lg:w-[285px] xl:w-[295px] max-w-[310px] flex flex-col transition-transform duration-300"
              >
                <PackageCard
                  pkg={pkg}
                  onApply={onApply}
                  onViewDetails={onViewDetails}
                  onOpenLine={() => onOpenLine(pkg)}
                  featured={pkg.category === 'POPULAR' || pkg.id === 'pkg-bb24-1000' || idx === 0}
                />
              </div>
            ))}
          </div>

          {/* Dots / Page Indicators at Bottom */}
          {displayedPackages.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-3 flex-wrap px-4">
              {displayedPackages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    activeIndex === idx
                      ? 'w-8 bg-gradient-to-r from-lime-400 to-[#FF5500] shadow-md shadow-emerald-500/50'
                      : 'w-2.5 bg-slate-700/60 hover:bg-slate-600'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};
