import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storage';
import { AboutUsSettings } from '../types';
import {
  ShieldCheck,
  Award,
  FileCheck2,
  ChevronRight,
  Phone,
  CheckCircle2,
  Copy,
  Check,
  Building2,
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';

interface AboutUsPageProps {
  onNavigate: (path: string) => void;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({ onNavigate }) => {
  const [aboutData, setAboutData] = useState<AboutUsSettings>(() =>
    StorageService.getAboutSettings()
  );
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    const data = StorageService.getAboutSettings();
    setAboutData(data);
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

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
          <span className="text-emerald-400 font-semibold">เกี่ยวกับเรา / ใบอนุญาตตัวแทน</span>
        </nav>
      </div>

      {/* Main Certificate Showcase Section (Matches the reference image faithfully) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        {/* Main Heading: "ใบอนุญาตตัวแทนจำหน่ายอย่างเป็นทางการ" */}
        <div className="text-center space-y-3 mb-8 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-slate-300 shadow-inner mb-1"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>หนังสือรับรองการแต่งตั้งอย่างถูกต้องตามกฎหมาย จาก AWN</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-snug drop-shadow-md"
          >
            <span className="text-lime-300 drop-shadow-[0_2px_12px_rgba(190,242,100,0.3)]">
              {aboutData.title_part1 || 'ใบอนุญาตตัวแทนจำหน่าย'}
            </span>
            <span className="text-[#FF5500] drop-shadow-[0_2px_12px_rgba(255,85,0,0.4)] ml-2">
              {aboutData.title_part2 || 'อย่างเป็นทางการ'}
            </span>
          </motion.h1>

          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto font-normal">
            มั่นใจทุกบริการ ติดตั้งเน็ตบ้าน AIS FIBRE 3 กับตัวแทนจำหน่ายแต่งตั้งอย่างเป็นทางการ
            ตรวจสอบเอกสารอนุญาตได้โปร่งใส 100%
          </p>
        </div>

        {/* Side-by-side A4 Documents Display (ขนาดรูปภาพ A4 คู่กัน - โชว์อย่างเดียว) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start justify-center max-w-5xl mx-auto">
          {/* Document 1 (Left A4) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col items-center w-full"
          >
            {/* A4 Container with precise aspect ratio 210 / 297 */}
            <div className="relative w-full aspect-[210/297] rounded-2xl sm:rounded-3xl overflow-hidden bg-white shadow-2xl shadow-black/80 border-4 sm:border-[6px] border-slate-800/80 flex items-center justify-center">
              {/* Document Image */}
              <img
                src={aboutData.doc1_image}
                alt={aboutData.doc1_title}
                className="w-full h-full object-contain bg-white select-none pointer-events-none"
                loading="eager"
              />

              {/* Top Document Tag */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-950/85 backdrop-blur-md text-[11px] font-bold text-emerald-300 border border-slate-700/60 shadow flex items-center gap-1.5 pointer-events-none">
                <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>หนังสืออนุญาต AWN 1</span>
              </div>
            </div>

            {/* Document Label */}
            <div className="mt-3 text-center w-full px-2">
              <span className="text-xs font-semibold text-slate-300 block">
                {aboutData.doc1_title}
              </span>
            </div>
          </motion.div>

          {/* Document 2 (Right A4) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center w-full"
          >
            {/* A4 Container with precise aspect ratio 210 / 297 */}
            <div className="relative w-full aspect-[210/297] rounded-2xl sm:rounded-3xl overflow-hidden bg-white shadow-2xl shadow-black/80 border-4 sm:border-[6px] border-slate-800/80 flex items-center justify-center">
              {/* Document Image */}
              <img
                src={aboutData.doc2_image}
                alt={aboutData.doc2_title}
                className="w-full h-full object-contain bg-white select-none pointer-events-none"
                loading="eager"
              />

              {/* Top Document Tag */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-950/85 backdrop-blur-md text-[11px] font-bold text-orange-400 border border-slate-700/60 shadow flex items-center gap-1.5 pointer-events-none">
                <Award className="w-3.5 h-3.5 text-orange-400" />
                <span>Partner Letter 0008/2025</span>
              </div>
            </div>

            {/* Document Label */}
            <div className="mt-3 text-center w-full px-2">
              <span className="text-xs font-semibold text-slate-300 block">
                {aboutData.doc2_title}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Company Name & Address at the bottom (Matches photo: Bold white company name + italicized address) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 sm:mt-14 text-center space-y-2 max-w-4xl mx-auto px-4"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white drop-shadow-md">
            {aboutData.company_name || 'บริษัท โฮมไฟเบอร์เนต999 จำกัด'}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-100 font-semibold tracking-normal leading-relaxed max-w-3xl mx-auto drop-shadow-sm">
            {aboutData.company_address ||
              'ที่ตั้ง บริษัท 512 หมู่ 1 ถนนรักสงบ ตำบลวิศิษฐ์ อำเภอเมือง จังหวัดบึงกาฬ 38000'}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

