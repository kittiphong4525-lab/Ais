import React, { useState, useEffect } from 'react';
import { ApiService } from '../../services/api';
import { AdminDashboardStats, CoverageCheckLead } from '../../types';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  MapPin,
  Users,
  Award,
  Calendar,
  Download,
  DollarSign,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminReportsPage: React.FC = () => {
  const { allUsers } = useAuth();
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [leads, setLeads] = useState<CoverageCheckLead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
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
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !stats) {
    return <div className="p-8 text-center text-slate-500">กำลังประมวลผลรายงานสถิติ...</div>;
  }

  // Calculate province distribution
  const provinceCounts: Record<string, number> = {};
  leads.forEach((l) => {
    provinceCounts[l.province] = (provinceCounts[l.province] || 0) + 1;
  });

  const sortedProvinces = Object.entries(provinceCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-emerald-400" />
          <span>รายงานยอดขาย & วิเคราะห์ประสิทธิภาพ (Reports & Analytics)</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          รายงานวิเคราะห์อัตราการปิดการขาย (Conversion Funnel), พื้นที่ที่มีความต้องการสูงสุด และประสิทธิภาพรายบุคคล
        </p>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400">อัตราความสำเร็จโดยรวม (Lead-to-Install)</span>
          <p className="text-3xl font-black text-emerald-400 font-display">
            {stats.conversionRate}%
          </p>
          <p className="text-[11px] text-slate-500">
            จากทั้งหมด {stats.totalLeads} คำขอ สำเร็จ {stats.completedInstalls} งาน
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400">มูลค่าสัญญารายเดือนรวม (MRR)</span>
          <p className="text-3xl font-black text-amber-300 font-display">
            ฿{stats.totalMonthlyRevenue.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500">คำนวณจากเคสที่ติดตั้งสำเร็จ</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400">สถานะคำขอที่รอดำเนินการ</span>
          <p className="text-3xl font-black text-sky-400 font-display">
            {leads.filter((l) => l.status !== 'COMPLETED' && l.status !== 'CANCELLED').length} เคส
          </p>
          <p className="text-[11px] text-slate-500">คำขอใหม่และกำลังประสานงาน</p>
        </div>
      </div>

      {/* Conversion Funnel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Funnel */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Sales Conversion Funnel (ขั้นตอนการขายจริง)</span>
          </h3>

          <div className="space-y-3">
            {(() => {
              const total = stats.totalLeads;
              const step1 = total;
              const step2 = leads.filter((l) => ['CHECKING_AREA', 'WAITING_DOCUMENT', 'WAITING_CONFIRM', 'APPOINTMENT', 'INSTALLING', 'COMPLETED'].includes(l.status)).length;
              const step3 = leads.filter((l) => ['WAITING_CONFIRM', 'APPOINTMENT', 'INSTALLING', 'COMPLETED'].includes(l.status)).length;
              const step4 = leads.filter((l) => ['APPOINTMENT', 'INSTALLING', 'COMPLETED'].includes(l.status)).length;
              const step5 = stats.completedInstalls;

              const funnelItems = [
                { stage: '1. คำขอเช็กพื้นที่ใหม่ (Inquiries)', count: step1, pct: total > 0 ? 100 : 0, color: 'bg-emerald-500' },
                { stage: '2. ตรวจสอบคู่สาย & มีช่องว่าง (DP Available)', count: step2, pct: total > 0 ? Math.round((step2 / total) * 100) : 0, color: 'bg-teal-500' },
                { stage: '3. ยืนยันเอกสาร & สิทธิโปรโมชั่น', count: step3, pct: total > 0 ? Math.round((step3 / total) * 100) : 0, color: 'bg-sky-500' },
                { stage: '4. นัดหมายช่างติดตั้งสำเร็จ', count: step4, pct: total > 0 ? Math.round((step4 / total) * 100) : 0, color: 'bg-indigo-500' },
                { stage: '5. เดินสายเสร็จสมบูรณ์ & เปิดสัญญาณ (Done)', count: step5, pct: total > 0 ? Math.round((step5 / total) * 100) : 0, color: 'bg-emerald-400' },
              ];

              return funnelItems.map((f, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">{f.stage}</span>
                    <span className="text-white font-mono">{f.count} เคส ({f.pct}%)</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden">
                    <div
                      className={`h-full ${f.color} rounded-full transition-all duration-500`}
                      style={{ width: `${f.pct}%` }}
                    />
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>

        {/* Top Demanded Provinces */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>จังหวัดที่มีคำขอติดตั้งสูงสุด (Top Regions)</span>
          </h3>

          {sortedProvinces.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              ยังไม่มีข้อมูลจังหวัดจากคำขอ (จะแสดงผลอัตโนมัติเมื่อมีลูกค้าส่งคำขอเข้ามา)
            </div>
          ) : (
            <div className="space-y-3">
              {sortedProvinces.map(([prov, count], idx) => {
                const pct = stats.totalLeads > 0 ? Math.round((count / stats.totalLeads) * 100) : 0;
                return (
                  <div key={prov} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-200">
                        {idx + 1}. {prov}
                      </span>
                      <span className="text-emerald-400 font-mono">
                        {count} ราย ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Staff Performance Table */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Award className="w-4 h-4 text-emerald-400" />
          <span>ประสิทธิภาพทีมขายและแอดมิน (Staff Leaderboard)</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-3 px-3">พนักงาน</th>
                <th className="py-3 px-3">ตำแหน่ง</th>
                <th className="py-3 px-3">งานที่ดูแล</th>
                <th className="py-3 px-3">ติดตั้งสำเร็จ</th>
                <th className="py-3 px-3">อัตราสำเร็จ</th>
                <th className="py-3 px-3 text-right">ยอดขายรายเดือน (MRR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {allUsers.map((u, i) => {
                const userLeads = leads.filter(
                  (l) => l.assigned_to === u.id || l.assigned_to === u.name || l.assigned_to_name === u.name
                );
                const assignedCount = userLeads.length;
                const closedCount = userLeads.filter((l) => l.status === 'COMPLETED').length;
                const revenue = userLeads
                  .filter((l) => l.status === 'COMPLETED')
                  .reduce((acc, l) => acc + (l.package_price || 0), 0);
                const successRate = assignedCount > 0 ? Math.round((closedCount / assignedCount) * 100) : 0;
                return (
                  <tr key={u.id} className="hover:bg-slate-850/50">
                    <td className="py-3 px-3 font-semibold text-white flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center text-[10px]">
                        {i + 1}
                      </div>
                      <span>{u.name}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-400">{u.role}</td>
                    <td className="py-3 px-3 text-slate-300 font-mono">{assignedCount} เคส</td>
                    <td className="py-3 px-3 font-bold text-emerald-400 font-mono">{closedCount} เคส</td>
                    <td className="py-3 px-3 text-slate-200 font-mono">{successRate}%</td>
                    <td className="py-3 px-3 text-right font-bold text-amber-300 font-mono">
                      ฿{revenue.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
