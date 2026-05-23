import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import type { MessageKey } from '../../i18n/messages';

type AuthModalProps = {
  show: boolean;
  onClose: () => void;
  authMode: 'LOGIN' | 'REGISTER';
  setAuthMode: (mode: 'LOGIN' | 'REGISTER') => void;
  authEmail: string;
  setAuthEmail: (value: string) => void;
  authPassword: string;
  setAuthPassword: (value: string) => void;
  authUsername: string;
  setAuthUsername: (value: string) => void;
  authStatus: string;
  onSubmit: () => void;
  t: (key: MessageKey, params?: Record<string, string | number>) => string;
  adminOnly?: boolean;
  allowClose?: boolean;
  titleKey?: MessageKey;
  hintKey?: MessageKey;
};

export function AuthModal({
  show,
  onClose,
  authMode,
  setAuthMode,
  authEmail,
  setAuthEmail,
  authPassword,
  setAuthPassword,
  authUsername,
  setAuthUsername,
  authStatus,
  onSubmit,
  t,
  adminOnly = false,
  allowClose = true,
  titleKey,
  hintKey,
}: AuthModalProps) {
  const title = titleKey
    ? t(titleKey)
    : authMode === 'LOGIN'
      ? t('auth.modalLogin')
      : t('auth.modalRegister');
  const hint = authStatus || (hintKey ? t(hintKey) : t('auth.modalContinueHint'));

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={allowClose ? onClose : undefined}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[900]"
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md z-[901]"
          >
            <GlassCard className="p-7 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-white">{title}</h3>
                {allowClose && (
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-xs text-purple-300">{hint}</p>
              <div className="space-y-3">
                {authMode === 'REGISTER' && !adminOnly && (
                  <input
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm"
                    value={authUsername}
                    onChange={e => setAuthUsername(e.target.value)}
                    placeholder={t('auth.usernamePlaceholder')}
                    required
                  />
                )}
                <input
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm"
                  value={authEmail}
                  onChange={e => setAuthEmail(e.target.value)}
                  placeholder={t('auth.emailPlaceholder')}
                  type="email"
                  required
                />
                <input
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm"
                  value={authPassword}
                  onChange={e => setAuthPassword(e.target.value)}
                  placeholder={t('auth.passwordPlaceholder')}
                  type="password"
                  required
                />
                <button
                  type="button"
                  onClick={onSubmit}
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-white transition-colors active:scale-[0.98]"
                >
                  {authMode === 'LOGIN' ? t('auth.modalLogin') : t('auth.createAccount')}
                </button>
              </div>
              {!adminOnly && (
                <button
                  onClick={() => setAuthMode(authMode === 'LOGIN' ? 'REGISTER' : 'LOGIN')}
                  className="w-full py-2 text-xs font-bold text-gray-300 hover:text-white"
                >
                  {authMode === 'LOGIN' ? t('auth.noAccountRegister') : t('auth.haveAccountLogin')}
                </button>
              )}
            </GlassCard>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
