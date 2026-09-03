import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  PhoneCall,
  MessageCircle,
  MapPin,
  CheckCircle2,
  Sparkles,
  Zap,
  ArrowRight,
  Tv,
  Wifi,
  Smartphone,
  CheckCircle,
} from 'lucide-react';
import { ApiService } from '../../services/api';
import { THAI_PROVINCES } from '../../data/thaiProvinces';

interface PromoSlide {
  id: string;
  badge: string;
  badgeColor: string;
  title: string;
  speed: string;
  price: string;
  originalPrice?: string;
  image: string;
  perks: string[];
  packageName: string;
  highlightText: string;
}

const PROMO_SLIDES: PromoSlide[] = [
  {
    id: 'slide-broadband-499',
    badge: '🔥 โปรโมชั่นขายดีอันดับ 1',
    badgeColor: 'bg-orange-500 text-white',
    title: 'Broadband 24 (1 Gbps / 500 Mbps)',
    speed: '1,000 / 500 Mbps',
    price: '499.-',
    originalPrice: '699.-',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
    perks: [
      'ฟรี! ค่าแรกเข้าและค่าติดตั้ง 4,800 บาท',
      'ฟรี! ยืมเราเตอร์ Wi-Fi 6 อัจฉริยะ',
      'สปีดแรงระดับกิกะบิต 1Gbps ดาวน์โหลดไว',
      'ช่างเข้าติดตั้งด่วนได้ภายใน 24 ชม.',
    ],
    packageName: 'Broadband 24 (1 Gbps / 500 Mbps) 499.-',
    highlightText: 'ย้ายค่ายรับส่วนลดเพิ่มทันที',
  },
  {
    id: 'slide-net-gang-599',
    badge: '🎬 เน็ตบ้าน + ทีวี AIS PLAYBOX',
    badgeColor: 'bg-emerald-600 text-white',
    title: 'Net Lite Gang 500/500 Mbps + PLAYBOX 4K',
    speed: '500 / 500 Mbps',
    price: '599.-',
    originalPrice: '799.-',
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&auto=format&fit=crop&q=80',
    perks: [
      'ฟรี! กล่อง AIS PLAYBOX 4K รีโมทสั่งงานด้วยเสียง',
      'ฟรี! สิทธิ์ชมซีรีส์ VIU Premium ไม่อั้น 24 เดือน',
      'ฟรี! ค่าเดินสายติดตั้งภายนอก-ภายในครบชุด',
      'ดูทีวีดิจิทัล ภาพยนตร์ หนังดังระดับโลก',
    ],
    packageName: 'Net Lite Gang + PLAYBOX 599.-',
    highlightText: 'แถมฟรีกล่องทีวี 4K พร้อมติดตั้ง',
  },
  {
    id: 'slide-supermesh-2g',
    badge: '🚀 สปีดสูงสุด 2,000 Mbps Wi-Fi 7',
    badgeColor: 'bg-teal-600 text-white',
    title: 'SuperMESH Plus 2Gbps / 1Gbps (Dual Router)',
    speed: '2,000 / 1,000 Mbps',
    price: '1,099.-',
    originalPrice: '1,499.-',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80',
    perks: [
      'ฟรี! เราเตอร์คู่ Mesh WiFi 6/7 สัญญาณเต็มทั่วบ้าน',
      'กระจายสัญญาณครอบคลุมบ้าน 2-3 ชั้น ไร้จุดอับ',
      'ความหน่วงต่ำพิเศษ Ultra-low Latency สำหรับเกมเมอร์',
      'รองรับการต่ออุปกรณ์พร้อมกันมากกว่า 200 เครื่อง',
    ],
    packageName: 'SuperMESH Plus 2Gbps 1,099.-',
    highlightText: 'เน็ตแรงทะลุผนังปูน ไร้จุดอับสัญญาณ',
  },
  {
    id: 'slide-condo-269',
    badge: '🏢 โปรโมชั่นพิเศษ คอนโด & หอพัก',
    badgeColor: 'bg-indigo-600 text-white',
    title: 'Condo Starter Fibre ประหยัดสุดคุ้ม',
    speed: '50 / 20 Mbps',
    price: '269.-',
    originalPrice: '399.-',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80',
    perks: [
      'เริ่มต้นเพียง 269.-/เดือน สัญญายืดหยุ่น 12 เดือน',
      'ฟรี! เราเตอร์ Dual Band WiFi พร้อมช่างติดตั้ง',
      'ติดตั้งง่าย ไม่ต้องเจาะผนังห้อง สัญญาณไฟเบอร์แท้',
      'เหมาะสำหรับคนอยู่คอนโด หอพัก นักศึกษา',
    ],
    packageName: 'Condo Starter 269.-',
    highlightText: 'เริ่มต้นเพียงเดือนละ 269 บาท',
  },
  {
    id: 'slide-power4-599',
    badge: '📱 เน็ตบ้าน + ซิมมือถือ AIS 5G',
    badgeColor: 'bg-lime-600 text-slate-950',
    title: 'POWER4 Starter (500/500) + ซิม 5G 10GB',
    speed: '500 / 500 Mbps',
    price: '599.-',
    originalPrice: '799.-',
    image: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=800&auto=format&fit=crop&q=80',
    perks: [
      'ฟรี! ซิมการ์ด AIS 5G ความเร็วเต็มสปีด 10GB/เดือน',
      'ฟรี! เราเตอร์ Mesh WiFi 6 สัญญาณทะลุผนัง',
      'โทรฟรีในเครือข่าย AIS 24 ชม.',
      'จ่ายบิลเดียวครบทั้งเน็ตบ้านและเน็ตมือถือ',
    ],
    packageName: 'POWER4 Starter (500 / 500 Mbps) 599.-',
    highlightText: 'คุ้ม 2 ต่อ ได้ทั้งเน็ตบ้านและซิม 5G',
  },
];

interface HeroPromoSliderProps {
  onNavigate: (path: string) => void;
  onOpenLine?: (pkgName?: string) => void;
}

export const HeroPromoSlider: React.FC<HeroPromoSliderProps> = ({
  onNavigate,
  onOpenLine,
}) => {
  const [activeTab, setActiveTab] = useState<'slider' | 'form'>('slider');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Form State for Quick Check Area
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [province, setProvince] = useState('กรุงเทพมหานคร');
  const [district, setDistrict] = useState('');
  const [packageInterest, setPackageInterest] = useState('Broadband 24 (1 Gbps / 500 Mbps) 499.-');
  const [loading, setLoading] = useState(false);
  const [submittedLead, setSubmittedLead] = useState<{ id: string; trackingCode: string } | null>(null);

  // Auto slide interval
  useEffect(() => {
    if (activeTab !== 'slider' || isHovered) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % PROMO_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [activeTab, isHovered]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % PROMO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + PROMO_SLIDES.length) % PROMO_SLIDES.length);
  }, []);

  const handleSelectPackageForCheck = (pkgName: string) => {
    setPackageInterest(pkgName);
    setActiveTab('form');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
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
        location_details: 'เช็คพื้นที่ด่วนจากแบนเนอร์ Hero',
        package_name: packageInterest,
        consent_contact: true,
      });

      setSubmittedLead({
        id: newLead.id,
        trackingCode: newLead.tracking_id || 'AIS-LEAD-999',
      });
      setName('');
      setPhone('');
      setDistrict('');
    } catch (err) {
      console.error('Error submitting hero lead:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentPromo = PROMO_SLIDES[currentIndex];

  return (
    <div
      id="hero-promo-slider-container"
      className="relative rounded-3xl bg-white text-slate-900 shadow-2xl overflow-hidden transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Header Bar: Mode Switcher & Hotline Number */}
      <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-200/80">
          <button
            type="button"
            onClick={() => setActiveTab('slider')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'slider'
                ? 'bg-white text-slate-950 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            id="tab-btn-promo-slider"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>โปรโมชั่นเด่น</span>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('form')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'form'
                ? 'bg-white text-slate-950 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            id="tab-btn-check-area"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>เช็คพื้นที่ติดตั้ง</span>
          </button>
        </div>
      </div>

      {/* Main Container Content */}
      {activeTab === 'slider' ? (
        <div className="p-4 sm:p-5 flex flex-col justify-between min-h-[440px]">
          {/* Animated Slide Content */}
          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPromo.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="space-y-3.5"
              >
                {/* Badge & Slide Index Counter */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wide shadow-xs ${currentPromo.badgeColor}`}
                  >
                    <span>{currentPromo.badge}</span>
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
                    <span>{currentIndex + 1}</span>
                    <span className="text-slate-400">/</span>
                    <span>{PROMO_SLIDES.length}</span>
                  </div>
                </div>

                {/* Promo Visual Image & Speed Banner */}
                <div className="relative rounded-2xl overflow-hidden aspect-[16/8] sm:aspect-[16/7] bg-slate-900 shadow-md group">
                  <img
                    src={currentPromo.image}
                    alt={currentPromo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                  {/* On-Image Floating Speed & Highlights */}
                  <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-lime-300 text-xs font-black flex items-center gap-1.5 border border-lime-400/40 shadow-sm">
                      <Zap className="w-3.5 h-3.5 text-lime-400" />
                      <span>{currentPromo.speed}</span>
                    </span>
                  </div>

                  {/* On-Image Bottom Price & Highlight */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between text-white">
                    <div>
                      <p className="text-[11px] font-bold text-emerald-300 drop-shadow-sm">
                        {currentPromo.highlightText}
                      </p>
                      <h3 className="text-sm sm:text-base font-black text-white leading-tight drop-shadow-md">
                        {currentPromo.title}
                      </h3>
                    </div>
                    <div className="text-right shrink-0">
                      {currentPromo.originalPrice && (
                        <p className="text-[10px] text-slate-300 line-through">
                          {currentPromo.originalPrice}
                        </p>
                      )}
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-xl sm:text-2xl font-black text-lime-300 drop-shadow-md">
                          {currentPromo.price}
                        </span>
                        <span className="text-[10px] font-bold text-slate-200">/ด.</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features & Benefits List (Black text, no black border) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {currentPromo.perks.map((perk, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 p-2 rounded-xl bg-slate-50 hover:bg-emerald-50/70 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-900 font-bold leading-tight">
                        {perk}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Action Buttons & Hotline Row */}
          <div className="pt-3.5 mt-2 border-t border-slate-200 space-y-2.5">
            {/* Primary Action Buttons - 2 Phone Numbers */}
            <div className="grid grid-cols-2 gap-2">
              <a
                href="tel:0621939199"
                className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-500 hover:from-emerald-400 hover:to-lime-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-1 shadow-md hover:scale-[1.02] active:scale-95 transition-all text-center"
                id="btn-promo-call-062"
                title="โทรสายด่วน 062-193-9199"
              >
                <PhoneCall className="w-3.5 h-3.5 text-slate-950 shrink-0" />
                <span className="truncate">062-193-9199</span>
              </a>

              <a
                href="tel:0935515442"
                className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-400 hover:from-teal-400 hover:via-cyan-400 hover:to-emerald-300 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-1 shadow-md hover:scale-[1.02] active:scale-95 transition-all text-center"
                id="btn-promo-call-093"
                title="โทรติดต่อ 093-551-5442"
              >
                <PhoneCall className="w-3.5 h-3.5 text-slate-950 shrink-0" />
                <span className="truncate">093-551-5442</span>
              </a>
            </div>

            {/* Line and Quick Actions */}
            <div>
              <button
                type="button"
                onClick={() =>
                  onOpenLine
                    ? onOpenLine(currentPromo.packageName)
                    : window.open('https://line.me/ti/p/@aisfibre999', '_blank')
                }
                className="w-full py-2.5 px-3 rounded-xl bg-[#06C755] hover:bg-[#05b34c] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md hover:scale-[1.01] active:scale-95 transition-all"
                id="btn-promo-line-chat"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>แอดไลน์สมัครติดตั้ง (@aisfibre999)</span>
              </button>
            </div>

            {/* Sub Action: Check Area for This Promo Package */}
            <div className="flex items-center justify-between gap-2 pt-0.5">
              <button
                type="button"
                onClick={() => handleSelectPackageForCheck(currentPromo.packageName)}
                className="text-xs text-emerald-800 hover:text-emerald-950 font-extrabold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>เช็คพื้นที่สำหรับโปรนี้ &gt;</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('/packages')}
                className="text-xs text-slate-700 hover:text-slate-950 font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>ดูแพ็กเกจทั้งหมด</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Slider Navigation Dots & Arrows */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={prevSlide}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-90"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Dot Indicators */}
              <div className="flex items-center gap-1.5">
                {PROMO_SLIDES.map((slide, idx) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      currentIndex === idx
                        ? 'w-6 bg-emerald-600'
                        : 'w-2 bg-slate-300 hover:bg-slate-400'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={nextSlide}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-90"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Instant Coverage Check Tab */
        <div className="p-4 sm:p-5">
          {!submittedLead ? (
            <form onSubmit={handleFormSubmit} className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-black text-slate-900 uppercase">
                    เช็คพื้นที่ติดตั้ง AIS FIBRE 3
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  ทราบผลใน 5 นาที
                </span>
              </div>

              {/* Name */}
              <div>
                <label className="block text-[11px] font-bold text-slate-900 mb-1">
                  ชื่อ-นามสกุล *
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น คุณสมชาย สุขใจ"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 focus:border-emerald-500 text-slate-900 text-xs focus:outline-none shadow-xs"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[11px] font-bold text-slate-900 mb-1">
                  เบอร์โทรศัพท์มือถือ *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="เช่น 081-234-5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 focus:border-emerald-500 text-slate-900 text-xs focus:outline-none shadow-xs"
                />
              </div>

              {/* Province & District */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-900 mb-1">
                    จังหวัด *
                  </label>
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-300 focus:border-emerald-500 text-slate-900 text-xs focus:outline-none shadow-xs"
                  >
                    {THAI_PROVINCES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-900 mb-1">
                    อำเภอ / เขต
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น เมือง / บางนา"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-300 focus:border-emerald-500 text-slate-900 text-xs focus:outline-none shadow-xs"
                  />
                </div>
              </div>

              {/* Selected Package */}
              <div>
                <label className="block text-[11px] font-bold text-slate-900 mb-1">
                  แพ็กเกจที่สนใจ
                </label>
                <select
                  value={packageInterest}
                  onChange={(e) => setPackageInterest(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-300 focus:border-emerald-500 text-slate-900 text-xs focus:outline-none shadow-xs font-bold"
                >
                  <option value="Broadband 24 (1 Gbps / 500 Mbps) 499.-">Broadband 24 (1Gbps/500Mbps) 499.-/ด.</option>
                  <option value="Net Lite Gang + PLAYBOX 599.-">Net Lite Gang + PLAYBOX 599.-/ด.</option>
                  <option value="SuperMESH Plus 2Gbps 1,099.-">SuperMESH Plus 2Gbps 1,099.-/ด.</option>
                  <option value="Condo Starter 269.-">Condo Starter 269.-/ด.</option>
                  <option value="POWER4 Starter (500 / 500 Mbps) 599.-">POWER4 Starter 599.-/ด.</option>
                </select>
              </div>

              {/* Submit & Call */}
              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-lime-500 to-orange-500 text-slate-950 font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all hover:brightness-105 active:scale-98 disabled:opacity-50"
                  id="btn-submit-quick-check-lead"
                >
                  <MapPin className="w-4 h-4" />
                  <span>{loading ? 'กำลังตรวจสอบ...' : 'ส่งตรวจสอบคู่สายฟรีทันที'}</span>
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-600 font-bold">
                  <span>หรือโทรด่วน:</span>
                  <a
                    href="tel:0621939199"
                    className="text-emerald-700 hover:text-emerald-800 font-black underline flex items-center gap-1"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>062-193-9199</span>
                  </a>
                </div>
              </div>
            </form>
          ) : (
            <div className="py-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h4 className="text-base font-black text-slate-900">รับข้อมูลเรียบร้อยแล้ว</h4>
              <p className="text-xs text-emerald-800 font-bold font-mono">
                รหัสติดตามงาน: {submittedLead.trackingCode}
              </p>
              <p className="text-xs text-slate-700 leading-relaxed max-w-xs mx-auto">
                เจ้าหน้าที่ประสานงานคู่สายจะโทรแจ้งผลภายใน 5-15 นาที หรือสอบถามด่วนที่{' '}
                <a href="tel:0621939199" className="font-black text-emerald-700 underline">
                  062-193-9199
                </a>
              </p>
              <button
                type="button"
                onClick={() => setSubmittedLead(null)}
                className="mt-2 py-1.5 px-4 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold hover:bg-slate-200 cursor-pointer"
              >
                เช็คอีกจุด
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
