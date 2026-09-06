import React, { useState } from 'react';
import { ApiService } from '../services/api';
import { CoverageCheckLead } from '../types';
import {
  MapPin,
  CheckCircle2,
  PhoneCall,
  Clock,
  ShieldCheck,
  Navigation,
  Copy,
  ArrowRight,
  Sparkles,
  Info,
  Check,
  MessageCircle,
} from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

interface CoverageCheckPageProps {
  onNavigate: (path: string, params?: any) => void;
  selectedPackage?: any;
}

export const CoverageCheckPage: React.FC<CoverageCheckPageProps> = ({ onNavigate, selectedPackage }) => {
  const { addToast } = useNotification();

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [province, setProvince] = useState('กรุงเทพมหานคร');
  const [district, setDistrict] = useState('');
  const [subdistrict, setSubdistrict] = useState('');
  const [village, setVillage] = useState('');
  const [houseNo, setHouseNo] = useState('');
  const [street, setStreet] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [locationDetails, setLocationDetails] = useState('');
  const [gpsLocation, setGpsLocation] = useState('');
  const [consentContact, setConsentContact] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Success Result State
  const [submittedLead, setSubmittedLead] = useState<CoverageCheckLead | null>(null);
  const [copied, setCopied] = useState(false);

  // Thai Provinces
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
    'เชียงราย',
    'ขอนแก่น',
    'นครราชสีมา',
    'อุดรธานี',
    'สงขลา',
    'ภูเก็ต',
    'สุราษฎร์ธานี',
    'พระนครศรีอยุธยา',
    'สระบุรี',
    'พิษณุโลก',
    'นครสวรรค์',
    'อุบลราชธานี',
  ];

  const handleGetGps = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`;
          setGpsLocation(coords);
          addToast({
            type: 'success',
            title: 'ดึงพิกัด GPS สำเร็จ',
            message: coords,
          });
        },
        (error) => {
          addToast({
            type: 'warning',
            title: 'ไม่สามารถดึงพิกัดอัตโนมัติได้',
            message: 'กรุณากรอกพิกัดหรือรายละเอียดสถานที่แทน',
          });
        }
      );
    } else {
      addToast({
        type: 'warning',
        title: 'เบราว์เซอร์ไม่รองรับ GPS',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !district.trim() || !subdistrict.trim()) {
      addToast({
        type: 'warning',
        title: 'กรุณากรอกข้อมูลสำคัญให้ครบถ้วน',
      });
      return;
    }

    if (!consentContact) {
      addToast({
        type: 'warning',
        title: 'กรุณายินยอมให้เจ้าหน้าที่ติดต่อกลับ',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await ApiService.createCoverageCheckLead({
        customer_name: customerName,
        phone,
        province,
        district,
        subdistrict,
        village: village || undefined,
        house_no: houseNo || undefined,
        street: street || undefined,
        zipcode: zipcode || undefined,
        location_details: locationDetails || undefined,
        gps_location: gpsLocation || undefined,
        consent_contact: true,
      });

      setSubmittedLead(created);
      addToast({
        type: 'success',
        title: 'ส่งข้อมูลตรวจสอบพื้นที่เรียบร้อยแล้ว',
        message: `รหัสคำขอของคุณคือ ${created.tracking_id}`,
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'เกิดข้อผิดพลาดในการส่งข้อมูล',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    addToast({ type: 'info', title: 'คัดลอกรหัสติดตามแล้ว' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
          <MapPin className="w-3.5 h-3.5" />
          <span>FIBRE COVERAGE CHECKER</span>
        </div>
        <h1 className="flex flex-row flex-nowrap items-center justify-center gap-1.5 sm:gap-2.5 whitespace-nowrap text-base sm:text-2xl md:text-3xl lg:text-5xl font-black tracking-tight leading-snug py-1">
          <span className="text-lime-300 drop-shadow-[0_2px_12px_rgba(190,242,100,0.3)] shrink-0 whitespace-nowrap">ตรวจสอบพื้นที่ให้บริการ</span>
          <span className="text-[#FF5500] drop-shadow-[0_2px_12px_rgba(255,85,0,0.4)] shrink-0 whitespace-nowrap">AIS Fibre 3</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          เช็กระยะคู่สาย DP และความพร้อมในการเดินสายไฟเบอร์ออปติกถึงหน้าบ้านคุณ ทราบผลรวดเร็วภายใน 15-30 นาที ฟรีไม่มีค่าใช้จ่าย
        </p>
      </div>

      {submittedLead ? (
        /* Result Confirmation Screen */
        <div className="rounded-3xl bg-slate-900 border border-emerald-500/40 p-6 sm:p-10 shadow-2xl space-y-6 text-center animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-500/10">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              รับข้อมูลเรียบร้อยแล้ว
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              เจ้าหน้าที่กำลังตรวจสอบคู่สายให้คุณ
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
              ทีมงาน AIS Fibre Net999 จะเช็กพิกัดเสาไฟฟ้าและจุดกระจายสัญญาณ DP พร้อมโทรแจ้งผลที่เบอร์ <strong>{submittedLead.phone}</strong>
            </p>
          </div>

          {/* Tracking ID Badge */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 max-w-md mx-auto space-y-2">
            <span className="text-[11px] text-slate-400 font-semibold uppercase">รหัสติดตามคำขอของคุณ</span>
            <div className="flex items-center justify-center gap-2">
              <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono tracking-wider">
                {submittedLead.tracking_id}
              </span>
              <button
                onClick={() => handleCopyCode(submittedLead.tracking_id || submittedLead.id || '')}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="คัดลอกรหัส"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              สถานะปัจจุบัน: <span className="text-sky-400 font-semibold">รอเจ้าหน้าที่ตรวจสอบคู่สาย</span>
            </p>
          </div>

          {/* Next Steps */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 max-w-md mx-auto text-left text-xs space-y-2 text-slate-300">
            <p className="font-bold text-white flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              ขั้นตอนถัดไป:
            </p>
            <p>1. วิศวกรตรวจสอบจุดเชื่อมต่อ DP ที่ใกล้บ้านที่สุด</p>
            <p>2. เจ้าหน้าที่โทรหรือทัก LINE ยืนยันความพร้อมและเสนอแพ็กเกจที่ดีที่สุด</p>
            <p>3. เพื่อนัดหมายคิวช่างเข้าติดตั้งตามวันและเวลาที่สะดวก</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 max-w-md mx-auto">
            <a
              href="https://line.me/ti/p/@aisfibre999"
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 px-5 rounded-xl bg-[#06C755] hover:bg-[#05b04a] text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4" />
              <span>ทัก LINE แจ้งช่าง (@aisfibre999)</span>
            </a>
            <button
              onClick={() => onNavigate('/articles')}
              className="w-full py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>อ่านบทความ & เทคนิค</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Form Section */
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-10 shadow-2xl space-y-8"
        >
          {/* Section 1: Customer Contact */}
          <div className="space-y-4">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span>1. ข้อมูลผู้ติดต่อ</span>
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
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  เบอร์โทรศัพท์ติดต่อ * (สำหรับโทรแจ้งผล)
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="เช่น 0812345678"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Address */}
          <div className="space-y-4">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>2. ที่อยู่ที่ต้องการติดตั้ง</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  จังหวัด *
                </label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                >
                  {provinces.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  อำเภอ / เขต *
                </label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="เช่น บางกะปิ, เมือง"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  ตำบล / แขวง *
                </label>
                <input
                  type="text"
                  required
                  value={subdistrict}
                  onChange={(e) => setSubdistrict(e.target.value)}
                  placeholder="เช่น คลองจั่น, สุเทพ"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  บ้านเลขที่ / ห้อง
                </label>
                <input
                  type="text"
                  value={houseNo}
                  onChange={(e) => setHouseNo(e.target.value)}
                  placeholder="เช่น 123/45"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  หมู่ / หมู่บ้าน / อาคาร
                </label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="เช่น ม.พฤกษา 5"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  ถนน / ซอย
                </label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="เช่น ลาดพร้าว 101"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  รหัสไปรษณีย์
                </label>
                <input
                  type="text"
                  value={zipcode}
                  onChange={(e) => setZipcode(e.target.value)}
                  placeholder="เช่น 10240"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                รายละเอียดสถานที่ / จุดสังเกตเพิ่มเติม
              </label>
              <textarea
                rows={2}
                value={locationDetails}
                onChange={(e) => setLocationDetails(e.target.value)}
                placeholder="เช่น ติดร้านสะดวกซื้อ 7-11, เสาไฟหน้าบ้านมีกล่องดำ, คอนโดชั้น 8 ห้องมุม"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* GPS Assist */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                  พิกัด GPS (ช่วยให้ตรวจสอบคู่สายได้แม่นยำ 100%)
                </span>
                <button
                  type="button"
                  onClick={handleGetGps}
                  className="px-3 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold hover:bg-emerald-900 transition-colors flex items-center gap-1"
                >
                  📍 ดึงพิกัดปัจจุบัน
                </button>
              </div>
              <input
                type="text"
                value={gpsLocation}
                onChange={(e) => setGpsLocation(e.target.value)}
                placeholder="เช่น 13.756331, 100.501762 หรือกดปุ่มดึงพิกัด"
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Consent Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consentContact}
                onChange={(e) => setConsentContact(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
              />
              <span className="text-xs text-slate-300 leading-relaxed">
                ข้าพเจ้ายินยอมให้ตัวแทนจำหน่าย AIS Fibre Net999 ตรวจสอบคู่สายไฟเบอร์และติดต่อกลับทางโทรศัพท์หรือ LINE เพื่อแจ้งผลการตรวจสอบและแนะนำโปรโมชั่น
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-800">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-400 via-lime-400 to-orange-500 hover:from-emerald-300 hover:via-lime-300 hover:to-orange-400 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-orange-500/20 active:scale-98 transition-all flex items-center justify-center gap-2"
              id="btn-submit-coverage-check"
            >
              <MapPin className="w-5 h-5 text-slate-950" />
              <span>{isSubmitting ? 'กำลังส่งข้อมูล...' : 'ส่งข้อมูลเพื่อตรวจสอบพื้นที่ทันที (ฟรี)'}</span>
            </button>
            <p className="text-[11px] text-slate-500 text-center mt-2">
              🔒 ข้อมูลของคุณจะถูกเก็บเป็นความลับ ใช้สำหรับการตรวจสอบคู่สายและติดตั้ง AIS Fibre เท่านั้น
            </p>
          </div>
        </form>
      )}
    </div>
  );
};
