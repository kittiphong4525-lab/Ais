import React, { useState, useEffect } from 'react';
import { ArticleItem } from '../types';
import { ApiService } from '../services/api';
import {
  ChevronLeft,
  Calendar,
  Eye,
  User,
  Share2,
  Bookmark,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

interface ArticleDetailPageProps {
  slug: string;
  onNavigate: (path: string, params?: any) => void;
  passedArticle?: ArticleItem;
}

export const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({
  slug,
  onNavigate,
  passedArticle,
}) => {
  const [article, setArticle] = useState<ArticleItem | null>(passedArticle || null);
  const [loading, setLoading] = useState(!passedArticle);
  const { addToast } = useNotification();

  useEffect(() => {
    if (!passedArticle && slug) {
      const fetchArticle = async () => {
        setLoading(true);
        try {
          const list = await ApiService.getArticles();
          const item = list.find((a) => a.slug === slug || a.id === slug);
          setArticle(item || null);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchArticle();
    }
  }, [slug, passedArticle]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        text: article?.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast({ type: 'info', title: 'คัดลอกลิงก์บทความแล้ว' });
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 animate-pulse space-y-4">
        <div className="h-8 bg-slate-800 rounded-lg w-3/4" />
        <div className="h-64 bg-slate-900 rounded-2xl" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">ไม่พบบทความ</h2>
        <button
          onClick={() => onNavigate('/articles')}
          className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
        >
          กลับหน้ารวมบทความ
        </button>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <button
        onClick={() => onNavigate('/articles')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>กลับหน้ารวมบทความ</span>
      </button>

      {/* Header */}
      <div className="space-y-4">
        <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
          {article.category}
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight font-display">
          {article.title}
        </h1>

        <div className="flex items-center justify-between text-xs text-slate-400 border-y border-slate-800 py-3">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              {new Date(article.published_date || article.published_at || '').toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              {(article.views ?? 0).toLocaleString()} วิว
            </span>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-1 text-slate-300 hover:text-emerald-400 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>แชร์</span>
          </button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="rounded-3xl overflow-hidden aspect-video bg-slate-950 border border-slate-800 shadow-2xl">
        <img
          src={article.cover_image || article.image}
          alt={article.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Content */}
      <div className="prose prose-invert prose-emerald max-w-none text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
        <p className="text-base sm:text-lg font-medium text-emerald-300 bg-emerald-950/30 p-4 rounded-2xl border border-emerald-500/20">
          {article.excerpt}
        </p>

        {article.content.split('\n\n').map((para: string, idx: number) => (
          <p key={idx}>{para}</p>
        ))}
      </div>

      {/* CTA Box */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950 to-slate-900 border border-emerald-500/40 space-y-3">
        <h4 className="text-base font-bold text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-emerald-400" />
          <span>สนใจติดตั้งเน็ตบ้าน AIS Fibre สปีดแรงเต็มสปีด?</span>
        </h4>
        <p className="text-xs text-slate-300">
          สมัครวันนี้ฟรีค่าแรกเข้า 4,800 บาท พร้อมรับเราเตอร์ WiFi 6 ยืมใช้งานฟรีตลอดอายุสัญญา
        </p>
        <div className="pt-2 flex gap-3">
          <button
            onClick={() => onNavigate('/check-area')}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
          >
            <span>เช็กพื้นที่ติดตั้งทันที</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
};
