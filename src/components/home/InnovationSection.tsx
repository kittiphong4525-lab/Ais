import React from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Wifi,
  ShieldCheck,
  Cpu,
  Zap,
  CheckCircle2,
} from 'lucide-react';

export const InnovationSection: React.FC = () => {
  const innovations = [
    {
      id: 'innov-1',
      title: 'Home Fiber LAN (10 Gbps Ready)',
      subtitle: 'สายใยแก้วโปร่งแสง เชื่อมสปีดกิกะบิตทุกห้อง',
      description:
        'นวัตกรรมการเดินสายไฟเบอร์ใสขนาดเล็กเท่าเส้นผม เชื่อมโยงทุกห้องในบ้านด้วยความเร็วระดับ Gigabit และรองรับสูงสุด 10Gbps ไม่เกะกะสายตา ทนทาน 30 ปี',
      icon: Sparkles,
      tag: 'นวัตกรรมรายแรก',
      iconColor: 'text-emerald-700 bg-emerald-100 border-emerald-300',
    },
    {
      id: 'innov-2',
      title: 'Smart AI Router',
      subtitle: 'จัดสรรช่องสัญญาณอัจฉริยะอัตโนมัติ',
      description:
        'ระบบ AI อัจฉริยะคอยแยกท่อสัญญาณระหว่าง การเล่นเกม สตรีมมิ่ง 4K และประชุมงาน WFH อัตโนมัติ ปิงต่ำสุด ไม่แย่งเน็ตกันในบ้าน',
      icon: Cpu,
      tag: 'AI Technology',
      iconColor: 'text-teal-700 bg-teal-100 border-teal-300',
    },
    {
      id: 'innov-3',
      title: 'SuperMESH WiFi 6 / WiFi 7',
      subtitle: 'สัญญาณแรงทะลุผนัง ครอบคลุมทั่วทั้งบ้าน',
      description:
        'เชื่อมต่อเราเตอร์แบบ Mesh กระจายสัญญาณรอบบ้าน 2-4 ชั้น เดินไปมุมไหนก็เชื่อมต่อชื่อ WiFi เดียวกันแบบ Seamless Roaming ไม่มีหลุด',
      icon: Wifi,
      tag: 'สัญญาณเต็มสปีด',
      iconColor: 'text-cyan-700 bg-cyan-100 border-cyan-300',
    },
    {
      id: 'innov-4',
      title: 'AIS Secure Net Cyber Protection',
      subtitle: 'ปลอดภัยระดับโครงข่าย ป้องกันไวรัสและเว็บอันตราย',
      description:
        'ป้องกันภัยคุกคาม มัลแวร์ และลิงก์ฟิชชิ่งตั้งแต่ระดับโครงข่ายไฟเบอร์ ไม่ต้องติดตั้งแอปเพิ่มเติม ปลอดภัยทั้งมือถือ คอมพิวเตอร์ และอุปกรณ์ Smart Home',
      icon: ShieldCheck,
      tag: 'ความปลอดภัยสูงสุด',
      iconColor: 'text-emerald-700 bg-emerald-100 border-emerald-300',
    },
  ];

  return (
    <section className="py-16 sm:py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-14 space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wide">
            <Zap className="w-3.5 h-3.5" />
            <span>AIS FIBRE NET 999 INNOVATIONS</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            <span className="text-lime-300 drop-shadow-[0_2px_12px_rgba(190,242,100,0.3)]">ที่สุดของนวัตกรรม</span>{' '}
            <span className="text-[#FF5500] drop-shadow-[0_2px_12px_rgba(255,85,0,0.4)]">เน็ตบ้านแห่งอนาคต</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
            ยกระดับประสบการณ์ใช้งานอินเทอร์เน็ตในบ้านด้วยเทคโนโลยีโครงข่ายไฟเบอร์ออพติก พร้อมอุปกรณ์มาตรฐานระดับโลก
          </p>
        </motion.div>

        {/* 4 Innovation Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {innovations.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="rounded-3xl p-6 bg-gradient-to-br from-emerald-600 via-lime-600 to-orange-500 text-white flex flex-col justify-between group shadow-xl border border-white/25 hover:shadow-2xl hover:scale-[1.02] transition-all relative overflow-hidden"
              >
                {/* Subtle lighting */}
                <div className="absolute -right-8 -top-8 w-24 h-24 bg-white/15 rounded-full blur-xl pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-xs text-white border border-white/30 group-hover:scale-105 transition-transform shadow-sm">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-black/25 text-amber-200 border border-white/20 backdrop-blur-xs">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-white mb-1.5 tracking-tight drop-shadow-sm">
                    {item.title}
                  </h3>
                  <p className="text-xs font-black text-yellow-300 mb-3 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                    {item.subtitle}
                  </p>
                  <p className="text-xs sm:text-[13px] text-white font-medium leading-relaxed bg-slate-950/75 backdrop-blur-md p-3.5 rounded-2xl border border-white/25 shadow-inner">
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-white/25 flex items-center gap-2 text-xs font-bold text-white relative z-10">
                  <CheckCircle2 className="w-4 h-4 text-yellow-300 shrink-0" />
                  <span className="drop-shadow-xs">รองรับทุกแพ็กเกจ AIS Fibre 3</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

