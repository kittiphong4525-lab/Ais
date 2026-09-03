import React, { useState, useEffect } from 'react';
import { ApiService } from '../../services/api';
import { BannerItem } from '../../types';
import { PRESET_BANNER_TEMPLATES } from '../../services/seedData';
import { useNotification } from '../../context/NotificationContext';
import { extractYouTubeId } from '../../components/home/PackageFinder';
import {
  Image,
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  Eye,
  Sliders,
  CheckCircle2,
  X,
  ExternalLink,
  ArrowRight,
  MoveUp,
  MoveDown,
  RotateCcw,
  Layers,
  Link,
  Calendar,
  ToggleLeft,
  ToggleRight,
  LayoutTemplate,
  Video,
  Play,
  Save,
  Check,
} from 'lucide-react';

export const AdminBannersPage: React.FC = () => {
  const { addToast } = useNotification();
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterPosition, setFilterPosition] = useState<string>('ALL');

  // Video Settings State
  const [videoUrl, setVideoUrl] = useState<string>('https://youtu.be/EfgbNbszqbM?si=vIjxgPV3jDkdaIz8');
  const [savingVideo, setSavingVideo] = useState<boolean>(false);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewModalBanner, setPreviewModalBanner] = useState<BannerItem | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [badge, setBadge] = useState('🔥 โปรโมชั่นพิเศษ');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1600&auto=format&fit=crop&q=80');
  const [mobileImage, setMobileImage] = useState('');
  const [ctaText, setCtaText] = useState('ดูแพ็กเกจ');
  const [ctaLink, setCtaLink] = useState('/packages');
  const [linkType, setLinkType] = useState<'INTERNAL' | 'EXTERNAL' | 'LINE' | 'PHONE'>('INTERNAL');
  const [position, setPosition] = useState<'HERO_SLIDER' | 'HOME_MIDDLE' | 'POPUP' | 'PROMOTIONS_PAGE'>('HERO_SLIDER');
  const [order, setOrder] = useState<number>(1);
  const [active, setActive] = useState(true);
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState('2026-12-31');
  const [saving, setSaving] = useState(false);

  const loadBanners = async () => {
    setLoading(true);
    try {
      const list = await ApiService.getBanners({ onlyActive: false });
      setBanners(list);

      // Load video url from settings
      const settings = await ApiService.getSettings();
      if (settings?.youtube_video_url) {
        setVideoUrl(settings.youtube_video_url);
      }
    } catch (err) {
      console.error(err);
      addToast({ type: 'error', title: 'ไม่สามารถโหลดข้อมูลแบนเนอร์ได้' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const handleSaveVideoSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!videoUrl.trim()) {
      addToast({ type: 'warning', title: 'กรุณาระบุ URL วิดีโอ YouTube' });
      return;
    }
    setSavingVideo(true);
    try {
      const currentSettings = await ApiService.getSettings();
      await ApiService.saveSettings({
        ...currentSettings,
        youtube_video_url: videoUrl.trim(),
      });
      addToast({
        type: 'success',
        title: 'บันทึกวิดีโอ YouTube หน้าแรกสำเร็จ',
        message: 'วิดีโอบนหน้าแรกจะอัปเดตตาม URL ใหม่ทันที',
      });
    } catch (err) {
      console.error(err);
      addToast({ type: 'error', title: 'เกิดข้อผิดพลาดในการบันทึกวิดีโอ' });
    } finally {
      setSavingVideo(false);
    }
  };

  const handleResetVideo = async () => {
    const defaultUrl = 'https://youtu.be/EfgbNbszqbM?si=vIjxgPV3jDkdaIz8';
    setVideoUrl(defaultUrl);
    setSavingVideo(true);
    try {
      const currentSettings = await ApiService.getSettings();
      await ApiService.saveSettings({
        ...currentSettings,
        youtube_video_url: defaultUrl,
      });
      addToast({ type: 'info', title: 'รีเซ็ตวิดีโอเป็นค่าเริ่มต้นเรียบร้อยแล้ว' });
    } catch (err) {
      console.error(err);
    } finally {
      setSavingVideo(false);
    }
  };

  const handleOpenCreate = () => {
    setIsEditing(false);
    setEditingId(null);
    setTitle('');
    setSubtitle('');
    setDescription('');
    setBadge('🔥 โปรโมชั่นพิเศษ');
    setImage('https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1600&auto=format&fit=crop&q=80');
    setMobileImage('');
    setCtaText('เลือกดูแพ็กเกจ');
    setCtaLink('/packages');
    setLinkType('INTERNAL');
    setPosition('HERO_SLIDER');
    setOrder(banners.length + 1);
    setActive(true);
    setStartDate(new Date().toISOString().slice(0, 10));
    setEndDate('2026-12-31');
    setShowModal(true);
  };

  const handleOpenEdit = (banner: BannerItem) => {
    setIsEditing(true);
    setEditingId(banner.id);
    setTitle(banner.title);
    setSubtitle(banner.subtitle || '');
    setDescription(banner.description || '');
    setBadge(banner.badge || '');
    setImage(banner.image);
    setMobileImage(banner.mobile_image || '');
    setCtaText(banner.cta_text || '');
    setCtaLink(banner.cta_link || '');
    setLinkType(banner.link_type || 'INTERNAL');
    setPosition(banner.position);
    setOrder(banner.order);
    setActive(banner.active);
    setStartDate(banner.start_date || new Date().toISOString().slice(0, 10));
    setEndDate(banner.end_date || '2026-12-31');
    setShowModal(true);
  };

  const handleApplyPreset = (preset: (typeof PRESET_BANNER_TEMPLATES)[0]) => {
    setTitle(preset.title);
    setSubtitle(preset.subtitle);
    setImage(preset.image);
    setBadge(preset.badge);
    setCtaText(preset.cta_text);
    setCtaLink(preset.cta_link);
    setLinkType(preset.link_type);
    setPosition(preset.position);
    addToast({
      type: 'info',
      title: 'ใช้แม่แบบแบนเนอร์สำเร็จ',
      message: `โหลดข้อมูลจาก: ${preset.name}`,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      addToast({ type: 'warning', title: 'กรุณากรอกหัวข้อแบนเนอร์' });
      return;
    }
    if (!image.trim()) {
      addToast({ type: 'warning', title: 'กรุณาระบุ URL รูปภาพแบนเนอร์' });
      return;
    }

    setSaving(true);
    try {
      await ApiService.saveBanner({
        id: editingId || undefined,
        title,
        subtitle,
        description,
        badge,
        image,
        mobile_image: mobileImage,
        cta_text: ctaText,
        cta_link: ctaLink,
        link_type: linkType,
        position,
        order: Number(order),
        active,
        start_date: startDate,
        end_date: endDate,
      });

      addToast({
        type: 'success',
        title: isEditing ? 'แก้ไขแบนเนอร์สำเร็จ' : 'เพิ่มแบนเนอร์ใหม่สำเร็จ',
        message: title,
      });

      setShowModal(false);
      loadBanners();
    } catch (err) {
      console.error(err);
      addToast({ type: 'error', title: 'เกิดข้อผิดพลาดในการบันทึกแบนเนอร์' });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (banner: BannerItem) => {
    try {
      await ApiService.toggleBannerStatus(banner.id);
      addToast({
        type: 'info',
        title: banner.active ? 'ปิดการแสดงผลแบนเนอร์แล้ว' : 'เปิดการแสดงผลแบนเนอร์แล้ว',
        message: banner.title,
      });
      loadBanners();
    } catch (err) {
      addToast({ type: 'error', title: 'ไม่สามารถเปลี่ยนสถานะแบนเนอร์ได้' });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`ยืนยันการลบแบนเนอร์ "${name}"?`)) return;
    try {
      await ApiService.deleteBanner(id);
      addToast({ type: 'success', title: 'ลบแบนเนอร์เรียบร้อยแล้ว' });
      loadBanners();
    } catch (err) {
      addToast({ type: 'error', title: 'เกิดข้อผิดพลาดในการลบแบนเนอร์' });
    }
  };

  const handleResetDefaults = async () => {
    if (!window.confirm('คุณต้องการรีเซ็ตแบนเนอร์กลับเป็นชุดตั้งต้นของระบบ (5 แบนเนอร์) หรือไม่?')) return;
    try {
      await ApiService.resetBannersToDefault();
      addToast({ type: 'success', title: 'รีเซ็ตแบนเนอร์เป็นค่าเริ่มต้นเรียบร้อยแล้ว' });
      loadBanners();
    } catch (err) {
      addToast({ type: 'error', title: 'เกิดข้อผิดพลาดในการรีเซ็ต' });
    }
  };

  const displayedBanners =
    filterPosition === 'ALL'
      ? banners
      : banners.filter((b) => b.position === filterPosition);

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-white font-display">
              จัดการแบนเนอร์ & สไลเดอร์หน้าแรก
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold font-mono">
              {banners.length} รายการ
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            ปรับแต่งสไลเดอร์ Hero Banner และแบนเนอร์โปรโมชั่น ปรับลำดับ เปิด/ปิดการแสดงผล
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleResetDefaults}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="รีเซ็ตกลับเป็นแบนเนอร์เริ่มต้น"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>รีเซ็ตค่าเริ่มต้น</span>
          </button>

          <button
            id="admin-add-banner-btn"
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-extrabold flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>เพิ่มแบนเนอร์ใหม่</span>
          </button>
        </div>
      </div>

      {/* Home YouTube Video Settings Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  จัดการวิดีโอ YouTube หน้าแรก
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                  YouTube Player
                </span>
              </div>
              <p className="text-xs text-slate-400">
                กำหนดลิงก์วิดีโอที่แสดงในส่วนค้นหาแพ็กเกจบนหน้าหลัก (หน้าร้านจะแสดงเฉพาะตัวเล่นวิดีโอ)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetVideo}
              disabled={savingVideo}
              className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>คืนค่าวิดีโอตั้งต้น</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSaveVideoSettings} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Input field & save button */}
          <div className="lg:col-span-7 space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                ลิงก์วิดีโอ YouTube (URL หรือ Video ID)
              </label>
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtu.be/EfgbNbszqbM หรือ https://www.youtube.com/watch?v=..."
                className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 transition-colors"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                รองรับรูปแบบ: youtu.be/ID, youtube.com/watch?v=ID, shorts หรือเฉพาะรหัส ID 11 หลัก
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="submit"
                disabled={savingVideo}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm inline-flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{savingVideo ? 'กำลังบันทึก...' : 'บันทึกวิดีโอใหม่'}</span>
              </button>

              <a
                href={videoUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
              >
                <span>เปิดดูบน YouTube</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Live Preview Embed */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video shadow-inner relative group">
              <iframe
                key={extractYouTubeId(videoUrl)}
                className="w-full h-full"
                src={`https://www.youtube-nocookie.com/embed/${extractYouTubeId(videoUrl)}?rel=0&autoplay=0`}
                title="Admin Preview"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <p className="text-[10px] text-center text-slate-500 mt-1.5">
              ตัวอย่างการแสดงผลวิดีโอ (ID: {extractYouTubeId(videoUrl)})
            </p>
          </div>
        </form>
      </div>

      {/* Position Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'ALL', label: 'ทั้งหมด' },
          { id: 'HERO_SLIDER', label: 'สไลเดอร์หน้าแรก (Hero Slider)' },
          { id: 'HOME_MIDDLE', label: 'แบนเนอร์กลางหน้า (Middle Banner)' },
          { id: 'PROMOTIONS_PAGE', label: 'หน้าโปรโมชั่น (Promotions)' },
          { id: 'POPUP', label: 'ป๊อปอัพ (Popup)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterPosition(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              filterPosition === tab.id
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Banner Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-72 bg-slate-900 rounded-3xl border border-slate-800" />
          ))}
        </div>
      ) : displayedBanners.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 rounded-3xl border border-slate-800 p-8 space-y-4">
          <Image className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">ยังไม่มีแบนเนอร์ในหมวดนี้</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            คุณสามารถกดปุ่ม "เพิ่มแบนเนอร์ใหม่" หรือ "รีเซ็ตค่าเริ่มต้น" เพื่อนำเข้าแบนเนอร์โปรโมชั่น
          </p>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
          >
            + สร้างแบนเนอร์แรก
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedBanners.map((banner) => (
            <div
              key={banner.id}
              className={`rounded-3xl bg-slate-900 border transition-all overflow-hidden flex flex-col justify-between ${
                banner.active ? 'border-slate-800 hover:border-emerald-500/50' : 'border-rose-900/40 opacity-70'
              }`}
            >
              {/* Image Preview Container */}
              <div className="relative h-44 w-full bg-slate-950 overflow-hidden group">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Badge Overlay */}
                {banner.badge && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-700/60 text-emerald-300 text-[11px] font-bold backdrop-blur-md">
                    {banner.badge}
                  </span>
                )}

                {/* Position & Order Badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-500/90 text-slate-950 text-[10px] font-black font-mono">
                    ลำดับ #{banner.order}
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-300 text-[10px] font-bold">
                    {banner.position === 'HERO_SLIDER' ? 'Hero Slider' : banner.position}
                  </span>
                </div>

                {/* Preview Trigger Button */}
                <button
                  onClick={() => setPreviewModalBanner(banner)}
                  className="absolute bottom-3 right-3 p-2 rounded-xl bg-slate-950/80 hover:bg-emerald-500 text-slate-300 hover:text-slate-950 border border-slate-700 text-xs backdrop-blur-md transition-all shadow-md"
                  title="ดูตัวอย่างแบบเต็ม"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              {/* Body Details */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-white line-clamp-2">{banner.title}</h3>
                  {banner.subtitle && (
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1 font-light">
                      {banner.subtitle}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Link className="w-3 h-3 text-emerald-400" />
                      {banner.cta_text || 'ไม่มีปุ่ม'}: <code className="text-slate-300">{banner.cta_link}</code>
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    {/* Active Toggle */}
                    <button
                      onClick={() => handleToggleActive(banner)}
                      className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                        banner.active
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25'
                          : 'bg-rose-500/15 border-rose-500/30 text-rose-300 hover:bg-rose-500/25'
                      }`}
                    >
                      {banner.active ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>เปิดใช้งาน</span>
                        </>
                      ) : (
                        <>
                          <X className="w-3.5 h-3.5 text-rose-400" />
                          <span>ปิดใช้งาน</span>
                        </>
                      )}
                    </button>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(banner)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title="แก้ไขแบนเนอร์"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(banner.id, banner.title)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
                        title="ลบแบนเนอร์"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Create / Edit Banner */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white font-display">
                  {isEditing ? 'แก้ไขแบนเนอร์' : 'เพิ่มแบนเนอร์ใหม่'}
                </h3>
                <p className="text-xs text-slate-400">
                  กำหนดข้อมูลรูปภาพ ข้อความ ลิงก์ปลายทาง และตำแหน่งการแสดงผล
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Preset Selector */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <LayoutTemplate className="w-4 h-4" />
                <span>เลือกใช้แม่แบบด่วน (Preset Templates)</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {PRESET_BANNER_TEMPLATES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-emerald-500/20 border border-slate-700 hover:border-emerald-500/40 text-[11px] font-medium text-slate-300 hover:text-emerald-300 transition-colors"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    หัวข้อหลักบนแบนเนอร์ (Title) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="เช่น AIS 3BB FIBRE 3 อนาคตที่มากกว่าเน็ตบ้าน"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                {/* Subtitle */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    คำโปรยรอง (Subtitle)
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="เช่น สปีดสูงสุด 2,000 Mbps พร้อมเราเตอร์ Wi-Fi 7 ฟรี!"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                {/* Badge */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    ป้ายกำกับ (Badge)
                  </label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="เช่น 🔥 โปรโมชั่นพิเศษ, ⚡ มาตรฐานใหม่ 2026"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                {/* Position */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    ตำแหน่งแบนเนอร์ (Position)
                  </label>
                  <select
                    value={position}
                    onChange={(e: any) => setPosition(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="HERO_SLIDER">สไลเดอร์หน้าแรก (Hero Slider)</option>
                    <option value="HOME_MIDDLE">แบนเนอร์กลางหน้าแรก (Home Middle)</option>
                    <option value="PROMOTIONS_PAGE">หน้าโปรโมชั่น (Promotions Page)</option>
                    <option value="POPUP">ป๊อปอัพแจ้งเตือน (Popup)</option>
                  </select>
                </div>

                {/* Image URL */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    URL รูปภาพแบนเนอร์ (Image URL) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="url"
                    required
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                  {image && (
                    <div className="mt-2 h-32 w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-950 relative">
                      <img
                        src={image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-slate-950/80 text-[10px] text-slate-300 font-mono">
                        ตัวอย่างรูปภาพ
                      </span>
                    </div>
                  )}
                </div>

                {/* CTA Text */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    ข้อความบนปุ่ม (CTA Text)
                  </label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    placeholder="เช่น เลือกดูแพ็กเกจ, สมัครติดตั้ง"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                {/* CTA Link */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    ลิงก์ปลายทาง (CTA Link)
                  </label>
                  <input
                    type="text"
                    value={ctaLink}
                    onChange={(e) => setCtaLink(e.target.value)}
                    placeholder="เช่น /packages, /apply, https://line.me/..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                  <div className="flex gap-1.5 pt-1">
                    {['/packages', '/apply', '/check-area', 'https://line.me/ti/p/@aisfibre999'].map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => setCtaLink(l)}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 hover:text-emerald-300"
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Link Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    ประเภทลิงก์
                  </label>
                  <select
                    value={linkType}
                    onChange={(e: any) => setLinkType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="INTERNAL">หน้าภายในเว็บ (Internal Route)</option>
                    <option value="LINE">เปิด LINE ติดต่อ (LINE Contact)</option>
                    <option value="PHONE">โทรออกทันที (Phone Call)</option>
                    <option value="EXTERNAL">เปิดเว็บภายนอก (External Link)</option>
                  </select>
                </div>

                {/* Display Order */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    ลำดับการแสดงผล (Order)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                {/* Active Toggle Switch */}
                <div className="sm:col-span-2 flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <div>
                    <span className="text-xs font-bold text-white block">สถานะการแสดงผล</span>
                    <span className="text-[11px] text-slate-400">
                      หากปิดไว้ แบนเนอร์นี้จะไม่ปรากฏบนหน้าเว็บไซต์
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActive(!active)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                      active ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {active ? 'เปิดใช้งาน (Active)' : 'ปิดใช้งาน (Inactive)'}
                  </button>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-bold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-extrabold flex items-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                >
                  {saving ? 'กำลังบันทึก...' : isEditing ? 'บันทึกการแก้ไข' : 'สร้างแบนเนอร์'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Fullscreen Banner Live Preview */}
      {previewModalBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            {/* Close */}
            <button
              onClick={() => setPreviewModalBanner(null)}
              className="absolute top-4 right-4 z-40 p-2.5 rounded-full bg-slate-950/80 hover:bg-slate-800 text-white border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Banner Preview Body */}
            <div className="relative min-h-[360px] sm:min-h-[420px] flex items-center overflow-hidden">
              <img
                src={previewModalBanner.image}
                alt={previewModalBanner.title}
                className="absolute inset-0 w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />

              <div className="relative z-10 p-8 sm:p-12 max-w-2xl space-y-4">
                {previewModalBanner.badge && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    {previewModalBanner.badge}
                  </span>
                )}
                <h3 className="text-2xl sm:text-4xl font-black text-white font-display">
                  {previewModalBanner.title}
                </h3>
                {previewModalBanner.subtitle && (
                  <p className="text-sm sm:text-base text-slate-200 font-light">
                    {previewModalBanner.subtitle}
                  </p>
                )}
                {previewModalBanner.cta_text && (
                  <button className="px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-sm flex items-center gap-2">
                    <span>{previewModalBanner.cta_text}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
