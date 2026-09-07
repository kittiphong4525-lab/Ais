import React, { useState, useEffect } from 'react';
import { PackageItem, CustomerApplication } from '../types';
import { ApiService } from '../services/api';
import {
  FileCheck,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  User,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  Upload,
  Copy,
  Check,
  Zap,
  ArrowRight,
  Tv,
  Router,
  Lock,
  MessageCircle,
} from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

interface ApplyPageProps {
  initialPackageId?: string;
  initialPackage?: any;
  initialCoverageData?: any;
  onNavigate: (path: string, params?: any) => void;
}

export const ApplyPage: React.FC<ApplyPageProps> = ({
  initialPackageId,
  initialPackage,
  initialCoverageData,
  onNavigate,
}) => {
  const { addToast, broadcastNewLead } = useNotification();

  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loadingPkgs, setLoadingPkgs] = useState(true);

  // Wizard Step (1 - 6, then success result)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const defaultPkgId = initialPackage?.id || initialPackageId || '';
  const [selectedPackageId, setSelectedPackageId] = useState<string>(defaultPkgId);
  const [customerName, setCustomerName] = useState(initialCoverageData?.customer_name || '');
  const [phone, setPhone] = useState(initialCoverageData?.phone || '');
  const [idCardNumber, setIdCardNumber] = useState('');
  const [email, setEmail] = useState(initialCoverageData?.email || '');
  const [lineId, setLineId] = useState(initialCoverageData?.line_id || '');

  // Address
  const [province, setProvince] = useState(initialCoverageData?.province || 'กรุงเทพมหานคร');
  const [district, setDistrict] = useState(initialCoverageData?.district || '');
  const [subdistrict, setSubdistrict] = useState(initialCoverageData?.subdistrict || '');
  const [village, setVillage] = useState(initialCoverageData?.village || '');
  const [houseNo, setHouseNo] = useState(initialCoverageData?.house_no || '');
  const [street, setStreet] = useState(initialCoverageData?.street || '');
  const [zipcode, setZipcode] = useState(initialCoverageData?.zipcode || '');
  const [notes, setNotes] = useState('');

  // Appointment
  const [preferredDate, setPreferredDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [preferredTimeSlot, setPreferredTimeSlot] = useState('09:00 - 12:00 น. (ช่วงเช้า)');

  // Documents simulation
  const [idCardImage, setIdCardImage] = useState<string>('');
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Final Created Application
  const [createdApp, setCreatedApp] = useState<CustomerApplication | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPkgs = async () => {
      setLoadingPkgs(true);
      try {
        const list = await ApiService.getPackages({ onlyActive: true });
        setPackages(list);
        if (!selectedPackageId && list.length > 0) {
          setSelectedPackageId(list[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingPkgs(false);
      }
    };
    fetchPkgs();
  }, [selectedPackageId]);

  const selectedPkg = packages.find((p) => p.id === selectedPackageId);

  const provinces = [
    'กรุงเทพมหานคร',
    'นนทบุรี',
    'ปทุมธานี',
    'สมุทรปราการ',
    'สมุทรสาคร',
    'นครปฐม',
    'ชลบุรี',
    'ระยอง',
    'เชียงใหม่',
    'ขอนแก่น',
    'นครราชสีมา',
    'สงขลา',
    'ภูเก็ต',
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setIdCardImage(reader.result as string);
        addToast({
          type: 'success',
          title: 'อัปโหลดรูปภาพบัตรประชาชนสำเร็จ',
          message: 'ระบบใส่ลายน้ำกำกับความปลอดภัยเรียบร้อย',
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!selectedPackageId) {
        addToast({ type: 'warning', title: 'กรุณาเลือกแพ็กเกจที่ต้องการ' });
        return;
      }
    } else if (currentStep === 2) {
      if (!customerName.trim() || !phone.trim()) {
        addToast({ type: 'warning', title: 'กรุณากรอกชื่อ-นามสกุล และเบอร์โทรศัพท์' });
        return;
      }
    } else if (currentStep === 3) {
      if (!district.trim() || !subdistrict.trim()) {
        addToast({ type: 'warning', title: 'กรุณากรอกอำเภอ/เขต และตำบล/แขวง' });
        return;
      }
    } else if (currentStep === 4) {
      if (!preferredDate) {
        addToast({ type: 'warning', title: 'กรุณาเลือกวันที่ต้องการติดตั้ง' });
        return;
      }
    }
    setCurrentStep((prev) => prev + 1);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleSubmitApplication = async () => {
    if (!termsAccepted) {
      addToast({ type: 'warning', title: 'กรุณายอมรับเงื่อนไขการสมัคร' });
      return;
    }

    setIsSubmitting(true);
    try {
      const app = await ApiService.createApplication({
        package_id: selectedPackageId,
        package_name: selectedPkg?.name || 'AIS Fibre Package',
        package_price: selectedPkg?.price || 0,
        customer_name: customerName,
        phone,
        id_card_number: idCardNumber || undefined,
        email: email || undefined,
        line_id: lineId || undefined,
        province,
        district,
        subdistrict,
        village: village || undefined,
        house_no: houseNo || undefined,
        street: street || undefined,
        zipcode: zipcode || undefined,
        notes: notes || undefined,
        preferred_date: preferredDate,
        preferred_time_slot: preferredTimeSlot,
        id_card_image: idCardImage || undefined,
      });

      setCreatedApp(app);
      broadcastNewLead(customerName, phone, selectedPkg?.name);
      addToast({
        type: 'success',
        title: '🎉 สมัครติดตั้งสำเร็จ!',
        message: `รหัสคำขอของคุณคือ ${app.tracking_id}`,
      });
    } catch (err) {
      addToast({ type: 'error', title: 'เกิดข้อผิดพลาดในการส่งใบสมัคร' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast({ type: 'info', title: 'คัดลอกรหัสติดตามแล้ว' });
  };

  const stepsHeader = [
    { step: 1, label: 'เลือกแพ็กเกจ' },
    { step: 2, label: 'ข้อมูลผู้สมัคร' },
    { step: 3, label: 'สถานที่ติดตั้ง' },
    { step: 4, label: 'วันนัดหมาย' },
    { step: 5, label: 'เอกสาร' },
    { step: 6, label: 'สรุป & ยืนยัน' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
          <FileCheck className="w-3.5 h-3.5" />
          <span>FAST ONLINE APPLICATION (3-5 MINS)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-display">
          สมัครติดตั้ง AIS Fibre ออนไลน์
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          กรอกข้อมูลและเลือกวันนัดหมายช่างติดตั้งได้ทันที ฟรีค่าแรกเข้าและค่าเดินสายไฟเบอร์ 4,800 บาท
        </p>
      </div>

      {createdApp ? (
        /* Success Screen */
        <div className="rounded-3xl bg-slate-900 border border-emerald-500/50 p-8 sm:p-12 shadow-2xl space-y-6 text-center animate-in zoom-in-95">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-500/10 animate-bounce">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              SUCCESSFUL APPLICATION
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              ส่งใบสมัครติดตั้งเรียบร้อยแล้ว!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
              เจ้าหน้าที่ได้รับข้อมูลของท่านเรียบร้อยแล้ว และจะทำการตรวจสอบคู่สายพร้อมโทรยืนยันนัดหมายช่างที่เบอร์ <strong>{createdApp.phone}</strong>
            </p>
          </div>

          {/* Tracking Ticket */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 max-w-md mx-auto space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs text-slate-400">รหัสติดตามคำขอ</span>
              <span className="text-xs font-bold text-emerald-400">{createdApp.tracking_id}</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs text-slate-400">แพ็กเกจ</span>
              <span className="text-xs font-bold text-white">{createdApp.package_name}</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs text-slate-400">ค่าบริการ</span>
              <span className="text-xs font-bold text-emerald-400">{(createdApp.package_price || 0).toLocaleString()} บาท/ด.</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">วันนัดติดตั้งที่เลือก</span>
              <span className="text-xs font-bold text-slate-200">{createdApp.preferred_date} ({createdApp.preferred_time_slot})</span>
            </div>

            <div className="pt-2">
              <button
                onClick={() => handleCopyCode(createdApp.tracking_id || createdApp.id || '')}
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'คัดลอกรหัสแล้ว' : 'คัดลอกรหัสติดตามคำขอ'}</span>
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto">
            <a
              href="https://line.me/ti/p/@aisfibrefanclub"
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 px-6 rounded-xl bg-[#06C755] hover:bg-[#05b04a] text-white font-bold text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>ติดต่อแอดมิน LINE (@aisfibrefanclub)</span>
            </a>
            <button
              onClick={() => onNavigate('/articles')}
              className="w-full py-3.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm"
            >
              อ่านบทความ & เทคนิค
            </button>
          </div>
        </div>
      ) : (
        /* Multi-step Form Wizard */
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-10 shadow-2xl space-y-8">
          {/* Progress Step Header */}
          <div className="hidden sm:grid grid-cols-6 gap-2 border-b border-slate-800 pb-6">
            {stepsHeader.map((s) => {
              const isDone = currentStep > s.step;
              const isCurrent = currentStep === s.step;
              return (
                <div key={s.step} className="flex flex-col items-center text-center space-y-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isDone
                        ? 'bg-emerald-500 text-slate-950'
                        : isCurrent
                        ? 'bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500'
                        : 'bg-slate-950 text-slate-500 border border-slate-800'
                    }`}
                  >
                    {isDone ? '✓' : s.step}
                  </div>
                  <span
                    className={`text-[11px] font-medium ${
                      isCurrent ? 'text-emerald-400 font-bold' : isDone ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Mobile Step Badge */}
          <div className="sm:hidden flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400">ขั้นตอนที่ {currentStep} จาก 6</span>
            <span className="text-xs font-bold text-emerald-400">{stepsHeader[currentStep - 1].label}</span>
          </div>

          {/* Step 1: Select Package */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-400" />
                <span>ขั้นตอนที่ 1: เลือกแพ็กเกจที่ต้องการ</span>
              </h3>

              {loadingPkgs ? (
                <div className="h-48 bg-slate-950 rounded-2xl animate-pulse" />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {packages.map((pkg) => {
                    const isSelected = selectedPackageId === pkg.id;
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPackageId(pkg.id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/30'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-emerald-400">
                              {pkg.badge || 'AIS FIBRE'}
                            </span>
                            <h4 className="text-sm font-bold text-white mt-1">{pkg.name}</h4>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-bold text-emerald-400 block">ราคาเริ่มต้น</span>
                            <span className="text-xl font-black text-emerald-400 font-display">
                              {(pkg.price ?? (pkg as any).monthlyPrice ?? 0).toLocaleString()}.-
                            </span>
                            <p className="text-[10px] text-slate-400">/เดือน</p>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between text-xs text-slate-300 border-t border-slate-800/80 pt-2">
                          <span>สปีด {pkg.download_speed}/{pkg.upload_speed} Mbps</span>
                          {pkg.tvIncluded && (
                            <span className="text-purple-300 text-[11px] flex items-center gap-1">
                              <Tv className="w-3 h-3" /> รวมกล่อง TV
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Personal info */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-400" />
                <span>ขั้นตอนที่ 2: ข้อมูลผู้สมัคร</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    ชื่อ-นามสกุล *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="เช่น คุณกฤษณะ สุขใจ"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    เบอร์โทรศัพท์ติดต่อ * (รับ SMS ยืนยัน)
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="เช่น 0812345678"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    เลขบัตรประจำตัวประชาชน 13 หลัก (ใช้เปิดสัญญา)
                  </label>
                  <input
                    type="text"
                    maxLength={13}
                    value={idCardNumber}
                    onChange={(e) => setIdCardNumber(e.target.value)}
                    placeholder="1234567890123"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    LINE ID (สำหรับส่งใบงานและติดต่อ)
                  </label>
                  <input
                    type="text"
                    value={lineId}
                    onChange={(e) => setLineId(e.target.value)}
                    placeholder="เช่น somchai_line"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    อีเมล (รับใบแจ้งค่าบริการ e-Bill)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Installation Address */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-400" />
                <span>ขั้นตอนที่ 3: ที่อยู่ติดตั้งอินเทอร์เน็ต</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">จังหวัด *</label>
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  >
                    {provinces.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">อำเภอ / เขต *</label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="เช่น บางกะปิ"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">ตำบล / แขวง *</label>
                  <input
                    type="text"
                    required
                    value={subdistrict}
                    onChange={(e) => setSubdistrict(e.target.value)}
                    placeholder="เช่น คลองจั่น"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">บ้านเลขที่ / ห้อง</label>
                  <input
                    type="text"
                    value={houseNo}
                    onChange={(e) => setHouseNo(e.target.value)}
                    placeholder="เช่น 99/12"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">หมู่บ้าน / อาคาร / ชั้น</label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder="เช่น คอนโด A ชั้น 5"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">ถนน / ซอย</label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="เช่น รามคำแหง 24"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">รหัสไปรษณีย์</label>
                  <input
                    type="text"
                    value={zipcode}
                    onChange={(e) => setZipcode(e.target.value)}
                    placeholder="เช่น 10240"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Appointment */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-400" />
                <span>ขั้นตอนที่ 4: เลือกวันและเวลาที่สะดวกให้ช่างติดตั้ง</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    วันที่ต้องการติดตั้ง *
                  </label>
                  <input
                    type="date"
                    required
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    ช่วงเวลาที่สะดวก *
                  </label>
                  <select
                    value={preferredTimeSlot}
                    onChange={(e) => setPreferredTimeSlot(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="09:00 - 12:00 น. (ช่วงเช้า)">09:00 - 12:00 น. (ช่วงเช้า)</option>
                    <option value="13:00 - 17:00 น. (ช่วงบ่าย)">13:00 - 17:00 น. (ช่วงบ่าย)</option>
                    <option value="17:00 - 19:00 น. (ช่วงเย็น)">17:00 - 19:00 น. (ช่วงเย็น)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  หมายเหตุเพิ่มเติมสำหรับทีมช่าง
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="เช่น ต้องใช้บันไดยาว, บ้านมีสุนัข, นิติบุคคลให้เข้าหลัง 10:00 น."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          {/* Step 5: Document Upload */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>ขั้นตอนที่ 5: แนบเอกสารบัตรประชาชน (หรือส่งทาง LINE ภายหลังได้)</span>
              </h3>

              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 border-dashed text-center space-y-3">
                {idCardImage ? (
                  <div className="space-y-3">
                    <div className="relative max-w-xs mx-auto rounded-xl overflow-hidden border border-emerald-500/40">
                      <img src={idCardImage} alt="ID Card" className="w-full h-40 object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 pointer-events-none">
                        <span className="text-xs font-bold text-emerald-400 rotate-[-15deg] border border-emerald-400 px-3 py-1 bg-slate-950/80">
                          ใช้สำหรับสมัคร AIS Fibre เท่านั้น
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIdCardImage('')}
                      className="text-xs text-rose-400 hover:underline"
                    >
                      เปลี่ยนรูปภาพ
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-slate-200">
                      คลิกเพื่ออัปโหลด หรือ ถ่ายภาพบัตรประชาชนหน้าตรง
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      รองรับไฟล์ JPG, PNG (ระบบจะกำกับลายน้ำอัตโนมัติ)
                    </p>
                    <label className="mt-3 inline-block px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer transition-colors">
                      เลือกไฟล์ภาพ
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
              <p className="text-[11px] text-slate-400 text-center">
                * หากไม่สะดวกอัปโหลดตอนนี้ สามารถกดข้ามเพื่อส่งให้เจ้าหน้าที่ผ่าน LINE ภายหลังได้
              </p>
            </div>
          )}

          {/* Step 6: Summary & Confirm */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>ขั้นตอนที่ 6: ตรวจสอบข้อมูลก่อนยืนยัน</span>
              </h3>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2 border-b border-slate-800 pb-2">
                  <span className="text-slate-400">แพ็กเกจที่เลือก:</span>
                  <span className="font-bold text-white text-right">{selectedPkg?.name}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 border-b border-slate-800 pb-2">
                  <span className="text-slate-400">ค่าบริการ:</span>
                  <span className="font-bold text-emerald-400 text-right">
                    {((selectedPkg?.price ?? (selectedPkg as any)?.monthlyPrice) || 0).toLocaleString()} บาท/เดือน
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 border-b border-slate-800 pb-2">
                  <span className="text-slate-400">ชื่อผู้สมัคร:</span>
                  <span className="font-semibold text-slate-200 text-right">{customerName}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 border-b border-slate-800 pb-2">
                  <span className="text-slate-400">เบอร์โทรศัพท์:</span>
                  <span className="font-semibold text-slate-200 text-right">{phone}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 border-b border-slate-800 pb-2">
                  <span className="text-slate-400">สถานที่ติดตั้ง:</span>
                  <span className="font-semibold text-slate-200 text-right">
                    {houseNo} {village} {street} ต.{subdistrict} อ.{district} จ.{province} {zipcode}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-slate-400">วันเวลานัดหมาย:</span>
                  <span className="font-semibold text-emerald-300 text-right">
                    {preferredDate} ({preferredTimeSlot})
                  </span>
                </div>
              </div>

              {/* Consent checkbox */}
              <label className="flex items-start gap-3 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
                />
                <span className="text-xs text-slate-300">
                  ข้าพเจ้ายืนยันว่าข้อมูลถูกต้อง และยินยอมให้ตัวแทนจำหน่าย AIS FIBRE 3 By โฮมไฟเบอร์เนต999 เปิดใบงานและประสานงานทีมช่างเข้าติดตั้งตามนัดหมาย
                </span>
              </label>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between border-t border-slate-800 pt-6">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>ย้อนกลับ</span>
              </button>
            ) : <div />}

            {currentStep < 6 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <span>ถัดไป</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmitApplication}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-emerald-500/25 active:scale-95 transition-all flex items-center gap-2"
                id="btn-confirm-application-submit"
              >
                <FileCheck className="w-4 h-4" />
                <span>{isSubmitting ? 'กำลังส่งใบสมัคร...' : 'ยืนยันการสมัครติดตั้ง'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
