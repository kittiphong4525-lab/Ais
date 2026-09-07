import React from 'react';
import { motion } from 'motion/react';
import { PromotionItem } from '../../types';
import { Sparkles, Calendar, ArrowRight } from 'lucide-react';

interface PromotionCardProps {
  promo: PromotionItem;
  onAction: (link: string) => void;
}

export const PromotionCard: React.FC<PromotionCardProps> = ({ promo, onAction }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.5 }}
      className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-emerald-600 via-lime-600 to-orange-500 text-white relative overflow-hidden group shadow-2xl border border-white/25"
      id={`promo-card-${promo.id}`}
    >
      {/* Background ambient lighting */}
      <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/15 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-black/15 rounded-full blur-2xl pointer-events-none" />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
        {/* Left/Main info */}
        <div className="md:col-span-8 space-y-3.5">
          <div className="flex items-center gap-2 flex-wrap">
            {promo.badge && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-white text-emerald-800 shadow-md">
                <Sparkles className="w-3 h-3 text-amber-500" />
                {promo.badge}
              </span>
            )}
            {promo.discountBadge && (
              <span className="px-3 py-1 rounded-full text-xs font-black bg-orange-600 text-white border border-white/40 shadow-sm">
                {promo.discountBadge}
              </span>
            )}
            {(promo.end_date || promo.endDate) && (
              <span className="text-xs text-white/95 flex items-center gap-1 font-semibold bg-black/25 px-3 py-1 rounded-full border border-white/20 backdrop-blur-xs">
                <Calendar className="w-3.5 h-3.5 text-amber-300" />
                ถึง {new Date(promo.end_date || promo.endDate || '').toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
            )}
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white leading-snug tracking-tight drop-shadow-xs">
            {promo.title}
          </h3>

          {promo.subtitle && (
            <p className="text-sm sm:text-base font-black text-amber-200 drop-shadow-xs">
              {promo.subtitle}
            </p>
          )}

          <p className="text-xs sm:text-sm text-white/95 leading-relaxed font-normal bg-black/15 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
            {promo.description}
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                const target = promo.cta_link || promo.ctaLink || 'https://line.me/ti/p/@aisfibrefanclub';
                if (target === '/apply' || target.includes('apply')) {
                  window.open('https://line.me/ti/p/@aisfibrefanclub', '_blank');
                } else if (target.startsWith('http')) {
                  window.open(target, '_blank');
                } else {
                  onAction(target);
                }
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 via-lime-400 to-orange-500 hover:from-emerald-300 hover:via-lime-300 hover:to-orange-400 text-slate-950 text-xs font-black transition-all shadow-xl shadow-orange-500/20 hover:scale-[1.02] cursor-pointer"
            >
              <span>{promo.cta_text}</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </div>
        </div>

        {/* Right Thumbnail/Graphic */}
        <div className="md:col-span-4 relative rounded-2xl overflow-hidden aspect-video md:aspect-square bg-black/20 border border-white/30 flex items-center justify-center group-hover:scale-[1.02] transition-transform shadow-lg">
          <img
            src={promo.image}
            alt={promo.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-2.5 right-2.5">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-lg bg-white/95 text-slate-900 border border-white/50 backdrop-blur-xs shadow-sm">
              AIS Fibre Official
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
