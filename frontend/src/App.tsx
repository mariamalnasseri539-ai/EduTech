import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { WelcomePage } from './pages/WelcomePage';
import { LoadingScreen } from './components/LoadingScreen';

const MainAppContent: React.FC = () => {
  const { firebaseUser, isLoading: isAuthLoading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  // Exact 5-second Splash / Loading Screen
  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 5000);

    return () => clearTimeout(splashTimer);
  }, []);

  // 5-Second Branded Loading Screen on initial open
  if (showSplash || isAuthLoading) {
    return (
      <LoadingScreen
        message="مرحباً بك في منصة إديوتك..."
        subMessage="إديوتك • بوابتك نحو التعلّم التفاعلي والذكي"
      />
    );
  }

  // Unauthenticated State: Render Login or Register Page
  if (!firebaseUser) {
    return authView === 'login' ? (
      <LoginPage
        onNavigateToRegister={() => setAuthView('register')}
        onLoginSuccess={() => {}}
      />
    ) : (
      <RegisterPage
        onNavigateToLogin={() => setAuthView('login')}
        onRegisterSuccess={() => {}}
      />
    );
  }

  // Authenticated State: Clean Blank Welcome Page
  return <WelcomePage />;
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainAppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
