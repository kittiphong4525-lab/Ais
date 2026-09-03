import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PackageItem } from '../../types';
import {
  Sparkles,
  Users,
  Film,
} from 'lucide-react';
import { PackageCard } from '../common/PackageCard';
import { ApiService } from '../../services/api';

interface PackageFinderProps {
  packages: PackageItem[];
  onApply: (pkg: PackageItem) => void;
  onViewDetails: (pkg: PackageItem) => void;
}

// Helper to extract YouTube video ID from various URL formats
export function extractYouTubeId(url?: string): string {
  if (!url) return 'EfgbNbszqbM';
  const cleanUrl = url.trim();
  const shortMatch = cleanUrl.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];
  const watchMatch = cleanUrl.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return watchMatch[1];
  const embedMatch = cleanUrl.match(/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return embedMatch[1];
  const shortsMatch = cleanUrl.match(/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shortsMatch) return shortsMatch[1];
  if (/^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) return cleanUrl;
  return 'EfgbNbszqbM';
}

export const PackageFinder: React.FC<PackageFinderProps> = ({
  packages,
  onApply,
  onViewDetails,
}) => {
  const [budget, setBudget] = useState<string>('500-699');
  const [usage, setUsage] = useState<string>('STREAMING');
  const [usersCount, setUsersCount] = useState<string>('2-3');
  const [needTv, setNeedTv] = useState<boolean>(true);
  const [videoUrl, setVideoUrl] = useState<string>('https://youtu.be/EfgbNbszqbM?si=vIjxgPV3jDkdaIz8');

  // Load saved video URL from backend settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await ApiService.getSettings();
        if (settings?.youtube_video_url) {
          setVideoUrl(settings.youtube_video_url);
        }
      } catch (e) {
        console.error('Failed to load video settings', e);
      }
    };
    loadSettings();
  }, []);

  const videoId = useMemo(() => extractYouTubeId(videoUrl), [videoUrl]);
  const embedUrl = useMemo(
    () =>
      `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&autoplay=1&mute=1&loop=1&playlist=${videoId}&playsinline=1`,
    [videoId]
  );

  // Compute recommendation
  const recommendation = useMemo(() => {
    let matches = [...packages];

    // Filter by budget
    if (budget === 'under-500') {
      matches = matches.filter((p) => p.price < 500);
    } else if (budget === '500-699') {
      matches = matches.filter((p) => p.price >= 500 && p.price <= 699);
    } else if (budget === '700-999') {
      matches = matches.filter((p) => p.price >= 700 && p.price <= 999);
    } else if (budget === '1000+') {
      matches = matches.filter((p) => p.price >= 1000);
    }

    // Filter by TV requirement
    if (needTv) {
      const withTv = matches.filter(
        (p) => p.tvIncluded || p.playboxIncluded || p.name.includes('PLAY') || p.description.includes('PLAYBOX')
      );
      if (withTv.length > 0) matches = withTv;
    }

    // Filter by usage type
    if (usage === 'GAMING') {
      const gaming = matches.filter(
        (p) => p.category === 'GAMER' || p.name.includes('GAMER') || p.description.includes('เกม')
      );
      if (gaming.length > 0) matches = gaming;
    } else if (usage === 'WFH') {
      const wfh = matches.filter(
        (p) => p.category === 'BUSINESS' || p.download_speed >= 1000
      );
      if (wfh.length > 0) matches = wfh;
    }

    // Pick the best match or fallback to a popular package
    const bestPkg = matches[0] || packages.find((p) => p.isFeatured || p.isBestSeller) || packages[0];

    // Determine tailored reason
    let reason = 'แพ็กเกจคุ้มค่าตอบโจทย์การใช้งานทั่วไปอย่างลงตัว';
    if (usage === 'GAMING') {
      reason = 'เหมาะสำหรับเล่นเกม สปีดดาวน์โหลด/อัปโหลดเร็ว ปิงต่ำ ค่าความหน่วงน้อย';
    } else if (usage === 'STREAMING') {
      reason = 'เหมาะสำหรับสตรีมมิ่ง ดูหนัง 4K พร้อมกันหลายจอไม่มีสะดุด';
    } else if (usage === 'WFH') {
      reason = 'เหมาะสำหรับทำงานที่บ้าน ประชุมออนไลน์ ส่งไฟล์ขนาดใหญ่ได้เสถียร 24 ชม.';
    }

    return { package: bestPkg, reason };
  }, [budget, usage, usersCount, needTv, packages]);

  return (
    <section className="py-16 sm:py-20 bg-slate-950/35 backdrop-blur-sm border-y border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ค้นหาแพ็กเกจที่เหมาะกับคุณ</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            <span className="text-lime-300 drop-shadow-[0_2px_12px_rgba(190,242,100,0.3)]">เลือกแพ็กเกจให้ตรง</span>{' '}
            <span className="text-[#FF5500] drop-shadow-[0_2px_12px_rgba(255,85,0,0.4)]">กับสไตล์การใช้งาน</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            ตอบคำถามสั้นๆ เพื่อให้ระบบคำนวณและแนะนำแพ็กเกจที่คุ้มค่าที่สุดสำหรับบ้านคุณ
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Questions Quiz Panel & Clean Video Embed */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
              {/* Question 1: Users */}
              <div className="space-y-3">
                <label className="text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>1. จำนวนคนใช้งานพร้อมกันในบ้าน</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: '1', label: '1 คน', desc: 'ห้องพัก/คอนโด' },
                    { id: '2-3', label: '2-3 คน', desc: 'บ้านทั่วไป' },
                    { id: '4-6', label: '4-6 คน', desc: 'ครอบครัวขนาดกลาง' },
                    { id: '7+', label: '7+ คน', desc: 'บ้านใหญ่/โฮมออฟฟิศ' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setUsersCount(item.id)}
                      className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                        usersCount === item.id
                          ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-sm'
                          : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <div className="font-bold text-xs sm:text-sm">{item.label}</div>
                      <div className="text-[10px] text-slate-300 mt-0.5">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2: Usage Style */}
              <div className="space-y-3">
                <label className="text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Film className="w-4 h-4 text-emerald-400" />
                  <span>2. กิจกรรมหลักที่ใช้งานบ่อยที่สุด</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'GENERAL', label: 'ทั่วไป / โซเชียล', desc: 'เล่นเน็ต ดูยูทูป' },
                    { id: 'STREAMING', label: 'ดูหนัง ซีรีส์ 4K', desc: 'Netflix / Disney+' },
                    { id: 'GAMING', label: 'เล่นเกมออนไลน์', desc: 'เน้นปิงต่ำ เสถียร' },
                    { id: 'WFH', label: 'Work from Home', desc: 'ประชุม ส่งไฟล์ใหญ่' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setUsage(item.id)}
                      className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                        usage === item.id
                          ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-sm'
                          : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <div className="font-bold text-xs sm:text-sm">{item.label}</div>
                      <div className="text-[10px] text-slate-300 mt-0.5">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 3: Budget */}
              <div className="space-y-3">
                <label className="text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-2">
                  <span>3. งบประมาณรายเดือนที่ต้องการ</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'under-500', label: 'ประหยัด', price: 'ต่ำกว่า 500.-' },
                    { id: '500-699', label: 'ยอดนิยม', price: '500 - 699.-' },
                    { id: '700-999', label: 'สปีดแรง', price: '700 - 999.-' },
                    { id: '1000+', label: 'พรีเมียม', price: '1,000+ ขึ้นไป' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setBudget(item.id)}
                      className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                        budget === item.id
                          ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-sm'
                          : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <div className="font-bold text-xs sm:text-sm">{item.label}</div>
                      <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
                        {item.price}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 4: Entertainment & TV */}
              <div className="space-y-3">
                <label className="text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-2">
                  <span>4. ต้องการกล่องความบันเทิง AIS PLAYBOX หรือไม่</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNeedTv(true)}
                    className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      needTv
                        ? 'bg-gradient-to-r from-emerald-400 via-lime-400 to-orange-500 hover:from-emerald-300 hover:via-lime-300 hover:to-orange-400 text-slate-950 font-black shadow-lg shadow-orange-500/20 border-transparent'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-emerald-500/40 hover:text-white'
                    }`}
                  >
                    <span>ต้องการ (มีกล่องทีวี/ความบันเทิง)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNeedTv(false)}
                    className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      !needTv
                        ? 'bg-gradient-to-r from-emerald-400 via-lime-400 to-orange-500 hover:from-emerald-300 hover:via-lime-300 hover:to-orange-400 text-slate-950 font-black shadow-lg shadow-orange-500/20 border-transparent'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-emerald-500/40 hover:text-white'
                    }`}
                  >
                    <span>ไม่ต้องการ (เน้นเฉพาะเน็ต)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* YouTube Video Embed with Autoplay & Promotion Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl space-y-0"
            >
              {/* Pure Video Player */}
              <div className="relative w-full aspect-video bg-slate-950">
                <iframe
                  key={embedUrl}
                  className="w-full h-full border-0"
                  src={embedUrl}
                  title="AIS FIBRE 3 Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                />
              </div>

              {/* Green & Orange Gradient Promotional Banner Under Video */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-600 via-lime-600 to-orange-500 text-white shadow-lg border-t border-white/20 relative overflow-hidden">
                {/* Background lighting flare */}
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/15 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-black/15 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-3">
                    <h3 className="text-base sm:text-lg md:text-xl font-black text-white tracking-tight drop-shadow-sm">
                      โปรโมชั่นติดเน็ตบ้าน AIS Fibre
                    </h3>
                    <div className="inline-flex items-baseline gap-1.5 bg-black/25 backdrop-blur-xs px-3 py-1 rounded-xl border border-white/20 self-start sm:self-auto">
                      <span className="text-xs sm:text-sm font-bold text-emerald-100">เริ่มเพียง</span>
                      <span className="text-xl sm:text-2xl font-black text-amber-200 tracking-tight drop-shadow-md">269</span>
                      <span className="text-xs sm:text-sm font-bold text-white">บ./เดือน</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-[13px] text-white font-medium leading-relaxed bg-slate-950/75 backdrop-blur-md p-3 rounded-2xl border border-white/25 shadow-inner">
                    *หมายเหตุ ลูกค้ามือถือรายเดือนรับส่วนลดสูงสุด พร้อมโปรโมชันติดตั้งคอนโดระบบ VDSL(ยกเว้น Fiber) AIS/3BB เริ่มต้น 269บ/ด.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Calculated Recommendation Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 space-y-4"
          >
            <div className="rounded-3xl p-5 bg-gradient-to-br from-emerald-600 via-lime-600 to-orange-500 text-white border border-white/25 shadow-xl space-y-2 relative overflow-hidden">
              <div className="flex items-center gap-2 text-white text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span className="drop-shadow-xs">แพ็กเกจที่แนะนำสำหรับคุณ</span>
              </div>
              <p className="text-xs sm:text-[13px] text-white font-semibold leading-relaxed bg-slate-950/75 backdrop-blur-md p-3.5 rounded-2xl border border-white/25 shadow-inner">
                "{recommendation.reason}"
              </p>
            </div>

            <AnimatePresence mode="wait">
              {recommendation.package && (
                <motion.div
                  key={recommendation.package.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <PackageCard
                    pkg={recommendation.package}
                    onApply={onApply}
                    onViewDetails={onViewDetails}
                    featured={true}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
