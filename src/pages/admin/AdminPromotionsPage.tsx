import React, { useState, useEffect } from 'react';
import { ApiService } from '../../services/api';
import { PromotionItem } from '../../types';
import { useNotification } from '../../context/NotificationContext';
import {
  Flame,
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  Calendar,
  X,
  Tag,
  CheckCircle2,
} from 'lucide-react';

export const AdminPromotionsPage: React.FC = () => {
  const { addToast } = useNotification();
  const [promotions, setPromotions] = useState<PromotionItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [badge, setBadge] = useState('🔥 โปรโมชั่นพิเศษ');
  const [discountPercent, setDiscountPercent] = useState<number | undefined>(50);
  const [image, setImage] = useState('https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80');
  const [ctaText, setCtaText] = useState('รับสิทธิ์โปรโมชั่น');
  const [ctaLink, setCtaLink] = useState('/apply');
  const [startDate, setStartDate] = useState('2026-08-01');
  const [endDate, setEndDate] = useState('2026-09-30');
  const [isHighlight, setIsHighlight] = useState(true);
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadPromotions = async () => {
    setLoading(true);
    try {
      const list = await ApiService.getPromotions();
      setPromotions(list);
    } catch (err) {
      console.error(err);
      addToast({ type: 'error', title: 'ไม่สามารถโหลดข้อมูลโปรโมชั่นได้' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPromotions();
  }, []);

  const handleOpenCreate = () => {
    setIsEditing(false);
    setEditingId(null);
    setTitle('');
    setSubtitle('');
    setDescription('');
    setBadge('🔥 โปรโมชั่นพิเศษ');
    setDiscountPercent(50);
    setImage('https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80');
    setCtaText('รับสิทธิ์โปรโมชั่น');
    setCtaLink('/apply');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate('2026-12-31');
    setIsHighlight(false);
    setActive(true);
    setShowModal(true);
  };

  const handleOpenEdit = (promo: PromotionItem) => {
    setIsEditing(true);
    setEditingId(promo.id);
    setTitle(promo.title || '');
    setSubtitle(promo.subtitle || '');
    setDescription(promo.description || '');
    setBadge(promo.badge || '');
    setDiscountPercent(promo.discountPercent || promo.discount_percent || 0);
    setImage(promo.image || '');
    setCtaText(promo.ctaText || promo.cta_text || '');
    setCtaLink(promo.ctaLink || promo.cta_link || '');
    setStartDate(promo.startDate || promo.start_date || '');
    setEndDate(promo.endDate || promo.end_date || '');
    setIsHighlight(promo.isHighlight || promo.highlight || false);
    setActive(promo.active ?? true);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      addToast({ type: 'warning', title: 'กรุณากรอกหัวข้อโปรโมชั่น' });
      return;
    }

    setSaving(true);
    try {
      const payload: Partial<PromotionItem> = {
        title,
        subtitle,
        description,
        badge,
        discountPercent: discountPercent ? Number(discountPercent) : undefined,
        image,
        ctaText,
        ctaLink,
        startDate,
        endDate,
        isHighlight,
        active,
      };

      if (isEditing && editingId) {
        await ApiService.updatePromotion(editingId, payload);
        addToast({ type: 'success', title: 'อัปเดตโปรโมชั่นสำเร็จ' });
      } else {
        await ApiService.createPromotion(payload as any);
        addToast({ type: 'success', title: 'สร้างโปรโมชั่นใหม่สำเร็จ' });
      }

      setShowModal(false);
      loadPromotions();
    } catch (err) {
      addToast({ type: 'error', title: 'เกิดข้อผิดพลาดในการบันทึก' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, promoTitle: string) => {
    if (!window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบโปรโมชั่น "${promoTitle}"?`)) return;
    try {
      await ApiService.deletePromotion(id);
      addToast({ type: 'success', title: 'ลบโปรโมชั่นเรียบร้อยแล้ว' });
      loadPromotions();
    } catch (err) {
      addToast({ type: 'error', title: 'เกิดข้อผิดพลาดในการลบ' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2">
            <Flame className="w-6 h-6 text-emerald-400" />
            <span>จัดการโปรโมชั่น & แคมเปญ (Promotion Management)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            จัดการแบนเนอร์ข้อเสนอพิเศษ ลด 50% ย้ายค่าย และของแถม
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md flex items-center gap-1.5 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>สร้างโปรโมชั่นใหม่</span>
        </button>
      </div>

      {/* Promotions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 text-center py-12 text-slate-500">กำลังโหลด...</div>
        ) : (
          promotions.map((promo) => (
            <div
              key={promo.id}
              className="rounded-3xl bg-slate-900 border border-slate-800 p-5 flex flex-col justify-between space-y-4 shadow-xl"
            >
              <div className="space-y-3">
                <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-950 border border-slate-800">
                  <img
                    src={promo.image}
                    alt={promo.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 flex gap-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500 text-slate-950">
                      {promo.badge}
                    </span>
                    {promo.isHighlight && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500 text-slate-950">
                        ⭐ แนะนำ
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">{promo.title}</h3>
                  <p className="text-xs text-emerald-400 font-semibold">{promo.subtitle}</p>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{promo.description}</p>
                </div>

                <div className="text-[11px] text-slate-500 flex items-center gap-2 pt-2 border-t border-slate-800">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>ถึงวันที่ {new Date(promo.endDate || promo.end_date || '').toLocaleDateString('th-TH')}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span
                  className={`text-[11px] font-bold ${
                    promo.active ? 'text-emerald-400' : 'text-slate-500'
                  }`}
                >
                  {promo.active ? '● เผยแพร่อยู่' : '○ ปิดการแสดง'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(promo)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(promo.id, promo.title)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Promo Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-emerald-400" />
                <span>{isEditing ? 'แก้ไขโปรโมชั่น' : 'สร้างโปรโมชั่นใหม่'}</span>
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">หัวข้อหลักโปรโมชั่น *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="เช่น ย้ายค่ายรับส่วนลด 50% นาน 12 เดือน"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">หัวข้อย่อย (Subtitle)</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="เช่น เริ่มต้นเพียง 299 บาท/เดือน"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">คำอธิบายสิทธิพิเศษ</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="รายละเอียดเงื่อนไขและของแถม..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">ป้ายกำกับ (Badge)</label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">% ส่วนลด</label>
                  <input
                    type="number"
                    value={discountPercent || ''}
                    onChange={(e) => setDiscountPercent(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="เช่น 50"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">ลิงก์รูปภาพ (Image URL)</label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">วันที่สิ้นสุดโปร</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-center gap-4 pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isHighlight}
                      onChange={(e) => setIsHighlight(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-emerald-500"
                    />
                    <span className="text-slate-300 font-semibold">ไฮไลท์หน้าแรก</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={(e) => setActive(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-emerald-500"
                    />
                    <span className="text-slate-300 font-semibold">เปิดใช้งาน</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-800"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-md"
                >
                  {saving ? 'กำลังบันทึก...' : 'บันทึกโปรโมชั่น'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
