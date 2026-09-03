import React from 'react';
import {
  Wifi,
  PhoneCall,
  MessageCircle,
  MapPin,
  Clock,
  ShieldCheck,
  Award,
  Zap,
  ChevronRight,
  Headphones,
  Mail,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { useSecretAdminTrigger } from '../../hooks/useSecretAdminTrigger';

interface FooterProps {
  onNavigate: (path: string) => void;
  onOpenAdminAuth?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAdminAuth }) => {
  const handleTriggerAdmin = () => {
    if (onOpenAdminAuth) {
      onOpenAdminAuth();
    } else {
      onNavigate('/admin');
    }
  };

  const secretTrigger = useSecretAdminTrigger({
    requiredClicks: 5,
    timeoutMs: 3000,
    onTrigger: handleTriggerAdmin,
  });

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/80 pt-16 pb-24 md:pb-12 text-sm relative">
      {/* 5-Clicks countdown indicator feedback */}
      {secretTrigger.isCounting && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-slate-900/95 border border-emerald-500/50 text-emerald-400 text-xs font-bold shadow-2xl flex items-center gap-2 animate-bounce backdrop-blur-md">
          <Lock className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>แตะอีก {secretTrigger.remainingClicks} ครั้ง เพื่อเข้าสู่ระบบหลังบ้าน</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-12 mb-12 border-b border-slate-800/80">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-br from-emerald-600 via-lime-600 to-orange-500 border border-white/25 text-white shadow-lg relative overflow-hidden group">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-xs text-white border border-white/30 shrink-0">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-black text-white text-xs sm:text-sm drop-shadow-xs">ตัวแทนอย่างเป็นทางการ</p>
              <p className="text-[11px] text-white/90">Authorized AIS FIBRE 3</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-br from-emerald-600 via-lime-600 to-orange-500 border border-white/25 text-white shadow-lg relative overflow-hidden group">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-xs text-white border border-white/30 shrink-0">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-black text-white text-xs sm:text-sm drop-shadow-xs">ติดตั้งรวดเร็ว ทันใจ</p>
              <p className="text-[11px] text-white/90">ทีมช่างมืออาชีพตรงถึงบ้าน</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-br from-emerald-600 via-lime-600 to-orange-500 border border-white/25 text-white shadow-lg relative overflow-hidden group">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-xs text-white border border-white/30 shrink-0">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-black text-white text-xs sm:text-sm drop-shadow-xs">ฟรี! ค่าแรกเข้า & เดินสาย</p>
              <p className="text-[11px] text-white/90">ประหยัดทันที 4,800 บาท</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-br from-emerald-600 via-lime-600 to-orange-500 border border-white/25 text-white shadow-lg relative overflow-hidden group">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-xs text-white border border-white/30 shrink-0">
              <Headphones className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-extrabold text-white text-xs sm:text-sm drop-shadow-xs">บริการรวดเร็ว ปรึกษาฟรี</p>
              <p className="text-xs sm:text-sm text-white font-black font-mono tracking-wide drop-shadow-sm">โทร 093-551-5442</p>
            </div>
          </div>
        </div>

        {/* 4 Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand & Description */}
          <div className="lg:col-span-2 space-y-4">
            <div
              onClick={() => onNavigate('/')}
              className="flex items-center gap-3 cursor-pointer group select-none inline-flex"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-700 shadow-md shadow-emerald-950">
                <Wifi className="w-5 h-5 text-slate-950 font-bold" />
              </div>
              <div>
                <span className="text-lg font-black text-white tracking-tight">AIS FIBRE</span>
                <span className="text-lg font-black text-emerald-400 ml-1">3</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 ml-2">
                  By โฮมไฟเบอร์เนต999
                </span>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-slate-300 max-w-sm font-medium">
              รับติดเน็ตบ้านสมัคร ออนไลน์ได้ทั่วประเทศ รวดเร็ว ครบวงจร เช็กพื้นที่ครอบคลุม ให้คำปรึกษาแพ็กเกจเน็ตบ้านและอุปกรณ์ Wi-Fi 6 / 7 ครบจบในที่เดียว
            </p>

            <div className="pt-2 flex flex-col gap-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-300 leading-relaxed">
                  บริษัท โฮมไฟเบอร์เนต999 จำกัด 512 หมู่ 1 ถนนรักสงบ ตำบลวิศิษฐ์ อำเภอเมือง จังหวัดบึงกาฬ 38000
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-emerald-300 font-semibold">เปิดให้บริการ ทุกวัน 08.00 - 17.00 น.</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">บริการออนไลน์</p>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => onNavigate('/packages')} className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-500" /> แพ็กเกจทั้งหมด
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/promotions')} className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-500" /> โปรโมชั่นพิเศษ
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/check-area')} className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-500" /> ตรวจสอบพื้นที่ติดตั้ง
                </button>
              </li>
              <li>
                <a
                  href="https://line.me/ti/p/@aisfibre999"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-500" /> สมัครติดตั้ง (LINE @aisfibre999)
                </a>
              </li>
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-lime-300 font-semibold">
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-500" /> เกี่ยวกับเรา & ใบอนุญาตตัวแทน
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/articles')} className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-500" /> บทความ & เทคนิคเน็ตบ้าน
                </button>
              </li>
            </ul>
          </div>

          {/* Equipment & Knowledge */}
          <div>
            <p className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">อุปกรณ์ & สาระน่ารู้</p>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => onNavigate('/equipment')} className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-500" /> เราเตอร์ Wi-Fi 6 / Wi-Fi 7
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/equipment')} className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-500" /> กล่อง AIS PLAYBOX 4K
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/articles')} className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-500" /> บทความ & เทคนิคเน็ตบ้าน
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/faq')} className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-500" /> คำถามที่พบบ่อย (FAQ)
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Direct */}
          <div>
            <p className="text-sm font-extrabold text-white uppercase tracking-wider mb-4 border-b border-emerald-500/30 pb-2 inline-block">
              ติดต่อตัวแทนจำหน่าย
            </p>
            <div className="space-y-2.5">
              <a
                href="tel:0935515442"
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-emerald-950/80 border border-emerald-500/40 hover:border-emerald-400 text-white transition-all shadow-sm hover:scale-[1.01] group"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-xs">
                  <PhoneCall className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex-1 flex items-center">
                  <span className="text-base sm:text-lg font-bold text-white tracking-wide font-mono">
                    093-551-5442
                  </span>
                </div>
              </a>

              <a
                href="https://line.me/ti/p/@aisfibre999"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-emerald-950/80 border border-[#06C755]/50 hover:border-[#06C755] text-white transition-all shadow-sm hover:scale-[1.01] group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#06C755] text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                  <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex-1 flex items-center">
                  <span className="text-base sm:text-lg font-bold text-white tracking-wide font-mono">
                    @aisfibre999
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer & Copyright */}
        <div className="pt-8 border-t border-slate-800/80 space-y-3">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400 font-medium">
            <span className="text-amber-400/90 font-semibold mr-1.5">หมายเหตุ:</span>
            ขอสงวนสิทธิในการเปลี่ยนแปลงโปรโมชั่นโดยไม่แจ้งให้ทราบล่วงหน้า เงื่อนไขตามบริษัทกำหนด
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 pt-2 text-center md:text-left">
            <p>
              © {new Date().getFullYear()} บริษัท โฮมไฟเบอร์เนต999 จำกัด Authorized Dealer. สงวนลิขสิทธิ์ทุกประการ
            </p>
            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              <span>AIS Fibre 3 ตัวแทนจำหน่ายอย่างเป็นทางการ</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
