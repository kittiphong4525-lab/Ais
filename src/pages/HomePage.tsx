import React, { useState, useEffect } from 'react';
import { PackageItem, PromotionItem, BannerItem } from '../types';
import { ApiService } from '../services/api';
import { HeroSection } from '../components/home/HeroSection';
import { BannerCarousel } from '../components/home/BannerCarousel';
import { MiddleBanner } from '../components/home/MiddleBanner';
import { QuickActions } from '../components/home/QuickActions';
import { PackageFinder } from '../components/home/PackageFinder';
import { SpeedToggleSection } from '../components/home/SpeedToggleSection';
import { InnovationSection } from '../components/home/InnovationSection';
import { InstallationStepsSection } from '../components/home/InstallationStepsSection';
import { CustomerReviewsSection } from '../components/home/CustomerReviewsSection';
import { FeaturedPackagesCarousel } from '../components/home/FeaturedPackagesCarousel';
import { PackageCard } from '../components/common/PackageCard';
import { PromotionCard } from '../components/common/PromotionCard';
import { LineContactModal } from '../components/common/LineContactModal';
import {
  Flame,
  Zap,
  ArrowRight,
  ShieldCheck,
  Award,
  Users,
  CheckCircle2,
  Tv,
  Router,
  MapPin,
  Sparkles,
  ChevronRight,
  PhoneCall,
  Activity,
  MessageCircle,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (path: string, params?: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [promotions, setPromotions] = useState<PromotionItem[]>([]);
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('ALL');

  // LINE Modal State
  const [lineModalOpen, setLineModalOpen] = useState(false);
  const [selectedPkgForLine, setSelectedPkgForLine] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [pkgs, promos, bns] = await Promise.all([
          ApiService.getPackages({ onlyActive: true }),
          ApiService.getPromotions(true),
          ApiService.getBanners({ onlyActive: true }),
        ]);
        setPackages(pkgs);
        setPromotions(promos);
        setBanners(bns);
      } catch (err) {
        console.error('Failed to load home data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleApply = (pkg?: PackageItem) => {
    window.open('https://line.me/ti/p/@aisfibre999', '_blank');
  };

  const handleViewDetails = (pkg: PackageItem) => {
    onNavigate(`/packages/${pkg.slug}`, { pkg });
  };

  const handleOpenLine = (pkg?: PackageItem | string) => {
    if (typeof pkg === 'string') {
      setSelectedPkgForLine(pkg);
    } else if (pkg) {
      setSelectedPkgForLine(`${pkg.name} (${pkg.price}.-/ด.)`);
    } else {
      setSelectedPkgForLine(undefined);
    }
    setLineModalOpen(true);
  };

  // Filtered packages for home showcase tab
  const displayedPackages = packages.filter((pkg) => {
    if (activeTab === 'HOT') return pkg.category === 'POPULAR' || pkg.id.includes('bb24') || pkg.id.includes('lite');
    if (activeTab === 'BROADBAND24') return pkg.category === 'BROADBAND24' || pkg.name.includes('Broadband 24');
    if (activeTab === 'ENTERTAINMENT') return pkg.tvIncluded || pkg.category === 'ENTERTAINMENT';
    if (activeTab === 'POWER4') return pkg.category === 'POWER4' || pkg.name.includes('POWER4') || pkg.name.includes('Smart Gang');
    if (activeTab === 'CONDO') return pkg.category === 'CONDO' || pkg.name.includes('Condo');
    return true;
  });

  const heroBanners = banners.filter((b) => b.position === 'HERO_SLIDER' || !b.position);
  const middleBanners = banners.filter((b) => b.position === 'HOME_MIDDLE');

  return (
    <div className="space-y-12 pb-16 relative overflow-hidden">
      {/* Ambient background blurred circles (Green / Lime / Orange glowing orbs) */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-48 right-10 w-[30rem] h-[30rem] bg-orange-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[35%] -left-20 w-[28rem] h-[28rem] bg-lime-500/12 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[55%] right-0 w-[32rem] h-[32rem] bg-emerald-500/12 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[75%] left-1/3 w-[36rem] h-[36rem] bg-orange-500/12 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-lime-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* 0. Top Hero Promotional Banner Carousel Slider */}
      {heroBanners.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
          <BannerCarousel
            banners={heroBanners}
            onNavigate={onNavigate}
            onOpenLine={handleOpenLine}
          />
        </section>
      )}

      {/* 1. Hero Section (with Instant Area Check & Lead Capture Card) */}
      <HeroSection onNavigate={onNavigate} onOpenLine={handleOpenLine} />

      {/* 2. Quick Actions (4 Action Buttons) */}
      <QuickActions onNavigate={onNavigate} />

      {/* 3. Featured Hot Packages Section (ais-fibre3.com lineup) Carousel */}
      <FeaturedPackagesCarousel
        packages={packages}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onApply={handleApply}
        onViewDetails={handleViewDetails}
        onOpenLine={handleOpenLine}
        onNavigate={onNavigate}
        loading={loading}
      />

      {/* 4. Speed Toggle Simulator Section */}
      <SpeedToggleSection />

      {/* 5. Middle Promotional Banners */}
      {middleBanners.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {middleBanners.map((banner) => (
              <MiddleBanner
                key={banner.id}
                banner={banner}
                onNavigate={onNavigate}
                onOpenLine={handleOpenLine}
              />
            ))}
          </div>
        </section>
      )}

      {/* 6. Innovation Showcase Section */}
      <InnovationSection />

      {/* 7. Interactive Package Finder AI Quiz */}
      <PackageFinder
        packages={packages}
        onApply={handleApply}
        onViewDetails={handleViewDetails}
      />

      {/* 8. Installation Steps (4 Steps) */}
      <InstallationStepsSection onCheckArea={() => onNavigate('/check-area')} />

      {/* 9. Promotional Banners */}
      {promotions.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>MONTHLY SPECIAL OFFERS</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                <span className="text-lime-300 drop-shadow-[0_2px_12px_rgba(190,242,100,0.3)]">สิทธิพิเศษ &</span>{' '}
                <span className="text-[#FF5500] drop-shadow-[0_2px_12px_rgba(255,85,0,0.4)]">แคมเปญประจำเดือน</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed max-w-xl mx-auto">
                สมัครผ่านช่องทางออนไลน์วันนี้ รับข้อเสนอสุดพิเศษและอุปกรณ์มาตรฐานระดับโลก
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {promotions.map((promo) => (
                <PromotionCard
                  key={promo.id}
                  promo={promo}
                  onAction={(link) => onNavigate(link)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 10. Customer Reviews & Installation Speedtest Gallery */}
      <CustomerReviewsSection />

      {/* LINE Consultation Modal */}
      <LineContactModal
        isOpen={lineModalOpen}
        onClose={() => setLineModalOpen(false)}
        packageName={selectedPkgForLine}
      />
    </div>
  );
};
