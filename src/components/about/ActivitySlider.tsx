import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ActivityImage } from '../../types';
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  ZoomIn,
  Camera,
  Sparkles
} from 'lucide-react';

interface ActivitySliderProps {
  images: ActivityImage[];
  onOpenImage?: (url: string) => void;
  autoPlayInterval?: number;
}

export const ActivitySlider: React.FC<ActivitySliderProps> = ({
  images,
  onOpenImage,
  autoPlayInterval = 5000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const touchStartXRef = useRef<number | null>(null);

  // Filter out any image items with missing url
  const validImages = (images || []).filter((img) => Boolean(img?.url));

  // Auto-slide effect
  useEffect(() => {
    if (validImages.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % validImages.length);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [validImages.length, isPaused, autoPlayInterval]);

  if (validImages.length === 0) {
    return null;
  }

  const currentImage = validImages[currentIndex] || validImages[0];

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % validImages.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    if (Math.abs(deltaX) > 40) {
      if (deltaX > 0) {
        handlePrev();
      } else {
        handleNext();
      }
    }
    touchStartXRef.current = null;
  };

  return (
    <div
      className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Main Slide Stage */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden bg-slate-900 flex items-center justify-center">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentImage.id || `img-${currentIndex}`}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 80 : -80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -80 : 80 }}
            transition={{ duration: 0.45, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full cursor-pointer"
            onClick={() => onOpenImage && onOpenImage(currentImage.url)}
            title="คลิกเพื่อดูภาพกิจกรรมขนาดใหญ่"
          >
            <img
              src={currentImage.url}
              alt={currentImage.title || 'ภาพกิจกรรม'}
              className="w-full h-full object-cover select-none transition-transform duration-700 group-hover:scale-103"
            />
            {/* Top gradient for badges */}
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-slate-950/80 via-slate-950/30 to-transparent pointer-events-none" />

            {/* Bottom gradient for captions */}
            <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-slate-950 via-slate-950/75 to-transparent pointer-events-none" />
          </motion.div>
        </AnimatePresence>

        {/* Top Badges & Controls */}
        <div className="absolute top-3 sm:top-4 inset-x-3 sm:inset-x-5 flex items-center justify-between pointer-events-none z-10">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 text-lime-400 text-xs font-bold shadow-lg">
              <Camera className="w-3.5 h-3.5" />
              <span>ภาพกิจกรรม & ผลงานติดตั้ง</span>
            </span>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            {/* Pause / Play button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsPaused(!isPaused);
              }}
              className="p-2 rounded-xl bg-slate-950/70 hover:bg-slate-900 backdrop-blur-md text-slate-300 hover:text-white border border-slate-700/80 text-xs transition-colors shadow-lg cursor-pointer"
              title={isPaused ? 'เล่นสไลด์อัตโนมัติ' : 'หยุดสไลด์ชั่วคราว'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>

            {/* Zoom / Lightbox button */}
            {onOpenImage && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenImage(currentImage.url);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-slate-950/70 hover:bg-slate-900 backdrop-blur-md text-slate-300 hover:text-white border border-slate-700/80 text-xs font-medium transition-colors shadow-lg flex items-center gap-1.5 cursor-pointer"
                title="ขยายดูภาพขนาดเต็ม"
              >
                <ZoomIn className="w-3.5 h-3.5 text-lime-400" />
                <span className="hidden sm:inline">ดูภาพขยาย</span>
              </button>
            )}

            {/* Counter */}
            <span className="px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-700 text-xs font-mono font-bold text-slate-300 shadow-lg">
              {currentIndex + 1} / {validImages.length}
            </span>
          </div>
        </div>

        {/* Bottom Caption Overlay */}
        <div className="absolute bottom-3 sm:bottom-4 inset-x-3 sm:inset-x-5 z-10 pointer-events-none">
          <div className="max-w-3xl space-y-1">
            {currentImage.title && (
              <h3 className="text-sm sm:text-lg md:text-xl font-black text-white drop-shadow-md flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-lime-400 shrink-0 hidden sm:inline" />
                <span>{currentImage.title}</span>
              </h3>
            )}
            {currentImage.description && (
              <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 drop-shadow-md font-normal leading-relaxed">
                {currentImage.description}
              </p>
            )}
          </div>
        </div>

        {/* Previous & Next Navigation Buttons */}
        {validImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="ภาพก่อนหน้า"
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-slate-950/75 hover:bg-slate-900 text-white border border-slate-700/90 backdrop-blur-md flex items-center justify-center transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer z-10"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="ภาพถัดไป"
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-slate-950/75 hover:bg-slate-900 text-white border border-slate-700/90 backdrop-blur-md flex items-center justify-center transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer z-10"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </>
        )}
      </div>

      {/* Navigation Indicators & Thumbnail Bar */}
      {validImages.length > 1 && (
        <div className="p-3 bg-slate-950/95 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Dot Indicators */}
          <div className="flex items-center gap-1.5">
            {validImages.map((img, idx) => (
              <button
                key={img.id || idx}
                type="button"
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                }}
                className={`transition-all duration-300 rounded-full h-2 cursor-pointer ${
                  idx === currentIndex
                    ? 'w-7 bg-lime-400'
                    : 'w-2 bg-slate-700 hover:bg-slate-500'
                }`}
                aria-label={`ไปยังภาพที่ ${idx + 1}`}
              />
            ))}
          </div>

          {/* Quick Mini Thumbnails (hidden on tiny screens, visible sm+) */}
          <div className="hidden sm:flex items-center gap-2 overflow-x-auto max-w-md py-0.5">
            {validImages.map((img, idx) => (
              <button
                key={img.id || idx}
                type="button"
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                }}
                className={`relative w-12 h-8 rounded-lg overflow-hidden shrink-0 border transition-all cursor-pointer ${
                  idx === currentIndex
                    ? 'border-lime-400 ring-2 ring-lime-400/30 scale-105'
                    : 'border-slate-800 opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={img.url}
                  alt={img.title || `สไลด์ ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
