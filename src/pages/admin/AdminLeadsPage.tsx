import React, { useState, useEffect, useMemo } from 'react';
import { ApiService } from '../../services/api';
import { CoverageCheckLead, LeadStatus, AdminUser } from '../../types';
import { StatusBadge, STATUS_CONFIG } from '../../components/common/StatusBadge';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  Search,
  Filter,
  Download,
  Plus,
  PhoneCall,
  MessageCircle,
  Clock,
  MapPin,
  Calendar,
  X,
  FileText,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Trash2,
  AlertTriangle,
  CheckSquare,
  Square,
  Check,
} from 'lucide-react';

export const AdminLeadsPage: React.FC = () => {
  const { addToast } = useNotification();
  const { allUsers, user: currentUser } = useAuth();

  const [leads, setLeads] = useState<CoverageCheckLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<CoverageCheckLead | null>(null);

  // Selection & Deletion state
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [leadToDelete, setLeadToDelete] = useState<CoverageCheckLead | null>(null);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [showClearAllModal, setShowClearAllModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Add Lead Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newProvince, setNewProvince] = useState('กรุงเทพมหานคร');
  const [newDistrict, setNewDistrict] = useState('');
  const [newSubdistrict, setNewSubdistrict] = useState('');
  const [newPackageName, setNewPackageName] = useState('AIS Fibre PowerPro 1000/1000');
  const [newNotes, setNewNotes] = useState('');
  const [addingLead, setAddingLead] = useState(false);

  // Edit Lead state
  const [editStatus, setEditStatus] = useState<LeadStatus>('NEW');
  const [editAssignedTo, setEditAssignedTo] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');
  const [savingEdit, setSavingEdit] = useState(false);

  const loadLeads = async () => {
    setLoading(true);
    try {
      const data = await ApiService.getCoverageCheckLeads();
      setLeads(data);
      // Clean up selected IDs that no longer exist
      const existingIds = new Set(data.map((d) => d.id));
      setSelectedLeadIds((prev) => prev.filter((id) => existingIds.has(id)));
    } catch (err) {
      console.error(err);
      addToast({ type: 'error', title: 'ไม่สามารถโหลดข้อมูลคำขอได้' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const filteredLeads = useMemo(() => {
    return leads.filter((item) => {
      const matchStatus = selectedStatus === 'ALL' || item.status === selectedStatus;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        item.customer_name.toLowerCase().includes(q) ||
        item.phone.toLowerCase().includes(q) ||
        (item.tracking_id && item.tracking_id.toLowerCase().includes(q)) ||
        (item.lead_no && item.lead_no.toLowerCase().includes(q)) ||
        item.province.toLowerCase().includes(q) ||
        item.district.toLowerCase().includes(q);
      return matchStatus && matchQuery;
    });
  }, [leads, selectedStatus, searchQuery]);

  const handleOpenLead = (lead: CoverageCheckLead) => {
    setSelectedLead(lead);
    setEditStatus(lead.status);
    setEditAssignedTo(lead.assigned_to || '');
    setEditNotes(lead.admin_notes || '');
  };

  const handleToggleSelect = (id: string) => {
    setSelectedLeadIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllFiltered = () => {
    if (filteredLeads.length === 0) return;
    const allFilteredIds = filteredLeads.map((l) => l.id);
    const allSelected = allFilteredIds.every((id) => selectedLeadIds.includes(id));
    if (allSelected) {
      setSelectedLeadIds((prev) => prev.filter((id) => !allFilteredIds.includes(id)));
    } else {
      setSelectedLeadIds((prev) => Array.from(new Set([...prev, ...allFilteredIds])));
    }
  };

  // Single Delete Handler
  const handleConfirmSingleDelete = async () => {
    if (!leadToDelete) return;
    setDeleting(true);
    try {
      await ApiService.deleteLead(leadToDelete.id);
      if (leadToDelete.tracking_id) {
        await ApiService.deleteApplication(leadToDelete.tracking_id);
      }
      addToast({
        type: 'success',
        title: 'ลบข้อมูลลูกค้าสำเร็จ',
        message: `ลบคำขอของคุณ ${leadToDelete.customer_name} (${leadToDelete.tracking_id}) แล้ว`,
      });
      if (selectedLead?.id === leadToDelete.id) {
        setSelectedLead(null);
      }
      setLeadToDelete(null);
      loadLeads();
    } catch (err) {
      console.error(err);
      addToast({ type: 'error', title: 'เกิดข้อผิดพลาดในการลบข้อมูล' });
    } finally {
      setDeleting(false);
    }
  };

  // Bulk Delete Handler
  const handleConfirmBulkDelete = async () => {
    if (selectedLeadIds.length === 0) return;
    setDeleting(true);
    try {
      const count = selectedLeadIds.length;
      await ApiService.deleteLeadsBulk(selectedLeadIds);
      addToast({
        type: 'success',
        title: 'ลบข้อมูลสำเร็จ',
        message: `ลบข้อมูลลูกค้าที่เลือกจำนวน ${count} รายการ เรียบร้อยแล้ว`,
      });
      setSelectedLeadIds([]);
      setShowBulkDeleteModal(false);
      if (selectedLead && selectedLeadIds.includes(selectedLead.id)) {
        setSelectedLead(null);
      }
      loadLeads();
    } catch (err) {
      console.error(err);
      addToast({ type: 'error', title: 'เกิดข้อผิดพลาดในการลบข้อมูล' });
    } finally {
      setDeleting(false);
    }
  };

  // Clear All Leads Handler
  const handleConfirmClearAll = async () => {
    setDeleting(true);
    try {
      await ApiService.clearAllLeads();
      await ApiService.clearAllApplications();
      addToast({
        type: 'success',
        title: 'ล้างข้อมูลทั้งหมดสำเร็จ',
        message: 'ลบข้อมูลลูกค้าและใบงานทั้งหมดในระบบแล้ว',
      });
      setSelectedLeadIds([]);
      setSelectedLead(null);
      setShowClearAllModal(false);
      loadLeads();
    } catch (err) {
      console.error(err);
      addToast({ type: 'error', title: 'เกิดข้อผิดพลาดในการล้างข้อมูล' });
    } finally {
      setDeleting(false);
    }
  };

  const handleSaveLead = async () => {
    if (!selectedLead) return;
    setSavingEdit(true);
    try {
      const updated = await ApiService.updateLeadStatus(
        selectedLead.id,
        editStatus,
        editNotes,
        editAssignedTo || undefined
      );
      addToast({
        type: 'success',
        title: 'บันทึกการแก้ไขสำเร็จ',
        message: `สถานะคำขอ: ${STATUS_CONFIG[editStatus].label}`,
      });
      setSelectedLead(updated);
      loadLeads();
    } catch (err) {
      addToast({ type: 'error', title: 'เกิดข้อผิดพลาดในการบันทึก' });
    } finally {
      setSavingEdit(false);
    }
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName.trim() || !newPhone.trim()) {
      addToast({ type: 'warning', title: 'กรุณากรอกชื่อและเบอร์โทรศัพท์' });
      return;
    }
    setAddingLead(true);
    try {
      const created = await ApiService.createCoverageCheckLead({
        customer_name: newCustomerName,
        phone: newPhone,
        province: newProvince,
        district: newDistrict || 'เมือง',
        subdistrict: newSubdistrict || 'ในเมือง',
        package_name: newPackageName,
        admin_notes: newNotes || 'รับเรื่องจากหน้าร้าน / โทรเข้า',
        assigned_to: currentUser?.name,
        consent_contact: true,
      });

      addToast({
        type: 'success',
        title: 'สร้างคำขอใหม่สำเร็จ',
        message: `รหัสคำขอ: ${created.tracking_id}`,
      });
      setShowAddModal(false);
      setNewCustomerName('');
      setNewPhone('');
      setNewDistrict('');
      setNewSubdistrict('');
      setNewNotes('');
      loadLeads();
    } catch (err) {
      addToast({ type: 'error', title: 'เกิดข้อผิดพลาดในการสร้างคำขอ' });
    } finally {
      setAddingLead(false);
    }
  };

  const handleExportCSV = () => {
    if (leads.length === 0) {
      addToast({ type: 'warning', title: 'ไม่มีข้อมูลสำหรับส่งออก' });
      return;
    }

    const headers = [
      'Tracking ID',
      'Customer Name',
      'Phone',
      'Status',
      'Province',
      'District',
      'Subdistrict',
      'Package',
      'Assigned To',
      'Created At',
      'Notes',
    ];

    const rows = leads.map((l) => [
      l.tracking_id,
      `"${l.customer_name}"`,
      `"${l.phone}"`,
      l.status,
      `"${l.province}"`,
      `"${l.district}"`,
      `"${l.subdistrict}"`,
      `"${l.package_name || ''}"`,
      `"${l.assigned_to || ''}"`,
      l.created_at,
      `"${(l.admin_notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ais_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({ type: 'success', title: 'ส่งออกไฟล์ CSV เรียบร้อยแล้ว' });
  };

  const isAllFilteredSelected =
    filteredLeads.length > 0 &&
    filteredLeads.every((l) => selectedLeadIds.includes(l.id));

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-400" />
            <span>จัดการรายชื่อลูกค้า & ใบงาน (CRM)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            ติดตามสถานะคู่สาย DP ตรวจสอบเอกสาร และนัดหมายคิวติดตั้งทั้งหมด ({filteredLeads.length} รายการ)
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {leads.length > 0 && (
            <button
              onClick={() => setShowClearAllModal(true)}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="ล้างข้อมูลลูกค้าทั้งหมดในระบบ"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>ลบทั้งหมด</span>
            </button>
          )}

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>ส่งออก CSV</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>เพิ่มคำขอใหม่ (Walk-in/โทร)</span>
          </button>
        </div>
      </div>

      {/* Floating Bulk Action Bar */}
      {selectedLeadIds.length > 0 && (
        <div className="p-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-950/90 via-slate-900 to-slate-900 border border-rose-500/40 shadow-xl flex flex-wrap items-center justify-between gap-3 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 text-xs font-bold font-mono">
              เลือกอยู่ {selectedLeadIds.length} รายการ
            </span>
            <span className="text-xs text-slate-300 hidden sm:inline">
              สามารถลบข้อมูลลูกค้าที่เลือกพร้อมกันได้ทันที
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedLeadIds([])}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              ยกเลิกการเลือก
            </button>
            <button
              onClick={() => setShowBulkDeleteModal(true)}
              className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>ลบรายการที่เลือก ({selectedLeadIds.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* Status Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedStatus('ALL')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            selectedStatus === 'ALL'
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          ทั้งหมด ({leads.length})
        </button>
        {Object.entries(STATUS_CONFIG).map(([stKey, conf]) => {
          const count = leads.filter((l) => l.status === stKey).length;
          return (
            <button
              key={stKey}
              onClick={() => setSelectedStatus(stKey)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedStatus === stKey
                  ? `${conf.bg} ${conf.text} border ${conf.border} font-bold ring-1 ring-emerald-500/30`
                  : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <span>{conf.label}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950/60 font-mono">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ค้นหาชื่อลูกค้า, เบอร์โทรศัพท์, รหัสคำขอ AIS-..., จังหวัด, เขต/อำเภอ..."
          className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Leads Table */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                <th className="py-3.5 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllFilteredSelected}
                    onChange={handleSelectAllFiltered}
                    className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                    title="เลือกทั้งหมด"
                  />
                </th>
                <th className="py-3.5 px-3 font-semibold">รหัสคำขอ</th>
                <th className="py-3.5 px-3 font-semibold">ชื่อลูกค้า</th>
                <th className="py-3.5 px-3 font-semibold">เบอร์โทรศัพท์</th>
                <th className="py-3.5 px-3 font-semibold">พื้นที่ติดตั้ง</th>
                <th className="py-3.5 px-3 font-semibold">แพ็กเกจ</th>
                <th className="py-3.5 px-3 font-semibold">ผู้รับผิดชอบ</th>
                <th className="py-3.5 px-3 font-semibold">สถานะ</th>
                <th className="py-3.5 px-3 font-semibold text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    กำลังโหลดข้อมูล...
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    ไม่พบรายการคำขอที่ค้นหา
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const isSelected = selectedLeadIds.includes(lead.id);
                  return (
                    <tr
                      key={lead.id}
                      onClick={() => handleOpenLead(lead)}
                      className={`hover:bg-slate-850/60 cursor-pointer transition-colors ${
                        isSelected ? 'bg-emerald-950/20' : ''
                      }`}
                    >
                      <td
                        className="py-3.5 px-3 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(lead.id)}
                          className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                        />
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold text-slate-300">
                        {lead.tracking_id}
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-white">
                        {lead.customer_name}
                      </td>
                      <td className="py-3.5 px-3">
                        <a
                          href={`tel:${lead.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-emerald-400 hover:underline flex items-center gap-1"
                        >
                          <PhoneCall className="w-3 h-3" />
                          <span>{lead.phone}</span>
                        </a>
                      </td>
                      <td className="py-3.5 px-3 text-slate-300">
                        {lead.district}, {lead.province}
                      </td>
                      <td className="py-3.5 px-3 text-slate-200">
                        {lead.package_name || '-'}
                      </td>
                      <td className="py-3.5 px-3 text-slate-400">
                        {lead.assigned_to || (
                          <span className="text-slate-600 italic">ยังไม่มอบหมาย</span>
                        )}
                      </td>
                      <td className="py-3.5 px-3">
                        <StatusBadge status={lead.status} size="sm" />
                      </td>
                      <td className="py-3.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenLead(lead)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold transition-colors"
                          >
                            เปิดใบงาน
                          </button>
                          <button
                            onClick={() => setLeadToDelete(lead)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="ลบข้อมูลลูกค้านี้"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Detail Modal / Drawer */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  ใบงานคำขอติดตั้ง AIS Fibre
                </span>
                <h3 className="text-xl font-bold text-white font-mono">{selectedLead.tracking_id}</h3>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Location Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>ข้อมูลลูกค้า</span>
                </h4>
                <p>
                  <strong className="text-slate-400">ชื่อ-นามสกุล:</strong>{' '}
                  <span className="text-white font-semibold">{selectedLead.customer_name}</span>
                </p>
                <p className="flex items-center gap-2">
                  <strong className="text-slate-400">เบอร์โทรศัพท์:</strong>
                  <a href={`tel:${selectedLead.phone}`} className="text-emerald-400 font-bold hover:underline">
                    {selectedLead.phone}
                  </a>
                  <a
                    href={`https://line.me/R/ti/p/~${selectedLead.phone}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 rounded bg-[#06C755] text-white"
                    title="ทัก LINE"
                  >
                    <MessageCircle className="w-3 h-3" />
                  </a>
                </p>
                <p>
                  <strong className="text-slate-400">แพ็กเกจที่สนใจ:</strong>{' '}
                  <span className="text-slate-200">{selectedLead.package_name || '-'}</span>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>สถานที่ติดตั้ง</span>
                </h4>
                <p className="text-slate-200">
                  {selectedLead.house_no} {selectedLead.village} {selectedLead.street} ต.
                  {selectedLead.subdistrict} อ.{selectedLead.district} จ.{selectedLead.province}{' '}
                  {selectedLead.zipcode}
                </p>
                {selectedLead.gps_location && (
                  <p className="text-[11px] text-slate-400 font-mono">
                    พิกัด GPS: {selectedLead.gps_location}
                  </p>
                )}
                {selectedLead.location_details && (
                  <p className="text-[11px] text-slate-400">
                    จุดสังเกต: {selectedLead.location_details}
                  </p>
                )}
              </div>
            </div>

            {/* Workflow Status Controls */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>อัปเดตสถานะและมอบหมายงาน</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    สถานะใบงาน (Status) *
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as LeadStatus)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  >
                    {Object.entries(STATUS_CONFIG).map(([stKey, conf]) => (
                      <option key={stKey} value={stKey}>
                        {conf.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    มอบหมายพนักงานรับผิดชอบ (Assignee)
                  </label>
                  <select
                    value={editAssignedTo}
                    onChange={(e) => setEditAssignedTo(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">-- ยังไม่มอบหมาย --</option>
                    {allUsers.map((u) => (
                      <option key={u.id} value={u.name}>
                        {u.name} ({u.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  บันทึกข้อความภายใน / หมายเหตุการโทร (Admin Notes)
                </label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="เช่น เช็กคู่สาย DP เสาเบอร์ 14 แล้ว มีช่องว่างพร้อมติดตั้ง ลูกค้าขอนัดวันที่ 3 ก.ย."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Modal Actions with Delete Button */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setLeadToDelete(selectedLead)}
                className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>ลบข้อมูลคำขอนี้</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedLead(null)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:bg-slate-800"
                >
                  ปิดหน้าต่าง
                </button>
                <button
                  type="button"
                  disabled={savingEdit}
                  onClick={handleSaveLead}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{savingEdit ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>เพิ่มคำขอใหม่ (ลูกค้าโทรเข้า / Walk-in)</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">ชื่อ-นามสกุลลูกค้า *</label>
                <input
                  type="text"
                  required
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  placeholder="เช่น คุณกฤษณะ ใจดี"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">เบอร์โทรศัพท์ติดต่อ *</label>
                <input
                  type="tel"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="เช่น 0812345678"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">จังหวัด</label>
                  <input
                    type="text"
                    value={newProvince}
                    onChange={(e) => setNewProvince(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">อำเภอ / เขต</label>
                  <input
                    type="text"
                    value={newDistrict}
                    onChange={(e) => setNewDistrict(e.target.value)}
                    placeholder="เช่น บางกะปิ"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">แพ็กเกจที่สนใจ</label>
                <input
                  type="text"
                  value={newPackageName}
                  onChange={(e) => setNewPackageName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">หมายเหตุบันทึก</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="เช่น ลูกค้าสอบถามโปรย้ายค่าย ลด 50%"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-800"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={addingLead}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-md"
                >
                  {addingLead ? 'กำลังบันทึก...' : 'บันทึกคำขอ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Single Delete Confirmation Modal */}
      {leadToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/30 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-display">ยืนยันการลบข้อมูลลูกค้า</h3>
                <p className="text-xs text-slate-400">รายการนี้จะถูกลบออกจากระบบอย่างถาวร</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
              <p className="text-slate-300">
                <span className="text-slate-500">รหัสคำขอ:</span>{' '}
                <strong className="text-white font-mono">{leadToDelete.tracking_id}</strong>
              </p>
              <p className="text-slate-300">
                <span className="text-slate-500">ชื่อลูกค้า:</span>{' '}
                <strong className="text-white">{leadToDelete.customer_name}</strong>
              </p>
              <p className="text-slate-300">
                <span className="text-slate-500">เบอร์โทรศัพท์:</span>{' '}
                <span className="text-emerald-400 font-mono">{leadToDelete.phone}</span>
              </p>
              <p className="text-slate-300">
                <span className="text-slate-500">พื้นที่:</span>{' '}
                <span>{leadToDelete.district}, {leadToDelete.province}</span>
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setLeadToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:bg-slate-800 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleConfirmSingleDelete}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg transition-all flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{deleting ? 'กำลังลบ...' : 'ยืนยันการลบ'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {showBulkDeleteModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/30 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-display">ลบข้อมูลลูกค้าหลายรายการ</h3>
                <p className="text-xs text-slate-400">
                  คุณต้องการลบข้อมูลลูกค้าที่เลือกทั้งหมด {selectedLeadIds.length} รายการ หรือไม่?
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800">
              ⚠️ การลบนี้จะมีผลทันทีและไม่สามารถกู้คืนข้อมูลได้ ข้อมูลคำขอติดตั้งและประวัติทั้งหมดจะถูกลบออกจากระบบ
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setShowBulkDeleteModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:bg-slate-800 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleConfirmBulkDelete}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg transition-all flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{deleting ? 'กำลังลบ...' : `ยืนยันลบ (${selectedLeadIds.length} รายการ)`}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Confirmation Modal */}
      {showClearAllModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/50 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-display">ล้างข้อมูลลูกค้าทั้งหมด</h3>
                <p className="text-xs text-rose-400 font-semibold">การดำเนินการนี้จะลบคำขอทั้งหมด ({leads.length} รายการ)</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              ระบบจะลบข้อมูลลูกค้า คำขอเช็กพื้นที่ ใบสมัครติดตั้ง และประวัติทั้งหมดให้เป็นค่าว่าง (0 รายการ)
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setShowClearAllModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:bg-slate-800 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleConfirmClearAll}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg transition-all flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{deleting ? 'กำลังล้างข้อมูล...' : 'ยืนยันล้างข้อมูลทั้งหมด'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

