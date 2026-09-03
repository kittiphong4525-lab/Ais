import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Wifi,
  MapPin,
  Sliders,
  Zap,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Tv,
  PhoneCall,
  MessageCircle,
  CheckCircle,
} from 'lucide-react';
import { ApiService } from '../../services/api';
import { THAI_PROVINCES } from '../../data/thaiProvinces';

interface HeroSectionProps {
  onNavigate: (path: string) => void;
  onOpenLine?: (pkgName?: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate, onOpenLine }) => {
  // Hero Embedded Lead State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [province, setProvince] = useState('กรุงเทพมหานคร');
  const [district, setDistrict] = useState('');
  const [packageInterest, setPackageInterest] = useState('Broadband 24 (1 Gbps / 500 Mbps) 499.-');
  const [loading, setLoading] = useState(false);
  const [submittedLead, setSubmittedLead] = useState<{ id: string; trackingCode: string } | null>(null);

  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    setLoading(true);
    try {
      const newLead = await ApiService.createCoverageCheckLead({
        customer_name: name,
        phone: phone,
        province: province,
        district: district || 'ไม่ระบุอำเภอ',
        subdistrict: '',
        location_details: 'เช็คพื้นที่ด่วนจากหน้าแรก (Hero Section)',
        package_name: packageInterest,
        consent_contact: true,
      });

      setSubmittedLead({
        id: newLead.id,
        trackingCode: newLead.lead_no || 'AIS-LEAD-999',
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="hero relative pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-black/20 shadow-2xl">
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

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-3"
            >
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onNavigate('/packages')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-lime-400 to-orange-500 hover:from-emerald-300 hover:via-lime-300 hover:to-orange-400 text-slate-950 font-black text-sm shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
                id="hero-btn-view-packages"
              >
                <Sliders className="w-4 h-4" />
                <span>เลือกดูแพ็กเกจยอดนิยม</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onOpenLine ? onOpenLine() : window.open('https://line.me/ti/p/@aisfibre999', '_blank')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#06C755]/20 hover:bg-[#06C755]/30 border border-[#06C755]/50 text-emerald-200 font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                id="hero-btn-line-contact"
              >
                <MessageCircle className="w-4 h-4 text-[#06C755]" />
                <span>แอดไลน์ปรึกษาฟรี (@aisfibre999)</span>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Column: Instant Area Check & Lead Capture Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="card relative text-slate-900 shadow-2xl">
              {/* Form Title */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs sm:text-sm font-black text-emerald-700 uppercase tracking-wider">
                    เช็คพื้นที่ติดตั้ง AIS FIBRE 3
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300">
                  ทราบผลใน 5 นาที
                </span>
              </div>

              {!submittedLead ? (
                <form onSubmit={handleHeroSubmit} className="space-y-3.5">
                  <p className="text-xs text-slate-700 font-semibold">
                    กรอกข้อมูลเบื้องต้นเพื่อให้ทีมช่างตรวจสอบคู่สายไฟเบอร์ใกล้บ้านคุณ:
                  </p>

                  {/* Name Input */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-800 mb-1">
                      ชื่อ-นามสกุล ผู้สนใจติดตั้ง *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="เช่น คุณสมชาย สุขใจ"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none transition-colors shadow-xs"
                    />
                  </div>

                  {/* Phone Input */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-800 mb-1">
                      เบอร์โทรศัพท์มือถือ *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="เช่น 081-234-5678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none transition-colors shadow-xs"
                    />
                  </div>

                  {/* Province & District Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-800 mb-1">
                        จังหวัด *
                      </label>
                      <select
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 focus:border-emerald-500 text-slate-900 text-xs focus:outline-none transition-colors shadow-xs font-medium"
                      >
                        {THAI_PROVINCES.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-800 mb-1">
                        อำเภอ / เขต (หรือที่อยู่)
                      </label>
                      <input
                        type="text"
                        placeholder="เช่น บางนา / เมือง"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none transition-colors shadow-xs"
                      />
                    </div>
                  </div>

                  {/* Package of Interest */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-800 mb-1">
                      แพ็กเกจที่สนใจ
                    </label>
                    <select
                      value={packageInterest}
                      onChange={(e) => setPackageInterest(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 focus:border-emerald-500 text-slate-900 text-xs focus:outline-none transition-colors shadow-xs font-medium"
                    >
                      <option value="Broadband 24 (1 Gbps / 500 Mbps) 499.-">Broadband 24 (1Gbps/500Mbps) 499.-/ด. (ยอดนิยม)</option>
                      <option value="Broadband 24 (500 / 500 Mbps) 399.-">Broadband 24 (500/500Mbps) 399.-/ด.</option>
                      <option value="Net Lite Gang + PLAYBOX 599.-">Net Lite Gang + PLAYBOX 599.-/ด.</option>
                      <option value="Net Standard Gang + Max/HBO 799.-">Net Standard Gang + Max/HBO 799.-/ด.</option>
                      <option value="Net Combo Gang VIP 899.-">Net Combo Gang VIP 4 แอพ 899.-/ด.</option>
                      <option value="SuperMESH Plus 2Gbps 1,099.-">SuperMESH Plus 2Gbps 1,099.-/ด.</option>
                      <option value="Condo Starter 269.-">Condo Starter 269.-/ด. (ประหยัด)</option>
                    </select>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-400 via-lime-400 to-orange-500 hover:from-emerald-300 hover:via-lime-300 hover:to-orange-400 text-slate-950 font-black text-sm shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-3 cursor-pointer"
                    id="btn-hero-submit-lead"
                  >
                    <MapPin className="w-4 h-4 text-slate-950" />
                    <span>{loading ? 'กำลังส่งข้อมูลตรวจสอบ...' : 'ตรวจสอบพื้นที่ติดตั้งฟรีทันที'}</span>
                  </motion.button>

                  <p className="text-[10px] text-center text-slate-500 pt-1 font-medium">
                    🔒 ข้อมูลของคุณได้รับการปกป้องและใช้เพื่อประสานงานติดตั้งเท่านั้น
                  </p>
                </form>
              ) : (
                /* Success Card */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-6 text-center space-y-4"
                >
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-900">รับข้อมูลเรียบร้อยแล้ว</h4>
                    <p className="text-xs text-emerald-700 font-mono mt-1 font-bold">
                      รหัสติดตามงาน: {submittedLead.trackingCode}
                    </p>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                    เจ้าหน้าที่ฝ่ายประสานงานคู่สายจะตรวจสอบสัญญาณและโทรแจ้งผลที่เบอร์{' '}
                    <strong className="text-slate-900">{phone}</strong> ภายใน 5-15 นาที
                  </p>
                  <div className="pt-2 flex flex-col gap-2">
                    <a
                      href="https://line.me/ti/p/@aisfibre999"
                      target="_blank"
                      rel="noreferrer"
                      className="py-2.5 px-4 rounded-xl bg-[#06C755] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>แจ้งรหัสติดตามทาง LINE ทันที</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => setSubmittedLead(null)}
                      className="py-2 px-4 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
                    >
                      เช็คพื้นที่เพิ่มอีกจุด
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

