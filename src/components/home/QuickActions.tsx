import React from 'react';
import { motion } from 'motion/react';
import { MapPin, PackagePlus, Flame, Headphones, ArrowUpRight } from 'lucide-react';

interface QuickActionsProps {
  onNavigate: (path: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onNavigate }) => {
  const actions = [
    {
      id: 'qa-check-area',
      title: 'ตรวจสอบพื้นที่',
      subtitle: 'เช็กคู่สาย DP เสาไฟฟ้า ใกล้บ้านคุณ',
      icon: MapPin,
      path: '/check-area',
      iconBg: 'bg-emerald-100 text-emerald-700 border-emerald-300',
      badge: 'เช็กฟรีใน 15 นาที',
      badgeStyle: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    },
    {
      id: 'qa-apply',
      title: 'สมัครติดตั้ง',
      subtitle: 'ทักไลน์แจ้งข้อมูลติดตั้งได้ทันที',
      icon: PackagePlus,
      path: 'https://line.me/ti/p/@aisfibrefanclub',
      isExternal: true,
      iconBg: 'bg-teal-100 text-teal-700 border-teal-300',
      badge: 'รับสิทธิ์ฟรีค่าแรกเข้า',
      badgeStyle: 'bg-teal-50 text-teal-800 border-teal-300',
    },
    {
      id: 'qa-promotions',
      title: 'ดูโปรโมชั่น',
      subtitle: 'โปรย้ายค่าย ลด 50% & ของแถม',
      icon: Flame,
      path: '/promotions',
      iconBg: 'bg-amber-100 text-amber-700 border-amber-300',
      badge: 'อัปเดต 2026',
      badgeStyle: 'bg-amber-50 text-amber-800 border-amber-300',
    },
    {
      id: 'qa-contact',
      title: 'ติดต่อเจ้าหน้าที่',
      subtitle: 'โทร 093-551-5442 หรือแชท LINE',
      icon: Headphones,
      path: '/contact',
      iconBg: 'bg-emerald-100 text-emerald-700 border-emerald-300',
      badge: 'เปิดทุกวัน 08.00-17.00น.',
      badgeStyle: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    },
  ];

  return (
    <section className="py-4 -mt-4 sm:-mt-8 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.025, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (action.isExternal || action.path.startsWith('http')) {
                    window.open(action.path, '_blank');
                  } else {
                    onNavigate(action.path);
                  }
                }}
                className="card !p-5 text-left group overflow-hidden cursor-pointer"
                id={action.id}
              >
                {/* Micro accent */}
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-xl border ${action.iconBg} group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${action.badgeStyle}`}>
                    {action.badge}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-slate-900 group-hover:text-emerald-600 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 font-normal">
                      {action.subtitle}
                    </p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors shrink-0 ml-2" />
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

