import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ToastContainer } from './components/common/ToastContainer';
import { Navbar } from './components/common/Navbar';
import { BottomNavigation } from './components/common/BottomNavigation';
import { Footer } from './components/common/Footer';
import { FloatingContact } from './components/common/FloatingContact';

// Frontend Pages
import { HomePage } from './pages/HomePage';
import { PackagesPage } from './pages/PackagesPage';
import { PackageDetailPage } from './pages/PackageDetailPage';
import { PromotionsPage } from './pages/PromotionsPage';
import { CoverageCheckPage } from './pages/CoverageCheckPage';
import { ApplyPage } from './pages/ApplyPage';
import { TrackApplicationPage } from './pages/TrackApplicationPage';
import { EquipmentPage } from './pages/EquipmentPage';
import { ArticlesPage } from './pages/ArticlesPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { FAQPage } from './pages/FAQPage';
import { ContactPage } from './pages/ContactPage';
import { AboutUsPage } from './pages/AboutUsPage';

// Admin Pages & Layout
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminAuthModal } from './components/admin/AdminAuthModal';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminLeadsPage } from './pages/admin/AdminLeadsPage';
import { AdminPackagesPage } from './pages/admin/AdminPackagesPage';
import { AdminBannersPage } from './pages/admin/AdminBannersPage';
import { AdminPromotionsPage } from './pages/admin/AdminPromotionsPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminAboutPage } from './pages/admin/AdminAboutPage';
import { SetupGuidePage } from './pages/SetupGuidePage';
import { FirestoreSyncService } from './services/firestoreSync';

interface NavigationState {
  path: string;
  params?: any;
}

function MainApp() {
  const { isPinUnlocked } = useAuth();
  const { isDark } = useTheme();
  const [nav, setNav] = useState<NavigationState>({ path: '/' });
  const [adminTab, setAdminTab] = useState<string>('dashboard');
  const [showSecretAuthModal, setShowSecretAuthModal] = useState<boolean>(false);

  useEffect(() => {
    FirestoreSyncService.initFirestoreSync();
  }, []);

  const isAdminRoute = nav.path.startsWith('/admin') || nav.path === '/setup-guide';

  // Handle Ctrl+M / Cmd+M shortcut to access admin back-office
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl+m or Cmd+m
      if ((e.ctrlKey || e.metaKey) && (e.key === 'm' || e.key === 'M')) {
        e.preventDefault();
        if (isAdminRoute) {
          // If already in admin back-office, toggle back to home page
          setNav({ path: '/' });
        } else {
          // If already unlocked, go to admin dashboard directly, else show login modal
          if (isPinUnlocked) {
            setNav({ path: '/admin/dashboard' });
          } else {
            setShowSecretAuthModal(true);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminRoute, isPinUnlocked]);

  // Handle navigation
  const handleNavigate = (newPath: string, params?: any) => {
    if (newPath === '/apply' || newPath.startsWith('/apply')) {
      window.open('https://line.me/ti/p/@aisfibre999', '_blank');
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setNav({ path: newPath, params });
  };

  // Admin Section Protection & Rendering
  if (isAdminRoute) {
    if (!isPinUnlocked) {
      return (
        <AdminAuthModal
          isOpen={true}
          isFullPage={true}
          onClose={() => handleNavigate('/')}
          onSuccess={() => {
            // Unlocked - will re-render AdminLayout
          }}
        />
      );
    }

    const activeSubTab = nav.path === '/setup-guide' ? 'setup-guide' : adminTab;

    return (
      <AdminLayout
        currentTab={activeSubTab}
        onSelectTab={(tab) => {
          setAdminTab(tab);
          if (tab === 'setup-guide') {
            setNav({ path: '/setup-guide' });
          } else {
            setNav({ path: `/admin/${tab}` });
          }
        }}
        onNavigateFrontend={() => handleNavigate('/')}
      >
        {activeSubTab === 'dashboard' && (
          <AdminDashboardPage onSelectTab={(tab) => {
            setAdminTab(tab);
            setNav({ path: `/admin/${tab}` });
          }} />
        )}
        {activeSubTab === 'leads' && <AdminLeadsPage />}
        {activeSubTab === 'packages' && <AdminPackagesPage />}
        {activeSubTab === 'banners' && <AdminBannersPage />}
        {activeSubTab === 'promotions' && <AdminPromotionsPage />}
        {activeSubTab === 'about' && <AdminAboutPage onNavigate={handleNavigate} />}
        {activeSubTab === 'reports' && <AdminReportsPage />}
        {activeSubTab === 'setup-guide' && <SetupGuidePage />}
      </AdminLayout>
    );
  }

  // Customer Frontend Rendering
  const renderFrontendPage = () => {
    const { path, params } = nav;

    if (path === '/') {
      return <HomePage onNavigate={handleNavigate} />;
    }
    if (path === '/packages') {
      return (
        <PackagesPage
          onNavigate={handleNavigate}
          initialCategory={params?.category}
        />
      );
    }
    if (path.startsWith('/packages/')) {
      const slug = path.replace('/packages/', '');
      return (
        <PackageDetailPage
          slug={slug}
          onNavigate={handleNavigate}
          passedPackage={params?.package}
        />
      );
    }
    if (path === '/promotions') {
      return <PromotionsPage onNavigate={handleNavigate} />;
    }
    if (path === '/check-area') {
      return (
        <CoverageCheckPage
          onNavigate={handleNavigate}
          selectedPackage={params?.selectedPackage}
        />
      );
    }
    if (path === '/apply') {
      window.location.href = 'https://line.me/ti/p/@aisfibre999';
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-[#06C755] text-white flex items-center justify-center shadow-xl animate-bounce">
            <span className="text-2xl font-black">LINE</span>
          </div>
          <h2 className="text-xl font-bold text-white">กำลังนำท่านไปยัง LINE Official...</h2>
          <p className="text-sm text-slate-300">สมัครติดตั้งเน็ตบ้านได้ทันทีผ่านไลน์ @aisfibre999</p>
          <a
            href="https://line.me/ti/p/@aisfibre999"
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 rounded-2xl bg-[#06C755] text-white font-bold text-sm shadow-lg hover:brightness-110 transition-all"
          >
            เปิด LINE สมัครติดตั้ง (@aisfibre999)
          </a>
        </div>
      );
    }
    if (path === '/track') {
      return <ArticlesPage onNavigate={handleNavigate} />;
    }
    if (path === '/equipment') {
      return <EquipmentPage onNavigate={handleNavigate} />;
    }
    if (path === '/articles') {
      return <ArticlesPage onNavigate={handleNavigate} />;
    }
    if (path.startsWith('/articles/')) {
      const slug = path.replace('/articles/', '');
      return (
        <ArticleDetailPage
          slug={slug}
          onNavigate={handleNavigate}
          passedArticle={params?.article}
        />
      );
    }
    if (path === '/faq') {
      return <FAQPage onNavigate={handleNavigate} />;
    }
    if (path === '/about') {
      return <AboutUsPage onNavigate={handleNavigate} />;
    }
    if (path === '/contact') {
      return <ContactPage onNavigate={handleNavigate} />;
    }

    // Default Fallback
    return <HomePage onNavigate={handleNavigate} />;
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 selection:bg-emerald-500 selection:text-white relative ${
      isDark ? 'bg-black text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Top Navigation */}
      <Navbar
        currentPath={nav.path}
        onNavigate={handleNavigate}
        onOpenAdminAuth={() => setShowSecretAuthModal(true)}
      />

      {/* Main Page Body with Ambient Background Glow */}
      <main className="flex-1 pb-16 md:pb-0 relative z-0 overflow-hidden">
        {/* Global ambient background glow orbs (green, lime, and orange blurred circles) */}
        <div className={`fixed top-[-10%] left-[-5%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] rounded-full blur-[120px] pointer-events-none -z-10 transition-opacity duration-300 ${
          isDark ? 'bg-emerald-500/10 opacity-100' : 'bg-emerald-500/15 opacity-60'
        }`} />
        <div className={`fixed top-[20%] right-[-10%] w-[50vw] h-[50vw] max-w-[650px] max-h-[650px] rounded-full blur-[140px] pointer-events-none -z-10 transition-opacity duration-300 ${
          isDark ? 'bg-orange-500/10 opacity-100' : 'bg-orange-500/12 opacity-60'
        }`} />
        <div className={`fixed bottom-[10%] left-[10%] w-[40vw] h-[40vw] max-w-[550px] max-h-[550px] rounded-full blur-[130px] pointer-events-none -z-10 transition-opacity duration-300 ${
          isDark ? 'bg-lime-500/8 opacity-100' : 'bg-lime-500/10 opacity-60'
        }`} />

        {renderFrontendPage()}
      </main>

      {/* Secret Ctrl+M Admin Password Modal */}
      <AdminAuthModal
        isOpen={showSecretAuthModal}
        onClose={() => setShowSecretAuthModal(false)}
        onSuccess={() => {
          setShowSecretAuthModal(false);
          handleNavigate('/admin/dashboard');
        }}
      />

      {/* Bottom Floating Contact Hotline & Line */}
      <FloatingContact onNavigate={handleNavigate} />

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenAdminAuth={() => setShowSecretAuthModal(true)}
      />

      {/* Mobile Bottom Navigation */}
      <BottomNavigation currentPath={nav.path} onNavigate={handleNavigate} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <MainApp />
          <ToastContainer />
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
