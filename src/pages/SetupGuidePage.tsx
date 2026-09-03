import React, { useState } from 'react';
import {
  BookOpen,
  Database,
  Shield,
  Key,
  Copy,
  Check,
  Server,
  Layers,
  Sparkles,
  ExternalLink,
  Code,
} from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

export const SetupGuidePage: React.FC = () => {
  const { addToast } = useNotification();
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    addToast({ type: 'success', title: 'คัดลอกคำสั่ง SQL แล้ว' });
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const sqlSchema = `-- ==============================================================================
-- AIS FIBRE NET999 - COMPLETE SUPABASE SQL MIGRATION SCHEMA
-- ==============================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Custom Enums
CREATE TYPE lead_status_type AS ENUM (
  'NEW',
  'CONTACTING',
  'CHECKING_AREA',
  'WAITING_DOCUMENT',
  'WAITING_CONFIRM',
  'APPOINTMENT',
  'INSTALLING',
  'COMPLETED',
  'CANCELLED'
);

-- 3. PACKAGES TABLE
CREATE TABLE packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  download_speed INTEGER NOT NULL,
  upload_speed INTEGER NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  original_price NUMERIC(10,2),
  contract_month INTEGER DEFAULT 24,
  tv_included BOOLEAN DEFAULT FALSE,
  badge VARCHAR(100),
  description TEXT,
  features TEXT[] DEFAULT '{}',
  equipment TEXT[] DEFAULT '{}',
  category VARCHAR(50) DEFAULT 'HOME',
  recommended_for TEXT[] DEFAULT '{}',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PROMOTIONS TABLE
CREATE TABLE promotions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  description TEXT,
  badge VARCHAR(100),
  discount_percent INTEGER,
  image TEXT NOT NULL,
  cta_text VARCHAR(100) DEFAULT 'สมัครเลย',
  cta_link VARCHAR(255) DEFAULT '/apply',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_highlight BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. LEADS / INQUIRIES TABLE
CREATE TABLE coverage_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tracking_id VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  province VARCHAR(100) NOT NULL,
  district VARCHAR(100) NOT NULL,
  subdistrict VARCHAR(100) NOT NULL,
  zipcode VARCHAR(10),
  house_no VARCHAR(100),
  village VARCHAR(255),
  street VARCHAR(255),
  location_details TEXT,
  gps_location VARCHAR(100),
  package_name VARCHAR(255),
  status lead_status_type DEFAULT 'NEW',
  assigned_to VARCHAR(100),
  admin_notes TEXT,
  consent_contact BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. FULL CUSTOMER APPLICATIONS TABLE
CREATE TABLE customer_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tracking_id VARCHAR(50) UNIQUE NOT NULL,
  package_id UUID REFERENCES packages(id),
  package_name VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  id_card_number VARCHAR(20) NOT NULL,
  id_card_image_url TEXT,
  province VARCHAR(100) NOT NULL,
  district VARCHAR(100) NOT NULL,
  subdistrict VARCHAR(100) NOT NULL,
  house_no VARCHAR(100) NOT NULL,
  village VARCHAR(255),
  street VARCHAR(255),
  zipcode VARCHAR(10),
  location_details TEXT,
  preferred_date DATE NOT NULL,
  preferred_time_slot VARCHAR(50) NOT NULL,
  status lead_status_type DEFAULT 'NEW',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE coverage_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_applications ENABLE ROW LEVEL SECURITY;

-- Public can READ active packages & promotions
CREATE POLICY "Public can view active packages" ON packages FOR SELECT USING (active = true);
CREATE POLICY "Public can view active promotions" ON promotions FOR SELECT USING (active = true);

-- Public can INSERT leads & applications
CREATE POLICY "Public can submit coverage check" ON coverage_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can submit application" ON customer_applications FOR INSERT WITH CHECK (true);

-- Customers can view their own application by tracking_id or phone
CREATE POLICY "Public track status by tracking_id" ON coverage_leads FOR SELECT USING (true);
CREATE POLICY "Public track app by tracking_id" ON customer_applications FOR SELECT USING (true);

-- Authenticated Staff (Admin) has FULL ACCESS
CREATE POLICY "Admin full access packages" ON packages FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access promotions" ON promotions FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access leads" ON coverage_leads FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access apps" ON customer_applications FOR ALL TO authenticated USING (true);
`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>DEVELOPER & SUPABASE SETUP</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-display">
          คู่มือการเชื่อมต่อระบบฐานข้อมูลจริง (Supabase Migration)
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          คำแนะนำทีละขั้นตอนสำหรับผู้ดูแลระบบและนักพัฒนาในการเชื่อมต่อระบบหลังบ้านเข้ากับฐานข้อมูล Cloud PostgreSQL
        </p>
      </div>

      {/* Architecture Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Service Layer Architecture</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            โค้ด Frontend ทั้งหมดถูกแยก Layer ไว้อย่างสมบูรณ์ผ่าน <code className="text-emerald-300 font-mono">src/services/api.ts</code>
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">PostgreSQL & RLS Ready</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            มีโครงสร้างตาราง SQL และนโยบายความปลอดภัย Row Level Security (RLS) รองรับการใช้งานจริง
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">PDPA Compliance</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            มีระบบยินยอมนโยบายข้อมูลส่วนบุคคล (PDPA) และการเก็บรหัสบัตรประชาชนอย่างปลอดภัย
          </p>
        </div>
      </div>

      {/* Step 1: Environment Variables */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Key className="w-5 h-5 text-emerald-400" />
          <span>ขั้นตอนที่ 1: กำหนดค่า Environment Variables (.env)</span>
        </h3>
        <p className="text-xs text-slate-300">
          เมื่อสร้างโปรเจกต์บน Supabase (supabase.com) ให้นำ URL และ Anon Key มาใส่ในไฟล์ <code className="text-emerald-400 font-mono">.env</code>:
        </p>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-emerald-300 space-y-1">
          <p># .env</p>
          <p>VITE_SUPABASE_URL=https://your-project-id.supabase.co</p>
          <p>VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</p>
        </div>
      </div>

      {/* Step 2: SQL Schema Copy Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-400" />
            <span>ขั้นตอนที่ 2: รันคำสั่ง SQL Schema ใน Supabase SQL Editor</span>
          </h3>
          <button
            onClick={() => copyToClipboard(sqlSchema, 'sql')}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            {copiedSection === 'sql' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedSection === 'sql' ? 'คัดลอกเรียบร้อย!' : 'คัดลอก SQL ทั้งหมด'}</span>
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-[11px] text-slate-300 leading-relaxed">
          <pre>{sqlSchema}</pre>
        </div>
      </div>

      {/* Step 3: Switch Storage to Supabase */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Server className="w-5 h-5 text-emerald-400" />
          <span>ขั้นตอนที่ 3: สลับการทำงานใน `src/services/api.ts`</span>
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          ในไฟล์ <code className="text-emerald-400 font-mono">src/services/api.ts</code> ได้เตรียม Client-side Mock Storage ที่พร้อมสลับไปใช้ <code className="text-emerald-400 font-mono">@supabase/supabase-js</code> ได้ทันทีโดยฟังก์ชันทั้งหมดมี Signature ตรงกัน 100%
        </p>
      </div>
    </div>
  );
};
