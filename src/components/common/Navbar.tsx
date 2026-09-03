import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wifi,
  MapPin,
  PhoneCall,
  MessageCircle,
  Menu,
  X,
  Flame,
  Zap,
  BookOpen,
  Award,
  Headphones,
  Sun,
  Moon,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface NavbarProps {
  currentPath?: string;
  onNavigate?: (path: string, params?: any) => void;
  currentTab?: string;
  onSelectTab?: (tab: string) => void;
  onOpenAreaCheck?: () => void;
  onOpenAdminAuth?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath = '/',
  onNavigate,
  currentTab,
  onSelectTab,
  onOpenAreaCheck,
  onOpenAdminAuth,
}) => {
  const { theme, toggleTheme, isDark } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const logoTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleLogoClick = () => {
    if (logoTimerRef.current) clearTimeout(logoTimerRef.current);
    const nextCount = logoClickCount + 1;
    if (nextCount >= 5) {
      setLogoClickCount(0);
      if (onOpenAdminAuth) {
        onOpenAdminAuth();
      } else if (onNavigate) {
        onNavigate('/admin');
      }
    } else {
      setLogoClickCount(nextCount);
      logoTimerRef.current = setTimeout(() => {
        setLogoClickCount(0);
      }, 3000);
      handleNav('/', 'home');
    }
  };

  const handleNav = (path: string, tabId?: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else if (onSelectTab && tabId) {
      onSelectTab(tabId);
    }
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { path: '/', id: 'home', label: 'หน้าแรก', icon: Wifi },
    { path: '/packages', id: 'packages', label: 'แพ็กเกจเน็ตบ้าน', icon: Zap },
    { path: '/promotions', id: 'promotions', label: 'โปรโมชั่นย้ายค่าย', icon: Flame },
    { path: '/check-area', id: 'check-area', label: 'เช็คพื้นที่ติดตั้ง', icon: MapPin },
    { path: '/about', id: 'about', label: 'เกี่ยวกับเรา', icon: Award },
    { path: '/articles', id: 'articles', label: 'บทความ & สาระน่ารู้', icon: BookOpen },
    { path: '/contact', id: 'contact', label: 'ติดต่อเรา', icon: Headphones },
  ];

  return (
    <header className={`sticky top-0 z-50 backdrop-blur-2xl transition-colors duration-200 ${
      isDark
        ? 'bg-gradient-to-r from-[#022013]/98 via-[#072a1b]/95 to-[#2e1202]/98 border-b border-orange-500/30 shadow-2xl shadow-black/50'
        : 'bg-white/95 border-b border-slate-200 shadow-md shadow-slate-200/50'
    }`}>
      {/* Top Green to Orange Gradient Bar */}
      <div className="h-[3.5px] w-full bg-gradient-to-r from-[#00A859] via-[#84CC16] via-[#F97316] to-[#FF5500] shadow-sm shadow-orange-500/40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1 sm:py-1.5">
        <div className="flex items-center justify-between h-[74px] sm:h-[78px] gap-4 md:gap-6 lg:gap-8 xl:gap-10">
          {/* Brand Logo & Name */}
          <button
            type="button"
            onClick={handleLogoClick}
            className="flex items-center gap-3.5 text-left group cursor-pointer shrink-0"
            title="AIS FIBRE 3 By โฮมไฟเบอร์เนต999"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-lime-400 to-[#FF5500] flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 group-hover:shadow-orange-500/30 transition-all duration-300">
              <Wifi className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className={`text-xl sm:text-[22px] font-black tracking-tight flex items-center ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  AIS FIBRE<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-lime-500 to-[#FF7700] ml-1.5">3</span>
                </span>
              </div>
              <p className={`text-[11px] sm:text-xs font-medium leading-tight ${
                isDark ? 'text-emerald-300/90' : 'text-emerald-600'
              }`}>
                By โฮมไฟเบอร์เนต999
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-2 xl:gap-2.5 2xl:gap-3">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentPath === link.path || currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNav(link.path, link.id)}
                  className={`px-3.5 xl:px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-400 via-lime-400 to-orange-500 text-slate-950 font-black shadow-lg shadow-orange-500/25'
                      : isDark
                        ? 'text-slate-200 hover:text-white hover:bg-emerald-500/10 hover:border-emerald-500/20 border border-transparent'
                        : 'text-slate-700 hover:text-emerald-600 hover:bg-slate-100 border border-transparent font-bold'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-emerald-500'}`} />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Desktop Right CTA Buttons */}
          <div className="hidden sm:flex items-center gap-2 xl:gap-2.5 shrink-0">
            <button
              onClick={() => {
                if (onOpenAreaCheck) onOpenAreaCheck();
                else handleNav('/check-area', 'check-area');
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 via-lime-400 to-orange-500 hover:from-emerald-300 hover:via-lime-300 hover:to-orange-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-orange-500/25 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              <MapPin className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              <span>เช็คพื้นที่ฟรี</span>
            </button>

            <a
              href="https://line.me/ti/p/@aisfibre999"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#06C755] to-[#04a044] hover:brightness-110 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-950/50 hover:scale-[1.02] active:scale-95 transition-all whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4" />
              <span>LINE ฟรี</span>
            </a>

            {/* Dark/Light Mode Toggle Button (Icon Only, Placed after LINE) */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer shadow-sm flex items-center justify-center hover:scale-105 active:scale-95 ${
                isDark
                  ? 'bg-slate-900/80 hover:bg-slate-800 border-slate-700 text-amber-300 hover:text-amber-200'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700 hover:text-slate-900'
              }`}
              title={isDark ? 'สลับเป็นโหมดสว่าง (Light Mode)' : 'สลับเป็นโหมดมืด (Dark Mode)'}
              aria-label={isDark ? 'สลับเป็นโหมดสว่าง' : 'สลับเป็นโหมดมืด'}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>
          </div>

          {/* Mobile hamburger & theme button */}
          <div className="flex lg:hidden items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Mobile Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition-all ${
                isDark
                  ? 'bg-slate-900 border-slate-700 text-amber-300'
                  : 'bg-slate-100 border-slate-300 text-slate-700'
              }`}
              title="สลับโหมดสว่าง/มืด"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            <button
              onClick={() => {
                if (onOpenAreaCheck) onOpenAreaCheck();
                else handleNav('/check-area', 'check-area');
              }}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md"
            >
              <MapPin className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>เช็คพื้นที่</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-xl border transition-colors ${
                isDark
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30 hover:text-white hover:bg-emerald-900/60'
                  : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
              }`}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`lg:hidden border-t px-4 pt-3 pb-6 space-y-2 shadow-2xl backdrop-blur-2xl ${
              isDark
                ? 'border-orange-500/30 bg-gradient-to-b from-[#062618]/98 via-[#0b2014]/98 to-[#240e02]/98'
                : 'border-slate-200 bg-white/98'
            }`}
          >
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentPath === link.path || currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNav(link.path, link.id)}
                  className={`w-full px-4 py-3 rounded-xl text-left text-sm font-semibold flex items-center gap-3 transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500 via-lime-400 to-[#FF5500] text-slate-950 font-black shadow-md'
                      : isDark
                        ? 'text-slate-200 hover:bg-emerald-500/10'
                        : 'text-slate-800 hover:bg-slate-100 font-bold'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-slate-950' : 'text-emerald-500'}`} />
                  <span>{link.label}</span>
                </button>
              );
            })}

            <div className="pt-3 border-t border-emerald-500/20 grid grid-cols-2 gap-2">
              <a
                href="tel:0935515442"
                className={`py-3 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                  isDark
                    ? 'bg-slate-950/80 border-emerald-500/30 text-white hover:bg-emerald-950/50'
                    : 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
                }`}
              >
                <PhoneCall className="w-4 h-4 text-emerald-500" />
                <span>093-551-5442</span>
              </a>
              <a
                href="https://line.me/ti/p/@aisfibre999"
                target="_blank"
                rel="noreferrer"
                className="py-3 px-4 rounded-xl bg-gradient-to-r from-[#06C755] to-[#04a044] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:brightness-110 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>LINE: @aisfibre999</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
