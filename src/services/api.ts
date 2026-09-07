import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  limit,
  writeBatch,
  Unsubscribe,
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { handleFirestoreError, OperationType } from './firestoreError';
import {
  PackageItem,
  PromotionItem,
  BannerItem,
  LeadItem,
  LeadStatus,
  ApplicationItem,
  ApplicationStatus,
  EquipmentItem,
  ArticleItem,
  FAQItem,
  AdminUser,
  StoreSettings,
  AppNotification,
  ContactMessage,
  AboutUsSettings,
} from '../types';
import {
  INITIAL_PACKAGES,
  INITIAL_PROMOTIONS,
  INITIAL_BANNERS,
  INITIAL_EQUIPMENT,
  INITIAL_ARTICLES,
  INITIAL_FAQS,
  INITIAL_SETTINGS,
  INITIAL_ADMIN_USERS,
} from './seedData';
import { INITIAL_ABOUT_SETTINGS } from '../data/defaultCertificates';
import { StorageService } from './storage';
import { sanitizeAboutSettingsImages } from '../utils/imageCompressor';

// Helper to generate IDs
export const generateId = (prefix = 'id'): string => {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
};

// Helper to generate formatted Lead/Application Number
export const generateTrackingNumber = (type: 'LEAD' | 'APP'): string => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(10000 + Math.random() * 90000).toString();
  if (type === 'LEAD') {
    return `AIS-${dateStr}-${randomSuffix}`;
  }
  return `AIS-APP-${dateStr}-${randomSuffix}`;
};

// Helper to check if a package or promotion is currently active & not expired
export const isItemActiveAndValid = (item: {
  active?: boolean;
  start_date?: string;
  end_date?: string;
  startDate?: string;
  endDate?: string;
}): boolean => {
  if (item.active === false) return false;
  const now = new Date();

  const startDate = item.start_date || item.startDate;
  if (startDate) {
    const start = new Date(startDate);
    if (!isNaN(start.getTime()) && now < start) return false;
  }

  const endDate = item.end_date || item.endDate;
  if (endDate) {
    const end = new Date(endDate);
    if (!isNaN(end.getTime())) {
      end.setHours(23, 59, 59, 999);
      if (now > end) return false;
    }
  }

  return true;
};

// Ensure Cloud Database initialization
let isCloudDbInitialized = false;
export async function initializeCloudDatabaseIfNeeded(): Promise<void> {
  if (isCloudDbInitialized) return;
  isCloudDbInitialized = true;

  try {
    // 1. Packages
    try {
      const pkgSnap = await getDocs(collection(db, 'packages'));
      if (pkgSnap && pkgSnap.empty) {
        const batch = writeBatch(db);
        for (const p of INITIAL_PACKAGES) {
          batch.set(doc(db, 'packages', p.id), p);
        }
        await batch.commit();
      }
    } catch (err: any) {
      if (err?.code === 'permission-denied') {
        handleFirestoreError(err, OperationType.LIST, 'packages');
      }
    }

    // 2. Promotions
    try {
      const promoSnap = await getDocs(collection(db, 'promotions'));
      if (promoSnap && promoSnap.empty) {
        const batch = writeBatch(db);
        for (const pr of INITIAL_PROMOTIONS) {
          batch.set(doc(db, 'promotions', pr.id), pr);
        }
        await batch.commit();
      }
    } catch (err: any) {
      if (err?.code === 'permission-denied') {
        handleFirestoreError(err, OperationType.LIST, 'promotions');
      }
    }

    // 3. Banners
    try {
      const bannerSnap = await getDocs(collection(db, 'banners'));
      if (bannerSnap && bannerSnap.empty) {
        const batch = writeBatch(db);
        for (const b of INITIAL_BANNERS) {
          batch.set(doc(db, 'banners', b.id), b);
        }
        await batch.commit();
      }
    } catch (err: any) {
      if (err?.code === 'permission-denied') {
        handleFirestoreError(err, OperationType.LIST, 'banners');
      }
    }

    // 4. Equipment
    try {
      const eqSnap = await getDocs(collection(db, 'equipment'));
      if (eqSnap && eqSnap.empty) {
        const batch = writeBatch(db);
        for (const e of INITIAL_EQUIPMENT) {
          batch.set(doc(db, 'equipment', e.id), e);
        }
        await batch.commit();
      }
    } catch (err: any) {
      if (err?.code === 'permission-denied') {
        handleFirestoreError(err, OperationType.LIST, 'equipment');
      }
    }

    // 5. Articles
    try {
      const artSnap = await getDocs(collection(db, 'articles'));
      if (artSnap && artSnap.empty) {
        const batch = writeBatch(db);
        for (const a of INITIAL_ARTICLES) {
          batch.set(doc(db, 'articles', a.id), a);
        }
        await batch.commit();
      }
    } catch (err: any) {
      if (err?.code === 'permission-denied') {
        handleFirestoreError(err, OperationType.LIST, 'articles');
      }
    }

    // 6. FAQs
    try {
      const faqSnap = await getDocs(collection(db, 'faqs'));
      if (faqSnap && faqSnap.empty) {
        const batch = writeBatch(db);
        for (const f of INITIAL_FAQS) {
          batch.set(doc(db, 'faqs', f.id), f);
        }
        await batch.commit();
      }
    } catch (err: any) {
      if (err?.code === 'permission-denied') {
        handleFirestoreError(err, OperationType.LIST, 'faqs');
      }
    }

    // 7. Store Settings
    try {
      const settingSnap = await getDoc(doc(db, 'settings', 'main'));
      if (settingSnap && !settingSnap.exists()) {
        await setDoc(doc(db, 'settings', 'main'), INITIAL_SETTINGS);
      } else if (settingSnap && settingSnap.exists()) {
        const currentData = settingSnap.data();
        if (
          currentData.line_id === '@aisfibre999' ||
          currentData.line_id === '@aisfibre3' ||
          !currentData.line_id
        ) {
          await setDoc(
            doc(db, 'settings', 'main'),
            {
              line_id: INITIAL_SETTINGS.line_id,
              line_url: INITIAL_SETTINGS.line_url,
            },
            { merge: true }
          );
        }
      }
    } catch (err: any) {
      if (err?.code === 'permission-denied') {
        handleFirestoreError(err, OperationType.GET, 'settings/main');
      }
    }

    // 8. About Us
    try {
      const aboutSnap = await getDoc(doc(db, 'about', 'company'));
      if (aboutSnap && !aboutSnap.exists()) {
        const sanitized = await sanitizeAboutSettingsImages(INITIAL_ABOUT_SETTINGS);
        await setDoc(doc(db, 'about', 'company'), sanitized);
      }
    } catch (err: any) {
      if (err?.code === 'permission-denied') {
        handleFirestoreError(err, OperationType.GET, 'about/company');
      }
    }

    // 9. Admin Users
    try {
      const userSnap = await getDocs(collection(db, 'admin_users'));
      if (userSnap && userSnap.empty) {
        const batch = writeBatch(db);
        for (const u of INITIAL_ADMIN_USERS) {
          batch.set(doc(db, 'admin_users', u.id), u);
        }
        await batch.commit();
      }
    } catch (err: any) {
      if (err?.code === 'permission-denied') {
        handleFirestoreError(err, OperationType.LIST, 'admin_users');
      }
    }
  } catch (error) {
    console.warn('Cloud Database bootstrap notice:', error);
  }
}

// Initialization is triggered on app mount or lazily on first query

export const ApiService = {
  // ------------------ PACKAGES ------------------
  async getPackages(options?: { onlyActive?: boolean; category?: string }): Promise<PackageItem[]> {
    try {
      await initializeCloudDatabaseIfNeeded();
      const colRef = collection(db, 'packages');
      const snap = await getDocs(colRef);
      let list = snap.docs.map((d) => ({ ...d.data(), id: d.id } as PackageItem));

      if (list.length === 0) {
        list = [...INITIAL_PACKAGES];
      }

      if (options?.onlyActive) {
        list = list.filter((pkg) => isItemActiveAndValid(pkg));
      }

      if (options?.category && options.category !== 'ALL') {
        list = list.filter((pkg) => pkg.category === options.category);
      }

      return list;
    } catch (error: any) {
      if (error?.code === 'permission-denied') {
        handleFirestoreError(error, OperationType.LIST, 'packages');
      }
      console.warn('Falling back to local packages:', error?.message || error);
      let list = StorageService.getPackages();
      if (!list || list.length === 0) list = [...INITIAL_PACKAGES];
      if (options?.onlyActive) list = list.filter((pkg) => isItemActiveAndValid(pkg));
      if (options?.category && options.category !== 'ALL') list = list.filter((pkg) => pkg.category === options.category);
      return list;
    }
  },

  subscribePackages(callback: (packages: PackageItem[]) => void): Unsubscribe {
    const colRef = collection(db, 'packages');
    return onSnapshot(
      colRef,
      (snap) => {
        const list = snap.docs.map((d) => ({ ...d.data(), id: d.id } as PackageItem));
        callback(list.length > 0 ? list : [...INITIAL_PACKAGES]);
      },
      (error) => {
        if (error?.code === 'permission-denied') {
          handleFirestoreError(error, OperationType.GET, 'packages');
        } else {
          console.warn('Firestore subscription (packages) notice:', error?.message || error);
        }
      }
    );
  },

  async getPackageBySlugOrId(idOrSlug: string): Promise<PackageItem | null> {
    try {
      const colRef = collection(db, 'packages');
      const snap = await getDocs(colRef);
      const all = snap.docs.map((d) => ({ ...d.data(), id: d.id } as PackageItem));
      const found = all.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
      if (found) return found;
      const local = StorageService.getPackages();
      return (local.length > 0 ? local : INITIAL_PACKAGES).find((p) => p.id === idOrSlug || p.slug === idOrSlug) || null;
    } catch (error: any) {
      if (error?.code === 'permission-denied') {
        handleFirestoreError(error, OperationType.GET, `packages/${idOrSlug}`);
      }
      const local = StorageService.getPackages();
      return (local.length > 0 ? local : INITIAL_PACKAGES).find((p) => p.id === idOrSlug || p.slug === idOrSlug) || null;
    }
  },

  async savePackage(pkg: Partial<PackageItem>): Promise<PackageItem> {
    try {
      const pkgId = pkg.id || generateId('pkg');
      const finalPkg: PackageItem = {
        id: pkgId,
        name: pkg.name || 'New Package',
        slug: pkg.slug || `package-${Date.now()}`,
        price: pkg.price !== undefined ? Number(pkg.price) : 599,
        originalPrice: pkg.originalPrice !== undefined ? Number(pkg.originalPrice) : undefined,
        download_speed: pkg.download_speed !== undefined ? Number(pkg.download_speed) : 500,
        upload_speed: pkg.upload_speed !== undefined ? Number(pkg.upload_speed) : 500,
        contract_month: pkg.contract_month !== undefined ? Number(pkg.contract_month) : 24,
        installation_fee: pkg.installation_fee !== undefined ? Number(pkg.installation_fee) : 0,
        description: pkg.description || '',
        features: pkg.features || [],
        equipment: pkg.equipment || [],
        category: pkg.category || 'BROADBAND24',
        badge: pkg.badge || '',
        image: pkg.image || '',
        active: pkg.active !== undefined ? pkg.active : true,
        start_date: pkg.start_date || '',
        end_date: pkg.end_date || '',
        recommendedFor: pkg.recommendedFor || '',
        tvIncluded: !!pkg.tvIncluded,
      };

      await setDoc(doc(db, 'packages', pkgId), finalPkg, { merge: true });
      return finalPkg;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `packages/${pkg.id || 'new'}`);
    }
  },

  async deletePackage(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, 'packages', id));
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `packages/${id}`);
    }
  },

  // ------------------ PROMOTIONS ------------------
  async getPromotions(onlyActive = true): Promise<PromotionItem[]> {
    try {
      await initializeCloudDatabaseIfNeeded();
      const colRef = collection(db, 'promotions');
      const snap = await getDocs(colRef);
      let list = snap.docs.map((d) => ({ ...d.data(), id: d.id } as PromotionItem));

      if (list.length === 0) {
        list = [...INITIAL_PROMOTIONS];
      }

      if (onlyActive) {
        list = list.filter((p) => isItemActiveAndValid(p));
      }
      return list;
    } catch (error: any) {
      if (error?.code === 'permission-denied') {
        handleFirestoreError(error, OperationType.LIST, 'promotions');
      }
      console.warn('Falling back to local promotions:', error?.message || error);
      let list = StorageService.getPromotions();
      if (!list || list.length === 0) list = [...INITIAL_PROMOTIONS];
      if (onlyActive) list = list.filter((p) => isItemActiveAndValid(p));
      return list;
    }
  },

  subscribePromotions(callback: (promotions: PromotionItem[]) => void): Unsubscribe {
    const colRef = collection(db, 'promotions');
    return onSnapshot(
      colRef,
      (snap) => {
        const list = snap.docs.map((d) => ({ ...d.data(), id: d.id } as PromotionItem));
        callback(list.length > 0 ? list : [...INITIAL_PROMOTIONS]);
      },
      (error) => {
        if (error?.code === 'permission-denied') {
          handleFirestoreError(error, OperationType.GET, 'promotions');
        } else {
          console.warn('Firestore subscription (promotions) notice:', error?.message || error);
        }
      }
    );
  },

  async getPromotionById(id: string): Promise<PromotionItem | null> {
    try {
      const snap = await getDoc(doc(db, 'promotions', id));
      if (!snap.exists()) return null;
      return { ...snap.data(), id: snap.id } as PromotionItem;
    } catch (error: any) {
      if (error?.code === 'permission-denied') {
        handleFirestoreError(error, OperationType.GET, `promotions/${id}`);
      }
      const local = StorageService.getPromotions();
      return (local.length > 0 ? local : INITIAL_PROMOTIONS).find((p) => p.id === id) || null;
    }
  },

  async savePromotion(promo: Partial<PromotionItem>): Promise<PromotionItem> {
    try {
      const promoId = promo.id || generateId('promo');
      const finalPromo: PromotionItem = {
        id: promoId,
        title: promo.title || 'โปรโมชั่นใหม่',
        subtitle: promo.subtitle || '',
        description: promo.description || '',
        image: promo.image || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
        start_date: promo.start_date || new Date().toISOString().slice(0, 10),
        end_date: promo.end_date || '2026-12-31',
        cta_text: promo.cta_text || 'สมัครติดตั้ง',
        cta_link: promo.cta_link || '/apply',
        badge: promo.badge || '',
        active: promo.active !== undefined ? promo.active : true,
        highlight: !!promo.highlight,
      };

      await setDoc(doc(db, 'promotions', promoId), finalPromo, { merge: true });
      return finalPromo;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `promotions/${promo.id || 'new'}`);
    }
  },

  async deletePromotion(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, 'promotions', id));
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `promotions/${id}`);
    }
  },

  // ------------------ BANNERS ------------------
  async getBanners(options?: { onlyActive?: boolean; position?: string }): Promise<BannerItem[]> {
    try {
      await initializeCloudDatabaseIfNeeded();
      const colRef = collection(db, 'banners');
      const snap = await getDocs(colRef);
      let list = snap.docs.map((d) => ({ ...d.data(), id: d.id } as BannerItem));

      if (list.length === 0) {
        list = [...INITIAL_BANNERS];
      }

      if (options?.onlyActive) {
        list = list.filter((b) => isItemActiveAndValid(b));
      }

      if (options?.position && options.position !== 'ALL') {
        list = list.filter((b) => b.position === options.position);
      }

      return list.sort((a, b) => (a.order || 0) - (b.order || 0));
    } catch (error: any) {
      if (error?.code === 'permission-denied') {
        handleFirestoreError(error, OperationType.LIST, 'banners');
      }
      console.warn('Falling back to local banners:', error?.message || error);
      let list = StorageService.getBanners();
      if (!list || list.length === 0) list = [...INITIAL_BANNERS];
      if (options?.onlyActive) list = list.filter((b) => isItemActiveAndValid(b));
      if (options?.position && options.position !== 'ALL') list = list.filter((b) => b.position === options.position);
      return list.sort((a, b) => (a.order || 0) - (b.order || 0));
    }
  },

  subscribeBanners(callback: (banners: BannerItem[]) => void): Unsubscribe {
    const colRef = collection(db, 'banners');
    return onSnapshot(
      colRef,
      (snap) => {
        const list = snap.docs.map((d) => ({ ...d.data(), id: d.id } as BannerItem));
        callback(list.length > 0 ? list.sort((a, b) => (a.order || 0) - (b.order || 0)) : [...INITIAL_BANNERS]);
      },
      (error) => {
        if (error?.code === 'permission-denied') {
          handleFirestoreError(error, OperationType.GET, 'banners');
        } else {
          console.warn('Firestore subscription (banners) notice:', error?.message || error);
        }
      }
    );
  },

  async getBannerById(id: string): Promise<BannerItem | null> {
    try {
      const snap = await getDoc(doc(db, 'banners', id));
      if (!snap.exists()) return null;
      return { ...snap.data(), id: snap.id } as BannerItem;
    } catch (error: any) {
      if (error?.code === 'permission-denied') {
        handleFirestoreError(error, OperationType.GET, `banners/${id}`);
      }
      const local = StorageService.getBanners();
      return (local.length > 0 ? local : INITIAL_BANNERS).find((b) => b.id === id) || null;
    }
  },

  async saveBanner(banner: Partial<BannerItem>): Promise<BannerItem> {
    try {
      const bannerId = banner.id || generateId('banner');
      const finalBanner: BannerItem = {
        id: bannerId,
        title: banner.title || 'แบนเนอร์ใหม่',
        subtitle: banner.subtitle || '',
        description: banner.description || '',
        image: banner.image || 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1600&auto=format&fit=crop&q=80',
        mobile_image: banner.mobile_image || '',
        badge: banner.badge || '🔥 สิทธิพิเศษ',
        cta_text: banner.cta_text || 'ดูรายละเอียด',
        cta_link: banner.cta_link || '/packages',
        link_type: banner.link_type || 'INTERNAL',
        position: banner.position || 'HERO_SLIDER',
        order: banner.order !== undefined ? banner.order : 1,
        active: banner.active !== undefined ? banner.active : true,
        bg_gradient: banner.bg_gradient || 'from-emerald-950/90 via-slate-900/90 to-slate-950/95',
        start_date: banner.start_date || new Date().toISOString().slice(0, 10),
        end_date: banner.end_date || '2026-12-31',
        created_at: banner.created_at || new Date().toISOString(),
      };

      await setDoc(doc(db, 'banners', bannerId), finalBanner, { merge: true });
      return finalBanner;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `banners/${banner.id || 'new'}`);
    }
  },

  async toggleBannerStatus(id: string): Promise<BannerItem | null> {
    try {
      const snap = await getDoc(doc(db, 'banners', id));
      if (!snap.exists()) return null;
      const cur = snap.data() as BannerItem;
      const updated = !cur.active;
      await updateDoc(doc(db, 'banners', id), { active: updated });
      return { ...cur, id, active: updated };
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `banners/${id}`);
    }
  },

  async deleteBanner(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, 'banners', id));
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `banners/${id}`);
    }
  },

  async reorderBanners(banners: BannerItem[]): Promise<boolean> {
    try {
      const batch = writeBatch(db);
      banners.forEach((b, idx) => {
        batch.update(doc(db, 'banners', b.id), { order: idx + 1 });
      });
      await batch.commit();
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'banners');
    }
  },

  async resetBannersToDefault(): Promise<BannerItem[]> {
    try {
      const snap = await getDocs(collection(db, 'banners'));
      const batch = writeBatch(db);
      snap.docs.forEach((d) => batch.delete(d.ref));
      INITIAL_BANNERS.forEach((b) => batch.set(doc(db, 'banners', b.id), b));
      await batch.commit();
      return INITIAL_BANNERS;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'banners');
    }
  },

  // ------------------ LEADS (Coverage Check & CRM) ------------------
  async getLeads(filters?: {
    status?: LeadStatus;
    search?: string;
    assigned_to?: string;
    province?: string;
  }): Promise<LeadItem[]> {
    try {
      const colRef = collection(db, 'leads');
      const snap = await getDocs(colRef);
      let list = snap.docs.map((d) => ({ ...d.data(), id: d.id } as LeadItem));

      // Sort by created_at desc
      list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      if (filters?.status) {
        list = list.filter((l) => l.status === filters.status);
      }
      if (filters?.assigned_to) {
        list = list.filter((l) => l.assigned_to === filters.assigned_to);
      }
      if (filters?.province) {
        list = list.filter((l) => l.province?.includes(filters.province!));
      }
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        list = list.filter(
          (l) =>
            l.customer_name?.toLowerCase().includes(q) ||
            l.phone?.includes(q) ||
            (l.lead_no && l.lead_no.toLowerCase().includes(q)) ||
            (l.tracking_id && l.tracking_id.toLowerCase().includes(q)) ||
            (l.package_name && l.package_name.toLowerCase().includes(q))
        );
      }

      return list;
    } catch (error: any) {
      if (error?.code === 'permission-denied') {
        handleFirestoreError(error, OperationType.LIST, 'leads');
      }
      console.warn('Falling back to local leads:', error?.message || error);
      let list = StorageService.getLeads();
      if (filters?.status) list = list.filter((l) => l.status === filters.status);
      if (filters?.assigned_to) list = list.filter((l) => l.assigned_to === filters.assigned_to);
      if (filters?.province) list = list.filter((l) => l.province?.includes(filters.province!));
      return list;
    }
  },

  subscribeLeads(callback: (leads: LeadItem[]) => void): Unsubscribe {
    const colRef = collection(db, 'leads');
    return onSnapshot(
      colRef,
      (snap) => {
        const list = snap.docs.map((d) => ({ ...d.data(), id: d.id } as LeadItem));
        list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        callback(list);
      },
      (error) => {
        if (error?.code === 'permission-denied') {
          handleFirestoreError(error, OperationType.GET, 'leads');
        } else {
          console.warn('Firestore subscription (leads) notice:', error?.message || error);
        }
      }
    );
  },

  async getLeadById(id: string): Promise<LeadItem | null> {
    try {
      const snap = await getDoc(doc(db, 'leads', id));
      if (snap.exists()) {
        return { ...snap.data(), id: snap.id } as LeadItem;
      }
      // Try search by lead_no or tracking_id
      const qSnap = await getDocs(query(collection(db, 'leads'), where('lead_no', '==', id)));
      if (!qSnap.empty) {
        return { ...qSnap.docs[0].data(), id: qSnap.docs[0].id } as LeadItem;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `leads/${id}`);
    }
  },

  async createCoverageCheckLead(data: {
    customer_name: string;
    phone: string;
    province: string;
    district: string;
    subdistrict: string;
    address_detail?: string;
    house_no?: string;
    village?: string;
    street?: string;
    zipcode?: string;
    postal_code?: string;
    landmark?: string;
    location_details?: string;
    gps_lat?: number;
    gps_lng?: number;
    gps_location?: string;
    consent_contact: boolean;
    package_id?: string;
    package_name?: string;
    package_price?: number;
    admin_notes?: string;
    assigned_to?: string;
  }): Promise<LeadItem> {
    try {
      const leadId = generateId('lead');
      const leadNo = generateTrackingNumber('LEAD');
      const newLead: LeadItem = {
        id: leadId,
        lead_no: leadNo,
        tracking_id: leadNo,
        created_at: new Date().toISOString(),
        customer_name: data.customer_name,
        phone: data.phone,
        province: data.province,
        district: data.district,
        subdistrict: data.subdistrict,
        address_detail:
          data.address_detail ||
          `${data.house_no || ''} ${data.village || ''} ${data.street || ''}`.trim(),
        house_no: data.house_no,
        village: data.village,
        street: data.street,
        zipcode: data.zipcode || data.postal_code,
        postal_code: data.postal_code || data.zipcode,
        landmark: data.landmark || data.location_details,
        location_details: data.location_details || data.landmark,
        gps_lat: data.gps_lat,
        gps_lng: data.gps_lng,
        gps_location: data.gps_location,
        package_id: data.package_id,
        package_name: data.package_name,
        package_price: data.package_price,
        status: 'NEW',
        source: 'COVERAGE_CHECK',
        consent_contact: data.consent_contact,
        assigned_to: data.assigned_to,
        admin_notes: data.admin_notes,
        notes: [
          {
            id: generateId('note'),
            created_at: new Date().toISOString(),
            created_by: 'system',
            created_by_name: 'ระบบตรวจสอบพื้นที่',
            message: data.admin_notes || 'ลูกค้าส่งข้อมูลตรวจสอบพื้นที่รอเจ้าหน้าที่ตรวจสอบคู่สาย',
          },
        ],
      };

      await setDoc(doc(db, 'leads', leadId), newLead);

      // Create Shared Notification in Firestore
      const notifId = generateId('notif');
      await setDoc(doc(db, 'notifications', notifId), {
        id: notifId,
        type: 'NEW_LEAD',
        title: '📍 มีคำขอตรวจสอบพื้นที่ใหม่',
        message: `${data.customer_name} (${data.phone}) - ${data.province} ${data.district}`,
        created_at: new Date().toISOString(),
        read: false,
        link: '/admin/leads',
      }).catch(() => {});

      return newLead;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'leads');
    }
  },

  async updateLeadStatus(
    leadId: string,
    newStatus: LeadStatus,
    adminUserOrNote?: string | { id: string; name: string },
    noteMessage?: string,
    appointmentDate?: string,
    appointmentTime?: string
  ): Promise<LeadItem | null> {
    try {
      const snap = await getDoc(doc(db, 'leads', leadId));
      if (!snap.exists()) return null;

      const currentLead = snap.data() as LeadItem;
      const oldStatus = currentLead.status;

      let createdById = 'admin';
      let createdByName = 'เจ้าหน้าที่ดูแลระบบ';
      let message = noteMessage || `เปลี่ยนสถานะจาก ${oldStatus} เป็น ${newStatus}`;

      if (typeof adminUserOrNote === 'string') {
        message = adminUserOrNote || message;
      } else if (adminUserOrNote && typeof adminUserOrNote === 'object') {
        createdById = adminUserOrNote.id;
        createdByName = adminUserOrNote.name;
      }

      const newNote = {
        id: generateId('note'),
        created_at: new Date().toISOString(),
        created_by: createdById,
        created_by_name: createdByName,
        message,
        status_change: { from: oldStatus, to: newStatus },
      };

      const updatePayload: Partial<LeadItem> = {
        status: newStatus,
        notes: [newNote, ...(currentLead.notes || [])],
      };

      if (appointmentDate) updatePayload.appointment_date = appointmentDate;
      if (appointmentTime) updatePayload.appointment_time = appointmentTime;

      await updateDoc(doc(db, 'leads', leadId), updatePayload);
      return { ...currentLead, ...updatePayload, id: leadId };
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `leads/${leadId}`);
    }
  },

  async assignLead(leadId: string, staffUser: { id: string; name: string }): Promise<LeadItem | null> {
    try {
      const snap = await getDoc(doc(db, 'leads', leadId));
      if (!snap.exists()) return null;
      const currentLead = snap.data() as LeadItem;

      const note = {
        id: generateId('note'),
        created_at: new Date().toISOString(),
        created_by: 'system',
        created_by_name: 'ระบบ',
        message: `มอบหมายงานให้ ${staffUser.name}`,
      };

      const updatePayload: Partial<LeadItem> = {
        assigned_to: staffUser.id,
        assigned_to_name: staffUser.name,
        notes: [note, ...(currentLead.notes || [])],
      };

      await updateDoc(doc(db, 'leads', leadId), updatePayload);
      return { ...currentLead, ...updatePayload, id: leadId };
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `leads/${leadId}`);
    }
  },

  async addLeadNote(
    leadId: string,
    author: { id: string; name: string },
    message: string
  ): Promise<LeadItem | null> {
    try {
      const snap = await getDoc(doc(db, 'leads', leadId));
      if (!snap.exists()) return null;
      const currentLead = snap.data() as LeadItem;

      const note = {
        id: generateId('note'),
        created_at: new Date().toISOString(),
        created_by: author.id,
        created_by_name: author.name,
        message,
      };

      const updatePayload: Partial<LeadItem> = {
        notes: [note, ...(currentLead.notes || [])],
      };

      await updateDoc(doc(db, 'leads', leadId), updatePayload);
      return { ...currentLead, ...updatePayload, id: leadId };
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `leads/${leadId}`);
    }
  },

  async deleteLead(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, 'leads', id));
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `leads/${id}`);
    }
  },

  async deleteLeadsBulk(ids: string[]): Promise<boolean> {
    try {
      const batch = writeBatch(db);
      for (const id of ids) {
        batch.delete(doc(db, 'leads', id));
      }
      await batch.commit();
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'leads/bulk');
    }
  },

  async clearAllLeads(): Promise<boolean> {
    try {
      const snap = await getDocs(collection(db, 'leads'));
      const batch = writeBatch(db);
      snap.docs.forEach((d) => batch.delete(d.ref));
      await batch.commit();
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'leads/all');
    }
  },

  // ------------------ APPLICATIONS (Online Apply & Tracking) ------------------
  async submitApplication(data: Partial<ApplicationItem>): Promise<ApplicationItem> {
    try {
      const appId = generateId('app');
      const appNo = generateTrackingNumber('APP');
      const newApp: ApplicationItem = {
        id: appId,
        application_no: appNo,
        tracking_id: appNo,
        created_at: new Date().toISOString(),
        status: 'SUBMITTED',
        package_id: data.package_id || 'pkg-bb24-1000',
        package_name: data.package_name || 'Broadband 24 (1 Gbps / 500 Mbps)',
        package_price: data.package_price || 499,
        package_speed: data.package_speed || '1000/500 Mbps',
        tv_box_included: !!data.tv_box_included,
        router_type: data.router_type || 'Wi-Fi 6 Router',
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        thai_id: data.thai_id || '',
        birth_date: data.birth_date || '',
        phone: data.phone || '',
        phone_secondary: data.phone_secondary,
        email: data.email,
        line_id: data.line_id,
        current_isp: data.current_isp || 'NONE',
        has_existing_contract: !!data.has_existing_contract,
        install_house_no: data.install_house_no || '',
        install_village: data.install_village || '',
        install_street: data.install_street || '',
        install_subdistrict: data.install_subdistrict || '',
        install_district: data.install_district || '',
        install_province: data.install_province || '',
        install_zipcode: data.install_zipcode || '',
        install_landmark: data.install_landmark,
        install_gps_lat: data.install_gps_lat,
        install_gps_lng: data.install_gps_lng,
        id_card_image_url: data.id_card_image_url,
        home_registration_image_url: data.home_registration_image_url,
        location_photo_url: data.location_photo_url,
        preferred_install_date: data.preferred_install_date || '',
        preferred_install_time: data.preferred_install_time || 'MORNING',
        consent_pdpa: !!data.consent_pdpa,
        consent_marketing: !!data.consent_marketing,
        consent_terms: !!data.consent_terms,
        admin_notes: data.admin_notes,
        notes: [
          {
            id: generateId('note'),
            created_at: new Date().toISOString(),
            created_by: 'system',
            created_by_name: 'ระบบสมัครออนไลน์',
            message: 'ส่งใบสมัครติดตั้งออนไลน์เรียบร้อยแล้ว รอเจ้าหน้าที่ตรวจสอบเอกสาร',
          },
        ],
      };

      await setDoc(doc(db, 'applications', appId), newApp);

      // Create linked Lead in CRM as well
      const leadId = generateId('lead');
      const newLead: LeadItem = {
        id: leadId,
        lead_no: appNo,
        tracking_id: appNo,
        created_at: new Date().toISOString(),
        customer_name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
        phone: data.phone || '',
        province: data.install_province || '',
        district: data.install_district || '',
        subdistrict: data.install_subdistrict || '',
        address_detail: `${data.install_house_no || ''} ${data.install_village || ''} ${data.install_street || ''}`.trim(),
        house_no: data.install_house_no,
        village: data.install_village,
        street: data.install_street,
        zipcode: data.install_zipcode,
        postal_code: data.install_zipcode,
        landmark: data.install_landmark,
        location_details: data.install_landmark,
        gps_lat: data.install_gps_lat,
        gps_lng: data.install_gps_lng,
        package_id: data.package_id,
        package_name: data.package_name,
        package_price: data.package_price,
        status: 'NEW',
        source: 'ONLINE_APPLY',
        consent_contact: true,
        notes: [
          {
            id: generateId('note'),
            created_at: new Date().toISOString(),
            created_by: 'system',
            created_by_name: 'ระบบ',
            message: `สร้างจากใบสมัครออนไลน์เลขที่ ${appNo}`,
          },
        ],
      };

      await setDoc(doc(db, 'leads', leadId), newLead).catch(() => {});

      // Notification
      const notifId = generateId('notif');
      await setDoc(doc(db, 'notifications', notifId), {
        id: notifId,
        type: 'NEW_APPLICATION',
        title: '📋 มีใบสมัครติดตั้งออนไลน์ใหม่',
        message: `${newApp.first_name} ${newApp.last_name} (${newApp.phone}) - ${newApp.package_name}`,
        created_at: new Date().toISOString(),
        read: false,
        link: '/admin/leads',
      }).catch(() => {});

      return newApp;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'applications');
    }
  },

  async getApplications(): Promise<ApplicationItem[]> {
    try {
      const snap = await getDocs(collection(db, 'applications'));
      const list = snap.docs.map((d) => ({ ...d.data(), id: d.id } as ApplicationItem));
      return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } catch (error: any) {
      if (error?.code === 'permission-denied') {
        handleFirestoreError(error, OperationType.LIST, 'applications');
      }
      console.warn('Falling back to local applications:', error?.message || error);
      return StorageService.getApplications() || [];
    }
  },

  subscribeApplications(callback: (apps: ApplicationItem[]) => void): Unsubscribe {
    const colRef = collection(db, 'applications');
    return onSnapshot(
      colRef,
      (snap) => {
        const list = snap.docs.map((d) => ({ ...d.data(), id: d.id } as ApplicationItem));
        list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        callback(list);
      },
      (error) => {
        if (error?.code === 'permission-denied') {
          handleFirestoreError(error, OperationType.GET, 'applications');
        } else {
          console.warn('Firestore subscription (applications) notice:', error?.message || error);
        }
      }
    );
  },

  async getApplicationById(id: string): Promise<ApplicationItem | null> {
    try {
      const snap = await getDoc(doc(db, 'applications', id));
      if (snap.exists()) {
        return { ...snap.data(), id: snap.id } as ApplicationItem;
      }
      const qSnap = await getDocs(
        query(collection(db, 'applications'), where('application_no', '==', id))
      );
      if (!qSnap.empty) {
        return { ...qSnap.docs[0].data(), id: qSnap.docs[0].id } as ApplicationItem;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `applications/${id}`);
    }
  },

  async updateApplicationStatus(
    appId: string,
    newStatus: ApplicationStatus,
    adminUserOrNote?: string | { id: string; name: string },
    noteMessage?: string
  ): Promise<ApplicationItem | null> {
    try {
      const snap = await getDoc(doc(db, 'applications', appId));
      if (!snap.exists()) return null;
      const cur = snap.data() as ApplicationItem;

      let createdById = 'admin';
      let createdByName = 'เจ้าหน้าที่ดูแลระบบ';
      let message = noteMessage || `เปลี่ยนสถานะใบสมัครเป็น ${newStatus}`;

      if (typeof adminUserOrNote === 'string') {
        message = adminUserOrNote || message;
      } else if (adminUserOrNote && typeof adminUserOrNote === 'object') {
        createdById = adminUserOrNote.id;
        createdByName = adminUserOrNote.name;
      }

      const note = {
        id: generateId('note'),
        created_at: new Date().toISOString(),
        created_by: createdById,
        created_by_name: createdByName,
        message,
        status_change: { from: cur.status, to: newStatus },
      };

      const updatePayload: Partial<ApplicationItem> = {
        status: newStatus,
        notes: [note, ...(cur.notes || [])],
      };

      await updateDoc(doc(db, 'applications', appId), updatePayload);
      return { ...cur, ...updatePayload, id: appId };
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `applications/${appId}`);
    }
  },

  async deleteApplication(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, 'applications', id));
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `applications/${id}`);
    }
  },

  async deleteApplicationsBulk(ids: string[]): Promise<boolean> {
    try {
      const batch = writeBatch(db);
      for (const id of ids) {
        batch.delete(doc(db, 'applications', id));
      }
      await batch.commit();
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'applications/bulk');
    }
  },

  async clearAllApplications(): Promise<boolean> {
    try {
      const snap = await getDocs(collection(db, 'applications'));
      const batch = writeBatch(db);
      snap.docs.forEach((d) => batch.delete(d.ref));
      await batch.commit();
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'applications/all');
    }
  },

  // ------------------ EQUIPMENT ------------------
  async getEquipment(): Promise<EquipmentItem[]> {
    try {
      await initializeCloudDatabaseIfNeeded();
      const snap = await getDocs(collection(db, 'equipment'));
      const list = snap.docs.map((d) => ({ ...d.data(), id: d.id } as EquipmentItem));
      return list.length > 0 ? list : [...INITIAL_EQUIPMENT];
    } catch (error: any) {
      if (error?.code === 'permission-denied') {
        handleFirestoreError(error, OperationType.LIST, 'equipment');
      }
      const local = StorageService.getEquipment();
      return local && local.length > 0 ? local : [...INITIAL_EQUIPMENT];
    }
  },

  async saveEquipment(eq: Partial<EquipmentItem>): Promise<EquipmentItem> {
    try {
      const eqId = eq.id || generateId('eq');
      const finalEq: EquipmentItem = {
        id: eqId,
        name: eq.name || 'Equipment',
        type: eq.type || 'ROUTER',
        model: eq.model || '',
        specs: eq.specs || [],
        image: eq.image || 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&auto=format&fit=crop&q=80',
        description: eq.description || '',
        is_highlight: !!eq.is_highlight,
      };

      await setDoc(doc(db, 'equipment', eqId), finalEq, { merge: true });
      return finalEq;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `equipment/${eq.id || 'new'}`);
    }
  },

  async deleteEquipment(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, 'equipment', id));
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `equipment/${id}`);
    }
  },

  // ------------------ ARTICLES ------------------
  async getArticles(): Promise<ArticleItem[]> {
    try {
      await initializeCloudDatabaseIfNeeded();
      const snap = await getDocs(collection(db, 'articles'));
      const list = snap.docs.map((d) => ({ ...d.data(), id: d.id } as ArticleItem));
      return list.length > 0 ? list : [...INITIAL_ARTICLES];
    } catch (error: any) {
      if (error?.code === 'permission-denied') {
        handleFirestoreError(error, OperationType.LIST, 'articles');
      }
      const local = StorageService.getArticles();
      return local && local.length > 0 ? local : [...INITIAL_ARTICLES];
    }
  },

  async getArticleBySlugOrId(idOrSlug: string): Promise<ArticleItem | null> {
    try {
      const snap = await getDocs(collection(db, 'articles'));
      const all = snap.docs.map((d) => ({ ...d.data(), id: d.id } as ArticleItem));
      const art = all.find((a) => a.id === idOrSlug || a.slug === idOrSlug) || null;
      if (art) {
        updateDoc(doc(db, 'articles', art.id), {
          views: (art.views || 0) + 1,
        }).catch(() => {});
      }
      return art;
    } catch (error: any) {
      if (error?.code === 'permission-denied') {
        handleFirestoreError(error, OperationType.GET, `articles/${idOrSlug}`);
      }
      const local = StorageService.getArticles();
      return (local && local.length > 0 ? local : INITIAL_ARTICLES).find((a) => a.id === idOrSlug || a.slug === idOrSlug) || null;
    }
  },

  async saveArticle(art: Partial<ArticleItem>): Promise<ArticleItem> {
    try {
      const artId = art.id || generateId('art');
      const finalArt: ArticleItem = {
        id: artId,
        title: art.title || 'บทความใหม่',
        slug: art.slug || `article-${Date.now()}`,
        excerpt: art.excerpt || '',
        content: art.content || '',
        category: art.category || 'GUIDE',
        cover_image:
          art.cover_image ||
          'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
        author: art.author || 'AIS Fibre Expert',
        published_at: art.published_at || new Date().toISOString().slice(0, 10),
        read_time_minutes: art.read_time_minutes || 4,
        tags: art.tags || ['AIS Fibre'],
        featured: !!art.featured,
        views: art.views || 0,
      };

      await setDoc(doc(db, 'articles', artId), finalArt, { merge: true });
      return finalArt;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `articles/${art.id || 'new'}`);
    }
  },

  async deleteArticle(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, 'articles', id));
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `articles/${id}`);
    }
  },

  // ------------------ FAQS ------------------
  async getFAQs(): Promise<FAQItem[]> {
    try {
      await initializeCloudDatabaseIfNeeded();
      const snap = await getDocs(collection(db, 'faqs'));
      const list = snap.docs.map((d) => ({ ...d.data(), id: d.id } as FAQItem));
      return (list.length > 0 ? list : [...INITIAL_FAQS]).sort((a, b) => a.order - b.order);
    } catch (error: any) {
      if (error?.code === 'permission-denied') {
        handleFirestoreError(error, OperationType.LIST, 'faqs');
      }
      const local = StorageService.getFAQs();
      return (local && local.length > 0 ? local : [...INITIAL_FAQS]).sort((a, b) => a.order - b.order);
    }
  },

  async saveFAQ(faq: Partial<FAQItem>): Promise<FAQItem> {
    try {
      const faqId = faq.id || generateId('faq');
      const finalFaq: FAQItem = {
        id: faqId,
        question: faq.question || 'คำถาม',
        answer: faq.answer || 'คำตอบ',
        category: faq.category || 'GENERAL',
        order: faq.order !== undefined ? faq.order : 1,
      };

      await setDoc(doc(db, 'faqs', faqId), finalFaq, { merge: true });
      return finalFaq;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `faqs/${faq.id || 'new'}`);
    }
  },

  async deleteFAQ(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, 'faqs', id));
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `faqs/${id}`);
    }
  },

  // ------------------ CONTACT MESSAGES ------------------
  async sendContactMessage(msg: {
    name: string;
    phone: string;
    email?: string;
    topic: string;
    message: string;
  }): Promise<boolean> {
    try {
      const msgId = generateId('msg');
      const newMsg: ContactMessage = {
        id: msgId,
        created_at: new Date().toISOString(),
        ...msg,
        read: false,
      };
      await setDoc(doc(db, 'contact_messages', msgId), newMsg);

      const notifId = generateId('notif');
      await setDoc(doc(db, 'notifications', notifId), {
        id: notifId,
        type: 'NEW_LEAD',
        title: '💬 ข้อความติดต่อใหม่จากหน้าเว็บ',
        message: `${msg.name} (${msg.phone}) - เรื่อง: ${msg.topic}`,
        created_at: new Date().toISOString(),
        read: false,
        link: '/admin/leads',
      }).catch(() => {});

      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'contact_messages');
    }
  },

  async getContactMessages(): Promise<ContactMessage[]> {
    try {
      const snap = await getDocs(collection(db, 'contact_messages'));
      const list = snap.docs.map((d) => ({ ...d.data(), id: d.id } as ContactMessage));
      return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'contact_messages');
    }
  },

  // ------------------ STORE & ABOUT SETTINGS ------------------
  async getSettings(): Promise<StoreSettings> {
    try {
      await initializeCloudDatabaseIfNeeded();
      const snap = await getDoc(doc(db, 'settings', 'main'));
      if (snap.exists()) {
        return snap.data() as StoreSettings;
      }
      return INITIAL_SETTINGS;
    } catch (error: any) {
      if (error?.code === 'permission-denied') {
        handleFirestoreError(error, OperationType.GET, 'settings/main');
      }
      return StorageService.getSettings() || INITIAL_SETTINGS;
    }
  },

  async saveSettings(settings: StoreSettings): Promise<StoreSettings> {
    try {
      await setDoc(doc(db, 'settings', 'main'), settings, { merge: true });
      return settings;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'settings/main');
    }
  },

  async getAboutUs(): Promise<AboutUsSettings> {
    try {
      await initializeCloudDatabaseIfNeeded();
      const [snap, certsSnap, actsSnap] = await Promise.all([
        getDoc(doc(db, 'about', 'company')).catch(() => null),
        getDoc(doc(db, 'about', 'certificates')).catch(() => null),
        getDoc(doc(db, 'about', 'activities')).catch(() => null),
      ]);

      if (snap && snap.exists()) {
        const data = { ...snap.data() } as AboutUsSettings;

        // Merge split certificates document if present
        if (certsSnap && certsSnap.exists()) {
          const certsData = certsSnap.data();
          if (certsData.doc1_image) data.doc1_image = certsData.doc1_image;
          if (certsData.doc2_image) data.doc2_image = certsData.doc2_image;
          if (certsData.doc1_title) data.doc1_title = certsData.doc1_title;
          if (certsData.doc2_title) data.doc2_title = certsData.doc2_title;
        }

        // Merge split activities document if present
        if (actsSnap && actsSnap.exists()) {
          const actsData = actsSnap.data();
          if (Array.isArray(actsData.activity_images) && actsData.activity_images.length > 0) {
            data.activity_images = actsData.activity_images;
          }
        }

        if (data.show_certificates === false || !data.doc1_image || data.doc1_image.includes('ขออนุญาตโฆษณาประชาสัมพันธ์')) {
          const updated: AboutUsSettings = {
            ...data,
            doc1_image: INITIAL_ABOUT_SETTINGS.doc1_image,
            doc2_image: INITIAL_ABOUT_SETTINGS.doc2_image,
            show_certificates: true,
          };
          this.saveAboutUs(updated).catch(() => {});
          return updated;
        }
        if (!data.activity_images || data.activity_images.length === 0) {
          data.activity_images = INITIAL_ABOUT_SETTINGS.activity_images;
          data.show_activities = true;
        }
        return data;
      }
      return StorageService.getAboutSettings() || INITIAL_ABOUT_SETTINGS;
    } catch (error: any) {
      if (error?.code === 'permission-denied') {
        handleFirestoreError(error, OperationType.GET, 'about/company');
      }
      return StorageService.getAboutSettings() || INITIAL_ABOUT_SETTINGS;
    }
  },

  async saveAboutUs(aboutData: AboutUsSettings): Promise<AboutUsSettings> {
    try {
      // 1. Sanitize & compress any heavy base64 images so they never exceed limits
      const sanitized = (await sanitizeAboutSettingsImages(aboutData)) as AboutUsSettings;

      // 2. Separate documents so each document has its own 1MB quota
      const certsPayload = {
        doc1_title: sanitized.doc1_title || '',
        doc1_image: sanitized.doc1_image || '',
        doc2_title: sanitized.doc2_title || '',
        doc2_image: sanitized.doc2_image || '',
        updated_at: sanitized.updated_at || new Date().toISOString(),
      };

      const actsPayload = {
        activity_images: sanitized.activity_images || [],
        updated_at: sanitized.updated_at || new Date().toISOString(),
      };

      // In main company document, store metadata and safe lightweight images
      const companyPayload = {
        title_part1: sanitized.title_part1 || '',
        title_part2: sanitized.title_part2 || '',
        company_name: sanitized.company_name || '',
        company_address: sanitized.company_address || '',
        dealer_codes: sanitized.dealer_codes || [],
        authorized_by: sanitized.authorized_by || '',
        show_certificates: sanitized.show_certificates !== false,
        show_activities: sanitized.show_activities !== false,
        doc1_title: sanitized.doc1_title || '',
        doc2_title: sanitized.doc2_title || '',
        // Only keep inline image if small (< 100KB), else rely on about/certificates
        doc1_image: (sanitized.doc1_image && sanitized.doc1_image.length < 100000) ? sanitized.doc1_image : '',
        doc2_image: (sanitized.doc2_image && sanitized.doc2_image.length < 100000) ? sanitized.doc2_image : '',
        updated_at: sanitized.updated_at || new Date().toISOString(),
      };

      // Write to Firestore split documents in parallel
      await Promise.all([
        setDoc(doc(db, 'about', 'company'), companyPayload, { merge: true }),
        setDoc(doc(db, 'about', 'certificates'), certsPayload, { merge: true }),
        setDoc(doc(db, 'about', 'activities'), actsPayload, { merge: true }),
      ]);

      StorageService.saveAboutSettings(sanitized);
      return sanitized;
    } catch (error) {
      console.warn('Firestore about save warning, falling back to local storage:', error);
      StorageService.saveAboutSettings(aboutData);
      handleFirestoreError(error, OperationType.WRITE, 'about/company');
    }
  },

  // ------------------ NOTIFICATIONS ------------------
  async getNotifications(): Promise<AppNotification[]> {
    try {
      const snap = await getDocs(collection(db, 'notifications'));
      const list = snap.docs.map((d) => ({ ...d.data(), id: d.id } as AppNotification));
      return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'notifications');
    }
  },

  subscribeNotifications(callback: (notifications: AppNotification[]) => void): Unsubscribe {
    const colRef = collection(db, 'notifications');
    return onSnapshot(
      colRef,
      (snap) => {
        const list = snap.docs.map((d) => ({ ...d.data(), id: d.id } as AppNotification));
        list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        callback(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'notifications');
      }
    );
  },

  async markNotificationAsRead(id: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'notifications', id), { read: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `notifications/${id}`);
    }
  },

  async markAllNotificationsAsRead(): Promise<void> {
    try {
      const snap = await getDocs(collection(db, 'notifications'));
      const batch = writeBatch(db);
      snap.docs.forEach((d) => {
        batch.update(d.ref, { read: true });
      });
      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'notifications');
    }
  },

  // ------------------ ADMIN USERS ------------------
  async getAdminUsers(): Promise<AdminUser[]> {
    try {
      await initializeCloudDatabaseIfNeeded();
      const snap = await getDocs(collection(db, 'admin_users'));
      const list = snap.docs.map((d) => ({ ...d.data(), id: d.id } as AdminUser));
      return list.length > 0 ? list : [...INITIAL_ADMIN_USERS];
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'admin_users');
    }
  },

  async saveAdminUser(user: AdminUser): Promise<AdminUser> {
    try {
      await setDoc(doc(db, 'admin_users', user.id), user, { merge: true });
      return user;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `admin_users/${user.id}`);
    }
  },

  // ------------------ DASHBOARD STATS ------------------
  async getDashboardStats() {
    try {
      const leads = await this.getLeads();
      const applications = await this.getApplications();
      const todayStr = new Date().toISOString().slice(0, 10);

      const todayLeads = leads.filter((l) => l.created_at.slice(0, 10) === todayStr);
      const completed = leads.filter((l) => l.status === 'COMPLETED');

      const leadsByStatus: Record<LeadStatus, number> = {
        NEW: leads.filter((l) => l.status === 'NEW').length,
        CONTACTING: leads.filter((l) => l.status === 'CONTACTING').length,
        CHECKING_AREA: leads.filter((l) => l.status === 'CHECKING_AREA').length,
        WAITING_DOCUMENT: leads.filter((l) => l.status === 'WAITING_DOCUMENT').length,
        WAITING_CONFIRM: leads.filter((l) => l.status === 'WAITING_CONFIRM').length,
        APPOINTMENT: leads.filter((l) => l.status === 'APPOINTMENT').length,
        INSTALLING: leads.filter((l) => l.status === 'INSTALLING').length,
        COMPLETED: completed.length,
        CANCELLED: leads.filter((l) => l.status === 'CANCELLED').length,
      };

      const conversionRate = leads.length > 0 ? ((completed.length / leads.length) * 100).toFixed(1) : '0.0';
      const totalMonthlyRevenue = completed.reduce((acc, curr) => acc + (curr.package_price || 699), 0);

      return {
        todayLeads: todayLeads.length,
        totalLeads: leads.length,
        totalApplications: applications.length,
        completedInstalls: completed.length,
        conversionRate,
        totalMonthlyRevenue,
        leadsByStatus,
        todayAppointments: leads.filter(
          (l) => l.status === 'APPOINTMENT' && l.appointment_date === todayStr
        ),
      };
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, 'stats');
    }
  },

  // Convenience Aliases for all existing call sites
  async getAdminStats() {
    return this.getDashboardStats();
  },

  async getCoverageCheckLeads(filters?: any) {
    return this.getLeads(filters);
  },

  async createPackage(pkg: Partial<PackageItem>) {
    return this.savePackage(pkg);
  },

  async updatePackage(id: string, pkg: Partial<PackageItem>) {
    return this.savePackage({ ...pkg, id });
  },

  async createPromotion(promo: Partial<PromotionItem>) {
    return this.savePromotion(promo);
  },

  async updatePromotion(id: string, promo: Partial<PromotionItem>) {
    return this.savePromotion({ ...promo, id });
  },

  async getEquipmentList() {
    return this.getEquipment();
  },

  async getFaqs() {
    return this.getFAQs();
  },

  async createApplication(data: Partial<ApplicationItem>) {
    return this.submitApplication(data);
  },

  async getStoreSettings(): Promise<StoreSettings> {
    return this.getSettings();
  },

  async saveStoreSettings(settings: StoreSettings): Promise<StoreSettings> {
    return this.saveSettings(settings);
  },

  async trackApplication(queryText: string) {
    try {
      const clean = queryText.trim().toLowerCase();
      const cleanDigits = queryText.replace(/\D/g, '');

      const [applications, leads] = await Promise.all([
        this.getApplications(),
        this.getLeads(),
      ]);

      const app = applications.find(
        (a) =>
          (a.application_no && a.application_no.toLowerCase() === clean) ||
          (a.tracking_id && a.tracking_id.toLowerCase() === clean) ||
          (cleanDigits.length >= 9 && a.phone.replace(/\D/g, '').includes(cleanDigits))
      );

      const lead = leads.find(
        (l) =>
          (l.lead_no && l.lead_no.toLowerCase() === clean) ||
          (l.tracking_id && l.tracking_id.toLowerCase() === clean) ||
          (cleanDigits.length >= 9 && l.phone.replace(/\D/g, '').includes(cleanDigits))
      );

      return { application: app || null, lead: lead || null };
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, 'track');
    }
  },
};
