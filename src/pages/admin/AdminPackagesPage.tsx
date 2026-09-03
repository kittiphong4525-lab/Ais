import React, { useState, useEffect } from 'react';
import { ApiService } from '../../services/api';
import { PackageItem } from '../../types';
import { useNotification } from '../../context/NotificationContext';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Tv,
  Zap,
  Layers,
  X,
  Sparkles,
  Image as ImageIcon,
} from 'lucide-react';

export const AdminPackagesPage: React.FC = () => {
  const { addToast } = useNotification();
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<string>('HOME');
  const [downloadSpeed, setDownloadSpeed] = useState(1000);
  const [uploadSpeed, setUploadSpeed] = useState(1000);
  const [price, setPrice] = useState(599);
  const [originalPrice, setOriginalPrice] = useState(899);
  const [contractMonths, setContractMonths] = useState(24);
  const [badge, setBadge] = useState('🔥 ยอดนิยม');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [featuresStr, setFeaturesStr] = useState('');
  const [equipmentStr, setEquipmentStr] = useState('');
  const [tvIncluded, setTvIncluded] = useState(false);
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadPackages = async () => {
    setLoading(true);
    try {
      const data = await ApiService.getPackages();
      setPackages(data);
    } catch (err) {
      console.error(err);
      addToast({ type: 'error', title: 'ไม่สามารถโหลดข้อมูลแพ็กเกจได้' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  const handleOpenCreate = () => {
    setIsEditing(false);
    setEditingId(null);
    setName('');
    setSlug('');
    setCategory('HOME');
    setDownloadSpeed(1000);
    setUploadSpeed(1000);
    setPrice(599);
    setOriginalPrice(899);
    setContractMonths(24);
    setBadge('ใหม่ล่าสุด');
    setImage('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80');
    setDescription('อินเทอร์เน็ตความเร็วสูงไฟเบอร์แท้ 100%');
    setFeaturesStr('ฟรีค่าแรกเข้า 4,800 บาท\nเราเตอร์ WiFi 6 ยืมฟรี\nบริการดูแลตลอด 24 ชม.');
    setEquipmentStr('WiFi 6 Router (AX3000), สายไฟเบอร์ออปติก');
    setTvIncluded(false);
    setActive(true);
    setShowModal(true);
  };

  const handleOpenEdit = (pkg: PackageItem) => {
    setIsEditing(true);
    setEditingId(pkg.id);
    setName(pkg.name);
    setSlug(pkg.slug || '');
    setCategory(pkg.category || 'POPULAR');
    setDownloadSpeed(pkg.download_speed ?? (pkg as any).downloadSpeed ?? 500);
    setUploadSpeed(pkg.upload_speed ?? (pkg as any).uploadSpeed ?? 500);
    setPrice(pkg.price ?? (pkg as any).monthlyPrice ?? 499);
    setOriginalPrice(pkg.originalPrice || pkg.price || (pkg as any).monthlyPrice || 499);
    setContractMonths(pkg.contract_month ?? (pkg as any).contractMonths ?? 24);
    setBadge(pkg.badge || '');
    setImage(pkg.image || '');
    setDescription(pkg.description || '');
    const feats = (pkg.features || []).map((f) => (typeof f === 'string' ? f : (f as any).text));
    setFeaturesStr(feats.join('\n'));
    setEquipmentStr((pkg.equipment || []).join(', '));
    setTvIncluded(pkg.tvIncluded ?? false);
    setActive(pkg.active ?? true);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast({ type: 'warning', title: 'กรุณากรอกชื่อแพ็กเกจ' });
      return;
    }

    setSaving(true);
    try {
      const payload: Partial<PackageItem> = {
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        category,
        download_speed: Number(downloadSpeed),
        upload_speed: Number(uploadSpeed),
        price: Number(price),
        originalPrice: Number(originalPrice),
        contract_month: Number(contractMonths),
        badge: badge || undefined,
        image: image || undefined,
        description,
        features: featuresStr.split('\n').map((s) => s.trim()).filter(Boolean),
        equipment: equipmentStr.split(',').map((s) => s.trim()).filter(Boolean),
        tvIncluded,
        active,
      };

      if (isEditing && editingId) {
        await ApiService.updatePackage(editingId, payload);
        addToast({ type: 'success', title: 'อัปเดตแพ็กเกจสำเร็จ' });
      } else {
        await ApiService.createPackage(payload as any);
        addToast({ type: 'success', title: 'สร้างแพ็กเกจใหม่สำเร็จ' });
      }

      setShowModal(false);
      loadPackages();
    } catch (err) {
      addToast({ type: 'error', title: 'เกิดข้อผิดพลาดในการบันทึกแพ็กเกจ' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, pkgName: string) => {
    if (!window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบแพ็กเกจ "${pkgName}"?`)) return;
    try {
      await ApiService.deletePackage(id);
      addToast({ type: 'success', title: 'ลบแพ็กเกจเรียบร้อยแล้ว' });
      loadPackages();
    } catch (err) {
      addToast({ type: 'error', title: 'เกิดข้อผิดพลาดในการลบ' });
    }
  };

  const handleToggleActive = async (pkg: PackageItem) => {
    try {
      await ApiService.updatePackage(pkg.id, { active: !pkg.active });
      addToast({
        type: 'info',
        title: !pkg.active ? 'เปิดใช้งานแพ็กเกจแล้ว' : 'ปิดการแสดงผลแพ็กเกจแล้ว',
      });
      loadPackages();
    } catch (err) {
      addToast({ type: 'error', title: 'ไม่สามารถเปลี่ยนสถานะได้' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2">
            <Package className="w-6 h-6 text-emerald-400" />
            <span>จัดการแพ็กเกจเน็ตบ้าน (Package Management)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            เพิ่ม ลบ แก้ไขสปีด ราคา สัญญา และของแถม โดยข้อมูลจะอัปเดตบนหน้าเว็บลูกค้าทันที
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md flex items-center gap-1.5 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>เพิ่มแพ็กเกจใหม่</span>
        </button>
      </div>

      {/* Package Grid / List */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                <th className="py-3.5 px-4 font-semibold">ชื่อแพ็กเกจ</th>
                <th className="py-3.5 px-4 font-semibold">หมวดหมู่</th>
                <th className="py-3.5 px-4 font-semibold">ความเร็ว (DL/UL)</th>
                <th className="py-3.5 px-4 font-semibold">ราคา/เดือน</th>
                <th className="py-3.5 px-4 font-semibold">สัญญา</th>
                <th className="py-3.5 px-4 font-semibold">กล่อง TV</th>
                <th className="py-3.5 px-4 font-semibold">สถานะ</th>
                <th className="py-3.5 px-4 font-semibold text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    กำลังโหลดข้อมูล...
                  </td>
                </tr>
              ) : packages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-white">
                    <div className="flex items-center gap-2">
                      <span>{pkg.name}</span>
                      {pkg.badge && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                          {pkg.badge}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                    {pkg.category}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400">
                    {pkg.download_speed ?? (pkg as any).downloadSpeed ?? 0}/{pkg.upload_speed ?? (pkg as any).uploadSpeed ?? 0} Mbps
                  </td>
                  <td className="py-3.5 px-4 font-bold text-white">
                    ฿{(pkg.price ?? (pkg as any).monthlyPrice ?? 0).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    {pkg.contract_month ?? (pkg as any).contractMonths ?? 24} เดือน
                  </td>
                  <td className="py-3.5 px-4">
                    {pkg.tvIncluded ? (
                      <span className="text-purple-400 font-semibold flex items-center gap-1">
                        <Tv className="w-3 h-3" /> มีกล่อง
                      </span>
                    ) : (
                      <span className="text-slate-600">-</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleToggleActive(pkg)}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition-colors ${
                        pkg.active
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-rose-500/10 hover:text-rose-400'
                          : 'bg-slate-800 text-slate-500 border-slate-700 hover:bg-emerald-500/10 hover:text-emerald-400'
                      }`}
                    >
                      {pkg.active ? '✓ แสดงหน้าร้าน' : '✕ ซ่อนอยู่'}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(pkg)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        title="แก้ไข"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(pkg.id, pkg.name)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                        title="ลบ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Package Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-400" />
                <span>{isEditing ? 'แก้ไขข้อมูลแพ็กเกจ' : 'เพิ่มแพ็กเกจเน็ตใหม่'}</span>
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">ชื่อแพ็กเกจ *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="เช่น AIS Fibre HomePLUS 500/500"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">หมวดหมู่</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="HOME">บ้าน & WFH</option>
                    <option value="POPULAR">ยอดนิยม (Popular)</option>
                    <option value="GAMER">เกมเมอร์ (Gamer)</option>
                    <option value="ENTERTAINMENT">รวมความบันเทิง (Entertainment)</option>
                    <option value="BUDGET">ราคาประหยัด (Budget)</option>
                    <option value="BUSINESS">ธุรกิจ SME (Business)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Download (Mbps)</label>
                  <input
                    type="number"
                    required
                    value={downloadSpeed}
                    onChange={(e) => setDownloadSpeed(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Upload (Mbps)</label>
                  <input
                    type="number"
                    required
                    value={uploadSpeed}
                    onChange={(e) => setUploadSpeed(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">ราคา/เดือน (บาท) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">สัญญา (เดือน)</label>
                  <input
                    type="number"
                    value={contractMonths}
                    onChange={(e) => setContractMonths(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">ป้ายกำกับพิเศษ (Badge)</label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="เช่น 🔥 ยอดนิยม, ลด 50%"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tvIncluded}
                      onChange={(e) => setTvIncluded(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-emerald-500"
                    />
                    <span className="text-slate-300 font-semibold">รวมกล่อง AIS PLAYBOX</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={(e) => setActive(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-emerald-500"
                    />
                    <span className="text-slate-300 font-semibold">เปิดแสดงหน้าร้าน</span>
                  </label>
                </div>
              </div>

              {/* Image Input & Presets */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <label className="block font-semibold text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-emerald-400" />
                    <span>รูปภาพหัวการ์ดแพ็กเกจ (URL รูปภาพ)</span>
                  </span>
                  {image && (
                    <button
                      type="button"
                      onClick={() => setImage('')}
                      className="text-[11px] text-rose-400 hover:underline"
                    >
                      ล้างรูป
                    </button>
                  )}
                </label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/... หรือใส่ลิงก์รูปภาพ"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
                <div className="flex items-center gap-2 flex-wrap text-[11px] pt-1">
                  <span className="text-slate-400">เลือกรูปตัวอย่าง:</span>
                  <button
                    type="button"
                    onClick={() => setImage('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80')}
                    className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px]"
                  >
                    เน็ตบ้าน 1Gbps
                  </button>
                  <button
                    type="button"
                    onClick={() => setImage('https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600&auto=format&fit=crop&q=80')}
                    className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px]"
                  >
                    เน็ต + PLAYBOX
                  </button>
                  <button
                    type="button"
                    onClick={() => setImage('https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80')}
                    className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px]"
                  >
                    เกมเมอร์ VIP Ping
                  </button>
                  <button
                    type="button"
                    onClick={() => setImage('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80')}
                    className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px]"
                  >
                    SuperMESH 2Gbps
                  </button>
                  <button
                    type="button"
                    onClick={() => setImage('https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=80')}
                    className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px]"
                  >
                    คอนโด & หอพัก
                  </button>
                </div>
                {image && (
                  <div className="mt-2 h-28 w-full rounded-xl overflow-hidden border border-slate-700 relative">
                    <img src={image} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute bottom-1 right-1 bg-slate-950/80 px-2 py-0.5 rounded text-[10px] text-emerald-400">
                      ตัวอย่างรูปภาพ
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">สิทธิพิเศษ (ขึ้นบรรทัดใหม่ละ 1 ข้อ)</label>
                <textarea
                  rows={3}
                  value={featuresStr}
                  onChange={(e) => setFeaturesStr(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">อุปกรณ์ที่ได้รับ (คั่นด้วยเครื่องหมายจุลภาค ,)</label>
                <input
                  type="text"
                  value={equipmentStr}
                  onChange={(e) => setEquipmentStr(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
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
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-md"
                >
                  {saving ? 'กำลังบันทึก...' : 'บันทึกแพ็กเกจ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
