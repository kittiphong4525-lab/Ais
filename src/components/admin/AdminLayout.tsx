import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import {
  LayoutDashboard,
  Users,
  Package,
  Flame,
  Image as ImageIcon,
  FileText,
  BarChart3,
  BookOpen,
  LogOut,
  ExternalLink,
  Bell,
  Menu,
  X,
  Shield,
  UserCheck,
  CheckCircle,
  Award,
  KeyRound,
  Lock,
} from 'lucide-react';

interface AdminLayoutProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onNavigateFrontend: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  onNavigateFrontend,
  children,
}) => {
  const { user, logout, lockAdmin, allUsers, switchUser, adminPin, setAdminPin } = useAuth();
  const { unreadCount, notifications, markAllAsRead, addToast } = useNotification();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [newPinInput, setNewPinInput] = useState('');
  const [pinChangeError, setPinChangeError] = useState('');

  const handleLogout = () => {
    logout();
    addToast({
      type: 'info',
      title: 'ออกจากระบบสำเร็จ',
      message: 'ระบบหลังบ้านถูกล็อคเรียบร้อย (ต้องแตะ 5 ครั้งเพื่อเข้าใหม่)',
    });
    onNavigateFrontend();
  };

  const handleSaveNewPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPinInput.trim().length < 4) {
      setPinChangeError('กรุณาระบุรหัส PIN 4 หลักขึ้นไป');
      return;
    }
    const success = await setAdminPin(newPinInput.trim());
    if (success) {
      addToast({
        type: 'success',
        title: 'เปลี่ยนรหัส PIN สำเร็จ',
        message: `รหัสเข้าหลังบ้านใหม่คือ: ${newPinInput.trim()}`,
      });
      setShowPinModal(false);
      setNewPinInput('');
      setPinChangeError('');
    } else {
      setPinChangeError('ไม่สามารถบันทึกรหัส PIN ได้');
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'แดชบอร์ดภาพรวม', icon: LayoutDashboard },
    { id: 'leads', label: 'จัดการลูกค้า & ใบงาน (CRM)', icon: Users, badgeCount: unreadCount },
    { id: 'packages', label: 'จัดการแพ็กเกจเน็ต', icon: Package },
    { id: 'banners', label: 'จัดการแบนเนอร์ & สไลเดอร์', icon: ImageIcon },
    { id: 'promotions', label: 'จัดการโปรโมชั่น', icon: Flame },
    { id: 'about', label: 'เกี่ยวกับเรา & ใบอนุญาต A4', icon: Award },
    { id: 'reports', label: 'รายงานยอดขาย & สถิติ', icon: BarChart3 },
    { id: 'setup-guide', label: 'คู่มือติดตั้ง & Supabase', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      {/* Mobile Top bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-transparent overflow-hidden p-0.5 flex items-center justify-center shrink-0">
            <img
              src="/logo.png"
              alt="AIS FIBRE Logo"
              className="w-full h-full object-contain drop-shadow-md"
            />
          </div>
          <div>
            <span className="font-bold text-sm text-white">AIS Net999</span>
            <span className="text-[10px] text-emerald-400 block font-mono">BACKEND CRM</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg bg-slate-800 text-slate-300"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold flex items-center justify-center text-white">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-800 text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Desktop & Mobile Drawer */}
      <aside
        className={`${
          mobileMenuOpen ? 'flex' : 'hidden'
        } md:flex flex-col w-full md:w-64 bg-slate-900 border-r border-slate-800 p-4 space-y-6 shrink-0 z-30 fixed md:sticky top-0 md:top-0 h-auto md:h-screen overflow-y-auto`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-transparent overflow-hidden p-0.5 flex items-center justify-center shrink-0">
              <img
                src="/logo.png"
                alt="AIS FIBRE Logo"
                className="w-full h-full object-contain drop-shadow-md"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm text-white font-display">AIS FIBRE</span>
                <span className="text-[10px] font-bold px-1 rounded bg-emerald-500 text-slate-950">ADMIN</span>
              </div>
              <p className="text-[10px] text-slate-400">ระบบจัดการตัวแทน 999</p>
            </div>
          </div>
        </div>

        {/* Current User Info & Role Switcher */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-400" />
              <span>ผู้ใช้งาน:</span>
            </span>
            <span className="font-bold text-emerald-300">{user?.role || 'ADMIN'}</span>
          </div>
          <p className="text-xs font-semibold text-white truncate">{user?.name}</p>

          {/* Staff Switcher */}
          <div className="pt-1">
            <label className="text-[10px] text-slate-500 block mb-1">บัญชีผู้ปฏิบัติงาน:</label>
            <select
              value={user?.id}
              onChange={(e) => switchUser(e.target.value)}
              className="w-full text-[11px] py-1 px-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 focus:outline-none focus:border-emerald-500"
            >
              {allUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.role})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badgeCount && item.badgeCount > 0 ? (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-slate-950 text-emerald-400' : 'bg-rose-500 text-white'
                    }`}
                  >
                    {item.badgeCount}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <button
            type="button"
            onClick={() => {
              setNewPinInput(adminPin || '9999');
              setPinChangeError('');
              setShowPinModal(true);
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-800 hover:border-emerald-500/40 text-xs font-semibold transition-all cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>เปลี่ยนรหัส PIN ({adminPin || '9999'})</span>
          </button>

          <button
            onClick={onNavigateFrontend}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
            <span>กลับหน้าเว็บไซต์ลูกค้า</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 text-xs font-semibold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>ล็อค & ออกจากระบบ</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950">
        {/* Top Header Bar for Desktop */}
        <header className="hidden md:flex items-center justify-between h-16 px-8 bg-slate-900/80 border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-bold text-white capitalize">
              {menuItems.find((m) => m.id === currentTab)?.label || 'ระบบหลังบ้าน'}
            </h1>
            <span className="text-xs text-slate-500">|</span>
            <span className="text-xs text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/20">
              สถานะระบบ: ออนไลน์ 100%
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* PIN Settings Button */}
            <button
              type="button"
              onClick={() => {
                setNewPinInput(adminPin || '9999');
                setPinChangeError('');
                setShowPinModal(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>รหัส PIN: {adminPin || '9999'}</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold flex items-center justify-center text-white animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-4 space-y-3 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-white">การแจ้งเตือนคำขอใหม่</span>
                    <button
                      onClick={markAllAsRead}
                      className="text-[10px] text-emerald-400 hover:underline"
                    >
                      อ่านทั้งหมด
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-4">ไม่มีการแจ้งเตือน</p>
                    ) : (
                      notifications.slice(0, 5).map((n) => (
                        <div
                          key={n.id}
                          className={`p-2.5 rounded-xl border text-xs space-y-1 ${
                            n.read
                              ? 'bg-slate-950/50 border-slate-800 text-slate-400'
                              : 'bg-emerald-950/30 border-emerald-500/30 text-slate-200'
                          }`}
                        >
                          <p className="font-bold text-white">{n.title}</p>
                          <p className="text-[11px] text-slate-300">{n.message}</p>
                          <span className="text-[9px] text-slate-500 block">
                            {new Date(n.created_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Customer Site button */}
            <button
              onClick={onNavigateFrontend}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              <span>ดูหน้าร้าน</span>
            </button>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
              title="ล็อคระบบ & ออกจากระบบ"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Sub-page Render */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* Change PIN Modal Dialog */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">ตั้งค่ารหัส PIN หลังบ้าน</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPinModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewPin} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1.5">
                  รหัส PIN ใหม่ (อย่างน้อย 4 หลัก)
                </label>
                <input
                  type="password"
                  maxLength={8}
                  value={newPinInput}
                  onChange={(e) => {
                    setNewPinInput(e.target.value);
                    setPinChangeError('');
                  }}
                  placeholder="กรอกรหัสผ่านใหม่ (4-8 หลัก)"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-center text-lg tracking-widest focus:outline-none focus:border-emerald-500"
                  autoFocus
                />
              </div>

              {pinChangeError && (
                <p className="text-xs text-rose-400 text-center">{pinChangeError}</p>
              )}

              <div className="text-[11px] text-slate-400 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80 space-y-1">
                <p className="font-semibold text-slate-300">📌 หมายเหตุความปลอดภัย:</p>
                <p>• ใช้รหัสนี้ในการปลดล็อคเข้าสู่ระบบจัดการหลังบ้าน (กดปุ่มลัด Ctrl + M)</p>
                <p>• กรุณาจดจำรหัสผ่านของท่านอย่างปลอดภัย</p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 via-lime-400 to-orange-500 hover:brightness-110 text-slate-950 text-xs font-black transition-all cursor-pointer shadow-md"
                >
                  บันทึกรหัส PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
