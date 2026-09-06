import React, { useState, useEffect, useRef } from 'react';
import { PhoneCall, MessageCircle, MapPin, ChevronUp, MessageSquare } from 'lucide-react';

interface FloatingContactProps {
  onNavigate: (path: string) => void;
  onOpenLineModal?: () => void;
}

export const FloatingContact: React.FC<FloatingContactProps> = ({ onNavigate, onOpenLineModal }) => {
  const [expanded, setExpanded] = useState(true);
  const [countdown, setCountdown] = useState<number>(5);
  const [isHovered, setIsHovered] = useState(false);
  const userInteractedRef = useRef(false);

  // Auto-collapse after 5 seconds on load, pause when user hovers
  useEffect(() => {
    if (!expanded || userInteractedRef.current) return;

    const interval = setInterval(() => {
      if (isHovered) return;

      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setExpanded(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [expanded, isHovered]);

  const handleToggle = () => {
    userInteractedRef.current = true;
    setExpanded((prev) => !prev);
  };

  return (
    <div className="hidden lg:flex fixed bottom-6 right-6 z-40 flex-col items-end gap-3 select-none">
      {expanded && (
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="flex flex-col gap-2.5 bg-slate-900/95 backdrop-blur-xl p-3 rounded-3xl border border-emerald-500/30 shadow-2xl shadow-slate-950/80 animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <div className="text-[11px] font-bold text-slate-400 px-2 uppercase tracking-wider flex items-center justify-between gap-4">
            <span>ปรึกษาฟรี ทุกวัน 08.00 - 17.00 น.</span>
            <div className="flex items-center gap-1.5">
              {countdown > 0 && !userInteractedRef.current && (
                <span className="text-[10px] text-lime-400 font-mono font-bold bg-slate-800 px-1.5 py-0.5 rounded-full border border-lime-500/30">
                  {countdown}s
                </span>
              )}
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
          </div>

          {/* Phone Number: 093-551-5442 (Moved to top) */}
          <a
            href="tel:0935515442"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-slate-800 to-emerald-950/80 hover:from-slate-700 hover:to-emerald-900 border-2 border-emerald-500/60 text-white transition-all text-sm font-semibold group shadow-md"
            title="โทร 093-551-5442"
            id="floating-call-093"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold group-hover:scale-110 transition-transform shrink-0">
              <PhoneCall className="w-4 h-4 text-slate-950" />
            </div>
            <div className="flex items-center">
              <span className="font-extrabold text-white text-base font-mono tracking-wide">093-551-5442</span>
            </div>
          </a>

          {/* Phone Number: 062-193-9199 */}
          <a
            href="tel:0621939199"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 border-2 border-emerald-500/40 hover:border-emerald-400 text-white transition-all text-sm font-semibold group shadow-md"
            title="โทร 062-193-9199"
            id="floating-call-062"
          >
            <div className="w-8 h-8 rounded-xl bg-slate-800 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold group-hover:scale-110 transition-transform shrink-0">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div className="flex items-center">
              <span className="font-extrabold text-white text-base font-mono tracking-wide">062-193-9199</span>
            </div>
          </a>

          <button
            onClick={() => onOpenLineModal ? onOpenLineModal() : window.open('https://line.me/ti/p/@aisfibre999', '_blank')}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-[#06C755]/20 hover:bg-[#06C755]/30 border-2 border-[#06C755]/60 text-white transition-all text-sm font-semibold group text-left shadow-md"
          >
            <div className="w-8 h-8 rounded-xl bg-[#06C755] text-white flex items-center justify-center font-bold group-hover:scale-110 transition-transform shadow-md shadow-[#06C755]/40 shrink-0">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div className="flex items-center">
              <span className="font-extrabold text-white text-base">@aisfibre999</span>
            </div>
          </button>

          <button
            onClick={() => onNavigate('/check-area')}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-lime-400 to-orange-500 hover:from-emerald-300 hover:via-lime-300 hover:to-orange-400 text-slate-950 transition-all text-xs font-bold shadow-lg shadow-orange-500/20 active:scale-98"
          >
            <div className="w-8 h-8 rounded-xl bg-slate-950/20 text-slate-950 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="font-black text-slate-950">เช็กพื้นที่ติดตั้ง</p>
              <p className="text-[10px] text-slate-900 font-bold">ทราบผลใน 5 นาที</p>
            </div>
          </button>
        </div>
      )}

      {/* Floating Toggle Pill */}
      <button
        onClick={handleToggle}
        className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-400 via-lime-400 to-orange-500 hover:from-emerald-300 hover:via-lime-300 hover:to-orange-400 text-slate-950 font-black text-xs shadow-xl shadow-orange-500/25 hover:scale-105 active:scale-95 transition-all"
        id="floating-contact-toggle"
      >
        <MessageSquare className="w-4 h-4" />
        <span>{expanded ? 'ย่อหน้าต่าง' : 'ติดต่อสอบถาม'}</span>
        <ChevronUp className={`w-3.5 h-3.5 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
};
