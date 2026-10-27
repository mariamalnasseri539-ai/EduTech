import React, { useState, useMemo } from 'react';
import { AuthCardLayout } from '../../components/auth/AuthCardLayout';
import { registerWithEmail, loginWithGoogle, saveUserToFirestore } from '../../services/firebaseConfig';
import { useAuth } from '../../context/AuthContext';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
} from 'lucide-react';

interface RegisterPageProps {
  onNavigateToLogin: () => void;
  onRegisterSuccess: (targetRoute: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onNavigateToLogin,
  onRegisterSuccess,
}) => {
  const { syncProfile } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Live Password Strength Calculation
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: 'فارغة', color: 'bg-slate-200 dark:bg-slate-700' };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[a-zA-Z]/.test(password) && /[^a-zA-Z0-9]/.test(password)) score += 1;

    if (score <= 1) return { score: 1, label: 'ضعيفة', color: 'bg-rose-500' };
    if (score <= 2) return { score: 2, label: 'متوسطة', color: 'bg-amber-500' };
    return { score: 3, label: 'قوية وممتازة', color: 'bg-emerald-500' };
  }, [password]);

  // Error Mapping
  const mapAuthErrorToArabic = (err: any): string => {
    const code = err?.code || '';
    switch (code) {
      case 'auth/email-already-in-use':
        return 'هذا البريد الإلكتروني مسجل لدينا بالفعل. يرجى تسجيل الدخول به مباشرة.';
      case 'auth/invalid-email':
        return 'صيغة البريد الإلكتروني غير صالحة. يرجى كتابة بريد إلكتروني صحيح.';
      case 'auth/weak-password':
        return 'كلمة المرور ضعيفة جداً. يرجى اختيار كلمة مرور من 6 خانات على الأقل تحتوي أرقاماً وحروفاً.';
      case 'auth/operation-not-allowed':
        return 'إنشاء الحسابات بالبريد غير مفعّل حالياً. يرجى التواصل مع الدعم الفني.';
      case 'auth/network-request-failed':
        return 'تعذر الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت والمحاولة مجدداً.';
      default:
        return 'حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.';
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setIsCapsLockOn(e.getModifierState('CapsLock'));
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || isLoading) return;

    if (!displayName.trim()) {
      setErrorMessage('يرجى كتابة الاسم الكامل.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('يجب أن تتكون كلمة المرور من 6 خانات على الأقل.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('كلمتا المرور غير متطابقتين. يرجى التأكد من كتابتهما بدقة.');
      return;
    }

    if (!acceptTerms) {
      setErrorMessage('يجب الموافقة على شروط الاستخدام وسياسة الخصوصية للمتابعة.');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      const userCredential = await registerWithEmail(email.trim(), password, displayName.trim());

      // Save student profile to Cloud Firestore
      await saveUserToFirestore({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: displayName.trim(),
        role: 'STD',
      });

      // Synchronize with backend API
      const profile = await syncProfile(displayName.trim());
      const target = profile?.role === 'ADM' ? '/admin/dashboard' : '/dashboard';
      onRegisterSuccess(target);
    } catch (err: any) {
      console.error('Registration failure:', err);
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

      // Save to Cloud Firestore
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
      onRegisterSuccess(target);
    } catch (err: any) {
      console.error('Google register failure:', err);
      if (err?.code !== 'auth/popup-closed-by-user') {
        setErrorMessage(mapAuthErrorToArabic(err));
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <AuthCardLayout
      title="إنشاء حساب جديد"
      subtitle="انضم إلى منصة إديوتك وابدأ مسارك التعليمي التفاعلي"
      activeTab="register"
      onTabChange={(tab) => {
        if (tab === 'login') onNavigateToLogin();
      }}
    >
      <div className="space-y-3.5">
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
          <span>التسجيل السريع بواسطة Google</span>
        </button>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-1.5">
          <div className="w-full border-t border-slate-200 dark:border-[#3d3d3d]" />
          <span className="absolute px-3 bg-white dark:bg-[#2F2F2F] text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
            أو أنشئ حسابك بالبريد
          </span>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleRegisterSubmit} className="space-y-3">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              الاسم الكامل
            </label>
            <div className="relative group">
              <User className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#FFCB74] transition-colors" />
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="محمد عبدالله"
                className="w-full pr-10 pl-3 py-2 rounded-2xl border border-slate-300 dark:border-[#3d3d3d] bg-white dark:bg-[#262626] text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm outline-none focus:border-[#FFCB74] dark:focus:border-[#FFCB74] focus:ring-2 focus:ring-[#FFCB74]/20 transition-all"
              />
            </div>
          </div>

          {/* Email */}
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
                className="w-full pr-10 pl-3 py-2 rounded-2xl border border-slate-300 dark:border-[#3d3d3d] bg-white dark:bg-[#262626] text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm outline-none focus:border-[#FFCB74] dark:focus:border-[#FFCB74] focus:ring-2 focus:ring-[#FFCB74]/20 transition-all"
              />
            </div>
          </div>

          {/* Password & Confirm Password side by side on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Password */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                كلمة المرور
              </label>
              <div className="relative group">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-[#FFCB74] transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyUp={handleKeyUp}
                  placeholder="••••••••"
                  className="w-full pr-8 pl-8 py-2 rounded-2xl border border-slate-300 dark:border-[#3d3d3d] bg-white dark:bg-[#262626] text-slate-900 dark:text-white placeholder-slate-400 text-xs outline-none focus:border-[#FFCB74] dark:focus:border-[#FFCB74] focus:ring-2 focus:ring-[#FFCB74]/20 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                تأكيد المرور
              </label>
              <div className="relative group">
                <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-[#FFCB74] transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyUp={handleKeyUp}
                  placeholder="••••••••"
                  className="w-full pr-8 pl-3 py-2 rounded-2xl border border-slate-300 dark:border-[#3d3d3d] bg-white dark:bg-[#262626] text-slate-900 dark:text-white placeholder-slate-400 text-xs outline-none focus:border-[#FFCB74] dark:focus:border-[#FFCB74] focus:ring-2 focus:ring-[#FFCB74]/20 transition-all font-mono"
                />
              </div>
            </div>
          </div>

          {/* Live Password Strength Meter */}
          {password && (
            <div className="space-y-1 pt-0.5 animate-fadeIn">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">قوة كلمة المرور:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {passwordStrength.label}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1 h-1.5 w-full bg-slate-100 dark:bg-[#1f1f1f] rounded-full overflow-hidden p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    passwordStrength.score >= 1 ? passwordStrength.color : 'opacity-20'
                  }`}
                />
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    passwordStrength.score >= 2 ? passwordStrength.color : 'opacity-20'
                  }`}
                />
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    passwordStrength.score >= 3 ? passwordStrength.color : 'opacity-20'
                  }`}
                />
              </div>
            </div>
          )}

          {/* Caps Lock Warning */}
          {isCapsLockOn && (
            <div className="flex items-center space-x-1.5 space-x-reverse text-amber-500 text-[11px] animate-fadeIn">
              <AlertTriangle className="h-3 w-3 shrink-0" />
              <span>تنبيه: زر الحروف الكبيرة Caps Lock مفعّل!</span>
            </div>
          )}

          {/* Terms & Privacy Checkbox */}
          <div className="pt-1">
            <label className="flex items-start space-x-2 space-x-reverse cursor-pointer select-none">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="h-4 w-4 rounded-md border-slate-300 dark:border-[#3d3d3d] text-[#FFCB74] focus:ring-[#FFCB74] bg-white dark:bg-[#262626] mt-0.5 cursor-pointer"
              />
              <span className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
                أوافق على <span className="text-[#FFCB74] underline">شروط الاستخدام</span> و <span className="text-[#FFCB74] underline">سياسة الخصوصية</span> لمنصة إديوتك.
              </span>
            </label>
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={isLoading || isGoogleLoading}
            className="w-full mt-2 py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm bg-[#FFCB74] hover:bg-[#ffd387] active:bg-[#e6b25a] text-[#111111] shadow-lg shadow-[#FFCB74]/20 hover:shadow-xl hover:shadow-[#FFCB74]/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-2 space-x-reverse disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-[#111111]" />
                <span>جاري إنشاء الحساب والمزامنة...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4" />
                <span>إتمام التسجيل وبدء التعلّم</span>
                <ArrowRight className="h-4 w-4 transform rotate-180" />
              </>
            )}
          </button>
        </form>

        {/* Switch to Login link */}
        <div className="pt-2 text-center text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-[#383838]">
          لديك حساب بالفعل؟{' '}
          <button
            type="button"
            onClick={onNavigateToLogin}
            className="font-bold text-[#FFCB74] hover:underline transition-colors"
          >
            تسجيل الدخول
          </button>
        </div>
      </div>
    </AuthCardLayout>
  );
};

export default RegisterPage;
