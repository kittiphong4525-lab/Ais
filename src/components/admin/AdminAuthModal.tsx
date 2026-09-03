import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lock,
  Unlock,
  Shield,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  X,
  UserCheck,
  Smartphone,
  ArrowRight,
  Sparkles,
  RefreshCw,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  isFullPage?: boolean;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  isFullPage = false,
}) => {
  const { verifyPin, adminPin } = useAuth();
  const [pin, setPin] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('ADMIN');
  const [inputMode, setInputMode] = useState<'PIN' | 'TEXT'>('PIN');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [shake, setShake] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError('');
      setIsSuccess(false);
      setShake(false);
    }
  }, [isOpen]);

  // Handle number click in PIN keypad
  const handleKeypadPress = (digit: string) => {
    if (isSuccess) return;
    setError('');
    if (pin.length < 6) {
      const nextPin = pin + digit;
      setPin(nextPin);

      // Auto submit when 4 or more digits match
      if (nextPin.length === 4) {
        attemptLogin(nextPin);
      }
    }
  };

  const handleBackspace = () => {
    if (isSuccess) return;
    setError('');
    setPin((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    if (isSuccess) return;
    setError('');
    setPin('');
  };

  const attemptLogin = async (codeToVerify?: string) => {
    const code = (codeToVerify || pin).trim();
    if (!code) {
      setError('กรุณาระบุรหัสผ่านเข้าสู่ระบบ');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    const success = await verifyPin(code, selectedRole);
    if (success) {
      setIsSuccess(true);
      setError('');
      setTimeout(() => {
        onSuccess();
      }, 600);
    } else {
      setError('รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง');
      setShake(true);
      setTimeout(() => {
        setShake(false);
        setPin('');
      }, 500);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    attemptLogin();
  };

  if (!isOpen && !isFullPage) return null;

  const content = (
    <div className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 relative text-slate-100 backdrop-blur-xl">
      {/* Glow decorative gradients */}
      <div className="absolute -top-16 -left-16 w-36 h-36 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-36 h-36 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Close button if modal */}
      {!isFullPage && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-slate-700"
          title="ปิด"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Header */}
      <div className="text-center space-y-2 mb-6">
        <motion.div
          animate={
            isSuccess
              ? { scale: [1, 1.2, 1], rotate: [0, 10, 0] }
              : shake
              ? { x: [-10, 10, -10, 10, 0] }
              : {}
          }
          className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl transition-all ${
            isSuccess
              ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/40'
              : 'bg-gradient-to-br from-emerald-400 via-lime-400 to-orange-500 text-slate-950 shadow-orange-500/25'
          }`}
        >
          {isSuccess ? (
            <Unlock className="w-8 h-8 stroke-[2.5]" />
          ) : (
            <Lock className="w-8 h-8 stroke-[2.5]" />
          )}
        </motion.div>

        <div className="pt-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-1">
            <Shield className="w-3.5 h-3.5" />
            <span>ระบบยืนยันตัวตนผู้ดูแลระบบ (Ctrl + M)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            เข้าสู่ระบบจัดการหลังบ้าน
          </h2>
          <p className="text-xs text-slate-400">
            กรุณาระบุรหัส PIN หรือรหัสผ่านเจ้าหน้าที่เพื่อดำเนินการ
          </p>
        </div>
      </div>

      {/* Role Selection */}
      <div className="grid grid-cols-2 gap-2 mb-5 p-1 rounded-xl bg-slate-950/80 border border-slate-800">
        <button
          type="button"
          onClick={() => setSelectedRole('ADMIN')}
          className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            selectedRole === 'ADMIN'
              ? 'bg-gradient-to-r from-emerald-400 via-lime-400 to-orange-500 text-slate-950 font-black shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>ผู้จัดการ (Admin)</span>
        </button>
        <button
          type="button"
          onClick={() => setSelectedRole('STAFF')}
          className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            selectedRole === 'STAFF'
              ? 'bg-gradient-to-r from-emerald-400 via-lime-400 to-orange-500 text-slate-950 font-black shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>เจ้าหน้าที่ (Staff)</span>
        </button>
      </div>

      {/* Input Mode Toggle (PIN vs Text) */}
      <div className="flex items-center justify-between text-xs text-slate-400 mb-3 px-1">
        <span>โหมดป้อนรหัส:</span>
        <button
          type="button"
          onClick={() => {
            setInputMode(inputMode === 'PIN' ? 'TEXT' : 'PIN');
            setPin('');
            setError('');
          }}
          className="text-emerald-400 hover:text-emerald-300 font-semibold underline flex items-center gap-1 cursor-pointer"
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>{inputMode === 'PIN' ? 'สลับเป็นพิมพ์รหัสผ่าน' : 'สลับเป็นแป้น PIN ตัวเลข'}</span>
        </button>
      </div>

      {/* Form / PIN Entry */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {inputMode === 'PIN' ? (
          <div className="space-y-4">
            {/* PIN Indicator Dots */}
            <motion.div
              animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
              className="flex justify-center items-center gap-3 py-3 px-4 rounded-2xl bg-slate-950 border border-slate-800"
            >
              {[0, 1, 2, 3].map((index) => {
                const isFilled = pin.length > index;
                return (
                  <motion.div
                    key={index}
                    initial={false}
                    animate={{
                      scale: isFilled ? [1, 1.25, 1] : 1,
                      backgroundColor: isFilled ? '#34D399' : '#1E293B',
                      borderColor: isFilled ? '#10B981' : '#334155',
                    }}
                    transition={{ duration: 0.2 }}
                    className="w-4 h-4 rounded-full border-2 flex items-center justify-center shadow-inner"
                  />
                );
              })}
            </motion.div>

            {/* Keypad Grid */}
            <div className="grid grid-cols-3 gap-2.5">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleKeypadPress(digit)}
                  className="h-12 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-bold text-lg border border-slate-700/60 active:scale-95 transition-all shadow-md cursor-pointer flex items-center justify-center select-none"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={handleClear}
                className="h-12 rounded-xl bg-slate-800/40 hover:bg-slate-800 text-slate-400 font-semibold text-xs border border-slate-700/40 active:scale-95 transition-all cursor-pointer flex items-center justify-center select-none"
              >
                ล้าง
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress('0')}
                className="h-12 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-bold text-lg border border-slate-700/60 active:scale-95 transition-all shadow-md cursor-pointer flex items-center justify-center select-none"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleBackspace}
                className="h-12 rounded-xl bg-slate-800/40 hover:bg-slate-800 text-slate-300 font-bold text-sm border border-slate-700/40 active:scale-95 transition-all cursor-pointer flex items-center justify-center select-none"
              >
                ⌫
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError('');
                }}
                placeholder="ระบุรหัสผ่านเข้าสู่ระบบ"
                autoFocus
                className="w-full px-4 py-3.5 pr-11 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-hidden font-mono transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-400 via-lime-400 to-orange-500 hover:from-emerald-300 hover:via-lime-300 hover:to-orange-400 text-slate-950 font-black text-sm shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>ยืนยันรหัสผ่าน</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              key="auth-error-msg"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </motion.div>
          )}
          {isSuccess && (
            <motion.div
              key="auth-success-msg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-center gap-2 font-bold"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>ยืนยันรหัสถูกต้อง กำลังเข้าสู่ระบบหลังบ้าน...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );

  if (isFullPage) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        {content}
      </div>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div key="admin-auth-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative z-10 w-full max-w-md"
          >
            {content}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
