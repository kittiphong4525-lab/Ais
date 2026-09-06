export type LeadStatus =
  | 'NEW'
  | 'CONTACTING'
  | 'CHECKING_AREA'
  | 'WAITING_DOCUMENT'
  | 'WAITING_CONFIRM'
  | 'APPOINTMENT'
  | 'INSTALLING'
  | 'COMPLETED'
  | 'CANCELLED';

export type ApplicationStatus =
  | 'SUBMITTED'
  | 'DOCUMENT_CHECK'
  | 'APPROVED'
  | 'APPOINTMENT'
  | 'INSTALLING'
  | 'COMPLETED'
  | 'REJECTED'
  | 'CANCELLED';

export type UserRole = 'ADMIN' | 'STAFF';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  active: boolean;
}

export type PackageCategory =
  | 'ALL'
  | 'POPULAR'
  | 'GAMER'
  | 'HOME'
  | 'ENTERTAINMENT'
  | 'BUSINESS'
  | 'BUDGET'
  | 'CONDO'
  | 'BROADBAND24'
  | 'POWER4'
  | 'SMARTHOME'
  | 'MESH'
  | 'SME'
  | string;

export interface PackageFeatureObj {
  text: string;
  highlight?: boolean;
}

export type PackageFeature = string | PackageFeatureObj;

export interface PackageItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  monthlyPrice?: number;
  originalPrice?: number;
  normalPrice?: number;
  download_speed: number; // in Mbps
  downloadSpeed?: number;
  upload_speed: number; // in Mbps
  uploadSpeed?: number;
  speedDisplay?: string;
  contract_month: number;
  contractMonths?: number;
  installation_fee: number; // 0 for free
  description: string;
  tagline?: string;
  features: PackageFeature[];
  freebies?: string[];
  equipment: string[];
  category: PackageCategory;
  badge?: string;
  image?: string;
  active: boolean;
  start_date?: string;
  end_date?: string;
  recommendedFor?: string;
  tvIncluded?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNew?: boolean;
  routerType?: string;
  playboxIncluded?: boolean;
  entertainmentApps?: string[];
  simIncluded?: {
    data: string;
    calls: string;
  };
}

export interface BannerItem {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  mobile_image?: string;
  badge?: string;
  cta_text?: string;
  cta_link?: string;
  link_type?: 'INTERNAL' | 'EXTERNAL' | 'LINE' | 'PHONE';
  position: 'HERO_SLIDER' | 'HOME_MIDDLE' | 'POPUP' | 'PROMOTIONS_PAGE';
  order: number;
  active: boolean;
  start_date?: string;
  end_date?: string;
  bg_gradient?: string;
  created_at?: string;
}

export interface PromotionItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  start_date: string;
  end_date: string;
  startDate?: string;
  endDate?: string;
  cta_text: string;
  cta_link: string;
  ctaText?: string;
  ctaLink?: string;
  badge?: string;
  discountBadge?: string;
  discount_percent?: number;
  discountPercent?: number;
  active: boolean;
  highlight?: boolean;
  is_highlight?: boolean;
  isHighlight?: boolean;
}

export interface LeadItem {
  id: string;
  lead_no: string;
  tracking_id?: string;
  created_at: string;
  customer_name: string;
  phone: string;
  email?: string;
  line_id?: string;
  package_id?: string;
  package_name?: string;
  package_price?: number;
  province: string;
  district: string;
  subdistrict?: string;
  address_detail?: string;
  house_no?: string;
  village?: string;
  street?: string;
  zipcode?: string;
  postal_code?: string;
  gps_lat?: number;
  gps_lng?: number;
  gps_location?: string;
  landmark?: string;
  location_details?: string;
  status: LeadStatus;
  assigned_to?: string;
  assigned_to_name?: string;
  admin_notes?: string;
  appointment_date?: string;
  appointment_time?: string;
  notes: LeadNote[];
  source?: 'COVERAGE_CHECK' | 'DIRECT_APPLY' | 'CALLBACK_REQUEST' | 'CONTACT_FORM' | 'ONLINE_APPLY';
  consent_contact?: boolean;
  document_urls?: string[];
}

export interface LeadNote {
  id: string;
  created_at: string;
  created_by: string;
  created_by_name: string;
  message: string;
  status_change?: {
    from: LeadStatus;
    to: LeadStatus;
  };
}

export interface ApplicationItem {
  id: string;
  application_no: string;
  tracking_id?: string;
  created_at: string;
  lead_id?: string;
  package_id: string;
  package_name: string;
  package_price: number;
  package_speed?: string;
  customer_title?: string;
  first_name?: string;
  last_name?: string;
  customer_name?: string;
  thai_id?: string;
  birth_date?: string;
  phone: string;
  phone_secondary?: string;
  email?: string;
  line_id?: string;
  current_isp?: string;
  has_existing_contract?: boolean;
  id_card_number?: string;
  house_no?: string;
  village?: string;
  village_no?: string;
  building?: string;
  room_no?: string;
  floor?: string;
  street?: string;
  subdistrict?: string;
  district?: string;
  province?: string;
  postal_code?: string;
  zipcode?: string;
  landmark?: string;
  gps_lat?: number;
  gps_lng?: number;
  install_house_no?: string;
  install_village?: string;
  install_street?: string;
  install_subdistrict?: string;
  install_district?: string;
  install_province?: string;
  install_zipcode?: string;
  install_landmark?: string;
  install_gps_lat?: number;
  install_gps_lng?: number;
  id_card_image_url?: string;
  house_reg_image_url?: string;
  home_registration_image_url?: string;
  location_photo_url?: string;
  id_card_image?: string;
  house_reg_image?: string;
  preferred_date?: string;
  preferred_time_slot?: string;
  preferred_install_date?: string;
  preferred_install_time?: string;
  convenient_date?: string;
  convenient_time_slot?: string;
  tv_box_included?: boolean;
  router_type?: string;
  consent_pdpa?: boolean;
  consent_marketing?: boolean;
  consent_terms?: boolean;
  status: ApplicationStatus;
  installer_name?: string;
  installer_phone?: string;
  assigned_staff_id?: string;
  status_history?: ApplicationStatusHistory[];
  staff_remark?: string;
  notes?: any;
  admin_notes?: string;
}

export interface ApplicationStatusHistory {
  id: string;
  status: ApplicationStatus;
  updated_at: string;
  updated_by: string;
  note?: string;
}

export interface EquipmentItem {
  id: string;
  name: string;
  category?: 'WIFI_ROUTER' | 'WIFI_6' | 'WIFI_7' | 'MESH_WIFI' | 'AIS_PLAYBOX' | 'ONU' | string;
  type?: string;
  model?: string;
  image: string;
  description: string;
  highlights?: string[];
  features?: string[];
  suitable_for?: string;
  supported_packages?: string[];
  specs?: { [key: string]: string } | string[] | any;
  is_highlight?: boolean;
}

export interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  category?:
    | 'INTERNET'
    | 'WIFI'
    | 'GAMING'
    | 'STREAMING'
    | 'SMART_HOME'
    | 'AIS_PLAYBOX'
    | 'PROMOTIONS'
    | 'TROUBLESHOOT'
    | 'GENERAL'
    | 'GUIDE'
    | string;
  cover_image?: string;
  image?: string;
  author: string;
  published_date?: string;
  published_at?: string;
  read_time_minutes?: number;
  reading_time?: string;
  tags?: string[];
  featured?: boolean;
  excerpt: string;
  content: string;
  published?: boolean;
  views?: number;
  seo_title?: string;
  meta_description?: string;
  keywords?: string[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'GENERAL' | 'INSTALLATION' | 'COVERAGE' | 'DOCUMENTS' | 'PACKAGE' | 'EQUIPMENT' | 'BILLING' | 'TROUBLESHOOT';
  order: number;
  popular?: boolean;
}

export interface ContactMessage {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  email?: string;
  topic: string;
  message: string;
  read: boolean;
}

export interface ActivityImage {
  id: string;
  url: string;
  title?: string;
  description?: string;
}

export interface AboutUsSettings {
  title_part1: string; // e.g. "ใบอนุญาตตัวแทนจำหน่าย"
  title_part2: string; // e.g. "อย่างเป็นทางการ"
  company_name: string; // e.g. "บริษัท โฮมไฟเบอร์เนต999 จำกัด"
  company_address: string; // e.g. "ที่ตั้ง บริษัท 512 หมู่ 1 ถนนรักสงบ ตำบลวิศิษฐ์ อำเภอเมือง จังหวัดบึงกาฬ 38000"
  doc1_title: string;
  doc1_image: string; // A4 certificate image URL or data URL
  doc2_title: string;
  doc2_image: string; // A4 certificate image URL or data URL
  dealer_codes?: string[];
  authorized_by?: string;
  show_certificates?: boolean; // Set to false to hold off on showing license images
  show_activities?: boolean; // Set to true to show activity slider
  activity_images?: ActivityImage[]; // List of activity photos displayed in carousel
  updated_at?: string;
}

export interface StoreSettings {
  store_name: string;
  store_tagline: string;
  phone_primary: string;
  phone_secondary?: string;
  line_id: string;
  line_url: string;
  facebook_url: string;
  youtube_video_url?: string;
  working_hours: string;
  address: string;
  email: string;
  dealer_code: string;
  auto_assign_leads: boolean;
  admin_pin?: string;
}

export interface AppNotification {
  id: string;
  type: 'NEW_APPLICATION' | 'NEW_LEAD' | 'STATUS_CHANGE' | 'APPOINTMENT_DUE';
  title: string;
  message: string;
  created_at: string;
  read: boolean;
  link?: string;
}

export type CoverageCheckLead = LeadItem;
export type CustomerApplication = ApplicationItem;

export interface AdminDashboardStats {
  todayLeads: number;
  totalLeads: number;
  totalApplications: number;
  completedInstalls: number;
  conversionRate: string;
  totalMonthlyRevenue: number;
  leadsByStatus: Record<LeadStatus, number>;
  todayAppointments: LeadItem[];
}

export interface LeadSubmission {
  id: string;
  name: string;
  phone: string;
  province: string;
  district: string;
  packageInterest: string;
  trackingCode: string;
  createdAt: string;
}

export interface SpeedMode {
  id: string;
  name: string;
  badge: string;
  desc: string;
  download: number;
  upload: number;
}
