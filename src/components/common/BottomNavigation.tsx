import React, { useState } from 'react';
import { Home, Sliders, FileCheck, PhoneCall, MapPin, X, ChevronRight, MessageCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { AnimatePresence, motion } from 'motion/react';

interface BottomNavigationProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ currentPath, onNavigate }) => {
  const { isDark } = useTheme();
  const [showCallSheet, setShowCallSheet] = useState(false);

  const navItems = [
    { label: 'หน้าแรก', path: '/', icon: Home, id: 'bnav-home' },
    { label: 'แพ็กเกจ', path: '/packages', icon: Sliders, id: 'bnav-packages' },
    { label: 'สมัครติดตั้ง', href: 'https://line.me/ti/p/@aisfibre999', icon: FileCheck, isCenter: true, isExternal: true, id: 'bnav-apply' },
    { label: 'เช็คพื้นที่', path: '/check-area', icon: MapPin, id: 'bnav-area' },
    { label: 'โทรด่วน', isAction: true, icon: PhoneCall, id: 'bnav-call' },
  ];

  return (
    <>
      {/* Mobile & Tablet Bottom Dock Bar */}
      <nav
        id="mobile-bottom-navigation"
        aria-label="เมนูด้านล่างสำหรับมือถือและแท็บเล็ต"
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-2xl border-t shadow-2xl transition-colors select-none ${
          isDark
            ? 'bg-[#03150d]/95 border-emerald-500/25 shadow-black/80'
            : 'bg-white/95 border-slate-200/90 shadow-slate-400/30'
        }`}
        style={{
          paddingBottom: 'max(env(safe-area-inset-bottom), 0.5rem)',
        }}
      >
        <div className="max-w-xl mx-auto px-2 sm:px-4 py-1.5 flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;

            // 1. Center Glowing Action Button (สมัครติดตั้ง)
            if (item.isCenter) {
              return (
                <a
                  key={item.label}
                  id={item.id}
                  href={item.href || 'https://line.me/ti/p/@aisfibre999'}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center -mt-6 group focus:outline-none relative"
                  aria-label="สมัครติดตั้งเน็ตบ้านผ่าน LINE"
                >
                  <div
                    className={`w-13 h-13 rounded-full bg-gradient-to-tr from-emerald-500 via-lime-400 to-[#FF5500] text-slate-950 flex items-center justify-center shadow-xl shadow-orange-500/30 group-active:scale-95 transition-transform border-[2.5px] ${
                      isDark ? 'border-[#03150d]' : 'border-white'
                    }`}
                  >
                    <Icon className="w-6 h-6 stroke-[2.8]" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-lime-500 to-[#FF5500] mt-1 drop-shadow-xs">
                    {item.label}
                  </span>
                </a>
              );
            }

            // 2. Action Button (โทรด่วน Popover)
            if (item.isAction) {
              return (
                <button
                  key={item.label}
                  id={item.id}
                  type="button"
                  onClick={() => setShowCallSheet(true)}
                  className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer min-w-[56px] ${
                    showCallSheet
                      ? 'text-emerald-500 font-bold scale-105'
                      : isDark
                      ? 'text-slate-300 hover:text-emerald-400'
                      : 'text-slate-700 hover:text-emerald-600'
                  }`}
                  aria-label="โทรด่วนติดต่อเจ้าหน้าที่"
                >
                  <div className="relative p-1 rounded-lg">
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                    <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-semibold mt-0.5 whitespace-nowrap">
                    {item.label}
                  </span>
                </button>
              );
            }

            // 3. Standard Navigation Links
            return (
              <button
                key={item.label}
                id={item.id}
                type="button"
                onClick={() => onNavigate(item.path!)}
                className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer min-w-[56px] ${
                  isActive
                    ? 'text-emerald-500 font-black scale-105'
                    : isDark
                    ? 'text-slate-300 hover:text-slate-100'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                aria-label={item.label}
              >
                <div className={`p-1 rounded-lg transition-colors ${
                  isActive
                    ? isDark ? 'bg-emerald-500/15' : 'bg-emerald-50'
                    : 'bg-transparent'
                }`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[2]'}`} />
                </div>
                <span className={`text-[10px] sm:text-xs mt-0.5 whitespace-nowrap ${
                  isActive ? 'font-black' : 'font-medium'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Quick Hotline Call Sheet Modal for Mobile/Tablet */}
      <AnimatePresence>
        {showCallSheet && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            {/* Backdrop Scrim */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCallSheet(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm cursor-pointer"
            />

            {/* Sheet Card */}
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className={`relative z-10 w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl border ${
                isDark
                  ? 'bg-slate-950 border-emerald-500/30 text-white'
                  : 'bg-white border-slate-200 text-slate-900'
              }`}
              style={{
                paddingBottom: 'max(env(safe-area-inset-bottom), 1.5rem)',
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/40">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-black leading-tight">โทรสายด่วน AIS FIBRE 3</h3>
                    <p className="text-xs text-slate-400">เปิดบริการทุกวัน 08.00 - 17.00 น.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCallSheet(false)}
                  className="p-2 rounded-full hover:bg-slate-800/30 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  aria-label="ปิดหน้าต่างโทรด่วน"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Call Buttons */}
              <div className="space-y-3 pt-4">
                {/* Hotline 1: 062-193-9199 */}
                <a
                  href="tel:0621939199"
                  className="w-full p-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-lime-500 to-[#FF5500] hover:brightness-105 text-slate-950 font-black text-sm sm:text-base flex items-center justify-between shadow-xl shadow-orange-500/20 active:scale-[0.98] transition-all cursor-pointer"
                  id="mobile-call-hotline-1"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-950 text-emerald-400 flex items-center justify-center shrink-0">
                      <PhoneCall className="w-5 h-5 text-emerald-400 animate-bounce" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-slate-950 font-black uppercase tracking-wider">สายด่วนรับเรื่องเร็ว (เบอร์หลัก)</p>
                      <p className="text-lg font-black text-slate-950 font-mono tracking-wide leading-tight">062-193-9199</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-950 stroke-[3]" />
                </a>

                {/* Hotline 2: 093-551-5442 */}
                <a
                  href="tel:0935515442"
                  className={`w-full p-4 rounded-2xl border text-sm sm:text-base font-bold flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer ${
                    isDark
                      ? 'bg-slate-900 border-slate-700 hover:border-emerald-500 text-white'
                      : 'bg-slate-50 border-slate-200 hover:border-emerald-500 text-slate-900'
                  }`}
                  id="mobile-call-hotline-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                      <PhoneCall className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-slate-400 font-semibold">เจ้าหน้าที่ฝ่ายขายและข้อมูลติดตั้ง</p>
                      <p className="text-base font-extrabold font-mono tracking-wide leading-tight">093-551-5442</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </a>

                {/* LINE Official Link */}
                <a
                  href="https://line.me/ti/p/@aisfibre999"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full p-3.5 rounded-2xl bg-[#06C755] hover:bg-[#05b04a] text-white font-black text-sm flex items-center justify-between shadow-md active:scale-[0.98] transition-all cursor-pointer"
                  id="mobile-call-line"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white text-[#06C755] flex items-center justify-center shrink-0">
                      <MessageCircle className="w-5 h-5 fill-[#06C755]" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-emerald-100 font-medium">สมัครผ่านไลน์ ส่งโลเคชันเช็คพื้นที่ได้ทันที</p>
                      <p className="text-sm font-black leading-tight">LINE ID: @aisfibre999</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white" />
                </a>
              </div>

              {/* View all contact options */}
              <div className="pt-3 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowCallSheet(false);
                    onNavigate('/contact');
                  }}
                  className="text-xs font-bold text-emerald-500 hover:text-emerald-400 transition-colors py-1 cursor-pointer"
                >
                  ดูช่องทางติดต่อและที่ตั้งสำนักงานทั้งหมด &gt;
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
