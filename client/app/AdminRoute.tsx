import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import AdminWorkbench from '../../admin/AdminWorkbench';
import { AuthModal } from '../components/auth/AuthModal';
import { useApp } from './AppContext';

export function AdminRoute() {
  const {
    t,
    isAuthenticated,
    authUser,
    authToken,
    authSessionReady,
    showAuthModal,
    setShowAuthModal,
    authMode,
    setAuthMode,
    authLoginMethod,
    setAuthLoginMethod,
    authEmail,
    setAuthEmail,
    authPassword,
    setAuthPassword,
    authEmailCode,
    setAuthEmailCode,
    authCodeCooldown,
    authCodeSending,
    authUsername,
    setAuthUsername,
    authStatus,
    openAdminAuthModal,
    handleSendAuthEmailCode,
    handleAuthSubmit,
    handleLogout,
    notify,
    toastMessage,
  } = useApp();

  useEffect(() => {
    if (!authSessionReady) return;
    if (!isAuthenticated) {
      openAdminAuthModal();
    }
  }, [authSessionReady, isAuthenticated, openAdminAuthModal]);

  useEffect(() => {
    if (!authSessionReady || !isAuthenticated || !authUser) return;
    if (authUser.role !== 'ADMIN') {
      notify(t('admin.login.notAdmin'));
      window.location.replace('/');
    }
  }, [authSessionReady, isAuthenticated, authUser, notify, t]);

  const isAdmin = Boolean(isAuthenticated && authToken && authUser?.role === 'ADMIN');

  if (!authSessionReady) {
    return (
      <div className="min-h-screen bg-[#0f071a] text-white font-sans flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0f071a] text-white font-sans selection:bg-purple-500/30 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-3 mb-6">
          <p className="text-[10px] uppercase tracking-[0.35em] text-purple-300/80 font-bold">{t('admin.shell.console')}</p>
          <h1 className="text-2xl font-black tracking-tight">{t('admin.login.title')}</h1>
          <p className="text-sm text-gray-400">{t('admin.login.viaUserAppHint')}</p>
        </div>
        <AuthModal
          show={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          authMode={authMode}
          setAuthMode={setAuthMode}
          authLoginMethod={authLoginMethod}
          setAuthLoginMethod={setAuthLoginMethod}
          authEmail={authEmail}
          setAuthEmail={setAuthEmail}
          authPassword={authPassword}
          setAuthPassword={setAuthPassword}
          authEmailCode={authEmailCode}
          setAuthEmailCode={setAuthEmailCode}
          authCodeCooldown={authCodeCooldown}
          authCodeSending={authCodeSending}
          authUsername={authUsername}
          setAuthUsername={setAuthUsername}
          authStatus={authStatus}
          onSendEmailCode={handleSendAuthEmailCode}
          onSubmit={handleAuthSubmit}
          t={t}
          adminOnly
          allowClose={false}
          titleKey="admin.login.title"
          hintKey="admin.login.viaUserAppHint"
        />
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              className="fixed left-4 right-4 bottom-6 z-[500] rounded-2xl border border-white/10 bg-[#1a0b2e] px-4 py-3 text-sm font-bold text-white"
            >
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <>
      <AdminWorkbench
        token={authToken!}
        adminEmail={authUser!.email}
        onLogout={handleLogout}
      />
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed left-4 right-4 bottom-6 z-[500] rounded-2xl border border-white/10 bg-[#1a0b2e] px-4 py-3 text-sm font-bold text-white"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
