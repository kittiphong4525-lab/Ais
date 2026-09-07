import React from 'react';
import { motion } from 'motion/react';
import { BannerItem } from '../../types';
import { Sparkles, ArrowRight, MessageCircle, PhoneCall } from 'lucide-react';

interface MiddleBannerProps {
  banner: BannerItem;
  onNavigate: (path: string) => void;
  onOpenLine?: (pkgName?: string) => void;
}

export const MiddleBanner: React.FC<MiddleBannerProps> = ({
  banner,
  onNavigate,
  onOpenLine,
}) => {
  if (!banner || !banner.active) return null;

  const handleClick = () => {
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

    onNavigate(banner.cta_link);
  };

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

  return (
    <motion.div
      id={`middle-banner-${banner.id}`}
      onClick={handleClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.5 }}
      className="group relative overflow-hidden rounded-3xl bg-[#0d1622]/95 border border-white/15 hover:border-emerald-400/50 transition-all duration-300 shadow-2xl shadow-black/60 cursor-pointer backdrop-blur-2xl"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={banner.image}
          alt={banner.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-25"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d1622] via-[#0d1622]/95 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 sm:p-8 lg:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          {banner.badge && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{banner.badge}</span>
            </div>
          )}
          <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight group-hover:opacity-90 transition-opacity">
            {renderDualColorTitle(banner.title)}
          </h3>
          {(banner.subtitle || banner.description) && (
            <p className="text-xs sm:text-sm text-slate-200 font-normal leading-relaxed">
              {banner.subtitle || banner.description}
            </p>
          )}
        </div>

        {banner.cta_text && (
          <div className="shrink-0">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-lime-400 to-orange-500 hover:from-emerald-300 hover:via-lime-300 hover:to-orange-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-500/25 cursor-pointer"
            >
              <span>{banner.cta_text}</span>
              {banner.link_type === 'LINE' ? (
                <MessageCircle className="w-4 h-4" />
              ) : banner.link_type === 'PHONE' ? (
                <PhoneCall className="w-4 h-4" />
              ) : (
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              )}
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

