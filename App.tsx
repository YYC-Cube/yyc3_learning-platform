// =============================================================================
// YYC3-Learning-Platform — App Entry Point (v3.0.0)
// =============================================================================

import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { UserDashboard } from './components/UserDashboard';
import { Kanban } from './components/Kanban';
import { Community } from './components/Community';
import { Profile } from './components/Profile';
import { ModulePage } from './components/ModulePage';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { MobileSearchModal } from './components/MobileSearchModal';
import { AdminLayout } from './components/AdminLayout';
import { RoadmapPage } from './components/RoadmapPage';
import { CertificatesPage } from './components/CertificatesPage';
import { LanguageProvider } from './components/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { ForgotPasswordPage } from './components/auth/ForgotPasswordPage';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';
import { Search as SearchIcon } from 'lucide-react';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
const appLogo = "/yyc3-dist/yanyu_cloud_128x128.png";
import { defaultAvatarAsset } from './services/apiService';
import { updatedMockModules } from './data/modulesData';
import { useResponsive } from './hooks/useResponsive';
import { Toaster } from "sonner";
import { AIAssistant } from './components/AIAssistant';
import { BetaFeedbackModal } from './components/BetaFeedbackModal';
import type { User, AIMessageContext } from './types';

// =============================================================================
// Auth Gate — decides between login/register and main app
// =============================================================================

type AuthView = 'login' | 'register' | 'forgot-password';

const AuthGate: React.FC = () => {
  const { isLoading, isAuthenticated } = useAuth();
  const [authView, setAuthView] = useState<AuthView>('login');

  // Global loading spinner during session restore
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
            className="w-10 h-10 border-3 border-blue-500/20 border-t-blue-500 rounded-full"
          />
          <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.3em]">
            Restoring Session
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated → show login or register
  if (!isAuthenticated) {
    return (
      <AnimatePresence mode="wait">
        {authView === 'login' ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <LoginPage
              onSwitchToRegister={() => setAuthView('register')}
              onForgotPassword={() => setAuthView('forgot-password')}
            />
          </motion.div>
        ) : authView === 'register' ? (
          <motion.div
            key="register"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <RegisterPage onSwitchToLogin={() => setAuthView('login')} />
          </motion.div>
        ) : (
          <motion.div
            key="forgot-password"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ForgotPasswordPage onBack={() => setAuthView('login')} />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Authenticated → show main app
  return <AppContent />;
};

// =============================================================================
// Main App Content (authenticated state)
// =============================================================================

const AppContent: React.FC = () => {
  const { userId, userProfile, logout, isGuest } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [adminSection, setAdminSection] = useState('dashboard');
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const { breakpoint, isMobile, isTablet, isDesktop } = useResponsive();
  
  // Scroll detection for mobile header
  const { scrollY } = useScroll();
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 100) {
      setIsHeaderHidden(true);
    } else {
      setIsHeaderHidden(false);
    }
  });

  useEffect(() => {
    if (isMobile || isTablet) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [isMobile, isTablet]);

  const filteredModules = useMemo(() => {
    if (!searchQuery.trim()) return updatedMockModules;
    const query = searchQuery.toLowerCase().trim();
    return updatedMockModules.filter(module => 
      module.title.toLowerCase().includes(query) || 
      module.subtitle.toLowerCase().includes(query) ||
      module.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Derive the UI User shape from the auth context profile (with fallback)
  const user: User = useMemo(() => {
    if (userProfile) {
      return {
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        avatar: userProfile.avatar,
        completionPercentage: userProfile.completionPercentage,
        unlockedModules: userProfile.unlockedModules,
        totalModules: userProfile.totalModules,
        role: userProfile.role,
      };
    }
    return {
      firstName: isGuest ? '访客' : '用户',
      lastName: '',
      avatar: defaultAvatarAsset,
      completionPercentage: 0,
      unlockedModules: 0,
      totalModules: 12,
      role: 'user',
    };
  }, [userProfile, isGuest]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSelectedModuleId(null);
    setSearchQuery('');
  };

  const handleModuleClick = (moduleId: string) => {
    setSelectedModuleId(moduleId);
    setActiveTab('module-detail');
  };

  const handleLogout = () => {
    logout();
  };

  const renderContent = () => {
    if (activeTab === 'module-detail' && selectedModuleId) {
      return (
        <ModulePage 
          moduleId={selectedModuleId} 
          onBack={() => {
            setSelectedModuleId(null);
            setActiveTab('dashboard');
          }}
          onStartLesson={(id) => console.log('开始课程', id)}
          isMobile={isMobile}
        />
      );
    }

    switch (activeTab) {
      case 'dashboard': 
      case 'courses':
        return (
          <div className="space-y-6 sm:space-y-8 lg:space-y-10">
            {searchQuery && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-blue-600/10 border border-blue-500/20 p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-500 flex items-center justify-center text-white flex-shrink-0">
                    <SearchIcon size={isMobile ? 16 : 20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest">搜索结果</p>
                    <p className="text-white font-bold text-sm sm:text-base">找到 {filteredModules.length} 个与 "{searchQuery}" 相关的模块</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider"
                >
                  清除搜索
                </button>
              </motion.div>
            )}
            <UserDashboard 
              activeCategory="dashboard"
              modules={filteredModules}
              onModuleClick={handleModuleClick}
              isMobile={isMobile}
              breakpoint={breakpoint}
              onNavigate={handleTabChange}
            />
          </div>
        );
      case 'kanban': return <Kanban />;
      case 'community': return <Community />;
      case 'certificates': return <CertificatesPage />;
      case 'roadmap': return <RoadmapPage />;
      case 'profile': return <Profile onModuleClick={handleModuleClick} />;
      case 'admin':
        if (userProfile?.role !== 'admin') {
          return <UserDashboard activeCategory="dashboard" modules={updatedMockModules} onModuleClick={handleModuleClick} isMobile={isMobile} breakpoint={breakpoint} onNavigate={handleTabChange} />;
        }
        return (
          <AdminLayout
            adminSection={adminSection}
            onSectionChange={setAdminSection}
            onBackToUser={() => handleTabChange('dashboard')}
            isMobile={isMobile}
            breakpoint={breakpoint}
          />
        );
      default: 
        return <UserDashboard activeCategory="dashboard" modules={updatedMockModules} onModuleClick={handleModuleClick} isMobile={isMobile} breakpoint={breakpoint} onNavigate={handleTabChange} />;
    }
  };

  return (
    <div className="min-h-screen min-h-dvh bg-[#020617] text-slate-200 font-sans selection:bg-blue-500/30 selection:text-white overflow-x-hidden relative">
      
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/20 blur-[150px] rounded-full" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, -45, 0],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-indigo-600/15 blur-[180px] rounded-full" 
        />
      </div>

      {/* Mobile top header */}
      <motion.div 
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" }
        }}
        animate={isHeaderHidden ? "hidden" : "visible"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="lg:hidden h-14 sm:h-16 bg-[#0F172A]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 sticky top-0 z-[60]"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg overflow-hidden bg-white/5 p-1">
            <ImageWithFallback src={appLogo} alt="YYC3 Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-black tracking-tighter text-white uppercase text-xs sm:text-sm">YYC3</span>
          {isGuest && (
            <span className="text-[8px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded-full font-black uppercase tracking-wider">
              体验
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsMobileSearchOpen(true)}
            className="p-2 text-slate-400 hover:text-white transition-colors active:scale-95"
          >
            <SearchIcon size={18} />
          </button>
          <div 
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-800 border border-white/10 overflow-hidden cursor-pointer active:scale-95 transition-transform" 
            onClick={() => setActiveTab('profile')}
          >
            <ImageWithFallback src={user.avatar || defaultAvatarAsset} alt="头像" className="w-full h-full object-cover" />
          </div>
        </div>
      </motion.div>

      <Sidebar 
        activeTab={activeTab === 'module-detail' ? 'courses' : activeTab} 
        setActiveTab={handleTabChange} 
        closeMobileMenu={() => setIsSidebarOpen(false)}
        isOpen={isSidebarOpen}
        isMobile={isMobile || isTablet}
        onLogout={handleLogout}
        userRole={userProfile?.role}
      />

      {/* Main content */}
      <main className={`transition-all duration-500 ease-in-out min-h-screen min-h-dvh relative z-10 flex flex-col ${isDesktop ? 'lg:pl-20' : 'pl-0'}`}>
        <Header 
          user={user}
          isMobile={isMobile}
          isTablet={isTablet}
          isLiveActive={true}
          onSearch={(q) => {
            setSearchQuery(q);
            if(q && activeTab !== 'dashboard' && activeTab !== 'courses') {
              setActiveTab('dashboard');
            }
          }}
          isGuest={isGuest}
          onLogout={handleLogout}
          onTabChange={handleTabChange}
          onOpenFeedback={() => setIsFeedbackOpen(true)}
        />

        <div className={`flex-1 p-4 sm:p-6 md:p-8 lg:p-10 max-w-7xl mx-auto w-full ${(isMobile || isTablet) ? 'pb-24' : ''}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + (selectedModuleId || '') + searchQuery}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        <footer className="p-4 sm:p-6 lg:p-8 border-t border-white/5 text-center">
          <p className="text-slate-600 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em]">
            &copy; 2026 YYC3 学习平台 v3.0.0 &bull; 由蓝色旋变技术驱动
          </p>
        </footer>
      </main>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isSidebarOpen && (isMobile || isTablet) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-slate-950/60 backdrop-blur-md z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation */}
      {(isMobile || isTablet) && (
        <MobileBottomNav 
          activeTab={activeTab}
          onTabChange={handleTabChange}
          userRole={userProfile?.role}
        />
      )}

      {/* Mobile Search Modal */}
      <MobileSearchModal 
        isOpen={isMobileSearchOpen}
        onClose={() => setIsMobileSearchOpen(false)}
        onSearch={(q) => {
          setSearchQuery(q);
          if (q && activeTab !== 'dashboard' && activeTab !== 'courses') {
            setActiveTab('dashboard');
          }
        }}
      />

      {/* AI Assistant Floating Widget */}
      <AIAssistant
        userId={userId}
        isMobile={isMobile || isTablet}
        currentContext={
          selectedModuleId
            ? {
                moduleId: selectedModuleId,
                moduleTitle: updatedMockModules.find((m) => m.id === selectedModuleId)?.title,
                pageSection: activeTab,
              } as AIMessageContext
            : { pageSection: activeTab } as AIMessageContext
        }
      />

      {/* Beta Feedback Modal */}
      <BetaFeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </div>
  );
};

// =============================================================================
// Root App — wraps everything with providers
// =============================================================================

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Toaster position="top-right" richColors theme="dark" />
        <AuthGate />
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;