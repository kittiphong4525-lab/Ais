import React, { useState, useEffect } from 'react';
import { ApiService } from '../../services/api';
import { AdminDashboardStats, CoverageCheckLead, LeadStatus } from '../../types';
import { StatusBadge, STATUS_CONFIG } from '../../components/common/StatusBadge';
import {
  Users,
  FileCheck,
  TrendingUp,
  DollarSign,
  PhoneCall,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Zap,
  Plus,
  RefreshCw,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

interface AdminDashboardPageProps {
  onSelectTab: (tab: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onSelectTab }) => {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [leads, setLeads] = useState<CoverageCheckLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [leadToDelete, setLeadToDelete] = useState<CoverageCheckLead | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { addToast } = useNotification();

  const loadData = async () => {
    setLoading(true);
    try {
      const [s, l] = await Promise.all([
        ApiService.getDashboardStats(),
        ApiService.getCoverageCheckLeads(),
      ]);
      setStats(s);
      setLeads(l);
    } catch (err) {
      console.error(err);
      addToast({ type: 'error', title: 'ไม่สามารถโหลดข้อมูลสถิติได้' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleQuickStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    try {
      await ApiService.updateLeadStatus(leadId, newStatus);
      addToast({
        type: 'success',
        title: 'อัปเดตสถานะสำเร็จ',
        message: `เปลี่ยนสถานะเป็น ${STATUS_CONFIG[newStatus].label}`,
      });
      loadData();
    } catch (err) {
      addToast({ type: 'error', title: 'เกิดข้อผิดพลาดในการเปลี่ยนสถานะ' });
    }
  };

  const handleConfirmDelete = async () => {
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
        message: `ลบข้อมูล ${leadToDelete.customer_name} เรียบร้อยแล้ว`,
      });
      setLeadToDelete(null);
      loadData();
    } catch (err) {
      console.error(err);
      addToast({ type: 'error', title: 'เกิดข้อผิดพลาดในการลบข้อมูล' });
    } finally {
      setDeleting(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-slate-900 rounded-2xl" />
          ))}
        </div>
        <div className="h-80 bg-slate-900 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Welcome & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-display">
            แดชบอร์ดสรุปยอดขาย & ลูกค้า
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            ข้อมูลอัปเดตล่าสุด ณ วันที่ {new Date().toLocaleDateString('th-TH', { dateStyle: 'long' })}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
            title="รีเฟรชข้อมูล"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => onSelectTab('leads')}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>ดูรายการลูกค้าทั้งหมด ({leads.length})</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">คำขอทั้งหมด</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-white font-display">
              {stats.totalLeads.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-emerald-400">+{stats.todayLeads} วันนี้</span>
          </div>
          <p className="text-[11px] text-slate-500">คำขอเช็กพื้นที่และสมัครติดตั้ง</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">ใบสมัครสำเร็จ (Completed)</span>
            <div className="p-2 rounded-xl bg-green-500/10 text-green-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-green-400 font-display">
              {stats.completedInstalls.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400">เคส</span>
          </div>
          <p className="text-[11px] text-slate-500">ติดตั้งและเปิดสัญญาณเรียบร้อย</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">อัตราปิดการขาย (Conversion)</span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-sky-400 font-display">
              {stats.conversionRate}%
            </span>
            <span className="text-xs text-slate-400">เฉลี่ย</span>
          </div>
          <p className="text-[11px] text-slate-500">จากคำขอทั้งหมดสู่การติดตั้งสำเร็จ</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">มูลค่าสัญญารายเดือนรวม (MRR)</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-amber-300 font-display">
              ฿{stats.totalMonthlyRevenue.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400">/เดือน</span>
          </div>
          <p className="text-[11px] text-slate-500">จากลูกค้าที่ติดตั้งสำเร็จทั้งหมด</p>
        </div>
      </div>

      {/* Status Breakdown Bar */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center justify-between">
          <span>สถานะงานในระบบ CRM ปัจจุบัน</span>
          <button
            onClick={() => onSelectTab('leads')}
            className="text-xs text-emerald-400 hover:underline normal-case font-medium"
          >
            เปิดตารางจัดการงาน CRM →
          </button>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {Object.entries(stats.leadsByStatus).map(([statusKey, count]) => {
            const status = statusKey as LeadStatus;
            const config = STATUS_CONFIG[status] || STATUS_CONFIG.NEW;
            return (
              <div
                key={statusKey}
                onClick={() => onSelectTab('leads')}
                className={`p-3 rounded-2xl border cursor-pointer hover:scale-[1.02] transition-transform ${config.bg} ${config.border}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${config.text}`}>{config.label}</span>
                  <span className={`text-lg font-black ${config.text}`}>{count}</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 truncate">{config.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Leads Table with 1-click status changer */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            รายการคำขอล่าสุด (10 รายการ)
          </h3>
          <button
            onClick={() => onSelectTab('leads')}
            className="text-xs text-emerald-400 hover:underline font-semibold"
          >
            ดูทั้งหมด ({leads.length})
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-3 px-3">รหัสติดตาม</th>
                <th className="py-3 px-3">ชื่อลูกค้า</th>
                <th className="py-3 px-3">เบอร์โทรศัพท์</th>
                <th className="py-3 px-3">พื้นที่ติดตั้ง</th>
                <th className="py-3 px-3">แพ็กเกจ</th>
                <th className="py-3 px-3">สถานะ</th>
                <th className="py-3 px-3 text-right">เปลี่ยนสถานะด่วน</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-xs">
                    ยังไม่มีคำขอติดตั้งใหม่เข้ามา (ข้อมูลจะปรากฏขึ้นอัตโนมัติเมื่อมีผู้สนใจยื่นคำขอผ่านหน้าเว็บไซต์)
                  </td>
                </tr>
              ) : (
                leads.slice(0, 10).map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-300">
                      {lead.tracking_id}
                    </td>
                    <td className="py-3 px-3 font-semibold text-white">
                      {lead.customer_name}
                    </td>
                    <td className="py-3 px-3">
                      <a
                        href={`tel:${lead.phone}`}
                        className="text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        <PhoneCall className="w-3 h-3" />
                        <span>{lead.phone}</span>
                      </a>
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      {lead.district}, {lead.province}
                    </td>
                    <td className="py-3 px-3 text-slate-200">
                      {lead.package_name || '-'}
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={lead.status} size="sm" />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <select
                          value={lead.status}
                          onChange={(e) => handleQuickStatusChange(lead.id, e.target.value as LeadStatus)}
                          className="text-[11px] py-1 px-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
                        >
                          {Object.keys(STATUS_CONFIG).map((st) => (
                            <option key={st} value={st}>
                              {STATUS_CONFIG[st as LeadStatus].label}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => setLeadToDelete(lead)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="ลบข้อมูลลูกค้านี้"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
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
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg transition-all flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{deleting ? 'กำลังลบ...' : 'ยืนยันการลบ'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
