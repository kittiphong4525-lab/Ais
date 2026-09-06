import React, { useState, useEffect } from 'react';
import { ArticleItem } from '../types';
import { ApiService } from '../services/api';
import {
  Newspaper,
  Calendar,
  Eye,
  ChevronRight,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface ArticlesPageProps {
  onNavigate: (path: string, params?: any) => void;
}

export const ArticlesPage: React.FC<ArticlesPageProps> = ({ onNavigate }) => {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const list = await ApiService.getArticles();
        setArticles(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const categoryFilters = [
    { id: 'ALL', label: 'บทความทั้งหมด' },
    { id: 'WIFI', label: 'เทคนิค WiFi & เราเตอร์' },
    { id: 'INTERNET', label: 'เลือกสปีด & แพ็กเกจ' },
    { id: 'GAMING', label: 'เกมมิ่ง & ลดปิง' },
    { id: 'SMART_HOME', label: 'สมาร์ทโฮม & CCTV' },
  ];

  const filteredArticles = selectedCategory === 'ALL'
    ? articles
    : articles.filter((a) => a.category === selectedCategory || (a.category && a.category.toUpperCase() === selectedCategory));

  const getCategoryLabel = (cat: string) => {
    switch (cat?.toUpperCase()) {
      case 'WIFI':
        return 'เทคนิค WiFi & เราเตอร์';
      case 'INTERNET':
        return 'เลือกสปีด & แพ็กเกจ';
      case 'GAMING':
        return 'เกมมิ่ง & ลดปิง';
      case 'SMART_HOME':
        return 'สมาร์ทโฮม & CCTV';
      default:
        return cat || 'สาระน่ารู้';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>KNOWLEDGE & GUIDES</span>
        </div>
        <h1 className="flex flex-row flex-nowrap items-center justify-center gap-1.5 sm:gap-2.5 whitespace-nowrap text-base sm:text-2xl md:text-3xl lg:text-5xl font-black tracking-tight leading-snug">
          <span className="text-lime-300 drop-shadow-[0_2px_12px_rgba(190,242,100,0.3)] shrink-0 whitespace-nowrap">บทความ & สาระน่ารู้</span>
          <span className="text-[#FF5500] drop-shadow-[0_2px_12px_rgba(255,85,0,0.4)] shrink-0 whitespace-nowrap">เทคนิคเน็ตบ้าน</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          เทคนิคการวางเราเตอร์ WiFi ในบ้าน วิธีแก้ปัญหาเน็ตช้า สปีดไม่เต็ม และคำแนะนำการเลือกแพ็กเกจเน็ตไฟเบอร์ให้คุ้มค่าที่สุด
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categoryFilters.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-gradient-to-r from-emerald-400 via-lime-400 to-orange-500 hover:from-emerald-300 hover:via-lime-300 hover:to-orange-400 text-slate-950 border-transparent font-black shadow-lg shadow-orange-500/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 rounded-2xl bg-slate-900 border border-slate-800" />
          ))}
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-800">
          <p className="text-slate-400 text-sm">ไม่พบบทความในหมวดหมู่นี้</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((art) => (
            <div
              key={art.id}
              onClick={() => onNavigate(`/articles/${art.slug}`, { article: art })}
              className="rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 p-5 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
            >
              <div className="space-y-3">
                <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-950 border border-slate-800">
                  <img
                    src={art.cover_image || art.image}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-85 group-hover:opacity-100"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900/90 text-emerald-400 border border-emerald-500/30">
                      {getCategoryLabel(art.category || 'GENERAL')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-emerald-400" />
                    {new Date(art.published_date || art.published_at || '').toLocaleDateString('th-TH', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {(art.views ?? 0).toLocaleString()} อ่าน
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2">
                  {art.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {art.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-between text-xs font-semibold text-emerald-400 group-hover:text-emerald-300">
                <span>อ่านบทความ & เทคนิค</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
