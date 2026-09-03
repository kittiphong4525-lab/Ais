import React from 'react';
import { motion } from 'motion/react';
import {
  Wifi,
  Sliders,
  Sparkles,
  CheckCircle2,
  PhoneCall,
  MessageCircle,
} from 'lucide-react';
import { HeroPromoSlider } from './HeroPromoSlider';

interface HeroSectionProps {
  onNavigate: (path: string) => void;
  onOpenLine?: (pkgName?: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate, onOpenLine }) => {
  return (
    <section className="hero relative pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-emerald-950/20 shadow-xl">
      {/* Background Dimming Scrim for Readability over vivid 6-stop spectrum gradient */}
      <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-[1px] pointer-events-none -z-10" />

      {/* Abstract Gradient Mesh Aura */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.35, 0.2],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-24 left-1/4 w-[650px] h-[650px] rounded-full bg-white/10 blur-[100px]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.05]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Column: Minimalist Typography & Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Top Minimal Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-semibold backdrop-blur-md"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>AIS FIBRE 3 By โฮมไฟเบอร์เนต999 • อนาคตที่มากกว่าเน็ตบ้าน</span>
            </motion.div>

            {/* Main Headline (Clean, Minimal Display) */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-snug sm:leading-tight lg:leading-[1.25] space-y-1"
            >
              <span className="block">
                <span className="text-lime-300 drop-shadow-[0_2px_12px_rgba(190,242,100,0.3)]">
                  เน็ตบ้านไฟเบอร์
                </span>{' '}
                <span className="text-[#FF5500] drop-shadow-[0_2px_12px_rgba(255,85,0,0.4)]">
                  AIS FIBRE 3
                </span>
              </span>
              <span className="block font-bold text-xl sm:text-3xl lg:text-4xl mt-1 sm:mt-2">
                <span className="text-lime-300 drop-shadow-[0_2px_12px_rgba(190,242,100,0.3)]">
                  เร็ว แรง สปีด 2Gbps
                </span>{' '}
                <span className="text-[#FF5500] drop-shadow-[0_2px_12px_rgba(255,85,0,0.4)]">
                  ติดตั้งฟรีทั่วประเทศ
                </span>
              </span>
            </motion.h1>

            {/* Subheadline (Clean, Readable Paragraph) */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light"
            >
              สัมผัสความเร็วอินเทอร์เน็ตไฟเบอร์ออพติก 100% สัญญาณเสถียรไม่มีสะดุด 
              พร้อมเทคโนโลยีเราเตอร์อัจฉริยะ WiFi 6 / WiFi 7 และกล่อง AIS PLAYBOX ความบันเทิงระดับโลก
            </motion.p>

            {/* Free Perks Checklist (Clean, Minimal Grid) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="grid grid-cols-2 sm:grid-cols-2 gap-2.5 pt-1 text-left max-w-xl mx-auto lg:mx-0"
            >
              {[
                'ฟรี! ค่าแรกเข้า & ติดตั้ง 4,800.-',
                'ฟรี! ยืมเราเตอร์ Wi-Fi 6 อัจฉริยะ',
                'ฟรี! กล่อง AIS PLAYBOX 4K',
                'ฟรี! สิทธิ์ชม VIU & Max (HBO)',
              ].map((perk, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#0d1622]/95 border border-white/15 hover:border-emerald-400/40 transition-colors backdrop-blur-md shadow-md"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-400/30">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <span className="text-xs text-white font-semibold">{perk}</span>
                </div>
              ))}
            </motion.div>

            {/* Action Buttons with 062-193-9199 Hotline */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-3"
            >
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onNavigate('/packages')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-lime-400 to-orange-500 hover:from-emerald-300 hover:via-lime-300 hover:to-orange-400 text-slate-950 font-black text-sm shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
                id="hero-btn-view-packages"
              >
                <Sliders className="w-4 h-4" />
                <span>เลือกดูแพ็กเกจ</span>
              </motion.button>

              <a
                href="tel:0621939199"
                className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-lime-400 hover:from-emerald-300 hover:via-emerald-400 hover:to-lime-300 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                id="hero-btn-call-062"
                title="โทรสายด่วน 062-193-9199"
              >
                <PhoneCall className="w-4 h-4 text-slate-950 shrink-0 animate-bounce" />
                <span>โทร 062-193-9199</span>
              </a>

              <a
                href="tel:0935515442"
                className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-400 hover:from-teal-400 hover:via-cyan-400 hover:to-emerald-300 text-slate-950 font-black text-sm shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                id="hero-btn-call-093"
                title="โทรติดต่อ 093-551-5442"
              >
                <PhoneCall className="w-4 h-4 text-slate-950 shrink-0" />
                <span>โทร 093-551-5442</span>
              </a>
            </motion.div>
          </motion.div>

          {/* Right Column: Promotional Banner Slider */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            <HeroPromoSlider onNavigate={onNavigate} onOpenLine={onOpenLine} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

