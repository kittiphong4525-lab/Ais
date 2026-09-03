import React, { useState, useEffect, useMemo } from 'react';
import { PackageItem } from '../types';
import { ApiService } from '../services/api';
import { PackageCard } from '../components/common/PackageCard';
import { LineContactModal } from '../components/common/LineContactModal';
import {
  Sliders,
  Search,
  Filter,
  ArrowUpDown,
  Tv,
  Zap,
  CheckCircle2,
  X,
  Layers,
  Sparkles,
  MessageCircle,
} from 'lucide-react';

interface PackagesPageProps {
  onNavigate: (path: string, params?: any) => void;
  initialCategory?: string;
}

export const PackagesPage: React.FC<PackagesPageProps> = ({ onNavigate, initialCategory }) => {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>(initialCategory || 'ALL');
  const [speedFilter, setSpeedFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'speed_desc'>('price_asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyWithTv, setOnlyWithTv] = useState(false);

  // Line modal
  const [lineModalOpen, setLineModalOpen] = useState(false);
  const [selectedPkgForLine, setSelectedPkgForLine] = useState<string | undefined>(undefined);

  // Compare packages state
  const [compareList, setCompareList] = useState<PackageItem[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const data = await ApiService.getPackages({ onlyActive: true });
        setPackages(data);
      } catch (err) {
        console.error('Failed to load packages', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  const categories = [
    { id: 'ALL', label: 'ทั้งหมด' },
    { id: 'POPULAR', label: '🌟 ยอดนิยม' },
    { id: 'BROADBAND24', label: '🏠 Broadband 24 (เน็ตอย่างเดียว)' },
    { id: 'ENTERTAINMENT', label: '📺 Entertainment Gang (เน็ต+ทีวี)' },
    { id: 'POWER4', label: '📱 POWER4 (เน็ต+ซิม 5G)' },
    { id: 'CONDO', label: '🏢 คอนโด & หอพัก (269.-)' },
    { id: 'GAMER', label: '⚡ Gamer VIP Ping' },
    { id: 'SMARTHOME', label: '💎 Home Fiber LAN (10Gbps)' },
    { id: 'BUSINESS', label: '🏢 ธุรกิจ SME' },
  ];

  const filteredPackages = useMemo(() => {
    let result = [...packages];

    if (category !== 'ALL') {
      if (category === 'ENTERTAINMENT') {
        result = result.filter((p) => p.tvIncluded || p.category === 'ENTERTAINMENT');
      } else if (category === 'BROADBAND24') {
        result = result.filter((p) => p.category === 'BROADBAND24' || p.name.includes('Broadband 24'));
      } else if (category === 'CONDO') {
        result = result.filter((p) => p.category === 'CONDO' || p.name.includes('Condo'));
      } else if (category === 'POWER4') {
        result = result.filter((p) => p.category === 'POWER4' || p.name.includes('POWER4') || p.name.includes('Smart Gang'));
      } else {
        result = result.filter((p) => p.category === category);
      }
    }

    if (onlyWithTv) {
      result = result.filter((p) => p.tvIncluded);
    }

    if (speedFilter === '500') {
      result = result.filter((p) => p.download_speed <= 500);
    } else if (speedFilter === '1000') {
      result = result.filter((p) => p.download_speed === 1000);
    } else if (speedFilter === '2000') {
      result = result.filter((p) => p.download_speed >= 2000);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.features &&
            p.features.some((f) => {
              const text = typeof f === 'string' ? f : f.text;
              return text.toLowerCase().includes(q);
            }))
      );
    }

    if (sortBy === 'price_asc') {
      result.sort((a, b) => (a.price ?? (a as any).monthlyPrice ?? 0) - (b.price ?? (b as any).monthlyPrice ?? 0));
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => (b.price ?? (b as any).monthlyPrice ?? 0) - (a.price ?? (a as any).monthlyPrice ?? 0));
    } else if (sortBy === 'speed_desc') {
      result.sort(
        (a, b) =>
          (b.download_speed ?? (b as any).downloadSpeed ?? 0) -
          (a.download_speed ?? (a as any).downloadSpeed ?? 0)
      );
    }

    return result;
  }, [packages, category, speedFilter, sortBy, searchQuery, onlyWithTv]);

  const handleApply = (pkg?: PackageItem) => {
    window.open('https://line.me/ti/p/@aisfibre999', '_blank');
  };

  const handleViewDetails = (pkg: PackageItem) => {
    onNavigate(`/packages/${pkg.slug}`, { pkg });
  };

  const handleOpenLine = (pkg?: PackageItem) => {
    setSelectedPkgForLine(pkg ? `${pkg.name} (${pkg.price}.-/ด.)` : undefined);
    setLineModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AIS 3BB FIBRE 3 PACKAGES 2026</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-snug">
          <span className="text-lime-300 drop-shadow-[0_2px_12px_rgba(190,242,100,0.3)]">🔥 รวมแพ็กเกจเน็ตบ้าน</span>{' '}
          <span className="text-[#FF5500] drop-shadow-[0_2px_12px_rgba(255,85,0,0.4)]">AIS 3BB FIBRE 3</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
          ความเร็ว 200 - 2,000 Mbps พร้อมเราเตอร์ Wi-Fi 6 / Wi-Fi 7 และกล่อง AIS PLAYBOX สมัครวันนี้ฟรีค่าแรกเข้า 4,800 บาท
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
              category === cat.id
                ? 'bg-gradient-to-r from-emerald-400 via-lime-400 to-orange-500 hover:from-emerald-300 hover:via-lime-300 hover:to-orange-400 text-slate-950 border-transparent font-black shadow-lg shadow-orange-500/20'
                : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ค้นหาชื่อแพ็กเกจ, สปีด, อุปกรณ์..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950/90 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
          {/* Speed Filter */}
          <select
            value={speedFilter}
            onChange={(e) => setSpeedFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950/90 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-emerald-400 shrink-0"
          >
            <option value="ALL">ความเร็วทั้งหมด</option>
            <option value="500">ไม่เกิน 500 Mbps</option>
            <option value="1000">1 Gbps (1000 Mbps)</option>
            <option value="2000">2 Gbps (2000 Mbps)</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-slate-950/90 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-emerald-400 shrink-0"
          >
            <option value="price_asc">ราคา: ต่ำ ➔ สูง</option>
            <option value="price_desc">ราคา: สูง ➔ ต่ำ</option>
            <option value="speed_desc">ความเร็ว: สูง ➔ ต่ำ</option>
          </select>

          {/* TV filter toggle */}
          <button
            onClick={() => setOnlyWithTv(!onlyWithTv)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-colors shrink-0 ${
              onlyWithTv
                ? 'bg-purple-950/60 border-purple-500 text-purple-300'
                : 'bg-slate-950/90 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>กล่อง PLAYBOX</span>
          </button>
        </div>
      </div>

      {/* Package count label */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          พบ <strong>{filteredPackages.length}</strong> แพ็กเกจที่ตรงกับเงื่อนไข
        </span>
        <button
          onClick={() => handleOpenLine()}
          className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
        >
          <MessageCircle className="w-3.5 h-3.5 text-[#06C755]" />
          <span>ขอคำแนะนำแพ็กเกจทาง LINE</span>
        </button>
      </div>

      {/* Package Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-96 rounded-3xl bg-slate-900 border border-slate-800" />
          ))}
        </div>
      ) : filteredPackages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              onApply={handleApply}
              onViewDetails={handleViewDetails}
              onOpenLine={() => handleOpenLine(pkg)}
              featured={pkg.category === 'POPULAR' || pkg.id === 'pkg-bb24-1000'}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
          <p className="text-slate-300 font-bold">ไม่พบแพ็กเกจที่ตรงกับตัวกรองของคุณ</p>
          <p className="text-xs text-slate-500">ลองเปลี่ยนตัวกรองความเร็วหรือคำค้นหา</p>
          <button
            onClick={() => {
              setCategory('ALL');
              setSpeedFilter('ALL');
              setSearchQuery('');
              setOnlyWithTv(false);
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-emerald-400 hover:bg-slate-700"
          >
            ล้างตัวกรองทั้งหมด
          </button>
        </div>
      )}

      {/* LINE Consultation Modal */}
      <LineContactModal
        isOpen={lineModalOpen}
        onClose={() => setLineModalOpen(false)}
        packageName={selectedPkgForLine}
      />
    </div>
  );
};
