import { AnimatePresence, motion } from 'motion/react';
import { KeyRound, Mail, X } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import type { MessageKey } from '../../i18n/messages';

type AuthLoginMethod = 'PASSWORD' | 'EMAIL_CODE';

type AuthModalProps = {
  show: boolean;
  onClose: () => void;
  authMode: 'LOGIN' | 'REGISTER';
  setAuthMode: (mode: 'LOGIN' | 'REGISTER') => void;
  authLoginMethod: AuthLoginMethod;
  setAuthLoginMethod: (method: AuthLoginMethod) => void;
  authEmail: string;
  setAuthEmail: (value: string) => void;
  authPassword: string;
  setAuthPassword: (value: string) => void;
  authEmailCode: string;
  setAuthEmailCode: (value: string) => void;
  authCodeCooldown: number;
  authCodeSending: boolean;
  authUsername: string;
  setAuthUsername: (value: string) => void;
  authStatus: string;
  onSendEmailCode: () => void;
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
  onSendEmailCode,
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
  const showEmailCodeLogin = authMode === 'LOGIN' && authLoginMethod === 'EMAIL_CODE' && !adminOnly;
  const sendCodeLabel = authCodeCooldown > 0
    ? t('auth.resendCodeIn', { seconds: authCodeCooldown })
    : t('auth.sendCode');

  const switchAuthMode = () => {
    const nextMode = authMode === 'LOGIN' ? 'REGISTER' : 'LOGIN';
    setAuthMode(nextMode);
    setAuthLoginMethod('PASSWORD');
    setAuthEmailCode('');
  };

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
              {authMode === 'LOGIN' && !adminOnly && (
                <div className="grid grid-cols-2 rounded-xl border border-white/10 bg-white/5 p-1">
                  <button
                    type="button"
                    onClick={() => setAuthLoginMethod('PASSWORD')}
                    className={`flex min-h-10 items-center justify-center gap-2 rounded-lg px-2 text-xs font-bold transition-colors ${
                      authLoginMethod === 'PASSWORD'
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    <KeyRound className="h-4 w-4 shrink-0" />
                    <span className="truncate">{t('auth.passwordLogin')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthLoginMethod('EMAIL_CODE')}
                    className={`flex min-h-10 items-center justify-center gap-2 rounded-lg px-2 text-xs font-bold transition-colors ${
                      authLoginMethod === 'EMAIL_CODE'
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    <Mail className="h-4 w-4 shrink-0" />
                    <span className="truncate">{t('auth.emailCodeLogin')}</span>
                  </button>
                </div>
              )}
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
                {showEmailCodeLogin ? (
                  <div className="flex gap-2">
                    <input
                      className="min-w-0 flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-sm"
                      value={authEmailCode}
                      onChange={e => setAuthEmailCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder={t('auth.emailCodePlaceholder')}
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      required
                    />
                    <button
                      type="button"
                      onClick={onSendEmailCode}
                      disabled={authCodeCooldown > 0 || authCodeSending}
                      className="flex min-h-11 min-w-[7.5rem] items-center justify-center gap-2 rounded-xl border border-purple-400/30 bg-purple-500/15 px-3 text-xs font-bold text-purple-100 transition-colors hover:bg-purple-500/25 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Mail className="h-4 w-4 shrink-0" />
                      <span className="truncate">{sendCodeLabel}</span>
                    </button>
                  </div>
                ) : (
                  <input
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm"
                    value={authPassword}
                    onChange={e => setAuthPassword(e.target.value)}
                    placeholder={t('auth.passwordPlaceholder')}
                    type="password"
                    required
                  />
                )}
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
                  onClick={switchAuthMode}
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
