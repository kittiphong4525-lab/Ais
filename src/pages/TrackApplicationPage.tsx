import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api';
import { CoverageCheckLead, CustomerApplication, LeadStatus } from '../types';
import { STATUS_CONFIG, StatusBadge } from '../components/common/StatusBadge';
import {
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  PhoneCall,
  MessageCircle,
  FileText,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  User,
} from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

interface TrackApplicationPageProps {
  initialTrackingId?: string;
  onNavigate: (path: string, params?: any) => void;
}

export const TrackApplicationPage: React.FC<TrackApplicationPageProps> = ({
  initialTrackingId = '',
  onNavigate,
}) => {
  const { addToast } = useNotification();
  const [searchQuery, setSearchQuery] = useState(initialTrackingId);
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<{
    lead?: CoverageCheckLead | null;
    application?: CustomerApplication | null;
  } | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (initialTrackingId) {
      handleSearch(initialTrackingId);
    }
  }, [initialTrackingId]);

  const handleSearch = async (queryToSearch?: string) => {
    const q = (queryToSearch || searchQuery).trim();
    if (!q) {
      addToast({ type: 'warning', title: 'กรุณากรอกรหัสติดตามคำขอ หรือเบอร์โทรศัพท์' });
      return;
    }

    setLoading(true);
    setHasSearched(true);
    try {
      const res = await ApiService.trackApplication(q);
      setSearchResult(res);
      if (!res.lead && !res.application) {
        addToast({
          type: 'info',
          title: 'ไม่พบข้อมูลคำขอ',
          message: 'กรุณาตรวจสอบรหัสติดตามหรือเบอร์โทรศัพท์อีกครั้ง',
        });
      }
    } catch (err) {
      console.error(err);
      addToast({ type: 'error', title: 'เกิดข้อผิดพลาดในการค้นหา' });
    } finally {
      setLoading(false);
    }
  };

  const stepsOrder: LeadStatus[] = [
    'NEW',
    'CHECKING_AREA',
    'CONTACTING',
    'APPOINTMENT',
    'INSTALLING',
    'COMPLETED',
  ];

  const normalizeStatus = (status?: string): LeadStatus => {
    if (!status) return 'NEW';
    if (status === 'SUBMITTED') return 'NEW';
    if (status === 'DOCUMENT_CHECK') return 'WAITING_DOCUMENT';
    if (status === 'APPROVED') return 'WAITING_CONFIRM';
    if (status === 'REJECTED') return 'CANCELLED';
    return (status as LeadStatus) || 'NEW';
  };

  const currentStatus: LeadStatus = searchResult?.application
    ? normalizeStatus(searchResult.application.status)
    : searchResult?.lead
    ? normalizeStatus(searchResult.lead.status)
    : 'NEW';

  const isCancelled = currentStatus === 'CANCELLED';

  const getStepIndex = (status: LeadStatus) => {
    const map: Record<LeadStatus, number> = {
      NEW: 0,
      CONTACTING: 1,
      CHECKING_AREA: 1,
      WAITING_DOCUMENT: 2,
      WAITING_CONFIRM: 2,
      APPOINTMENT: 3,
      INSTALLING: 4,
      COMPLETED: 5,
      CANCELLED: -1,
    };
    return map[status] ?? 0;
  };

  const activeStepIdx = getStepIndex(currentStatus);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
          <Search className="w-3.5 h-3.5" />
          <span>STATUS TRACKING</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-snug">
          <span className="text-lime-300 drop-shadow-[0_2px_12px_rgba(190,242,100,0.3)]">ติดตามสถานะ</span>{' '}
          <span className="text-[#FF5500] drop-shadow-[0_2px_12px_rgba(255,85,0,0.4)]">คำขอติดตั้งเน็ตบ้าน</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          ตรวจสอบความคืบหน้าการเช็กคู่สาย และสถานะการนัดหมายทีมช่างแบบเรียลไทม์
        </p>
      </div>

      {/* Search Bar */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl max-w-2xl mx-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="กรอกรหัสติดตาม (เช่น AIS-20260830-00001) หรือ เบอร์โทรศัพท์"
              className="w-full pl-10 pr-3 py-3 text-xs sm:text-sm rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all whitespace-nowrap"
          >
            {loading ? 'กำลังค้นหา...' : 'ตรวจสอบสถานะ'}
          </button>
        </form>

        {/* Helpful search hint */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2 flex-wrap text-xs text-slate-400">
          <span className="text-slate-300 font-medium">รูปแบบรหัสที่ค้นหาได้:</span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px]">
            AIS-YYYYMMDD-XXXXX
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px]">
            AIS-APP-YYYYMMDD-XXXXX
          </span>
          <span className="text-slate-500">หรือเบอร์โทรศัพท์ที่ใช้ลงทะเบียน</span>
        </div>
      </div>

      {/* Result Display */}
      {hasSearched && !searchResult?.lead && !searchResult?.application && (
        <div className="text-center py-12 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-3 max-w-2xl mx-auto">
          <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
          <h3 className="text-base font-bold text-white">ไม่พบข้อมูลตามที่ระบุ</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            หากคุณเพิ่งส่งคำขอ อาจใช้เวลาประมวลผลประมาณ 1-2 นาที หรือสามารถติดต่อเจ้าหน้าที่โดยตรงได้ที่ 093-551-5442
          </p>
        </div>
      )}

      {(searchResult?.lead || searchResult?.application) && (
        <div className="rounded-3xl bg-slate-900 border border-emerald-500/30 p-6 sm:p-10 shadow-2xl space-y-8 animate-in fade-in duration-300">
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                รายละเอียดคำขอติดตั้ง
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white font-mono mt-0.5">
                {searchResult.application?.tracking_id || searchResult.lead?.tracking_id}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                ยื่นคำขอเมื่อ {new Date(searchResult.application?.created_at || searchResult.lead?.created_at || '').toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            <div>
              <StatusBadge status={currentStatus} size="lg" />
            </div>
          </div>

          {/* Timeline */}
          {isCancelled ? (
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-200 flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-rose-400 shrink-0" />
              <div>
                <p className="font-bold text-rose-300">คำขอนี้ถูกยกเลิกแล้ว</p>
                <p className="text-[11px] text-rose-200/80">
                  {searchResult.lead?.admin_notes || 'เนื่องจากอยู่นอกพื้นที่คู่สาย หรือลูกค้ายกเลิกคำขอ'}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                ขั้นตอนการดำเนินงาน (Timeline)
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                {[
                  { title: 'รับคำขอ', desc: 'เข้าระบบแล้ว' },
                  { title: 'เช็กคู่สาย', desc: 'วิศวกรตรวจสอบ' },
                  { title: 'ยืนยันสิทธิ์', desc: 'ติดต่อลูกค้า' },
                  { title: 'นัดหมายช่าง', desc: 'ลงตารางงาน' },
                  { title: 'เข้าติดตั้ง', desc: 'เดินสายไฟเบอร์' },
                  { title: 'เสร็จสมบูรณ์', desc: 'เปิดสัญญาณ' },
                ].map((st, idx) => {
                  const isPast = idx < activeStepIdx;
                  const isCurrent = idx === activeStepIdx;
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border text-center space-y-1 transition-all ${
                        isPast
                          ? 'bg-emerald-950/40 border-emerald-500/50 text-slate-200'
                          : isCurrent
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 ring-2 ring-emerald-500/30'
                          : 'bg-slate-950/50 border-slate-800 text-slate-500'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full mx-auto flex items-center justify-center text-[10px] font-bold ${
                          isPast
                            ? 'bg-emerald-500 text-slate-950'
                            : isCurrent
                            ? 'bg-emerald-400 text-slate-950 animate-pulse'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {isPast ? '✓' : idx + 1}
                      </div>
                      <p className="text-xs font-bold truncate">{st.title}</p>
                      <p className="text-[10px] text-slate-400">{st.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Details Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/70 p-6 rounded-2xl border border-slate-800 text-xs">
            <div className="space-y-3">
              <h4 className="font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                <User className="w-4 h-4 text-emerald-400" />
                <span>ข้อมูลผู้สมัคร</span>
              </h4>
              <p>
                <strong className="text-slate-400">ชื่อลูกค้า:</strong>{' '}
                <span className="text-slate-200 font-semibold">
                  {searchResult.application?.customer_name || searchResult.lead?.customer_name}
                </span>
              </p>
              <p>
                <strong className="text-slate-400">เบอร์โทรศัพท์:</strong>{' '}
                <span className="text-slate-200 font-semibold">
                  {searchResult.application?.phone || searchResult.lead?.phone}
                </span>
              </p>
              <p>
                <strong className="text-slate-400">แพ็กเกจที่สนใจ:</strong>{' '}
                <span className="text-emerald-400 font-semibold">
                  {searchResult.application?.package_name || searchResult.lead?.package_name || 'AIS Fibre Package'}
                </span>
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>สถานที่ติดตั้ง & นัดหมาย</span>
              </h4>
              <p>
                <strong className="text-slate-400">ที่อยู่:</strong>{' '}
                <span className="text-slate-200">
                  {searchResult.application?.house_no || searchResult.lead?.house_no || ''}{' '}
                  {searchResult.application?.street || searchResult.lead?.street || ''} ต.
                  {searchResult.application?.subdistrict || searchResult.lead?.subdistrict} อ.
                  {searchResult.application?.district || searchResult.lead?.district} จ.
                  {searchResult.application?.province || searchResult.lead?.province}
                </span>
              </p>
              {searchResult.application?.preferred_date && (
                <p>
                  <strong className="text-slate-400">วันเวลานัดหมายช่าง:</strong>{' '}
                  <span className="text-emerald-300 font-semibold">
                    {searchResult.application.preferred_date} ({searchResult.application.preferred_time_slot})
                  </span>
                </p>
              )}
              {searchResult.lead?.admin_notes && (
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300">
                  <strong className="text-emerald-400">บันทึกจากเจ้าหน้าที่:</strong> {searchResult.lead.admin_notes}
                </div>
              )}
            </div>
          </div>

          {/* Contact Support */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/20">
            <div className="flex items-center gap-3">
              <PhoneCall className="w-5 h-5 text-emerald-400 shrink-0" />
              <p className="text-xs text-slate-300">
                ต้องการเลื่อนนัดหมาย หรือสอบถามเพิ่มเติม โทร <strong>093-551-5442</strong> หรือ LINE: <strong>@aisfibre999</strong>
              </p>
            </div>
            <a
              href="https://line.me/ti/p/@aisfibre999"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-[#06C755] hover:bg-[#05b04a] text-white font-bold text-xs shadow transition-colors whitespace-nowrap"
            >
              แชท LINE (@aisfibre999)
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
