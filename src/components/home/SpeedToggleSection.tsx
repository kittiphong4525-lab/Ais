import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Zap, Download, Upload, CheckCircle2, Sparkles, RefreshCw } from 'lucide-react';

export const SpeedToggleSection: React.FC = () => {
  const [mode, setMode] = useState<'OVERDRIVE' | 'SYMMETRICAL' | 'UPLOAD'>('OVERDRIVE');

  const modes = [
    {
      id: 'OVERDRIVE',
      name: 'Overdrive Download (1000 / 300)',
      download: 1000,
      upload: 300,
      badge: 'โหลดเกม & สตรีมมิ่ง 4K',
      desc: 'ดึงสปีดดาวน์โหลดเต็มพิกัด 1Gbps เพื่อดาวน์โหลดเกมไฟล์ใหญ่ หรือดูวิดีโอ 8K/4K พร้อมกันหลายหน้าจอ',
      color: 'from-emerald-500 to-teal-400',
    },
    {
      id: 'SYMMETRICAL',
      name: 'Symmetrical (650 / 650)',
      download: 650,
      upload: 650,
      badge: 'WFH & ทำงานออนไลน์',
      desc: 'สมดุลทั้งดาวน์โหลดและอัปโหลด เหมาะสำหรับการประชุม Zoom/Teams, โยนไฟล์ขึ้น Cloud และทำงานจากบ้าน',
      color: 'from-teal-500 to-cyan-400',
    },
    {
      id: 'UPLOAD',
      name: 'Upload Focus (300 / 1000)',
      download: 300,
      upload: 1000,
      badge: 'สตรีมเมอร์ & ส่งไฟล์งาน',
      desc: 'อัดสปีดอัปโหลดสูงสุด 1,000 Mbps สำหรับสตรีมเมอร์ขึ้น YouTube/Twitch, อัปโหลดคลิป และสำรองข้อมูล Cloud',
      color: 'from-cyan-500 to-emerald-400',
    },
  ];

  const currentMode = modes.find((m) => m.id === mode) || modes[0];

  return (
    <section className="py-16 sm:py-20 bg-slate-950/30 backdrop-blur-sm border-y border-white/10 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12 space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EXCLUSIVE FOR AIS FIBRE 3</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            <span className="text-lime-300 drop-shadow-[0_2px_12px_rgba(190,242,100,0.3)]">AIS Speed Toggle</span>{' '}
            <span className="text-[#FF5500] drop-shadow-[0_2px_12px_rgba(255,85,0,0.4)]">สลับสปีดอัจฉริยะ</span>
            <span className="block text-base sm:text-xl font-medium text-slate-200 mt-1">
              สลับสปีดดาวน์โหลด / อัปโหลด ได้เองตามใจคุณ ตลอด 24 ชม.
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl mx-auto font-light">
            นวัตกรรมปรับความเร็วอินเทอร์เน็ตบ้านได้ตามกิจกรรมที่ทำ สลับสปีดได้ฟรีทันทีผ่านระบบ สะดวก ง่าย ไม่ต้องรอช่าง
          </p>
        </motion.div>

        {/* Interactive Speed Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Mode selector buttons */}
          <div className="lg:col-span-6 space-y-3.5">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              คลิกเลือกโหมดการใช้งาน เพื่อทดลองสลับสปีด:
            </p>

            {modes.map((item, idx) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setMode(item.id as any)}
                className={`card !p-4 sm:!p-5 w-full text-left transition-all duration-300 flex items-start justify-between gap-4 cursor-pointer ${
                  mode === item.id
                    ? 'border-emerald-500 ring-2 ring-emerald-500 shadow-xl'
                    : 'border-slate-200'
                }`}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                      mode === item.id
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-black'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>

                <div className="shrink-0 flex flex-col items-end justify-center h-full pt-1">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                    mode === item.id
                      ? 'bg-emerald-600 border-emerald-600 text-white scale-105 shadow-xs'
                      : 'border-slate-300 text-transparent bg-slate-50'
                  }`}>
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
              </motion.button>
            ))}

            <div className="card !p-4 border border-emerald-300 text-xs text-emerald-900 flex items-center gap-3 shadow-md">
              <Zap className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="text-slate-800 font-medium">
                ปรับสลับสปีดได้สูงสุด <strong className="font-bold text-emerald-700">10 ครั้ง/รอบบิล</strong> (คงอยู่นาน 30 ชั่วโมงต่อครั้ง หรือจนกว่าจะปรับคืน)
              </span>
            </div>
          </div>

          {/* Right: Live Interactive Speed Gauges */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6"
          >
            <div className="card text-slate-900 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-black text-emerald-800 uppercase tracking-wider">
                    LIVE SPEED SIMULATOR
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-500 flex items-center gap-1.5 font-bold">
                  <RefreshCw className="w-3 h-3 animate-spin text-emerald-600" />
                  <span>สลับสำเร็จใน 3 วินาที</span>
                </span>
              </div>

              {/* Download Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
                  <span className="flex items-center gap-2 text-emerald-700">
                    <Download className="w-4 h-4" />
                    <span>Download Speed (ดาวน์โหลด)</span>
                  </span>
                  <span className="text-lg sm:text-2xl font-black text-emerald-700 font-mono">
                    {currentMode.download} <span className="text-xs font-normal text-slate-500">Mbps</span>
                  </span>
                </div>
                {/* Progress bar */}
                <div className="h-4 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 shadow-md shadow-emerald-500/40"
                    animate={{ width: `${(currentMode.download / 1000) * 100}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                </div>
              </div>

              {/* Upload Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
                  <span className="flex items-center gap-2 text-teal-700">
                    <Upload className="w-4 h-4" />
                    <span>Upload Speed (อัปโหลด)</span>
                  </span>
                  <span className="text-lg sm:text-2xl font-black text-teal-700 font-mono">
                    {currentMode.upload} <span className="text-xs font-normal text-slate-500">Mbps</span>
                  </span>
                </div>
                {/* Progress bar */}
                <div className="h-4 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-500 shadow-md shadow-teal-500/40"
                    animate={{ width: `${(currentMode.upload / 1000) * 100}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                </div>
              </div>

              {/* Total Bandwidth Badge */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-600 font-semibold">แบนด์วิดท์รวมของแพ็กเกจ</span>
                <span className="text-sm font-black text-slate-900 font-mono">
                  1,300 Mbps (Full Capacity)
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

