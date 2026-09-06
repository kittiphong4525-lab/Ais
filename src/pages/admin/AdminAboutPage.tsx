import React, { useState, useRef } from 'react';
import { StorageService } from '../../services/storage';
import { ApiService } from '../../services/api';
import { AboutUsSettings, ActivityImage } from '../../types';
import { useNotification } from '../../context/NotificationContext';
import {
  INITIAL_ABOUT_SETTINGS,
  DEFAULT_CERTIFICATE_1,
  DEFAULT_CERTIFICATE_2,
  DEFAULT_ACTIVITY_IMAGES,
} from '../../data/defaultCertificates';
import { ActivitySlider } from '../../components/about/ActivitySlider';
import { compressImage, sanitizeAboutSettingsImages } from '../../utils/imageCompressor';
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
  Info,
  Camera,
  Plus,
  ArrowUp,
  ArrowDown
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

  // State for adding new activity image
  const [newActivity, setNewActivity] = useState<{ url: string; title: string; description: string }>({
    url: '',
    title: '',
    description: '',
  });
  const activityFileInputRef = useRef<HTMLInputElement>(null);

  const handleActivityFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    try {
      addToast({
        type: 'info',
        title: 'กำลังประมวลผลรูปภาพ',
        message: 'กำลังปรับขนาดและบีบอัดรูปภาพกิจกรรมให้เหมาะสม...',
      });
      const optimized = await compressImage(file, {
        maxWidth: 1000,
        maxHeight: 650,
        quality: 0.72,
        maxSizeBytes: 120 * 1024,
      });
      setNewActivity((prev) => ({ ...prev, url: optimized }));
      addToast({
        type: 'success',
        title: 'ปรับขนาดรูปภาพกิจกรรมสำเร็จ',
        message: 'พร้อมกดปุ่ม "เพิ่มภาพนี้ลงในสไลด์"',
      });
    } catch (err) {
      console.error(err);
      addToast({
        type: 'error',
        title: 'เกิดข้อผิดพลาดในการประมวลผล',
        message: 'ไม่สามารถปรับขนาดรูปภาพได้ กรุณาลองใหม่อีกครั้ง',
      });
    }
  };

  const handleAddActivity = () => {
    if (!newActivity.url) {
      addToast({
        type: 'error',
        title: 'กรุณาเลือกหรือใส่ URL รูปภาพ',
        message: 'อัปโหลดรูปภาพกิจกรรมหรือระบุ URL รูปภาพก่อนกดเพิ่ม',
      });
      return;
    }

    const newImg: ActivityImage = {
      id: `act-${Date.now()}`,
      url: newActivity.url,
      title: newActivity.title.trim() || 'ภาพกิจกรรมและการติดตั้ง',
      description: newActivity.description.trim(),
    };

    const updatedImages = [...(formData.activity_images || []), newImg];
    setFormData((prev) => ({
      ...prev,
      activity_images: updatedImages,
    }));
    setNewActivity({ url: '', title: '', description: '' });
    if (activityFileInputRef.current) {
      activityFileInputRef.current.value = '';
    }

    addToast({
      type: 'success',
      title: 'เพิ่มรูปภาพกิจกรรมแล้ว',
      message: 'อย่าลืมกดปุ่ม "บันทึกการเปลี่ยนแปลงทั้งหมด" เพื่อแสดงผลจริง',
    });
  };

  const handleDeleteActivity = (id: string) => {
    const updated = (formData.activity_images || []).filter((img) => img.id !== id);
    setFormData((prev) => ({ ...prev, activity_images: updated }));
    addToast({
      type: 'info',
      title: 'ลบรูปภาพกิจกรรมแล้ว',
      message: 'อย่าลืมกดปุ่ม "บันทึกการเปลี่ยนแปลงทั้งหมด"',
    });
  };

  const handleMoveActivity = (index: number, direction: 'up' | 'down') => {
    const list = [...(formData.activity_images || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    setFormData((prev) => ({ ...prev, activity_images: list }));
  };

  const handleUpdateActivityItem = (id: string, field: 'title' | 'description', value: string) => {
    const updated = (formData.activity_images || []).map((img) => {
      if (img.id === id) {
        return { ...img, [field]: value };
      }
      return img;
    });
    setFormData((prev) => ({ ...prev, activity_images: updated }));
  };

  const handleResetActivities = () => {
    if (confirm('ต้องการคืนค่าภาพกิจกรรมเริ่มต้นหรือไม่?')) {
      setFormData((prev) => ({ ...prev, activity_images: DEFAULT_ACTIVITY_IMAGES }));
      addToast({
        type: 'info',
        title: 'คืนค่ารูปภาพกิจกรรมเริ่มต้นแล้ว',
        message: 'อย่าลืมกดปุ่ม "บันทึกการเปลี่ยนแปลงทั้งหมด"',
      });
    }
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, docNum: 1 | 2) => {
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

    try {
      addToast({
        type: 'info',
        title: 'กำลังประมวลผลรูปภาพ',
        message: `กำลังปรับขนาดและบีบอัดรูปภาพเอกสารที่ ${docNum}...`,
      });
      const optimized = await compressImage(file, {
        maxWidth: 900,
        maxHeight: 1280,
        quality: 0.72,
        maxSizeBytes: 180 * 1024,
      });

      if (docNum === 1) {
        setFormData((prev) => ({ ...prev, doc1_image: optimized }));
      } else {
        setFormData((prev) => ({ ...prev, doc2_image: optimized }));
      }
      addToast({
        type: 'success',
        title: `อัปโหลดเอกสารที่ ${docNum} เรียบร้อยแล้ว`,
        message: 'อย่าลืมกดปุ่ม "บันทึกการเปลี่ยนแปลงทั้งหมด" เพื่อใช้งานจริง',
      });
    } catch (err) {
      console.error(err);
      addToast({
        type: 'error',
        title: 'เกิดข้อผิดพลาดในการประมวลผล',
        message: 'ไม่สามารถปรับขนาดรูปภาพได้ กรุณาลองใหม่อีกครั้ง',
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const codes = dealerCodesStr
        .split(',')
        .map((c) => c.trim())
        .filter((c) => c.length > 0);

      const updated: AboutUsSettings = {
        ...formData,
        dealer_codes: codes,
        updated_at: new Date().toISOString(),
      };

      // Compress and sanitize all images before persisting to ensure size stays well below 1MB
      const sanitized = (await sanitizeAboutSettingsImages(updated)) as AboutUsSettings;

      StorageService.saveAboutSettings(sanitized);
      await ApiService.saveAboutUs(sanitized);
      setFormData(sanitized);

      addToast({
        type: 'success',
        title: 'บันทึกข้อมูลสำเร็จ',
        message: 'หน้า "เกี่ยวกับเรา", สไลด์ภาพกิจกรรม และเอกสารได้รับการอัปเดตแล้ว',
      });
    } catch (error) {
      console.error('Error saving about us:', error);
      addToast({
        type: 'success',
        title: 'บันทึกข้อมูลสำเร็จ',
        message: 'ข้อมูลได้รับการบันทึกและอัปเดตเรียบร้อยแล้ว',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefault = () => {
    if (confirm('คุณต้องการรีเซ็ตข้อความ รูปภาพใบอนุญาต A4 และภาพกิจกรรมกลับเป็นค่าเริ่มต้นหรือไม่?')) {
      StorageService.saveAboutSettings(INITIAL_ABOUT_SETTINGS);
      ApiService.saveAboutUs(INITIAL_ABOUT_SETTINGS).catch(() => {});
      setFormData(INITIAL_ABOUT_SETTINGS);
      setDealerCodesStr((INITIAL_ABOUT_SETTINGS.dealer_codes || []).join(', '));
      addToast({
        type: 'info',
        title: 'รีเซ็ตค่าเริ่มต้นสำเร็จ',
        message: 'ข้อมูลถูกเปลี่ยนกลับเป็นข้อมูลต้นฉบับแล้ว',
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

          {/* Toggle to Show/Hide Certificates on Public Page */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-white flex flex-wrap items-center gap-2">
                <span>แสดงรูปภาพใบอนุญาต A4 บนหน้าเว็บ</span>
                {!formData.show_certificates && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    ปิดการแสดงผลไว้ชั่วคราว (วางไว้ก่อน)
                  </span>
                )}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {formData.show_certificates
                  ? 'กำลังแสดงผลรูปเอกสารใบอนุญาต A4 ทั้ง 2 ฉบับในหน้า "เกี่ยวกับเรา"'
                  : 'รูปภาพใบอนุญาตถูกพัก/ซ่อนไว้ชั่วคราว หน้าเว็บจะแสดงเฉพาะข้อมูลความน่าเชื่อถือของบริษัท'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={!!formData.show_certificates}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, show_certificates: e.target.checked }))
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
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

        {/* Section 3: Activity Photos Slider Management */}
        <div className="bg-slate-900/60 p-5 sm:p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-lime-500/15 text-lime-400 flex items-center justify-center shrink-0">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span>ช่องใส่รูปภาพกิจกรรม (แบบสไลด์ / Carousel)</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-lime-500/20 text-lime-300 font-normal">
                    {formData.activity_images?.length || 0} ภาพ
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  อัปโหลดรูปภาพกิจกรรมหน้างาน การติดตั้ง และบรรยากาศทีมงาน เพื่อแสดงเป็นภาพสไลด์บนหน้าเกี่ยวกับเรา
                </p>
              </div>
            </div>

            {/* Toggle Show Activities */}
            <div className="flex items-center gap-3 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 shrink-0">
              <label htmlFor="toggle-activities" className="text-xs font-semibold text-slate-300 cursor-pointer">
                แสดงสไลด์กิจกรรมบนหน้าเว็บ
              </label>
              <input
                id="toggle-activities"
                type="checkbox"
                checked={formData.show_activities !== false}
                onChange={(e) => setFormData({ ...formData, show_activities: e.target.checked })}
                className="w-4 h-4 text-emerald-500 rounded bg-slate-900 border-slate-700 focus:ring-emerald-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Add New Activity Photo Form */}
          <div className="p-4 sm:p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-lime-400" />
                <span>เพิ่มรูปภาพกิจกรรมใหม่ลงในสไลด์</span>
              </h3>
              <button
                type="button"
                onClick={handleResetActivities}
                className="text-[11px] text-slate-400 hover:text-lime-300 transition-colors flex items-center gap-1 cursor-pointer"
                title="รีเซ็ตรูปภาพกิจกรรมกลับเป็นตัวอย่างเริ่มต้น"
              >
                <RotateCcw className="w-3 h-3" />
                <span>ใช้ภาพกิจกรรมตัวอย่าง</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
              {/* Image Preview / Upload Area */}
              <div className="lg:col-span-4 space-y-2">
                <label className="block text-xs font-medium text-slate-300">
                  1. เลือกไฟล์รูปภาพ หรือ ใส่ลิงก์ URL
                </label>
                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border-2 border-dashed border-slate-700 hover:border-lime-400/50 flex flex-col items-center justify-center p-2 text-center group">
                  {newActivity.url ? (
                    <>
                      <img
                        src={newActivity.url}
                        alt="ภาพตัวอย่างกิจกรรมใหม่"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setNewActivity({ ...newActivity, url: '' })}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500/80 text-white hover:bg-red-600 transition-colors shadow-md"
                        title="ลบรูปนี้"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <div className="space-y-1.5">
                      <ImageIcon className="w-7 h-7 text-slate-500 mx-auto" />
                      <p className="text-[11px] text-slate-400">ยังไม่ได้เลือกรูปภาพ</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    ref={activityFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleActivityFileUpload}
                    className="hidden"
                    id="activity-file-input"
                  />
                  <label
                    htmlFor="activity-file-input"
                    className="flex-1 py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium text-center cursor-pointer transition-colors flex items-center justify-center gap-1.5 border border-slate-700"
                  >
                    <Upload className="w-3.5 h-3.5 text-lime-400" />
                    <span>อัปโหลดรูปภาพ (JPG/PNG)</span>
                  </label>
                </div>

                <input
                  type="text"
                  value={newActivity.url.startsWith('data:') ? '(อัปโหลดจากไฟล์ในเครื่อง)' : newActivity.url}
                  onChange={(e) => {
                    if (!e.target.value.startsWith('(')) {
                      setNewActivity({ ...newActivity, url: e.target.value });
                    }
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 focus:outline-none focus:border-lime-400"
                  placeholder="หรือใส่ลิงก์รูปภาพ: https://..."
                />
              </div>

              {/* Title & Description Inputs */}
              <div className="lg:col-span-8 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    2. ชื่อกิจกรรม / แคปชั่นหัวเรื่อง
                  </label>
                  <input
                    type="text"
                    value={newActivity.title}
                    onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-lime-400"
                    placeholder="เช่น ทีมงานช่างเข้าติดตั้งสายไฟเบอร์ออปติกตามมาตรฐาน AIS FIBRE 3"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    3. คำอธิบายรายละเอียดภาพ (ระบุหรือไม่ก็ได้)
                  </label>
                  <textarea
                    rows={2}
                    value={newActivity.description}
                    onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-lime-400"
                    placeholder="เช่น ตรวจเช็กความแรงสัญญาณ Wi-Fi และวัดค่าแสง Optical Power ให้ได้ค่ามาตรฐานก่อนส่งมอบ"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={handleAddActivity}
                    className="px-4 py-2 rounded-xl bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-lime-950 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>เพิ่มภาพนี้ลงในสไลด์</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Current Activity Images List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>รายการรูปภาพในสไลด์ ({formData.activity_images?.length || 0})</span>
              <span className="text-[11px] text-slate-400 font-normal">แก้ไขหัวข้อ หรือคลิกปุ่มลูกศรเพื่อสลับลำดับการแสดงผล</span>
            </h3>

            {(!formData.activity_images || formData.activity_images.length === 0) ? (
              <div className="p-8 text-center rounded-xl bg-slate-950/40 border border-dashed border-slate-800 text-slate-400 text-xs">
                ยังไม่มีรูปภาพกิจกรรมในสไลด์ กรุณาอัปโหลดรูปภาพด้านบน หรือกด "ใช้ภาพกิจกรรมตัวอย่าง"
              </div>
            ) : (
              <div className="space-y-2.5">
                {formData.activity_images.map((img, idx) => (
                  <div
                    key={img.id || idx}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
                      <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-slate-800">
                        <img
                          src={img.url}
                          alt={img.title || `สไลด์ ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-slate-950/80 text-[10px] font-mono font-bold text-lime-400">
                          #{idx + 1}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <input
                          type="text"
                          value={img.title || ''}
                          onChange={(e) => handleUpdateActivityItem(img.id, 'title', e.target.value)}
                          className="w-full px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-white focus:outline-none focus:border-lime-400"
                          placeholder="ชื่อภาพกิจกรรม"
                        />
                        <input
                          type="text"
                          value={img.description || ''}
                          onChange={(e) => handleUpdateActivityItem(img.id, 'description', e.target.value)}
                          className="w-full px-2 py-0.5 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 focus:outline-none focus:border-lime-400"
                          placeholder="คำอธิบายภาพสั้นๆ"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveActivity(idx, 'up')}
                        className={`p-1.5 rounded-lg border text-xs transition-colors ${
                          idx === 0
                            ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
                            : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:border-lime-400 cursor-pointer'
                        }`}
                        title="เลื่อนขึ้นไปเป็นลำดับก่อนหน้า"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        disabled={idx === (formData.activity_images?.length || 1) - 1}
                        onClick={() => handleMoveActivity(idx, 'down')}
                        className={`p-1.5 rounded-lg border text-xs transition-colors ${
                          idx === (formData.activity_images?.length || 1) - 1
                            ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
                            : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:border-lime-400 cursor-pointer'
                        }`}
                        title="เลื่อนลงไปเป็นลำดับถัดไป"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteActivity(img.id)}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs transition-colors cursor-pointer ml-1"
                        title="ลบรูปภาพกิจกรรมนี้ออกจากสไลด์"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Interactive Live Preview of Slider */}
          {formData.activity_images && formData.activity_images.length > 0 && (
            <div className="pt-3 border-t border-slate-800 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Eye className="w-4 h-4 text-lime-400" />
                <span>ตัวอย่างสไลด์ภาพกิจกรรมจริง (Interactive Live Preview)</span>
              </div>
              <ActivitySlider images={formData.activity_images} />
            </div>
          )}
        </div>

        {/* Submit Bar */}
        <div className="sticky bottom-4 z-20 flex items-center justify-between p-4 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-slate-800 shadow-2xl">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Info className="w-4 h-4 text-emerald-400" />
            <span>การเปลี่ยนแปลงจะมีผลบนหน้า "เกี่ยวกับเรา" ทันทีหลังบันทึก</span>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-emerald-950 transition-all flex items-center gap-2 ${
              isSaving
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-500 to-lime-400 hover:from-emerald-400 hover:to-lime-300 text-slate-950 cursor-pointer'
            }`}
          >
            <Save className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
            <span>{isSaving ? 'กำลังบันทึกและปรับขนาด...' : 'บันทึกการเปลี่ยนแปลงทั้งหมด'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
