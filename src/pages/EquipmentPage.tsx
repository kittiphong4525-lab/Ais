import React, { useState, useEffect } from 'react';
import { EquipmentItem } from '../types';
import { ApiService } from '../services/api';
import {
  Router,
  Tv,
  Wifi,
  Radio,
  CheckCircle2,
  Zap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface EquipmentPageProps {
  onNavigate: (path: string, params?: any) => void;
}

export const EquipmentPage: React.FC<EquipmentPageProps> = ({ onNavigate }) => {
  const [equipmentList, setEquipmentList] = useState<EquipmentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEquipment = async () => {
      setLoading(true);
      try {
        const list = await ApiService.getEquipmentList();
        setEquipmentList(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEquipment();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
          <Router className="w-3.5 h-3.5" />
          <span>HARDWARE & DEVICES</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-snug">
          <span className="text-lime-300 drop-shadow-[0_2px_12px_rgba(190,242,100,0.3)]">อุปกรณ์เน็ตบ้าน</span>{' '}
          <span className="text-[#FF5500] drop-shadow-[0_2px_12px_rgba(255,85,0,0.4)]">AIS FIBRE 3</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          อุปกรณ์เราเตอร์ WiFi 6 มาตรฐานระดับโลกและกล่อง AIS PLAYBOX 4K มั่นใจได้ในความเร็ว เสถียรภาพ และความปลอดภัย
        </p>
      </div>

      {/* Equipment Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-96 rounded-2xl bg-slate-900 border border-slate-800" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {equipmentList.map((eq) => (
            <div
              key={eq.id}
              className="rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 p-6 flex flex-col justify-between shadow-xl transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="space-y-4">
                {/* Image */}
                <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-950 border border-slate-800">
                  <img
                    src={eq.image}
                    alt={eq.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900/90 text-emerald-400 border border-emerald-500/30">
                      {eq.category}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {eq.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {eq.description}
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    คุณสมบัติเด่น
                  </p>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {(eq.features || eq.highlights || []).map((feat: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom package link */}
              <div className="pt-6 border-t border-slate-800/80 mt-6 flex items-center justify-between">
                <span className="text-[11px] text-emerald-400 font-medium">ยืมฟรีในแพ็กเกจ</span>
                <button
                  onClick={() => onNavigate('/packages')}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <span>ดูแพ็กเกจ</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
