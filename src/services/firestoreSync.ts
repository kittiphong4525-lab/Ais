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
} from 'firebase/firestore';
import { db } from './firebase';
import { StorageService } from './storage';
import {
  PackageItem,
  PromotionItem,
  BannerItem,
  LeadItem,
  ApplicationItem,
  EquipmentItem,
  ArticleItem,
  FAQItem,
  StoreSettings,
  AboutUsSettings,
} from '../types';

export const FirestoreSyncService = {
  // Sync initial data from local storage/seeds to Firestore if collection is empty
  async initFirestoreSync() {
    try {
      // Check and sync packages
      const pkgSnap = await getDocs(collection(db, 'packages'));
      if (pkgSnap.empty) {
        const localPkgs = StorageService.getPackages();
        for (const pkg of localPkgs) {
          await setDoc(doc(db, 'packages', pkg.id), pkg);
        }
      }

      // Check and sync banners
      const bannerSnap = await getDocs(collection(db, 'banners'));
      if (bannerSnap.empty) {
        const localBanners = StorageService.getBanners();
        for (const banner of localBanners) {
          await setDoc(doc(db, 'banners', banner.id), banner);
        }
      }

      // Check and sync promotions
      const promoSnap = await getDocs(collection(db, 'promotions'));
      if (promoSnap.empty) {
        const localPromos = StorageService.getPromotions();
        for (const promo of localPromos) {
          await setDoc(doc(db, 'promotions', promo.id), promo);
        }
      }

      // Check and sync settings
      const settingsSnap = await getDoc(doc(db, 'settings', 'main'));
      if (!settingsSnap.exists()) {
        const localSettings = StorageService.getSettings();
        await setDoc(doc(db, 'settings', 'main'), localSettings);
      }
    } catch (err) {
      console.warn('Firestore initial sync note (will fallback to local cache):', err);
    }
  },

  // Save Lead to Firestore & local
  async saveLead(lead: LeadItem) {
    try {
      await setDoc(doc(db, 'leads', lead.id), lead);
    } catch (e) {
      console.error('Failed to save lead to Firestore:', e);
    }
  },

  // Update Lead in Firestore
  async updateLead(leadId: string, data: Partial<LeadItem>) {
    try {
      await updateDoc(doc(db, 'leads', leadId), data);
    } catch (e) {
      console.error('Failed to update lead in Firestore:', e);
    }
  },

  // Delete Lead in Firestore
  async deleteLead(leadId: string) {
    try {
      await deleteDoc(doc(db, 'leads', leadId));
    } catch (e) {
      console.error('Failed to delete lead in Firestore:', e);
    }
  },

  // Save Application to Firestore
  async saveApplication(app: ApplicationItem) {
    try {
      await setDoc(doc(db, 'applications', app.id), app);
    } catch (e) {
      console.error('Failed to save application to Firestore:', e);
    }
  },

  // Update Application in Firestore
  async updateApplication(appId: string, data: Partial<ApplicationItem>) {
    try {
      await updateDoc(doc(db, 'applications', appId), data);
    } catch (e) {
      console.error('Failed to update application in Firestore:', e);
    }
  },

  // Delete Application in Firestore
  async deleteApplication(appId: string) {
    try {
      await deleteDoc(doc(db, 'applications', appId));
    } catch (e) {
      console.error('Failed to delete application in Firestore:', e);
    }
  },

  // Save Package in Firestore
  async savePackage(pkg: PackageItem) {
    try {
      await setDoc(doc(db, 'packages', pkg.id), pkg);
    } catch (e) {
      console.error('Failed to save package to Firestore:', e);
    }
  },

  // Delete Package in Firestore
  async deletePackage(id: string) {
    try {
      await deleteDoc(doc(db, 'packages', id));
    } catch (e) {
      console.error('Failed to delete package in Firestore:', e);
    }
  },

  // Save Banner in Firestore
  async saveBanner(banner: BannerItem) {
    try {
      await setDoc(doc(db, 'banners', banner.id), banner);
    } catch (e) {
      console.error('Failed to save banner to Firestore:', e);
    }
  },

  // Delete Banner in Firestore
  async deleteBanner(id: string) {
    try {
      await deleteDoc(doc(db, 'banners', id));
    } catch (e) {
      console.error('Failed to delete banner in Firestore:', e);
    }
  },

  // Save Promotion in Firestore
  async savePromotion(promo: PromotionItem) {
    try {
      await setDoc(doc(db, 'promotions', promo.id), promo);
    } catch (e) {
      console.error('Failed to save promotion to Firestore:', e);
    }
  },

  // Delete Promotion in Firestore
  async deletePromotion(id: string) {
    try {
      await deleteDoc(doc(db, 'promotions', id));
    } catch (e) {
      console.error('Failed to delete promotion in Firestore:', e);
    }
  },

  // Save Settings in Firestore
  async saveSettings(settings: StoreSettings) {
    try {
      await setDoc(doc(db, 'settings', 'main'), settings);
    } catch (e) {
      console.error('Failed to save settings to Firestore:', e);
    }
  },

  // Save About settings
  async saveAboutSettings(settings: AboutUsSettings) {
    try {
      await setDoc(doc(db, 'about', 'main'), settings);
    } catch (e) {
      console.error('Failed to save about settings to Firestore:', e);
    }
  },
};
