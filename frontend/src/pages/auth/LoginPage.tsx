import React, { useState } from 'react';
import { AuthCardLayout } from '../../components/auth/AuthCardLayout';
import { loginWithEmail, loginWithGoogle, resetPassword, saveUserToFirestore } from '../../services/firebaseConfig';
import { useAuth } from '../../context/AuthContext';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
  KeyRound,
  AlertTriangle,
} from 'lucide-react';

interface LoginPageProps {
  onNavigateToRegister: () => void;
  onLoginSuccess: (targetRoute: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onNavigateToRegister,
  onLoginSuccess,
}) => {
  const { syncProfile } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Password reset modal state
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);
  const [resetErrorMessage, setResetErrorMessage] = useState<string | null>(null);

  // Helper to map Firebase errors to clear, polite Arabic messages
  const mapAuthErrorToArabic = (err: any): string => {
    const code = err?.code || '';
    switch (code) {
      case 'auth/invalid-email':
        return 'صيغة البريد الإلكتروني غير صالحة. تأكد من كتابة البريد مثل: name@example.com';
      case 'auth/user-not-found':
        return 'لا يوجد حساب مسجل بهذا البريد الإلكتروني. يمكنك إنشاء حساب جديد بكل سهولة.';
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'بيانات الدخول غير صحيحة. يرجى التأكد من كتابة البريد وكلمة المرور بدقة.';
      case 'auth/too-many-requests':
        return 'تم إيقاف المحاولات مؤقتاً لحماية أمان الحساب. يرجى الانتظار دقيقة ثم المحاولة مجدداً.';
      case 'auth/network-request-failed':
        return 'تعذر الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت والمحاولة مجدداً.';
      case 'auth/popup-blocked':
        return 'قام المتصفح بحظر نافذة Google المنبثقة. يرجى السماح بالنوافذ المنبثقة من شريط العنوان.';
      case 'auth/popup-closed-by-user':
        return 'تم إغلاق نافذة تسجيل الدخول قبل إتمام المصادقة.';
      case 'auth/user-disabled':
        return 'هذا الحساب تم تعطيله مؤقتاً. يرجى مراجعة إدارة المنصة.';
      default:
        return 'حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.';
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setIsCapsLockOn(e.getModifierState('CapsLock'));
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || isLoading) return;

    setErrorMessage(null);
    setIsLoading(true);

    try {
      const userCredential = await loginWithEmail(email.trim(), password);
      
      // Save / verify in Cloud Firestore
      await saveUserToFirestore({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        role: 'STD',
      });

      // Synchronize with backend API
      const profile = await syncProfile(userCredential.user.displayName || undefined);
      const target = profile?.role === 'ADM' ? '/admin/dashboard' : '/dashboard';
      onLoginSuccess(target);
    } catch (err: any) {
      console.error('Email sign-in failure:', err);
      setErrorMessage(mapAuthErrorToArabic(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (isGoogleLoading) return;
    setErrorMessage(null);
    setIsGoogleLoading(true);

    try {
      const userCredential = await loginWithGoogle();

      // Save / verify in Cloud Firestore
      await saveUserToFirestore({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        role: 'STD',
        provider: 'google.com',
      });

      // Synchronize with backend API
      const profile = await syncProfile(userCredential.user.displayName || undefined);
      const target = profile?.role === 'ADM' ? '/admin/dashboard' : '/dashboard';
      onLoginSuccess(target);
    } catch (err: any) {
      console.error('Google sign-in failure:', err);
      if (err?.code !== 'auth/popup-closed-by-user') {
        setErrorMessage(mapAuthErrorToArabic(err));
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail || resetLoading) return;

    setResetErrorMessage(null);
    setResetSuccessMessage(null);
    setResetLoading(true);

    try {
      await resetPassword(resetEmail.trim());
      setResetSuccessMessage('تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني بنجاح! تفقد بريدك الوارد.');
    } catch (err: any) {
      setResetErrorMessage(mapAuthErrorToArabic(err));
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <AuthCardLayout
      title="مرحباً بعودتك"
      subtitle="سجّل الدخول لمتابعة مسارك التعليمي التفاعلي"
      activeTab="login"
      onTabChange={(tab) => {
        if (tab === 'register') onNavigateToRegister();
      }}
    >
      <div className="space-y-4">
        {/* Error Banner with close button */}
        {errorMessage && (
          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-400 text-xs flex items-start justify-between animate-fadeIn">
            <div className="flex items-start space-x-2 space-x-reverse">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span className="leading-relaxed font-medium">{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-xs hover:opacity-75 px-1 font-bold shrink-0"
              title="إغلاق التنبيه"
            >
              ✕
            </button>
          </div>
        )}

        {/* Social Auth: Google Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isLoading}
          className="group relative w-full flex items-center justify-center space-x-3 space-x-reverse py-2.5 px-4 rounded-2xl border border-slate-300 dark:border-[#3d3d3d] bg-white dark:bg-[#262626] text-slate-800 dark:text-slate-100 font-semibold text-xs sm:text-sm hover:border-[#FFCB74] dark:hover:border-[#FFCB74] hover:shadow-md hover:shadow-[#FFCB74]/10 transition-all duration-200 disabled:opacity-60 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFCB74]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          
          {isGoogleLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-[#FFCB74]" />
          ) : (
            <svg className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          )}
          <span>المتابعة باستخدام Google</span>
        </button>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-2">
          <div className="w-full border-t border-slate-200 dark:border-[#3d3d3d]" />
          <span className="absolute px-3 bg-white dark:bg-[#2F2F2F] text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
            أو عبر البريد الإلكتروني
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleEmailSubmit} className="space-y-3.5">
          {/* Email Field */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              البريد الإلكتروني
            </label>
            <div className="relative group">
              <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#FFCB74] transition-colors" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pr-10 pl-3 py-2.5 rounded-2xl border border-slate-300 dark:border-[#3d3d3d] bg-white dark:bg-[#262626] text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm outline-none focus:border-[#FFCB74] dark:focus:border-[#FFCB74] focus:ring-2 focus:ring-[#FFCB74]/20 transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                كلمة المرور
              </label>
              <button
                type="button"
                onClick={() => {
                  setResetEmail(email);
                  setShowResetModal(true);
                }}
                className="text-xs font-medium text-[#FFCB74] hover:underline transition-colors"
              >
                نسيت كلمة المرور؟
              </button>
            </div>
            <div className="relative group">
              <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#FFCB74] transition-colors" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyUp={handleKeyUp}
                placeholder="••••••••"
                className="w-full pr-10 pl-10 py-2.5 rounded-2xl border border-slate-300 dark:border-[#3d3d3d] bg-white dark:bg-[#262626] text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm outline-none focus:border-[#FFCB74] dark:focus:border-[#FFCB74] focus:ring-2 focus:ring-[#FFCB74]/20 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                title={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Caps Lock Warning */}
            {isCapsLockOn && (
              <div className="flex items-center space-x-1.5 space-x-reverse text-amber-500 text-[11px] pt-1 animate-fadeIn">
                <AlertTriangle className="h-3 w-3 shrink-0" />
                <span>تنبيه: زر الحروف الكبيرة Caps Lock مفعّل!</span>
              </div>
            )}
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center space-x-2 space-x-reverse cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded-md border-slate-300 dark:border-[#3d3d3d] text-[#FFCB74] focus:ring-[#FFCB74] bg-white dark:bg-[#262626] cursor-pointer"
              />
              <span className="text-xs text-slate-600 dark:text-slate-400">تذكرني على هذا الجهاز</span>
            </label>
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={isLoading || isGoogleLoading}
            className="w-full mt-3 py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm bg-[#FFCB74] hover:bg-[#ffd387] active:bg-[#e6b25a] text-[#111111] shadow-lg shadow-[#FFCB74]/20 hover:shadow-xl hover:shadow-[#FFCB74]/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-2 space-x-reverse disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-[#111111]" />
                <span>جاري تسجيل الدخول والمزامنة...</span>
              </>
            ) : (
              <>
                <span>تسجيل الدخول</span>
                <ArrowRight className="h-4 w-4 transform rotate-180" />
              </>
            )}
          </button>
        </form>

        {/* Switch to Register link */}
        <div className="pt-2 text-center text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-[#383838]">
          ليس لديك حساب بعد؟{' '}
          <button
            type="button"
            onClick={onNavigateToRegister}
            className="font-bold text-[#FFCB74] hover:underline transition-colors"
          >
            إنشاء حساب جديد مجاناً
          </button>
        </div>
      </div>

      {/* Reset Password Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white dark:bg-[#262626] border border-slate-200 dark:border-[#3d3d3d] rounded-3xl p-6 max-w-sm w-full shadow-2xl relative">
            <div className="text-center mb-4">
              <div className="inline-flex p-3 rounded-2xl bg-[#FFCB74]/15 text-[#FFCB74] mb-2">
                <KeyRound className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">استعادة كلمة المرور</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                أدخل بريدك الإلكتروني المسجل وسنرسل لك رابطاً لإعادة تعيين كلمة المرور.
              </p>
            </div>

            {resetSuccessMessage ? (
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center space-x-2 space-x-reverse mb-4">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{resetSuccessMessage}</span>
              </div>
            ) : (
              <form onSubmit={handlePasswordReset} className="space-y-3">
                {resetErrorMessage && (
                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-400 text-xs flex items-center space-x-2 space-x-reverse">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{resetErrorMessage}</span>
                  </div>
                )}
                <div>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-[#3d3d3d] bg-white dark:bg-[#1a1a1a] text-slate-900 dark:text-white text-xs outline-none focus:border-[#FFCB74]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full py-2.5 rounded-xl bg-[#FFCB74] text-[#111111] font-bold text-xs hover:bg-[#ffd387] flex items-center justify-center space-x-2 space-x-reverse"
                >
                  {resetLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>إرسال الرابط</span>}
                </button>
              </form>
            )}

            <button
              onClick={() => {
                setShowResetModal(false);
                setResetSuccessMessage(null);
                setResetErrorMessage(null);
              }}
              className="w-full mt-2 py-2 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              إلغاء والعودة
            </button>
          </div>
        </div>
      )}
    </AuthCardLayout>
  );
};

export default LoginPage;
