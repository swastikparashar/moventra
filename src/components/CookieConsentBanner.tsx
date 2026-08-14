import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, ExternalLink, X, Check } from 'lucide-react';

interface CookieConsentBannerProps {
  onOpenLegalModal: (tab?: 'terms' | 'privacy' | 'disclaimer' | 'refund') => void;
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({
  onOpenLegalModal,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    // Check if user has already accepted legal/cookie consent
    const consent = localStorage.getItem('moventra_cookie_consent_v1');
    if (!consent) {
      // Delay slightly for smooth entering transition
      const t = setTimeout(() => setIsVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('moventra_cookie_consent_v1', 'accepted_all');
    setIsVisible(false);
  };

  const handleAcceptEssential = () => {
    localStorage.setItem('moventra_cookie_consent_v1', 'accepted_essential');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-6 md:right-auto md:max-w-xl z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-zinc-950/95 border border-zinc-800 rounded-3xl p-5 shadow-2xl backdrop-blur-xl text-xs space-y-3.5 relative overflow-hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="font-black text-white text-sm">
                Privacy & Data Consent Notice
              </h4>
              <p className="text-[10px] text-zinc-400">
                DPDP Act 2023 (India) & GDPR Compliance
              </p>
            </div>
          </div>
          <button
            onClick={handleAcceptEssential}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
            title="Dismiss consent notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-zinc-300 leading-relaxed text-[11px]">
          Moventra uses essential local storage and security session cookies to store your profile settings and process AI workout guidance. By continuing, you agree to our policies.
        </p>

        <div className="flex flex-wrap items-center gap-2 text-[11px] text-emerald-400 pt-1 border-t border-zinc-900">
          <button
            onClick={() => onOpenLegalModal('privacy')}
            className="hover:underline flex items-center gap-1 font-bold"
          >
            <Lock className="w-3 h-3" />
            <span>Privacy Policy</span>
          </button>
          <span>•</span>
          <button
            onClick={() => onOpenLegalModal('terms')}
            className="hover:underline flex items-center gap-1 font-bold"
          >
            <span>Terms of Service</span>
          </button>
          <span>•</span>
          <button
            onClick={() => onOpenLegalModal('disclaimer')}
            className="hover:underline flex items-center gap-1 font-bold text-amber-400"
          >
            <span>Medical Disclaimer</span>
          </button>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleAcceptAll}
            className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-green-500 text-zinc-950 font-black rounded-xl hover:opacity-95 transition-all text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Accept All & Continue</span>
          </button>
          <button
            onClick={handleAcceptEssential}
            className="px-3.5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold rounded-xl border border-zinc-800 transition-colors text-xs"
          >
            Essential Only
          </button>
        </div>
      </div>
    </div>
  );
};
