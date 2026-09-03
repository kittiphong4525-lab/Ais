import React from 'react';
import { motion } from 'motion/react';
import { PackageItem } from '../../types';
import {
  Download,
  Upload,
  Check,
  Tv,
  Smartphone,
  Router,
  ArrowRight,
  Sparkles,
  MessageCircle
} from 'lucide-react';

interface PackageCardProps {
  pkg: PackageItem;
  onApply: (pkg: PackageItem) => void;
  onViewDetails?: (pkg: PackageItem) => void;
  onOpenLine?: () => void;
  featured?: boolean;
}

export const PackageCard: React.FC<PackageCardProps> = ({
  pkg,
  onApply,
  onViewDetails,
  onOpenLine,
  featured = false,
}) => {
  const download = pkg.download_speed ?? (pkg as any).downloadSpeed ?? 500;
  const upload = pkg.upload_speed ?? (pkg as any).uploadSpeed ?? 500;
  const price = pkg.price ?? (pkg as any).monthlyPrice ?? 499;
  const contract = pkg.contract_month ?? (pkg as any).contractMonths ?? 24;
  const featuresList = (pkg.features || []).map(f => typeof f === 'string' ? f : (f as any).text);
  const equipmentList = pkg.equipment || [];

  const categoryFallbacks: Record<string, string> = {
    BROADBAND24: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    HOME: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
    POPULAR: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80',
    ENTERTAINMENT: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600&auto=format&fit=crop&q=80',
    POWER4: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600&auto=format&fit=crop&q=80',
    GAMER: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
    CONDO: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=80',
    SMARTHOME: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
    BUSINESS: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80',
  };

  const displayImage = pkg.image || categoryFallbacks[pkg.category] || categoryFallbacks.POPULAR;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4 }}
      className={`h-full rounded-2xl p-4 sm:p-4.5 bg-gradient-to-br from-emerald-600 via-lime-600 to-orange-500 text-white flex flex-col justify-between relative group shadow-xl border border-white/25 overflow-hidden transition-all duration-300 ${
        featured || (pkg as any).isFeatured
          ? 'ring-3 ring-amber-300/90 shadow-emerald-950/60'
          : ''
      }`}
      id={`pkg-card-${pkg.id}`}
    >
      {/* Background ambient lighting */}
      <div className="absolute -right-12 -top-12 w-36 h-36 bg-white/15 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 w-36 h-36 bg-black/20 rounded-full blur-2xl pointer-events-none" />

      {/* Top Image Banner - Full Bleed at the Top */}
      <div className="w-[calc(100%+2rem)] sm:w-[calc(100%+2.25rem)] -mx-4 -mt-4 sm:-mx-4.5 sm:-mt-4.5 h-36 sm:h-40 overflow-hidden relative mb-3 bg-slate-950 border-b border-white/20 shadow-sm group/img shrink-0">
        <img
          src={displayImage}
          alt={pkg.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src = categoryFallbacks.POPULAR;
          }}
        />
        {/* Gradient overlay for text/badge readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40 pointer-events-none" />

        {/* Floating Top Badges */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-1 pointer-events-none">
          <div className="flex items-center gap-1 flex-wrap">
            {pkg.badge && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-white text-emerald-800 shadow-sm border border-white/40">
                <Sparkles className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                {pkg.badge}
              </span>
            )}
            {(pkg as any).isBestSeller && (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-orange-500 text-white shadow-sm border border-white/30">
                ยอดนิยม
              </span>
            )}
          </div>
          <span className="text-[9px] font-bold text-white bg-black/65 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/25">
            สัญญา {contract} ด.
          </span>
        </div>

        {/* Bottom overlay in image: Speed / Category Indicator */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
          <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-100 bg-black/60 px-2 py-0.5 rounded-md border border-white/20 backdrop-blur-xs">
            {pkg.category || 'AIS FIBRE'}
          </span>
          <span className="text-[11px] font-black text-amber-200 font-mono bg-black/70 px-2 py-0.5 rounded-md border border-white/20 backdrop-blur-xs">
            ⚡ {download >= 1000 ? `${download / 1000}G` : `${download}M`} / {upload >= 1000 ? `${upload / 1000}G` : `${upload}M`}
          </span>
        </div>
      </div>

      {/* Package Header */}
      <div className="space-y-1.5 mb-3 relative z-10">
        <h3 className="text-lg sm:text-xl font-black text-white tracking-tight drop-shadow-md group-hover:text-amber-300 transition-colors line-clamp-1">
          {pkg.name}
        </h3>
        <p className="text-xs text-slate-100 font-semibold leading-relaxed bg-slate-950/85 backdrop-blur-md p-2.5 rounded-xl border border-white/25 min-h-[42px] line-clamp-2 flex items-center shadow-md">
          {pkg.description || (pkg as any).tagline || 'เน็ตบ้านไฟเบอร์อัจฉริยะ AIS FIBRE NET 999'}
        </p>
      </div>

      {/* Speed Visual Box */}
      <div className="rounded-xl bg-slate-950/80 backdrop-blur-md p-2.5 border border-white/25 mb-3 space-y-1.5 text-white relative z-10 shrink-0 shadow-md">
        <div className="grid grid-cols-2 gap-2 text-center divide-x divide-white/20">
          <div>
            <div className="flex items-center justify-center gap-1.5 text-[11px] font-black text-amber-300 tracking-wide">
              <Download className="w-3.5 h-3.5 text-amber-300 stroke-[2.5]" />
              <span>ดาวน์โหลด</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white font-mono mt-0.5 drop-shadow-md tracking-tight">
              {download >= 1000 ? `${download / 1000} Gbps` : `${download} Mbps`}
            </div>
          </div>
          <div className="pl-2">
            <div className="flex items-center justify-center gap-1.5 text-[11px] font-black text-emerald-300 tracking-wide">
              <Upload className="w-3.5 h-3.5 text-emerald-300 stroke-[2.5]" />
              <span>อัปโหลด</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white font-mono mt-0.5 drop-shadow-md tracking-tight">
              {upload >= 1000 ? `${upload / 1000} Gbps` : `${upload} Mbps`}
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Price Block */}
      <div className="mb-3 pb-2.5 border-b border-white/25 relative z-10 shrink-0">
        <span className="text-[11px] font-black text-yellow-300 uppercase tracking-wider block mb-0.5 drop-shadow-sm">
          ราคาพิเศษเริ่มต้น
        </span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl sm:text-4xl font-black text-yellow-300 tracking-tight font-display drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            ฿{price}
          </span>
          <span className="text-xs font-black text-white bg-slate-950/80 px-2 py-0.5 rounded-md border border-white/25 shadow-xs">
            /เดือน
          </span>
        </div>
      </div>

      {/* Hardware & Features Included */}
      <div className="space-y-1.5 mb-3.5 flex-1 relative z-10 flex flex-col justify-start min-h-[105px]">
        {equipmentList.length > 0 ? (
          <div className="flex items-center gap-2 text-xs font-bold text-white bg-slate-950/80 backdrop-blur-md p-2 rounded-xl border border-white/20 shadow-sm">
            <Router className="w-4 h-4 text-amber-300 shrink-0 stroke-[2.2]" />
            <span className="line-clamp-1">{equipmentList.join(', ')}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs font-bold text-white bg-slate-950/80 backdrop-blur-md p-2 rounded-xl border border-white/20 shadow-sm">
            <Router className="w-4 h-4 text-amber-300 shrink-0 stroke-[2.2]" />
            <span className="line-clamp-1">ฟรี WiFi 6 Router สัญญาณแรงทั่วบ้าน</span>
          </div>
        )}

        {(pkg.tvIncluded || (pkg as any).playboxIncluded) && (
          <div className="flex items-center gap-2 text-xs font-bold text-white bg-slate-950/80 backdrop-blur-md p-2 rounded-xl border border-white/20 shadow-sm">
            <Tv className="w-4 h-4 text-purple-300 shrink-0 stroke-[2.2]" />
            <span className="line-clamp-1">กล่อง AIS PLAYBOX 4K คมชัดระดับพรีเมียม</span>
          </div>
        )}

        {(pkg as any).simIncluded && (
          <div className="flex items-center gap-2 text-xs font-bold text-white bg-slate-950/80 backdrop-blur-md p-2 rounded-xl border border-white/20 shadow-sm">
            <Smartphone className="w-4 h-4 text-teal-300 shrink-0 stroke-[2.2]" />
            <span className="line-clamp-1">ซิม 5G: {(pkg as any).simIncluded.data} ({(pkg as any).simIncluded.calls})</span>
          </div>
        )}

        {/* Feature bullet list with high-contrast dark container */}
        <div className="bg-slate-950/80 backdrop-blur-md p-2.5 rounded-xl border border-white/20 mt-auto shadow-sm">
          <ul className="space-y-1.5 text-xs text-white font-semibold">
            {featuresList.slice(0, 2).map((feat, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <Check className="w-4 h-4 text-amber-300 shrink-0 mt-0.5 stroke-[2.5]" />
                <span className="line-clamp-1 text-white font-bold">{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-1 relative z-10">
        <button
          type="button"
          onClick={() => onApply(pkg)}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-400 via-lime-400 to-orange-500 hover:from-emerald-300 hover:via-lime-300 hover:to-orange-400 text-slate-950 font-black text-sm shadow-xl shadow-black/40 flex items-center justify-center gap-2 transition-all cursor-pointer border border-white/30 hover:scale-[1.02] active:scale-[0.98]"
        >
          <span className="text-sm font-black text-slate-950 tracking-wide drop-shadow-xs">สมัครติดตั้งแพ็กเกจนี้</span>
          <ArrowRight className="w-4 h-4 text-slate-950 stroke-[3]" />
        </button>

        <div className="grid grid-cols-2 gap-2">
          {onViewDetails && (
            <button
              type="button"
              onClick={() => onViewDetails(pkg)}
              className="w-full py-2 px-2.5 rounded-xl bg-slate-950/90 hover:bg-slate-900 text-white font-black text-xs transition-colors cursor-pointer border border-white/30 backdrop-blur-md shadow-sm flex items-center justify-center gap-1.5 hover:border-white/50"
            >
              <span className="font-black text-white text-xs">ดูรายละเอียด</span>
            </button>
          )}
          {onOpenLine && (
            <button
              type="button"
              onClick={onOpenLine}
              className="w-full py-2 px-2.5 rounded-xl bg-[#06C755] hover:bg-[#05b04a] text-white font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-[#06C755]/30 border border-white/30 hover:scale-[1.01]"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white text-[#06C755]" />
              <span className="font-black text-white text-xs tracking-wide">ทักแชทไลน์</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
