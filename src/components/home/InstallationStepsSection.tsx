import React from 'react';
import { motion } from 'motion/react';
import { MapPin, PhoneCall, Wrench, Wifi, ArrowRight } from 'lucide-react';

interface InstallationStepsProps {
  onCheckArea: () => void;
}

export const InstallationStepsSection: React.FC<InstallationStepsProps> = ({ onCheckArea }) => {
  const steps = [
    {
      step: '01',
      title: 'เช็คพื้นที่ & เลือกแพ็กเกจ',
      desc: 'กรอกที่อยู่หรือปักหมุด เพื่อให้ระบบตรวจสอบคู่สายไฟเบอร์และเสา DP ใกล้บ้านคุณฟรี',
      icon: MapPin,
      color: 'from-emerald-500 to-teal-400',
    },
    {
      step: '02',
      title: 'เจ้าหน้าที่ยืนยัน & นัดหมาย',
      desc: 'เจ้าหน้าที่โทรติดต่อกลับเพื่อยืนยันสิทธิ์โปรโมชั่น และนัดวัน-เวลาที่สะดวกให้ช่างเข้าติดตั้ง',
      icon: PhoneCall,
      color: 'from-teal-400 to-cyan-400',
    },
    {
      step: '03',
      title: 'ช่างมืออาชีพติดตั้งถึงบ้าน',
      desc: 'ทีมช่าง AIS Fibre เข้าเดินสายไฟเบอร์ออพติก ติดตั้งเราเตอร์ Wi-Fi 6 และเซ็ตอัประบบ',
      icon: Wrench,
      color: 'from-cyan-400 to-emerald-400',
    },
    {
      step: '04',
      title: 'เทสสปีด & ใช้งานได้ทันที',
      desc: 'ทดสอบความเร็วอินเทอร์เน็ตจริงเต็มสปีด ส่งมอบงาน พร้อมแนะนำการใช้งานและบริการหลังการขาย',
      icon: Wifi,
      color: 'from-emerald-400 to-teal-300',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-slate-950/30 backdrop-blur-sm border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 space-y-3"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Wrench className="w-3.5 h-3.5" />
            <span>SIMPLE 4 STEPS</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            <span className="text-lime-300 drop-shadow-[0_2px_12px_rgba(190,242,100,0.3)]">ขั้นตอนการสมัคร</span>{' '}
            <span className="text-[#FF5500] drop-shadow-[0_2px_12px_rgba(255,85,0,0.4)]">และติดตั้งง่าย ๆ</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed max-w-xl mx-auto">
            สมัครวันนี้ นัดคิวช่างติดตั้งรวดเร็ว ทันใจ พร้อมดูแลตลอดการใช้งาน
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="rounded-3xl p-6 bg-gradient-to-br from-emerald-600 via-lime-600 to-orange-500 text-white relative group shadow-xl border border-white/25 hover:shadow-2xl hover:scale-[1.02] transition-all overflow-hidden"
              >
                {/* Subtle lighting */}
                <div className="absolute -right-8 -top-8 w-24 h-24 bg-white/15 rounded-full blur-xl pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white font-black text-lg shadow-md border border-white/30 group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-black font-mono text-white/50 group-hover:text-amber-200 transition-colors">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-white mb-2 tracking-tight drop-shadow-sm">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-white font-medium leading-relaxed bg-slate-950/75 backdrop-blur-md p-3.5 rounded-2xl border border-white/25 shadow-inner">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Action button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={onCheckArea}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-lime-400 to-orange-500 hover:from-emerald-300 hover:via-lime-300 hover:to-orange-400 text-slate-950 font-black text-sm shadow-xl shadow-orange-500/20 transition-all cursor-pointer"
          >
            <MapPin className="w-4 h-4" />
            <span>เริ่มต้นเช็คพื้นที่ติดตั้งฟรีทันที</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

