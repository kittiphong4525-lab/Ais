import React from 'react';
import { Home, Sliders, FileCheck, MessageCircle, PhoneCall } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface BottomNavigationProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ currentPath, onNavigate }) => {
  const { isDark } = useTheme();

  const navItems = [
    { label: 'หน้าแรก', path: '/', icon: Home },
    { label: 'แพ็กเกจ', path: '/packages', icon: Sliders },
    { label: 'สมัครติดตั้ง', href: 'https://line.me/ti/p/@aisfibre999', icon: FileCheck, isCenter: true, isExternal: true },
    { label: 'LINE', href: 'https://line.me/ti/p/@aisfibre999', icon: MessageCircle, isExternal: true },
    { label: 'ติดต่อ', path: '/contact', icon: PhoneCall },
  ];

  return (
    <div className={`md:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-xl border-t px-2 py-1.5 shadow-2xl transition-colors ${
      isDark
        ? 'bg-slate-950/95 border-emerald-500/20'
        : 'bg-white/95 border-slate-200'
    }`}>
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;

          if (item.isCenter) {
            return (
              <a
                key={item.label}
                href={item.href || 'https://line.me/ti/p/@aisfibre999'}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center -mt-6 group focus:outline-none"
              >
                <div className={`w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 via-lime-400 to-[#FF5500] text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/40 group-active:scale-95 transition-transform border-2 ${
                  isDark ? 'border-slate-950' : 'border-white'
                }`}>
                  <Icon className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="text-[10px] font-bold text-emerald-500 mt-1">{item.label}</span>
              </a>
            );
          }

          if (item.isExternal) {
            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors ${
                  isDark ? 'text-slate-400 hover:text-emerald-400' : 'text-slate-600 hover:text-emerald-600'
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#06C755]" />
                </div>
                <span className="text-[10px] font-medium mt-1">{item.label}</span>
              </a>
            );
          }

          return (
            <button
              key={item.label}
              onClick={() => onNavigate(item.path!)}
              className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors ${
                isActive
                  ? 'text-emerald-500 font-bold'
                  : isDark
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
              <span className="text-[10px] mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
