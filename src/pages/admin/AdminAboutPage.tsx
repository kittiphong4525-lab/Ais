import React, { useState, useRef } from 'react';
import { StorageService } from '../../services/storage';
import { AboutUsSettings } from '../../types';
import { useNotification } from '../../context/NotificationContext';
import { INITIAL_ABOUT_SETTINGS, DEFAULT_CERTIFICATE_1, DEFAULT_CERTIFICATE_2 } from '../../data/defaultCertificates';
import {
  Upload,
  Image as ImageIcon,
  Save,
  RotateCcw,
  ExternalLink,
  CheckCircle2,
  FileCheck2,
  Award,
  Building2,
  MapPin,
  Eye,
  Trash2,
  Sparkles,
  Info
} from 'lucide-react';

interface AdminAboutPageProps {
  onNavigate?: (path: string) => void;
}

export const AdminAboutPage: React.FC<AdminAboutPageProps> = ({ onNavigate }) => {
  const { addToast } = useNotification();
  const [formData, setFormData] = useState<AboutUsSettings>(() =>
    StorageService.getAboutSettings()
  );
  const [dealerCodesStr, setDealerCodesStr] = useState<string>(
    (formData.dealer_codes || ['8800010', '8800011', '1004784']).join(', ')
  );

  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, docNum: 1 | 2) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast({
        type: 'error',
        title: 'ไฟล์ไม่ถูกต้อง',
        message: 'กรุณาอัปโหลดไฟล์รูปภาพ (JPG, PNG, WebP) เท่านั้น',
      });
      return;
    }

    // Limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      addToast({
        type: 'error',
        title: 'ไฟล์มีขนาดใหญ่เกินไป',
        message: 'กรุณาอัปโหลดรูปภาพขนาดไม่เกิน 5MB',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (docNum === 1) {
        setFormData((prev) => ({ ...prev, doc1_image: result }));
      } else {
        setFormData((prev) => ({ ...prev, doc2_image: result }));
      }
      addToast({
        type: 'success',
        title: `อัปโหลดเอกสารที่ ${docNum} เรียบร้อยแล้ว`,
        message: 'อย่าลืมกดปุ่ม "บันทึกการเปลี่ยนแปลง" เพื่อใช้งานจริง',
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const codes = dealerCodesStr
      .split(',')
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    const updated: AboutUsSettings = {
      ...formData,
      dealer_codes: codes,
      updated_at: new Date().toISOString(),
    };

    StorageService.saveAboutSettings(updated);
    setFormData(updated);

    addToast({
      type: 'success',
      title: 'บันทึกข้อมูลสำเร็จ',
      message: 'หน้า "เกี่ยวกับเรา" และรูปภาพใบอนุญาต A4 ได้รับการอัปเดตแล้ว',
    });
  };

  const handleResetToDefault = () => {
    if (confirm('คุณต้องการรีเซ็ตข้อความและรูปภาพใบอนุญาต A4 กลับเป็นค่าเริ่มต้นหรือไม่?')) {
      StorageService.saveAboutSettings(INITIAL_ABOUT_SETTINGS);
      setFormData(INITIAL_ABOUT_SETTINGS);
      setDealerCodesStr((INITIAL_ABOUT_SETTINGS.dealer_codes || []).join(', '));
      addToast({
        type: 'info',
        title: 'รีเซ็ตค่าเริ่มต้นสำเร็จ',
        message: 'ข้อมูลถูกเปลี่ยนกลับเป็นเอกสารต้นฉบับแล้ว',
      });
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl font-bold text-white">จัดการหน้าเกี่ยวกับเรา / ใบอนุญาตตัวแทน A4</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            เปลี่ยนรูปภาพเอกสารใบอนุญาตคู่กัน (ขนาด A4), ข้อความหัวเรื่อง, และที่อยู่บริษัทได้ที่นี่
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>คืนค่าเริ่มต้น</span>
          </button>
          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('/about')}
              className="px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>ดูหน้าเว็บจริง</span>
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: A4 Documents Side-by-Side Uploader */}
        <div className="bg-slate-900/60 p-5 sm:p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-bold text-white">
                รูปภาพเอกสารใบอนุญาตคู่กัน (ขนาด A4 มาตรฐาน 210 × 297 มม.)
              </h2>
            </div>
            <span className="text-xs text-slate-400">คลิกที่กรอบหรือปุ่มเพื่อเปลี่ยนรูป</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Document 1 (Left A4) */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  เอกสารที่ 1 (ฝั่งซ้าย - A4)
                </span>
                <span className="text-[10px] text-slate-400">สัดส่วน 1:1.414 (A4)</span>
              </div>

              {/* Title input for Doc 1 */}
              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1">
                  ชื่อเอกสารที่ 1
                </label>
                <input
                  type="text"
                  value={formData.doc1_title}
                  onChange={(e) => setFormData({ ...formData, doc1_title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                  placeholder="เช่น หนังสือขออนุญาตใช้เครื่องหมายการค้า AWN"
                />
              </div>

              {/* A4 Preview Container */}
              <div
                onClick={() => fileInputRef1.current?.click()}
                className="relative aspect-[210/297] rounded-xl overflow-hidden bg-white border-2 border-dashed border-slate-700 hover:border-emerald-500 transition-colors cursor-pointer group shadow-lg flex items-center justify-center"
              >
                <img
                  src={formData.doc1_image}
                  alt={formData.doc1_title}
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4 text-white">
                  <Upload className="w-8 h-8 text-emerald-400" />
                  <span className="text-xs font-bold">คลิกเพื่ออัปโหลดรูปภาพใหม่</span>
                  <span className="text-[10px] text-slate-300">รองรับ JPG, PNG, WebP (สูงสุด 5MB)</span>
                </div>
              </div>

              <input
                ref={fileInputRef1}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e, 1)}
              />

              {/* Action Buttons & URL Input */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef1.current?.click()}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>อัปโหลดรูปจากเครื่อง</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, doc1_image: DEFAULT_CERTIFICATE_1 })}
                  className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                  title="คืนค่าเอกสาร 1"
                >
                  คืนค่า
                </button>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  หรือวาง Image URL / Data URL สำหรับเอกสารที่ 1
                </label>
                <input
                  type="text"
                  value={formData.doc1_image.startsWith('data:') ? '(รูปภาพ Base64 / SVG)' : formData.doc1_image}
                  onChange={(e) => {
                    if (!e.target.value.startsWith('(')) {
                      setFormData({ ...formData, doc1_image: e.target.value });
                    }
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 focus:outline-none focus:border-emerald-500"
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Document 2 (Right A4) */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-orange-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-400" />
                  เอกสารที่ 2 (ฝั่งขวา - A4)
                </span>
                <span className="text-[10px] text-slate-400">สัดส่วน 1:1.414 (A4)</span>
              </div>

              {/* Title input for Doc 2 */}
              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1">
                  ชื่อเอกสารที่ 2
                </label>
                <input
                  type="text"
                  value={formData.doc2_title}
                  onChange={(e) => setFormData({ ...formData, doc2_title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                  placeholder="เช่น หนังสือแสดงการเป็นตัวแทนจำหน่าย AIS 3BB FIBRE3"
                />
              </div>

              {/* A4 Preview Container */}
              <div
                onClick={() => fileInputRef2.current?.click()}
                className="relative aspect-[210/297] rounded-xl overflow-hidden bg-white border-2 border-dashed border-slate-700 hover:border-emerald-500 transition-colors cursor-pointer group shadow-lg flex items-center justify-center"
              >
                <img
                  src={formData.doc2_image}
                  alt={formData.doc2_title}
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4 text-white">
                  <Upload className="w-8 h-8 text-emerald-400" />
                  <span className="text-xs font-bold">คลิกเพื่ออัปโหลดรูปภาพใหม่</span>
                  <span className="text-[10px] text-slate-300">รองรับ JPG, PNG, WebP (สูงสุด 5MB)</span>
                </div>
              </div>

              <input
                ref={fileInputRef2}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e, 2)}
              />

              {/* Action Buttons & URL Input */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef2.current?.click()}
                  className="flex-1 py-2 px-3 rounded-xl bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 border border-orange-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>อัปโหลดรูปจากเครื่อง</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, doc2_image: DEFAULT_CERTIFICATE_2 })}
                  className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                  title="คืนค่าเอกสาร 2"
                >
                  คืนค่า
                </button>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  หรือวาง Image URL / Data URL สำหรับเอกสารที่ 2
                </label>
                <input
                  type="text"
                  value={formData.doc2_image.startsWith('data:') ? '(รูปภาพ Base64 / SVG)' : formData.doc2_image}
                  onChange={(e) => {
                    if (!e.target.value.startsWith('(')) {
                      setFormData({ ...formData, doc2_image: e.target.value });
                    }
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 focus:outline-none focus:border-emerald-500"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Text Headings & Company Address (Matches layout in photo) */}
        <div className="bg-slate-900/60 p-5 sm:p-6 rounded-2xl border border-slate-800 space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">ข้อความหัวเรื่อง และข้อมูลบริษัท</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-300 font-medium mb-1">
                หัวข้อส่วนที่ 1 (สีเขียวมะนาว)
              </label>
              <input
                type="text"
                value={formData.title_part1}
                onChange={(e) => setFormData({ ...formData, title_part1: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-lime-300 font-bold focus:outline-none focus:border-emerald-500"
                placeholder="ใบอนุญาตตัวแทนจำหน่าย"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 font-medium mb-1">
                หัวข้อส่วนที่ 2 (สีส้ม)
              </label>
              <input
                type="text"
                value={formData.title_part2}
                onChange={(e) => setFormData({ ...formData, title_part2: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-[#FF5500] font-bold focus:outline-none focus:border-emerald-500"
                placeholder="อย่างเป็นทางการ"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-300 font-medium mb-1">
              ชื่อบริษัทตัวแทนจำหน่าย (แสดงใต้เอกสาร A4)
            </label>
            <input
              type="text"
              value={formData.company_name}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white font-semibold focus:outline-none focus:border-emerald-500"
              placeholder="บริษัท โฮมไฟเบอร์เนต999 จำกัด"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-300 font-medium mb-1">
              ที่ตั้งบริษัทตัวแทนจำหน่าย (แสดงใต้เอกสาร A4)
            </label>
            <textarea
              rows={2}
              value={formData.company_address}
              onChange={(e) => setFormData({ ...formData, company_address: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
              placeholder="ที่ตั้ง บริษัท 512 หมู่ 1 ถนนรักสงบ ตำบลวิศิษฐ์ อำเภอเมือง จังหวัดบึงกาฬ 38000"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs text-slate-300 font-medium mb-1">
                รหัสตัวแทนจำหน่าย (คั่นด้วยเครื่องหมายจุลภาค ,)
              </label>
              <input
                type="text"
                value={dealerCodesStr}
                onChange={(e) => setDealerCodesStr(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-emerald-300 font-mono focus:outline-none focus:border-emerald-500"
                placeholder="8800010, 8800011, 1004784"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 font-medium mb-1">
                หน่วยงานผู้แต่งตั้ง
              </label>
              <input
                type="text"
                value={formData.authorized_by || ''}
                onChange={(e) => setFormData({ ...formData, authorized_by: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
                placeholder="บริษัท แอดวานซ์ ไวร์เลส เน็ทเวอร์ค จำกัด (AWN)"
              />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="sticky bottom-4 z-20 flex items-center justify-between p-4 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-slate-800 shadow-2xl">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Info className="w-4 h-4 text-emerald-400" />
            <span>การเปลี่ยนแปลงจะมีผลบนหน้า "เกี่ยวกับเรา" ทันทีหลังบันทึก</span>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-400 hover:from-emerald-400 hover:to-lime-300 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-950 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>บันทึกการเปลี่ยนแปลงทั้งหมด</span>
          </button>
        </div>
      </form>
    </div>
  );
};
