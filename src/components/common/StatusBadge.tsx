import React from 'react';
import { LeadStatus } from '../../types';

interface StatusBadgeProps {
  status: LeadStatus;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

export const STATUS_CONFIG: Record<
  LeadStatus,
  { label: string; bg: string; text: string; border: string; dot: string; desc: string }
> = {
  NEW: {
    label: 'คำขอใหม่',
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    dot: 'bg-emerald-400',
    desc: 'ลูกค้าเพิ่งส่งข้อมูลเข้ามา รอพนักงานรับเรื่อง',
  },
  CONTACTING: {
    label: 'กำลังติดต่อลูกค้า',
    bg: 'bg-sky-500/15',
    text: 'text-sky-400',
    border: 'border-sky-500/30',
    dot: 'bg-sky-400',
    desc: 'เจ้าหน้าที่กำลังโทรศัพท์หรือทัก LINE ลูกค้า',
  },
  CHECKING_AREA: {
    label: 'กำลังเช็กพื้นที่/คู่สาย',
    bg: 'bg-blue-500/15',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
    dot: 'bg-blue-400',
    desc: 'ตรวจสอบจุดเชื่อมต่อ DP / ความยาวสายไฟเบอร์',
  },
  WAITING_DOCUMENT: {
    label: 'รอเอกสารบัตรประชาชน',
    bg: 'bg-purple-500/15',
    text: 'text-purple-400',
    border: 'border-purple-500/30',
    dot: 'bg-purple-400',
    desc: 'รอภาพถ่ายบัตรประชาชนเพื่อเปิดใบงาน',
  },
  WAITING_CONFIRM: {
    label: 'รอยืนยันนัดหมาย',
    bg: 'bg-amber-500/15',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    dot: 'bg-amber-400',
    desc: 'คู่สายพร้อม รอคอนเฟิร์มวันเวลาที่ลูกค้าสะดวก',
  },
  APPOINTMENT: {
    label: 'นัดติดตั้งแล้ว',
    bg: 'bg-indigo-500/15',
    text: 'text-indigo-400',
    border: 'border-indigo-500/30',
    dot: 'bg-indigo-400',
    desc: 'ลงตารางนัดช่างเรียบร้อยแล้ว',
  },
  INSTALLING: {
    label: 'ช่างกำลังดำเนินการติดตั้ง',
    bg: 'bg-teal-500/15',
    text: 'text-teal-400',
    border: 'border-teal-500/30',
    dot: 'bg-teal-400',
    desc: 'ทีมช่างกำลังเดินสายและติดตั้งเราเตอร์ที่บ้านลูกค้า',
  },
  COMPLETED: {
    label: 'ติดตั้งสำเร็จ',
    bg: 'bg-green-500/20',
    text: 'text-green-300',
    border: 'border-green-500/40',
    dot: 'bg-green-400',
    desc: 'เปิดสัญญาณใช้งานเรียบร้อยแล้ว',
  },
  CANCELLED: {
    label: 'ยกเลิกคำขอ',
    bg: 'bg-rose-500/15',
    text: 'text-rose-400',
    border: 'border-rose-500/30',
    dot: 'bg-rose-400',
    desc: 'ยกเลิกคำขอเนื่องจากพื้นที่ไม่อำนวยหรือลูกค้าเปลี่ยนใจ',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', showDot = true }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.NEW;

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 font-medium gap-1.5',
    md: 'text-xs px-2.5 py-1 font-medium gap-2',
    lg: 'text-sm px-3.5 py-1.5 font-semibold gap-2.5',
  };

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border whitespace-nowrap ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]}`}
    >
      {showDot && (
        <span
          className={`rounded-full shrink-0 ${config.dot} ${dotSizes[size]} ${
            status === 'INSTALLING' || status === 'CONTACTING' ? 'animate-pulse' : ''
          }`}
        />
      )}
      <span>{config.label}</span>
    </span>
  );
};
