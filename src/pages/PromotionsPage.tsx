import React, { useState, useEffect } from 'react';
import { PromotionItem, BannerItem } from '../types';
import { ApiService } from '../services/api';
import { PromotionCard } from '../components/common/PromotionCard';
import { BannerCarousel } from '../components/home/BannerCarousel';
import { Flame, Sparkles, Tag, Clock } from 'lucide-react';

interface PromotionsPageProps {
  onNavigate: (path: string, params?: any) => void;
}

export const PromotionsPage: React.FC<PromotionsPageProps> = ({ onNavigate }) => {
  const [promotions, setPromotions] = useState<PromotionItem[]>([]);
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromos = async () => {
      setLoading(true);
      try {
        const [promos, bns] = await Promise.all([
          ApiService.getPromotions(true),
          ApiService.getBanners({ onlyActive: true }),
        ]);
        setPromotions(promos);
        setBanners(bns);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPromos();
  }, []);

  const promoBanners = banners.filter(
    (b) => b.position === 'PROMOTIONS_PAGE' || b.position === 'HERO_SLIDER'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold">
          <Flame className="w-3.5 h-3.5" />
          <span>SPECIAL CAMPAIGNS 2026</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-snug">
          <span className="text-lime-300 drop-shadow-[0_2px_12px_rgba(190,242,100,0.3)]">🔥 รวมโปรโมชั่นพิเศษ</span>{' '}
          <span className="text-[#FF5500] drop-shadow-[0_2px_12px_rgba(255,85,0,0.4)]">AIS FIBRE 3 ล่าสุด</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          รวมส่วนลดพิเศษ ย้ายค่ายลด 50%, ฟรีค่าแรกเข้า, แถมฟรีเราเตอร์ WiFi 6 และกล่อง PLAYBOX 4K
        </p>
      </div>

      {/* Featured Banner Slider on Promotions Page */}
      {promoBanners.length > 0 && (
        <div className="mb-8">
          <BannerCarousel banners={promoBanners} onNavigate={onNavigate} />
        </div>
      )}

      {/* Promotions List */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-slate-850 border border-slate-800" />
          ))}
        </div>
      ) : promotions.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-800">
          <p className="text-slate-400 text-sm">ยังไม่มีโปรโมชั่นที่เปิดใช้งานในขณะนี้</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {promotions.map((promo) => (
            <PromotionCard
              key={promo.id}
              promo={promo}
              onAction={(link) => onNavigate(link)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

