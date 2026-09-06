import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storage';
import { ApiService } from '../services/api';
import { AboutUsSettings } from '../types';
import {
  ShieldCheck,
  Award,
  FileCheck2,
  ChevronRight,
  PhoneCall,
  CheckCircle2,
  Building2,
  MapPin,
  Clock,
  Sparkles,
  Zap,
  Users,
  Headphones,
  ArrowRight,
  MessageCircle,
  ZoomIn,
  X,
  Camera
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ActivitySlider } from '../components/about/ActivitySlider';

interface AboutUsPageProps {
  onNavigate: (path: string) => void;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({ onNavigate }) => {
  const [aboutData, setAboutData] = useState<AboutUsSettings>(() =>
    StorageService.getAboutSettings()
  );
  const [previewDoc, setPreviewDoc] = useState<string | null>(null);

  useEffect(() => {
    const data = StorageService.getAboutSettings();
    setAboutData(data);
    ApiService.getAboutUs()
      .then((remoteData) => {
        if (remoteData) {
          setAboutData(remoteData);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen selection:bg-emerald-500 selection:text-white pb-20 relative overflow-hidden">
      {/* Ambient background lighting */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[90vw] max-w-4xl h-[400px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-40 right-[-10%] w-[40vw] h-[400px] bg-orange-600/10 rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <nav className="flex items-center gap-2 text-xs text-slate-400 font-medium">
          <button
            onClick={() => onNavigate('/')}
            className="hover:text-emerald-400 transition-colors cursor-pointer"
          >
            หน้าแรก
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-emerald-400 font-semibold">เกี่ยวกับเรา</span>
        </nav>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 space-y-10 sm:space-y-14">
        {/* Main Heading & Intro */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 shadow-xs"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>ตัวแทนจำหน่าย AIS FIBRE 3 อย่างเป็นทางการ</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-snug drop-shadow-md text-white"
          >
            เกี่ยวกับเรา{' '}
            <span className="text-lime-300 drop-shadow-[0_2px_12px_rgba(190,242,100,0.3)]">
              {aboutData.company_name || 'บริษัท โฮมไฟเบอร์เนต999 จำกัด'}
            </span>
          </motion.h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            ศูนย์บริการรับสมัครและประสานงานติดตั้งอินเทอร์เน็ตบ้านความเร็วสูง AIS FIBRE 3 ครอบคลุมทุกพื้นที่ทั่วประเทศไทย รวดเร็ว ปลอดภัย ได้รับอุปกรณ์แท้มาตรฐานสากล
          </p>
        </div>

        {/* Certificates Showcase - Placed Prominently at the Top */}
        {aboutData.show_certificates && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 pt-2"
          >
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold shadow-xs">
                <FileCheck2 className="w-4 h-4 text-emerald-400" />
                <span>เอกสารอนุญาตตัวแทนจำหน่าย A4</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white">
                <span className="text-lime-300 drop-shadow-[0_2px_10px_rgba(190,242,100,0.3)]">
                  {aboutData.title_part1 || 'ใบอนุญาตตัวแทนจำหน่าย'}
                </span>{' '}
                <span className="text-[#FF5500] drop-shadow-[0_2px_10px_rgba(255,85,0,0.4)]">
                  {aboutData.title_part2 || 'อย่างเป็นทางการ'}
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
                คลิกที่รูปภาพเอกสารเพื่อขยายดูรายละเอียดขนาดเต็ม
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {aboutData.doc1_image && (
                <div
                  onClick={() => setPreviewDoc(aboutData.doc1_image)}
                  className="group relative cursor-pointer rounded-2xl overflow-hidden bg-white border-2 border-slate-700 hover:border-emerald-400 aspect-[210/297] flex items-center justify-center transition-all shadow-xl hover:shadow-emerald-500/20"
                  title="คลิกเพื่อขยายดูรูปภาพเอกสารใบอนุญาต 1"
                >
                  <img
                    src={aboutData.doc1_image}
                    alt={aboutData.doc1_title || 'เอกสารอนุญาต 1'}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs sm:text-sm font-bold">
                    <ZoomIn className="w-5 h-5 text-emerald-400" />
                    <span>คลิกเพื่อดูภาพขยาย</span>
                  </div>
                </div>
              )}
              {aboutData.doc2_image && (
                <div
                  onClick={() => setPreviewDoc(aboutData.doc2_image)}
                  className="group relative cursor-pointer rounded-2xl overflow-hidden bg-white border-2 border-slate-700 hover:border-emerald-400 aspect-[210/297] flex items-center justify-center transition-all shadow-xl hover:shadow-emerald-500/20"
                  title="คลิกเพื่อขยายดูรูปภาพเอกสารใบอนุญาต 2"
                >
                  <img
                    src={aboutData.doc2_image}
                    alt={aboutData.doc2_title || 'เอกสารอนุญาต 2'}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs sm:text-sm font-bold">
                    <ZoomIn className="w-5 h-5 text-emerald-400" />
                    <span>คลิกเพื่อดูภาพขยาย</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Activity Images Slider - Shown if show_activities !== false and has images */}
        {aboutData.show_activities !== false && aboutData.activity_images && aboutData.activity_images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="space-y-4 pt-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-800/80 pb-3">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-500/15 border border-lime-500/30 text-lime-300 text-xs font-bold shadow-xs mb-2">
                  <Camera className="w-3.5 h-3.5 text-lime-400" />
                  <span>ภาพกิจกรรม & การปฏิบัติงานจริง</span>
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white">
                  <span className="text-lime-300 drop-shadow-[0_2px_10px_rgba(190,242,100,0.3)]">
                    ภาพกิจกรรม
                  </span>{' '}
                  <span className="text-[#FF5500] drop-shadow-[0_2px_10px_rgba(255,85,0,0.4)]">
                    และการทำงานของทีมงาน
                  </span>
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 max-w-sm sm:text-right">
                บรรยากาศการออกให้บริการติดตั้งเน็ตบ้าน AIS FIBRE 3 อย่างมืออาชีพ
              </p>
            </div>

            <ActivitySlider
              images={aboutData.activity_images}
              onOpenImage={(url) => setPreviewDoc(url)}
              autoPlayInterval={5000}
            />
          </motion.div>
        )}

        {/* Company Overview Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-emerald-500/30 shadow-2xl backdrop-blur-md relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <Building2 className="w-4 h-4" />
                <span>ข้อมูลนิติบุคคล</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {aboutData.company_name || 'บริษัท โฮมไฟเบอร์เนต999 จำกัด'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                เรามุ่งมั่นให้บริการรับสมัครและติดตั้งเน็ตบ้าน AIS FIBRE 3 ด้วยความโปร่งใส รวดเร็ว และมาตรฐานสูงสุด ดูแลลูกค้าทุกขั้นตอนตั้งแต่การเช็กคู่สายในพื้นที่ แนะนำแพ็กเกจที่เหมาะสม นัดหมายช่างติดตั้ง จนถึงการบริการหลังการขาย
              </p>

              <div className="pt-2 space-y-2.5 text-xs sm:text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                  <span>{aboutData.company_address || 'ที่ตั้ง บริษัท 512 หมู่ 1 ถนนรักสงบ ตำบลวิศิษฐ์ อำเภอเมือง จังหวัดบึงกาฬ 38000'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>เวลาทำการ: ทุกวัน เวลา 08.00 - 17.00 น.</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-950/80 p-5 sm:p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-lime-400" />
                <span>ช่องทางติดต่อสอบถาม & สมัครติดตั้ง</span>
              </h3>

              <div className="space-y-3">
                <a
                  href="tel:0935515442"
                  id="about-call-093"
                  className="flex items-center justify-center gap-2.5 p-3 rounded-xl bg-gradient-to-r from-emerald-500 via-lime-500 to-[#FF5500] text-slate-950 font-black text-sm sm:text-base hover:brightness-105 active:scale-98 transition-all"
                >
                  <PhoneCall className="w-4 h-4 shrink-0" />
                  <span className="font-mono font-black text-sm sm:text-base">093-551-5442</span>
                </a>

                <a
                  href="tel:0621939199"
                  id="about-call-062"
                  className="flex items-center justify-center gap-2.5 p-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm sm:text-base hover:border-emerald-500 transition-colors"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-mono font-bold text-sm sm:text-base text-emerald-300">062-193-9199</span>
                </a>

                <a
                  href="https://line.me/ti/p/@aisfibre999"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-[#06C755] text-white font-bold text-xs sm:text-sm hover:bg-[#05b04a] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>LINE Official</span>
                  </div>
                  <span className="font-mono font-black">@aisfibre999</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 4 Pillars of Service Credibility */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5 hover:border-emerald-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">เช็กพื้นที่ & คู่สายไว</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              ทราบผลครอบคลุมสัญญาณทันที พร้อมนัดหมายติดตั้งตามวันเวลาที่สะดวก
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5 hover:border-emerald-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-lime-500/15 text-lime-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">อุปกรณ์มาตรฐานสากล</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              เราเตอร์ Wi-Fi 6 / Wi-Fi 7 คุณภาพสูง สัญญาณแรงทั่วทั้งบ้าน
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5 hover:border-emerald-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">โปร่งใส ไร้ค่าใช้จ่ายแฝง</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              ฟรีค่าแรกเข้าและค่าติดตั้งตามเงื่อนไขแพ็กเกจ AIS ตรงไปตรงมา
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5 hover:border-emerald-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-orange-500/15 text-orange-400 flex items-center justify-center">
              <Headphones className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">ดูแลใส่ใจตลอดการใช้งาน</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              ประสานงานทีมช่างและฝ่ายบริการดูแลแก้ปัญหาให้อย่างรวดเร็ว
            </p>
          </div>
        </div>

        {/* Quick CTA banner */}
        <div className="text-center pt-4">
          <div className="inline-flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => onNavigate('/packages')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-400 hover:from-emerald-400 hover:to-lime-300 text-slate-950 font-black text-sm shadow-xl shadow-emerald-950/40 flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-105"
            >
              <span>เลือกดูแพ็กเกจเน็ตบ้าน</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('/check-area')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <span>ตรวจสอบพื้นที่ให้บริการ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Full-screen Lightbox Preview for Certificates */}
      <AnimatePresence>
        {previewDoc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewDoc(null)}
            className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md p-4 sm:p-8 flex items-center justify-center cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl p-2 sm:p-4 flex flex-col items-center cursor-default"
            >
              <button
                onClick={() => setPreviewDoc(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 transition-colors z-10 cursor-pointer shadow-lg"
                title="ปิดภาพขยาย"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-full h-full max-h-[82vh] overflow-auto flex items-center justify-center">
                <img
                  src={previewDoc}
                  alt="เอกสารใบอนุญาตฉบับเต็ม"
                  className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-sm"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

