import React, { useState } from 'react';
import { X, MessageCircle, Phone, CheckCircle2, QrCode, ExternalLink, Send } from 'lucide-react';
import { ApiService } from '../../services/api';

interface LineContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageName?: string;
}

export const LineContactModal: React.FC<LineContactModalProps> = ({
  isOpen,
  onClose,
  packageName,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState(packageName ? `สนใจแพ็กเกจ: ${packageName}` : '');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmitCallback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    setLoading(true);
    try {
      await ApiService.createCoverageCheckLead({
        customer_name: name,
        phone: phone,
        province: 'กรุงเทพมหานคร',
        district: 'ขอติดต่อทาง LINE/โทรกลับ',
        subdistrict: '',
        location_details: note || packageName || 'ขอคำปรึกษาแพ็กเกจ AIS Fibre 3',
        package_name: packageName || 'AIS 3BB FIBRE 3',
        consent_contact: true,
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/80 text-left overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glowing top backdrop */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#06C755] via-emerald-400 to-teal-400" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#06C755] flex items-center justify-center text-white shadow-lg shadow-[#06C755]/30">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#06C755]/20 text-[#06C755] border border-[#06C755]/30 uppercase tracking-wider">
                  LINE Official @aisfibrefanclub
                </span>
                <h3 className="text-xl font-black text-white mt-1">
                  ติดต่อฝ่ายขาย AIS FIBRE 3
                </h3>
              </div>
            </div>

            {packageName && (
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs">
                <span className="font-semibold text-slate-300">แพ็กเกจที่คุณสนใจ: </span>
                <strong className="text-emerald-300 font-bold">{packageName}</strong>
              </div>
            )}

            {/* Direct Line Action Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#06C755]/15 to-emerald-950/40 border border-[#06C755]/30 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className="w-24 h-24 rounded-xl bg-white p-2 flex items-center justify-center shrink-0 shadow-md">
                <div className="w-full h-full bg-slate-900 rounded flex flex-col items-center justify-center text-white text-[10px] text-center font-mono font-bold leading-tight p-1">
                  <QrCode className="w-8 h-8 text-[#06C755] mb-0.5" />
                  <span>@aisfibrefanclub</span>
                </div>
              </div>

              <div className="space-y-2 flex-1">
                <p className="text-xs text-slate-300">
                  สแกน QR Code หรือกดปุ่มด้านล่างเพื่อเปิดแชท LINE คุยกับเจ้าหน้าที่ได้ทันที (เปิดบริการ ทุกวัน 08.00 - 17.00 น.)
                </p>
                <a
                  href="https://line.me/ti/p/@aisfibrefanclub"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-[#06C755] hover:bg-[#05b34c] text-white text-xs font-bold shadow-lg shadow-[#06C755]/25 transition-all transform active:scale-98"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>เปิด LINE แชททันที (@aisfibrefanclub)</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>
              </div>
            </div>

            {/* Quick Callback Form */}
            <div className="pt-2 border-t border-slate-800">
              <p className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>หรือให้เจ้าหน้าที่โทรติดต่อกลับด่วนภายใน 5 นาที</span>
              </p>

              <form onSubmit={handleSubmitCallback} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <input
                      type="text"
                      placeholder="ชื่อ-นามสกุล ของคุณ *"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700 focus:border-emerald-400 text-white text-xs placeholder:text-slate-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="เบอร์โทรศัพท์มือถือ *"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700 focus:border-emerald-400 text-white text-xs placeholder:text-slate-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="ข้อความเพิ่มเติม / เวลาที่สะดวกให้โทรกลับ"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950/70 border border-slate-700 focus:border-emerald-400 text-white text-xs placeholder:text-slate-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{loading ? 'กำลังส่งข้อมูล...' : 'ส่งคำขอให้เจ้าหน้าที่โทรกลับ'}</span>
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-500/10">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-white">ส่งข้อมูลเรียบร้อยแล้ว</h4>
            <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
              เจ้าหน้าที่ฝ่ายบริการลูกค้า AIS 3BB FIBRE 3 จะติดต่อกลับคุณ <strong className="text-white">{name}</strong> ที่เบอร์ <strong className="text-emerald-400">{phone}</strong> ภายใน 5-15 นาที
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <a
                href="https://line.me/ti/p/@aisfibrefanclub"
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-xl bg-[#06C755] text-white text-xs font-bold flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>แชท LINE ต่อทันที</span>
              </a>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
