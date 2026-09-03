import React, { useState } from 'react';
import { ApiService } from '../services/api';
import {
  PhoneCall,
  MessageCircle,
  MapPin,
  Clock,
  Mail,
  Send,
  CheckCircle2,
  Headphones,
  ShieldCheck,
} from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

interface ContactPageProps {
  onNavigate: (path: string, params?: any) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const { addToast } = useNotification();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('สอบถามโปรโมชั่น');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      addToast({ type: 'warning', title: 'กรุณากรอกชื่อและเบอร์โทรศัพท์' });
      return;
    }

    setSubmitting(true);
    try {
      await ApiService.createCoverageCheckLead({
        customer_name: name,
        phone,
        province: 'ไม่ได้ระบุ (ติดต่อสอบถาม)',
        district: '-',
        subdistrict: '-',
        location_details: `เรื่อง: ${subject} | ข้อความ: ${message}`,
        consent_contact: true,
      });

      setSubmitted(true);
      addToast({
        type: 'success',
        title: 'ส่งข้อความเรียบร้อยแล้ว',
        message: 'เจ้าหน้าที่จะติดต่อกลับโดยเร็วที่สุด',
      });
    } catch (err) {
      addToast({ type: 'error', title: 'เกิดข้อผิดพลาดในการส่งข้อความ' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
          <Headphones className="w-3.5 h-3.5" />
          <span>CONTACT DEALER</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-snug">
          <span className="text-lime-300 drop-shadow-[0_2px_12px_rgba(190,242,100,0.3)]">ติดต่อเรา</span>{' '}
          <span className="text-[#FF5500] drop-shadow-[0_2px_12px_rgba(255,85,0,0.4)]">AIS FIBRE 3 By โฮมไฟเบอร์เนต999</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 font-medium">
          รับติดเน็ตบ้านสมัคร ออนไลน์ได้ทั่วประเทศ ให้คำปรึกษาแพ็กเกจและบริการติดตั้งทั่วไทย
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Contact Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>ช่องทางการติดต่อโดยตรง</span>
            </h3>

            {/* Direct Cards */}
            <div className="space-y-3">
              <a
                href="tel:0621939199"
                className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-slate-950 border-2 border-emerald-400 hover:border-emerald-300 text-slate-200 transition-all group shadow-md"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-400 text-slate-950 flex items-center justify-center group-hover:scale-110 transition-transform font-black shrink-0">
                  <PhoneCall className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-emerald-300">โทรศัพท์ติดต่อฝ่ายขาย (สายด่วน)</p>
                  <p className="text-xl sm:text-2xl font-black text-white font-mono tracking-wide">062-193-9199</p>
                  <p className="text-xs text-slate-300">โทรปรึกษาและสมัครติดตั้งได้ทันที</p>
                </div>
              </a>

              <a
                href="tel:0935515442"
                className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-slate-950 to-emerald-950/40 border border-emerald-500/30 hover:border-emerald-400 text-slate-200 transition-all group shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform font-bold shrink-0">
                  <PhoneCall className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400">โทรศัพท์สำนักงานตัวแทน</p>
                  <p className="text-lg font-bold text-white font-mono tracking-wide">093-551-5442</p>
                  <p className="text-xs text-slate-400">ติดต่อสอบถามข้อมูลทั่วไป</p>
                </div>
              </a>

              <a
                href="https://line.me/ti/p/@aisfibre999"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 p-4 rounded-2xl bg-[#06C755]/15 border-2 border-[#06C755]/50 hover:border-[#06C755] text-slate-200 transition-all group shadow-md"
              >
                <div className="w-12 h-12 rounded-xl bg-[#06C755] text-white flex items-center justify-center group-hover:scale-110 transition-transform font-bold shrink-0">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-emerald-300">LINE Official Account</p>
                  <p className="text-xl sm:text-2xl font-black text-white tracking-wide">@aisfibre999</p>
                  <p className="text-xs text-slate-300">แชทสอบถาม เช็คสิทธิ์ ส่งเอกสารได้ทันที</p>
                </div>
              </a>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-slate-200">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400">ที่ตั้งสำนักงานตัวแทน</p>
                  <p className="text-xs font-semibold text-white leading-relaxed">
                    บริษัท โฮมไฟเบอร์เนต999 จำกัด 512 หมู่ 1 ถนนรักสงบ ตำบลวิศิษฐ์ อำเภอเมือง จังหวัดบึงกาฬ 38000
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-slate-200">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400">เวลาให้บริการ</p>
                  <p className="text-sm font-bold text-emerald-400">
                    เปิดให้บริการ ทุกวัน 08.00 - 17.00 น.
                  </p>
                  <p className="text-[10px] text-slate-400">รับติดเน็ตบ้านสมัคร ออนไลน์ได้ทั่วประเทศ</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Message Form */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Mail className="w-5 h-5 text-emerald-400" />
              <span>ส่งข้อความให้เจ้าหน้าที่ติดต่อกลับ</span>
            </h3>

            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-bold text-white">ได้รับข้อความเรียบร้อยแล้ว</h4>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  เจ้าหน้าที่ฝ่ายบริการลูกค้าจะโทรศัพท์ติดต่อกลับที่เบอร์ <strong>{phone}</strong> โดยเร็วที่สุด
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setName('');
                    setPhone('');
                    setMessage('');
                  }}
                  className="px-5 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold"
                >
                  ส่งข้อความอื่นเพิ่มเติม
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      ชื่อ-นามสกุล *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="เช่น คุณธนกร วัฒนา"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      เบอร์โทรศัพท์ติดต่อ *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="เช่น 0891234567"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    เรื่องที่ต้องการติดต่อ
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="สอบถามโปรโมชั่นเน็ตบ้าน">สอบถามโปรโมชั่นเน็ตบ้าน</option>
                    <option value="สนใจย้ายค่ายมารับส่วนลด 50%">สนใจย้ายค่ายมารับส่วนลด 50%</option>
                    <option value="สอบถามพื้นที่คู่สายและการติดตั้ง">สอบถามพื้นที่คู่สายและการติดตั้ง</option>
                    <option value="ปรึกษาแพ็กเกจสำหรับธุรกิจ SME">ปรึกษาแพ็กเกจสำหรับธุรกิจ SME</option>
                    <option value="เรื่องอื่น ๆ">เรื่องอื่น ๆ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    ข้อความหรือคำถามเพิ่มเติม
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="ระบุที่อยู่หรือคำถามที่ต้องการให้เจ้าหน้าที่ช่วยดูแล..."
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'กำลังส่งข้อมูล...' : 'ส่งข้อความติดต่อกลับ'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
