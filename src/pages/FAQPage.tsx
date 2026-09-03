import React, { useState, useEffect } from 'react';
import { FAQItem } from '../types';
import { ApiService } from '../services/api';
import {
  HelpCircle,
  ChevronDown,
  Search,
  MessageCircle,
  PhoneCall,
  Sparkles,
} from 'lucide-react';

interface FAQPageProps {
  onNavigate: (path: string, params?: any) => void;
}

export const FAQPage: React.FC<FAQPageProps> = ({ onNavigate }) => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  useEffect(() => {
    const fetchFaqs = async () => {
      setLoading(true);
      try {
        const list = await ApiService.getFaqs();
        setFaqs(list);
        if (list.length > 0) setOpenId(list[0].id);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  const categories = ['ALL', 'การสมัครและเอกสาร', 'การติดตั้ง', 'อุปกรณ์และเราเตอร์', 'ค่าบริการและสัญญา'];

  const filteredFaqs = faqs.filter((item) => {
    const matchCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchQuery =
      !searchQuery.trim() ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>FREQUENTLY ASKED QUESTIONS</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-snug">
          <span className="text-lime-300 drop-shadow-[0_2px_12px_rgba(190,242,100,0.3)]">คำถามที่พบบ่อย</span>{' '}
          <span className="text-[#FF5500] drop-shadow-[0_2px_12px_rgba(255,85,0,0.4)]">(FAQ)</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          รวบรวมข้อสงสัยเกี่ยวกับการสมัครติดตั้ง เอกสารที่ต้องใช้ ระยะเวลาดำเนินการ และการใช้งานอุปกรณ์
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-xl mx-auto">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ค้นหาคำถาม เช่น ค่าแรกเข้า, เปลี่ยนเราเตอร์, ย้ายค่าย..."
          className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm rounded-2xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Category Filter */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-emerald-400 via-lime-400 to-orange-500 hover:from-emerald-300 hover:via-lime-300 hover:to-orange-400 text-slate-950 border-transparent font-black shadow-lg shadow-orange-500/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {cat === 'ALL' ? 'คำถามทั้งหมด' : cat}
          </button>
        ))}
      </div>

      {/* FAQ Accordion List */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 rounded-2xl bg-slate-900 border border-slate-800" />
          ))}
        </div>
      ) : filteredFaqs.length === 0 ? (
        <div className="text-center py-12 rounded-2xl bg-slate-900/50 border border-slate-800">
          <p className="text-slate-400 text-sm">ไม่พบคำถามที่ตรงกับการค้นหา</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden transition-colors hover:border-slate-700"
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left transition-colors"
                >
                  <span className="text-sm sm:text-base font-bold text-white">
                    {faq.question}
                  </span>
                  <div
                    className={`p-1.5 rounded-lg bg-slate-800 text-emerald-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 bg-emerald-500/20' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 animate-in fade-in duration-200">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Still have questions? */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-base font-bold text-white">ยังมีคำถามข้อสงสัยอื่น ๆ อยู่ใช่ไหม?</h3>
          <p className="text-xs text-slate-300">ทีมงานยินดีให้คำแนะนำ ทุกวัน 08.00 - 17.00 น.</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="tel:0935515442"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
            <span>093-551-5442</span>
          </a>
          <a
            href="https://line.me/ti/p/@aisfibre999"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl bg-[#06C755] hover:bg-[#05b04a] text-white text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>LINE: @aisfibre999</span>
          </a>
        </div>
      </div>
    </div>
  );
};
