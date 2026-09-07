import React, { useState, useEffect } from 'react';
import { PackageItem } from '../types';
import { ApiService } from '../services/api';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  CheckCircle2,
  Tv,
  Router,
  Zap,
  ShieldCheck,
  PhoneCall,
  ChevronLeft,
  Share2,
  Clock,
  HelpCircle,
  Sparkles,
  Info,
} from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

interface PackageDetailPageProps {
  slugOrId?: string;
  slug?: string;
  onNavigate: (path: string, params?: any) => void;
  passedPkg?: PackageItem;
  passedPackage?: PackageItem;
}

export const PackageDetailPage: React.FC<PackageDetailPageProps> = ({
  slugOrId,
  slug,
  onNavigate,
  passedPkg,
  passedPackage,
}) => {
  const activeSlug = slug || slugOrId || '';
  const initialPkg = passedPackage || passedPkg || null;
  const [pkg, setPkg] = useState<PackageItem | null>(initialPkg);
  const [loading, setLoading] = useState(!initialPkg);
  const [callbackModalOpen, setCallbackModalOpen] = useState(false);
  const [callbackName, setCallbackName] = useState('');
  const [callbackPhone, setCallbackPhone] = useState('');
  const [callbackSubmitting, setCallbackSubmitting] = useState(false);

  const { addToast } = useNotification();

  useEffect(() => {
    if (!initialPkg && activeSlug) {
      const fetchPkg = async () => {
        setLoading(true);
        try {
          const item = await ApiService.getPackageBySlugOrId(activeSlug);
          setPkg(item);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchPkg();
    }
  }, [activeSlug, initialPkg]);

  const handleCallbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!callbackName.trim() || !callbackPhone.trim()) {
      addToast({ type: 'warning', title: 'กรุณากรอกชื่อและเบอร์โทรศัพท์' });
      return;
    }
    setCallbackSubmitting(true);
    try {
      await ApiService.createCoverageCheckLead({
        customer_name: callbackName,
        phone: callbackPhone,
        province: 'ไม่ได้ระบุ (รอติดต่อกลับ)',
        district: '-',
        subdistrict: '-',
        consent_contact: true,
        package_id: pkg?.id,
        package_name: pkg?.name,
        package_price: pkg?.price,
      });

      addToast({
        type: 'success',
        title: 'บันทึกข้อมูลเรียบร้อย',
        message: 'เจ้าหน้าที่จะโทรติดต่อกลับเพื่อแนะนำโปรโมชั่นเร็วที่สุด',
      });
      setCallbackModalOpen(false);
      setCallbackName('');
      setCallbackPhone('');
    } catch (err) {
      addToast({ type: 'error', title: 'เกิดข้อผิดพลาดในการส่งข้อมูล' });
    } finally {
      setCallbackSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center animate-pulse">
        <div className="h-8 w-64 bg-slate-800 rounded-lg mx-auto mb-4" />
        <div className="h-48 bg-slate-900 rounded-2xl" />
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">ไม่พบข้อมูลแพ็กเกจ</h2>
        <button
          onClick={() => onNavigate('/packages')}
          className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
        >
          กลับหน้ารวมแพ็กเกจ
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <button
        onClick={() => onNavigate('/packages')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>กลับหน้ารวมแพ็กเกจ</span>
      </button>

      {/* Main Hero Card */}
      <div className="rounded-3xl bg-slate-900 border border-emerald-500/30 shadow-2xl relative overflow-hidden">
        {pkg.image && (
          <div className="w-full relative overflow-hidden bg-slate-950 border-b border-slate-800">
            <img
              src={pkg.image}
              alt={pkg.name}
              className="w-full h-auto max-h-[500px] sm:max-h-[600px] object-cover object-center block"
            />
          </div>
        )}

        {pkg.badge && (
          <div className="absolute top-0 right-0 z-10">
            <span className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-bl-2xl bg-gradient-to-r from-emerald-500 via-lime-400 to-orange-500 text-slate-950 shadow-lg">
              {pkg.badge}
            </span>
          </div>
        )}

        <div className="p-6 sm:p-10 space-y-8">
          {/* Title & Price Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-8">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  AIS FIBRE OFFICIAL
                </span>
                <span className="text-xs text-slate-400">สัญญา {pkg.contract_month} เดือน</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display">
                {pkg.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {pkg.description}
              </p>
            </div>

            {/* Big Price */}
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 text-right shrink-0 min-w-[200px]">
              <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">ราคาเริ่มต้น</p>
              <div className="flex items-baseline justify-end gap-1.5 mt-1">
                <span className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-emerald-400 via-lime-400 to-orange-500 bg-clip-text text-transparent font-display">
                  {(pkg.price ?? (pkg as any).monthlyPrice ?? 0).toLocaleString()}
                </span>
                <span className="text-xs text-slate-300 font-medium">บาท/ด.</span>
              </div>
              <p className="text-[11px] text-emerald-400/90 font-medium mt-1">ฟรี! ค่าแรกเข้า & ค่าติดตั้ง</p>
            </div>
          </div>

        {/* Dual Speeds */}
        {(() => {
          const dl = pkg.download_speed ?? (pkg as any).downloadSpeed ?? 500;
          const ul = pkg.upload_speed ?? (pkg as any).uploadSpeed ?? 500;
          return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <ArrowDownCircle className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Download Speed</p>
                  <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-emerald-400 via-lime-400 to-orange-500 bg-clip-text text-transparent">
                    {dl >= 1000 ? `${dl / 1000} Gbps` : `${dl} Mbps`}
                  </p>
                  <p className="text-[11px] text-slate-400">สปีดดาวน์โหลดเต็มพิกัด</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-orange-500/10 text-orange-400">
                  <ArrowUpCircle className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Upload Speed</p>
                  <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-lime-400 via-yellow-400 to-orange-500 bg-clip-text text-transparent">
                    {ul >= 1000 ? `${ul / 1000} Gbps` : `${ul} Mbps`}
                  </p>
                  <p className="text-[11px] text-slate-400">สปีดอัปโหลดเร็วทันใจ</p>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Features & Privileges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>สิทธิพิเศษและบริการในแพ็กเกจ</span>
            </h3>
            <ul className="space-y-2.5">
              {(pkg.features || []).map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                  <span>{typeof feat === 'string' ? feat : feat.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Router className="w-4 h-4 text-teal-400" />
              <span>อุปกรณ์ที่ได้รับ (ยืมฟรีตลอดสัญญา)</span>
            </h3>
            <div className="space-y-2.5">
              {(pkg.equipment || []).map((eq, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-200 flex items-center gap-2.5"
                >
                  <Router className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{eq}</span>
                </div>
              ))}
            </div>

            {pkg.recommendedFor && (
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200">
                <strong>เหมาะสำหรับ:</strong> {pkg.recommendedFor}
              </div>
            )}
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 text-xs text-slate-400 space-y-1">
          <p className="font-bold text-slate-300 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            เงื่อนไขการให้บริการ:
          </p>
          <p>• สัญญาการใช้งาน {pkg.contract_month} เดือน</p>
          <p>• ฟรี ค่าแรกเข้าและค่าติดตั้งเดินสายไฟเบอร์ออปติกมูลค่า 4,800 บาท</p>
          <p>• อุปกรณ์เราเตอร์และกล่องทีวีเป็นกรรมสิทธิ์ของบริษัท ให้ยืมใช้ตลอดอายุการเป็นสมาชิก</p>
        </div>

        {/* Action Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={() => window.open('https://line.me/ti/p/@aisfibrefanclub', '_blank')}
            className="w-full sm:flex-1 py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-400 via-lime-400 to-orange-500 hover:from-emerald-300 hover:via-lime-300 hover:to-orange-400 text-slate-950 font-black text-sm shadow-xl shadow-orange-500/20 active:scale-98 transition-all flex items-center justify-center gap-2"
            id="btn-apply-package-detail"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>สมัครแพ็กเกจนี้ทันที (ทัก LINE @aisfibrefanclub)</span>
          </button>

          <button
            onClick={() => setCallbackModalOpen(true)}
            className="w-full sm:w-auto py-4 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition-colors flex items-center justify-center gap-2"
          >
            <PhoneCall className="w-4 h-4 text-emerald-400" />
            <span>ให้เจ้าหน้าที่ติดต่อกลับ</span>
          </button>
        </div>
        </div>
      </div>

      {/* Callback Modal */}
      {callbackModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>ขอให้เจ้าหน้าที่ติดต่อกลับ</span>
              </h3>
              <button
                onClick={() => setCallbackModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              สนใจแพ็กเกจ <strong>{pkg.name}</strong> กรุณากรอกเบอร์โทรศัพท์ เจ้าหน้าที่จะติดต่อกลับภายใน 15 นาที
            </p>

            <form onSubmit={handleCallbackSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  ชื่อ-นามสกุล *
                </label>
                <input
                  type="text"
                  required
                  value={callbackName}
                  onChange={(e) => setCallbackName(e.target.value)}
                  placeholder="เช่น คุณสมชาย ใจดี"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  เบอร์โทรศัพท์ติดต่อ *
                </label>
                <input
                  type="tel"
                  required
                  value={callbackPhone}
                  onChange={(e) => setCallbackPhone(e.target.value)}
                  placeholder="เช่น 0812345678"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCallbackModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:bg-slate-800"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={callbackSubmitting}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md"
                >
                  {callbackSubmitting ? 'กำลังส่งข้อมูล...' : 'ส่งคำขอติดต่อกลับ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
