import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  ShieldCheck,
  Award,
  FileCheck2,
  Building2,
  MapPin,
  PhoneCall,
  ExternalLink,
  CheckCircle2,
  ZoomIn,
  Sparkles,
  ArrowRight,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { StorageService } from '../../services/storage';
import { ApiService } from '../../services/api';
import { AboutUsSettings } from '../../types';

interface AboutUsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export const AboutUsModal: React.FC<AboutUsModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [aboutData, setAboutData] = useState<AboutUsSettings>(() =>
    StorageService.getAboutSettings()
  );
  const [dontShowToday, setDontShowToday] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(5);

  useEffect(() => {
    if (isOpen) {
      setAboutData(StorageService.getAboutSettings());
      ApiService.getAboutUs()
        .then((remote) => {
          if (remote) setAboutData(remote);
        })
        .catch(() => {});
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (dontShowToday) {
      const todayStr = new Date().toISOString().split('T')[0];
      localStorage.setItem('ais_hide_about_popup_date', todayStr);
    }
    onClose();
  }, [dontShowToday, onClose]);

  // 5-second countdown auto-dismiss
  useEffect(() => {
    if (!isOpen) {
      setCountdown(5);
      return;
    }

    setCountdown(5);

    const interval = setInterval(() => {
      // Pause countdown if user is previewing an enlarged certificate
      if (previewDoc) return;

      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, previewDoc]);

  // Safely auto-close when countdown reaches 0 via useEffect
  useEffect(() => {
    if (isOpen && countdown === 0) {
      handleClose();
    }
  }, [isOpen, countdown, handleClose]);

  const handleGoToAboutPage = () => {
    handleClose();
    onNavigate('/about');
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="about-us-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
            onClick={handleClose}
            id="about-us-modal-backdrop"
          >
            <motion.div
              key="about-us-modal-container"
              initial={{ opacity: 0, scale: 0.93, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative w-full max-w-2xl bg-slate-900 border-2 border-emerald-500/40 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-emerald-950/90 text-left my-auto overflow-hidden text-white"
              onClick={(e) => e.stopPropagation()}
              id="about-us-modal-container"
            >
          {/* Top animated 5-second progress bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-800 overflow-hidden z-30">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-400 via-lime-400 to-teal-400"
              initial={{ width: '100%' }}
              animate={{ width: `${(countdown / 5) * 100}%` }}
              transition={{ duration: 1, ease: 'linear' }}
            />
          </div>

          {/* Top Right Controls: 5s Countdown Badge & Close Button */}
          <div className="absolute top-3.5 right-3.5 flex items-center gap-2 z-20">
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/95 border border-slate-700/80 text-[11px] text-slate-300 shadow-sm"
              title="ป๊อปอัปจะปิดอัตโนมัติภายใน 5 วินาที"
            >
              <Clock className="w-3.5 h-3.5 text-lime-400 animate-pulse" />
              <span>ปิดใน <strong className="text-lime-300 font-mono font-bold text-xs">{countdown}s</strong></span>
            </div>

            <button
              onClick={handleClose}
              className="p-2 rounded-full text-slate-400 hover:text-white bg-slate-800/90 hover:bg-slate-700 transition-colors cursor-pointer shadow-md"
              aria-label="ปิดหน้าต่าง"
              id="about-modal-close-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Header Section */}
          <div className="space-y-2 mb-4 sm:mb-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 font-semibold shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>เกี่ยวกับเรา • ตัวแทนจำหน่ายอย่างเป็นทางการ</span>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight leading-tight">
              <span className="text-lime-300 drop-shadow-[0_2px_10px_rgba(190,242,100,0.3)]">
                {aboutData.title_part1 || 'ใบอนุญาตตัวแทนจำหน่าย'}
              </span>{' '}
              <span className="text-[#FF5500] drop-shadow-[0_2px_10px_rgba(255,85,0,0.4)]">
                {aboutData.title_part2 || 'อย่างเป็นทางการ'}
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
              มั่นใจ ปลอดภัย 100% สมัครติดตั้งเน็ตบ้าน AIS FIBRE 3 กับตัวแทนจำหน่ายที่ได้รับการแต่งตั้งอย่างถูกต้องตามกฎหมายจาก AWN
            </p>
          </div>

          {/* Certificate Documents Grid (Only shown if show_certificates is enabled) */}
          {aboutData.show_certificates && (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
              {/* Document 1 */}
              <div
                onClick={() => setPreviewDoc(aboutData.doc1_image)}
                className="group relative cursor-pointer rounded-xl sm:rounded-2xl overflow-hidden bg-white border-2 border-slate-700 hover:border-emerald-400 transition-all shadow-md aspect-[210/280] flex items-center justify-center"
                title="คลิกเพื่อขยายดูหนังสืออนุญาต AWN 1"
              >
                <img
                  src={aboutData.doc1_image}
                  alt={aboutData.doc1_title || 'หนังสืออนุญาต AWN 1'}
                  className="w-full h-full object-contain bg-white group-hover:scale-105 transition-transform duration-300"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 text-white text-xs font-bold">
                  <ZoomIn className="w-4 h-4 text-emerald-400" />
                  <span>แตะเพื่อขยาย</span>
                </div>
                <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-slate-950/90 text-[10px] font-bold text-emerald-300 border border-slate-700 flex items-center gap-1">
                  <FileCheck2 className="w-3 h-3 text-emerald-400" />
                  <span className="truncate max-w-[100px] sm:max-w-none">หนังสืออนุญาต AWN</span>
                </div>
              </div>

              {/* Document 2 */}
              <div
                onClick={() => setPreviewDoc(aboutData.doc2_image)}
                className="group relative cursor-pointer rounded-xl sm:rounded-2xl overflow-hidden bg-white border-2 border-slate-700 hover:border-emerald-400 transition-all shadow-md aspect-[210/280] flex items-center justify-center"
                title="คลิกเพื่อขยายดู Partner Letter"
              >
                <img
                  src={aboutData.doc2_image}
                  alt={aboutData.doc2_title || 'Partner Letter 0008/2025'}
                  className="w-full h-full object-contain bg-white group-hover:scale-105 transition-transform duration-300"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 text-white text-xs font-bold">
                  <ZoomIn className="w-4 h-4 text-orange-400" />
                  <span>แตะเพื่อขยาย</span>
                </div>
                <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-slate-950/90 text-[10px] font-bold text-orange-300 border border-slate-700 flex items-center gap-1">
                  <Award className="w-3 h-3 text-orange-400" />
                  <span className="truncate max-w-[100px] sm:max-w-none">Partner Letter</span>
                </div>
              </div>
            </div>
          )}

          {/* Company Details Box */}
          <div className="p-3 sm:p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2 mb-4">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
                  {aboutData.company_name || 'บริษัท โฮมไฟเบอร์เนต999 จำกัด'}
                </h3>
                <p className="text-xs text-slate-300 mt-1 flex items-start gap-1 leading-normal">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>
                    {aboutData.company_address ||
                      '512 หมู่ 1 ถนนรักสงบ ตำบลวิศิษฐ์ อำเภอเมือง จังหวัดบึงกาฬ 38000'}
                  </span>
                </p>
              </div>
            </div>

            {/* Quick Guarantees Badge Row */}
            <div className="pt-2 border-t border-slate-700/60 flex flex-wrap gap-2 text-[11px] text-slate-300 font-medium">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900 text-emerald-300">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                ตรวจสอบสิทธิ์ได้ 100%
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900 text-lime-300">
                <CheckCircle2 className="w-3 h-3 text-lime-400" />
                ติดตั้งฟรีทั่วไทย
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900 text-teal-300">
                <CheckCircle2 className="w-3 h-3 text-teal-400" />
                ทีมช่างมาตรฐาน AIS
              </span>
            </div>
          </div>

          {/* Call Hotline Buttons */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4">
            <a
              href="tel:0935515442"
              className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-lime-400 hover:from-emerald-300 hover:via-emerald-400 hover:to-lime-300 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md transition-all text-center"
              id="about-modal-call-093"
            >
              <PhoneCall className="w-3.5 h-3.5 shrink-0" />
              <span>093-551-5442</span>
            </a>
            <a
              href="tel:0621939199"
              className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-400 hover:from-teal-400 hover:via-cyan-400 hover:to-emerald-300 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md transition-all text-center"
              id="about-modal-call-062"
            >
              <PhoneCall className="w-3.5 h-3.5 shrink-0" />
              <span>062-193-9199</span>
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2 border-t border-slate-800">
            <button
              onClick={handleClose}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
              id="about-modal-enter-site-btn"
            >
              <span>เข้าสู่เว็บไซต์ / ดูโปรโมชั่น</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-950/20 text-slate-950 font-mono font-bold">
                {countdown}s
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleGoToAboutPage}
              className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
              id="about-modal-view-full-btn"
            >
              <span>ดูเอกสารฉบับเต็ม</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          {/* Don't show again today checkbox */}
          <div className="mt-3 text-center sm:text-left">
            <label className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={dontShowToday}
                onChange={(e) => setDontShowToday(e.target.checked)}
                className="w-3.5 h-3.5 rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900 cursor-pointer"
                id="about-modal-dont-show-checkbox"
              />
              <span>ไม่ต้องแสดงป๊อปอัปนี้อีกในวันนี้</span>
            </label>
          </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox Preview for enlarged Certificate */}
      <AnimatePresence>
        {previewDoc && (
          <motion.div
            key="certificate-lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setPreviewDoc(null)}
            id="certificate-lightbox-backdrop"
          >
            <motion.div
              key="certificate-lightbox-card"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-2xl w-full max-h-[90vh] bg-white rounded-2xl overflow-hidden p-2 flex flex-col items-center shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setPreviewDoc(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 transition-colors shadow-lg z-10 cursor-pointer"
                aria-label="ปิดภาพขยาย"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={previewDoc}
                alt="ใบอนุญาตฉบับเต็ม"
                className="max-h-[85vh] w-auto object-contain bg-white"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
