import {
  PackageItem,
  PromotionItem,
  BannerItem,
  LeadItem,
  ApplicationItem,
  EquipmentItem,
  ArticleItem,
  FAQItem,
  AdminUser,
  StoreSettings,
  AboutUsSettings,
  AppNotification,
  ContactMessage,
} from '../types';
import {
  INITIAL_PACKAGES,
  INITIAL_PROMOTIONS,
  INITIAL_BANNERS,
  INITIAL_LEADS,
  INITIAL_APPLICATIONS,
  INITIAL_EQUIPMENT,
  INITIAL_ARTICLES,
  INITIAL_FAQS,
  INITIAL_ADMIN_USERS,
  INITIAL_SETTINGS,
} from './seedData';
import { INITIAL_ABOUT_SETTINGS } from '../data/defaultCertificates';

const KEYS = {
  PACKAGES: 'ais_net999_packages',
  PROMOTIONS: 'ais_net999_promotions',
  BANNERS: 'ais_net999_banners',
  LEADS: 'ais_net999_leads',
  APPLICATIONS: 'ais_net999_applications',
  EQUIPMENT: 'ais_net999_equipment',
  ARTICLES: 'ais_net999_articles',
  FAQS: 'ais_net999_faqs',
  ADMIN_USERS: 'ais_net999_admin_users',
  SETTINGS: 'ais_net999_settings',
  ABOUT: 'ais_net999_about_settings',
  NOTIFICATIONS: 'ais_net999_notifications',
  CONTACT_MESSAGES: 'ais_net999_contact_messages',
};

function getFromStorage<T>(key: string, defaultData: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(item);
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return defaultData;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
}

export const StorageService = {
  // Initialize storage with defaults if empty
  init: () => {
    getFromStorage(KEYS.PACKAGES, INITIAL_PACKAGES);
    getFromStorage(KEYS.PROMOTIONS, INITIAL_PROMOTIONS);
    getFromStorage(KEYS.BANNERS, INITIAL_BANNERS);
    getFromStorage(KEYS.LEADS, INITIAL_LEADS);
    getFromStorage(KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
    getFromStorage(KEYS.EQUIPMENT, INITIAL_EQUIPMENT);
    getFromStorage(KEYS.ARTICLES, INITIAL_ARTICLES);
    getFromStorage(KEYS.FAQS, INITIAL_FAQS);
    getFromStorage(KEYS.ADMIN_USERS, INITIAL_ADMIN_USERS);
    getFromStorage(KEYS.SETTINGS, INITIAL_SETTINGS);
    getFromStorage(KEYS.NOTIFICATIONS, []);
  },

  // Reset to initial clean production data
  resetAll: () => {
    localStorage.setItem(KEYS.PACKAGES, JSON.stringify(INITIAL_PACKAGES));
    localStorage.setItem(KEYS.PROMOTIONS, JSON.stringify(INITIAL_PROMOTIONS));
    localStorage.setItem(KEYS.BANNERS, JSON.stringify(INITIAL_BANNERS));
    localStorage.setItem(KEYS.LEADS, JSON.stringify(INITIAL_LEADS));
    localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify(INITIAL_APPLICATIONS));
    localStorage.setItem(KEYS.EQUIPMENT, JSON.stringify(INITIAL_EQUIPMENT));
    localStorage.setItem(KEYS.ARTICLES, JSON.stringify(INITIAL_ARTICLES));
    localStorage.setItem(KEYS.FAQS, JSON.stringify(INITIAL_FAQS));
    localStorage.setItem(KEYS.ADMIN_USERS, JSON.stringify(INITIAL_ADMIN_USERS));
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify([]));
    return true;
  },

  // Packages
  getPackages: (): PackageItem[] => {
    const list = getFromStorage<PackageItem[]>(KEYS.PACKAGES, INITIAL_PACKAGES);
    let changed = false;
    const enriched = list.map((pkg) => {
      if (!pkg.image) {
        const seed = INITIAL_PACKAGES.find((s) => s.id === pkg.id || s.slug === pkg.slug);
        if (seed && seed.image) {
          changed = true;
          return { ...pkg, image: seed.image };
        }
      }
      return pkg;
    });
    if (changed) {
      saveToStorage(KEYS.PACKAGES, enriched);
    }
    return enriched;
  },
  savePackages: (data: PackageItem[]) => saveToStorage(KEYS.PACKAGES, data),

  // Promotions
  getPromotions: (): PromotionItem[] => getFromStorage(KEYS.PROMOTIONS, INITIAL_PROMOTIONS),
  savePromotions: (data: PromotionItem[]) => saveToStorage(KEYS.PROMOTIONS, data),

  // Banners
  getBanners: (): BannerItem[] => getFromStorage(KEYS.BANNERS, INITIAL_BANNERS),
  saveBanners: (data: BannerItem[]) => saveToStorage(KEYS.BANNERS, data),

  // Leads
  getLeads: (): LeadItem[] => getFromStorage(KEYS.LEADS, INITIAL_LEADS),
  saveLeads: (data: LeadItem[]) => saveToStorage(KEYS.LEADS, data),
  deleteLead: (id: string): boolean => {
    const list = getFromStorage<LeadItem[]>(KEYS.LEADS, INITIAL_LEADS);
    const updated = list.filter((l) => l.id !== id && l.lead_no !== id);
    saveToStorage(KEYS.LEADS, updated);
    return true;
  },
  deleteLeadsBulk: (ids: string[]): boolean => {
    const idSet = new Set(ids);
    const list = getFromStorage<LeadItem[]>(KEYS.LEADS, INITIAL_LEADS);
    const updated = list.filter((l) => !idSet.has(l.id) && !idSet.has(l.lead_no));
    saveToStorage(KEYS.LEADS, updated);
    return true;
  },
  clearAllLeads: (): boolean => {
    saveToStorage(KEYS.LEADS, []);
    return true;
  },

  // Applications
  getApplications: (): ApplicationItem[] => getFromStorage(KEYS.APPLICATIONS, INITIAL_APPLICATIONS),
  saveApplications: (data: ApplicationItem[]) => saveToStorage(KEYS.APPLICATIONS, data),
  deleteApplication: (id: string): boolean => {
    const list = getFromStorage<ApplicationItem[]>(KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
    const updated = list.filter((a) => a.id !== id && a.application_no !== id);
    saveToStorage(KEYS.APPLICATIONS, updated);
    return true;
  },
  deleteApplicationsBulk: (ids: string[]): boolean => {
    const idSet = new Set(ids);
    const list = getFromStorage<ApplicationItem[]>(KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
    const updated = list.filter((a) => !idSet.has(a.id) && !idSet.has(a.application_no));
    saveToStorage(KEYS.APPLICATIONS, updated);
    return true;
  },
  clearAllApplications: (): boolean => {
    saveToStorage(KEYS.APPLICATIONS, []);
    return true;
  },

  // Equipment
  getEquipment: (): EquipmentItem[] => getFromStorage(KEYS.EQUIPMENT, INITIAL_EQUIPMENT),
  saveEquipment: (data: EquipmentItem[]) => saveToStorage(KEYS.EQUIPMENT, data),

  // Articles
  getArticles: (): ArticleItem[] => getFromStorage(KEYS.ARTICLES, INITIAL_ARTICLES),
  saveArticles: (data: ArticleItem[]) => saveToStorage(KEYS.ARTICLES, data),

  // FAQs
  getFAQs: (): FAQItem[] => getFromStorage(KEYS.FAQS, INITIAL_FAQS),
  saveFAQs: (data: FAQItem[]) => saveToStorage(KEYS.FAQS, data),

  // Admin Users
  getAdminUsers: (): AdminUser[] => getFromStorage(KEYS.ADMIN_USERS, INITIAL_ADMIN_USERS),
  saveAdminUsers: (data: AdminUser[]) => saveToStorage(KEYS.ADMIN_USERS, data),

  // Settings
  getSettings: (): StoreSettings => {
    const current = getFromStorage<StoreSettings>(KEYS.SETTINGS, INITIAL_SETTINGS);
    let changed = false;
    let updated = { ...current };

    if (!updated.youtube_video_url) {
      updated.youtube_video_url = INITIAL_SETTINGS.youtube_video_url;
      changed = true;
    }

    // Auto-migrate old contact info if present
    if (
      !current.phone_primary ||
      current.phone_primary === '02-999-8888' ||
      current.line_id === '@aisfibre999' ||
      current.line_id === '@aisfibre3' ||
      current.line_id !== '@aisfibrefanclub' ||
      !current.address ||
      current.address.includes('พหลโยธิน') ||
      current.address.includes('เน็ตเวิร์คทาวเวอร์')
    ) {
      updated = {
        ...updated,
        store_name: INITIAL_SETTINGS.store_name,
        store_tagline: INITIAL_SETTINGS.store_tagline,
        phone_primary: INITIAL_SETTINGS.phone_primary,
        phone_secondary: INITIAL_SETTINGS.phone_secondary,
        line_id: INITIAL_SETTINGS.line_id,
        line_url: INITIAL_SETTINGS.line_url,
        working_hours: INITIAL_SETTINGS.working_hours,
        address: INITIAL_SETTINGS.address,
      };
      changed = true;
    }

    if (changed) {
      saveToStorage(KEYS.SETTINGS, updated);
      return updated;
    }
    return current;
  },
  saveSettings: (data: StoreSettings) => saveToStorage(KEYS.SETTINGS, data),

  // About Us / Official Dealer Certificates
  getAboutSettings: (): AboutUsSettings => {
    const current = getFromStorage<AboutUsSettings>(KEYS.ABOUT, INITIAL_ABOUT_SETTINGS);
    if (
      !current ||
      current.company_name === 'บริษัท ดีเอ็มพี แอดวานซ์ โซลูชั่น เน็ตเวิร์ค จำกัด' ||
      !current.company_name ||
      current.company_address?.includes('ศรีนครินทร์ 42') ||
      current.show_certificates === false
    ) {
      const merged: AboutUsSettings = {
        ...INITIAL_ABOUT_SETTINGS,
        ...(current || {}),
        company_name: INITIAL_ABOUT_SETTINGS.company_name,
        company_address: INITIAL_ABOUT_SETTINGS.company_address,
        doc1_image: current?.doc1_image && !current.doc1_image.includes('DEFAULT_CERTIFICATE') && !current.doc1_image.includes('AWN')
          ? current.doc1_image
          : INITIAL_ABOUT_SETTINGS.doc1_image,
        doc2_image: current?.doc2_image && !current.doc2_image.includes('DEFAULT_CERTIFICATE') && !current.doc2_image.includes('AWN')
          ? current.doc2_image
          : INITIAL_ABOUT_SETTINGS.doc2_image,
        show_certificates: true,
      };
      saveToStorage(KEYS.ABOUT, merged);
      return merged;
    }
    if (current.show_certificates === undefined) {
      current.show_certificates = true;
    }
    if (current.show_activities === undefined) {
      current.show_activities = true;
    }
    if (!current.activity_images || current.activity_images.length === 0) {
      current.activity_images = INITIAL_ABOUT_SETTINGS.activity_images;
    }
    return current;
  },
  saveAboutSettings: (data: AboutUsSettings) => saveToStorage(KEYS.ABOUT, data),

  // Notifications
  getNotifications: (): AppNotification[] => getFromStorage(KEYS.NOTIFICATIONS, []),
  saveNotifications: (data: AppNotification[]) => saveToStorage(KEYS.NOTIFICATIONS, data),

  // Contact Messages
  getContactMessages: (): ContactMessage[] => getFromStorage(KEYS.CONTACT_MESSAGES, []),
  saveContactMessages: (data: ContactMessage[]) => saveToStorage(KEYS.CONTACT_MESSAGES, data),
};
