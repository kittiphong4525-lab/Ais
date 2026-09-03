import React from 'react';
import { motion } from 'motion/react';
import { Star, CheckCircle2, MapPin, Gauge } from 'lucide-react';

export const CustomerReviewsSection: React.FC = () => {
  const reviews = [
    {
      id: 'rev-1',
      name: 'คุณภาณุวัฒน์ ก.',
      location: 'บ้านเดี่ยว ม.มัณฑนา บางนา กรุงเทพฯ',
      package: 'Broadband 24 (1 Gbps / 500 Mbps)',
      rating: 5,
      comment:
        'ช่างมาตรงเวลามาก เดินสายไฟเบอร์เรียบร้อยเนียนตา เทสสปีดได้เต็ม 1000Mbps จริง เล่นเกมปิงแค่ 2ms สตรีม 4K สบาย แนะนำเลยครับ',
      speedResult: '984 / 512 Mbps (Ping 2ms)',
      date: 'ติดตั้งเมื่อ 2 วันที่แล้ว',
      housingType: 'บ้านเดี่ยว 2 ชั้น',
    },
    {
      id: 'rev-2',
      name: 'คุณณิชากร พ.',
      location: 'คอนโด Life Asoke-Rama 9',
      package: 'Condo Ultra Fibre (300 / 300 Mbps)',
      rating: 5,
      comment:
        'สมัครออนไลน์เช้า บ่ายช่างเข้ามาติดตั้งให้เลย ประทับใจมาก ราคา 399 คุ้มสุด ๆ ทำงาน WFH ประชุมลื่นไหลไม่มีหลุด',
      speedResult: '315 / 308 Mbps (Ping 3ms)',
      date: 'ติดตั้งเมื่อ 4 วันที่แล้ว',
      housingType: 'คอนโดมิเนียม',
    },
    {
      id: 'rev-3',
      name: 'คุณศุภชัย ว.',
      location: 'ทาวน์โฮม นนทบุรี',
      package: 'Net Combo Gang + PLAYBOX + Max',
      rating: 5,
      comment:
        'ได้ Mesh WiFi 2 ตัว สัญญาณเต็ม 3 ชั้น แถมกล่อง PLAYBOX ดูหนัง Max กับ VIU ฟรีทั้งครอบครัว คุ้มค่าที่สุดที่เคยใช้มาครับ',
      speedResult: '1,012 / 520 Mbps (Ping 1ms)',
      date: 'ติดตั้งเมื่อสัปดาห์ที่แล้ว',
      housingType: 'ทาวน์โฮม 3 ชั้น',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-slate-950/35 backdrop-blur-sm border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-14 space-y-2.5"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>ความประทับใจจากลูกค้าจริงทั่วประเทศ</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            <span className="text-lime-300 drop-shadow-[0_2px_12px_rgba(190,242,100,0.3)]">การันตีผลงานติดตั้ง</span>{' '}
            <span className="text-[#FF5500] drop-shadow-[0_2px_12px_rgba(255,85,0,0.4)]">77 จังหวัดทั่วไทย</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
            บริการด้วยใจ รวดเร็ว ทีมช่างได้รับคะแนนความพึงพอใจเฉลี่ย 4.9/5 ดาว
          </p>
        </motion.div>

        {/* Reviews Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <motion.div
              key={rev.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              whileHover={{ y: -4 }}
              className="p-6 rounded-3xl bg-[#0e151d]/90 border border-white/10 hover:border-emerald-500/30 transition-all duration-300 flex flex-col justify-between space-y-4 shadow-xl shadow-black/30 backdrop-blur-xl"
            >
              <div>
                {/* Rating stars */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400 font-light">{rev.date}</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light mb-4">
                  "{rev.comment}"
                </p>

                {/* Speedtest Badge */}
                <div className="p-3 rounded-2xl bg-[#080d12]/80 border border-emerald-500/20 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-medium text-[11px]">
                    <Gauge className="w-3.5 h-3.5" />
                    <span>ผลเทสสปีดจริง:</span>
                  </div>
                  <span className="font-mono font-semibold text-emerald-300 text-xs">{rev.speedResult}</span>
                </div>
              </div>

              {/* Customer footer */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-white flex items-center gap-1">
                    {rev.name}
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </h4>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5 font-light">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span>{rev.location}</span>
                  </p>
                </div>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-lg bg-slate-800/80 text-slate-300 border border-white/5">
                  {rev.housingType}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

