import React, { useState } from 'react';
import {
  registerOrSignInDirect,
  FirestoreUserProfile,
} from '../services/firebase';
import {
  X,
  Mail,
  User,
  Phone,
  CheckCircle2,
  LogIn,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: FirestoreUserProfile | null;
  onAuthSuccess: (userProfile: FirestoreUserProfile) => void;
  initialTab?: 'login' | 'signup';
  onOpenLegalModal?: (tab?: 'terms' | 'privacy' | 'disclaimer' | 'refund') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAuthSuccess,
  onOpenLegalModal,
}) => {
  // Form inputs - strictly Name, Email, Mobile Number
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');

  // Status & Error handling
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  // Direct Sign In / Registration with Name, Email & Mobile
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!mobile.trim() || mobile.trim().length < 8) {
      setErrorMsg('Please enter a valid mobile number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const userProfile = await registerOrSignInDirect({
        fullName: fullName.trim(),
        email: email.trim(),
        mobile: mobile.trim(),
      });

      setSuccessMsg(`🎉 Welcome, ${userProfile.fullName}! Signing you in...`);
      setTimeout(() => {
        onAuthSuccess(userProfile);
        onClose();
      }, 800);
    } catch (err: any) {
      console.error('Sign in error:', err);
      setErrorMsg(err.message || 'Could not sign in. Please check your details and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative overflow-hidden text-white max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MOVENTRA ATHLETE PORTAL</span>
          </div>
          <h2 className="text-2xl font-black text-white">Sign In to Moventra</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Enter your name, email, and mobile number to sign in instantly.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-950/80 border border-rose-800 rounded-xl text-rose-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-950/80 border border-emerald-800 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-pulse">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* DIRECT SIGN IN FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">
              Full Name <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. SWASTIK PARASHAR"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">
              Email Address <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">
              Mobile Number <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
              <input
                type="tel"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="+91 9876543210 or +1 555-0199"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-black font-black text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <LogIn className="w-4 h-4 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In / Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-zinc-800/80 text-center text-[10px] text-zinc-400 space-y-1.5">
          <div className="flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Instant sign-in enabled. No password or OTP code required.</span>
          </div>
          <p className="text-zinc-500">
            By signing in, you agree to Moventra's{' '}
            <button
              type="button"
              onClick={() => onOpenLegalModal && onOpenLegalModal('terms')}
              className="text-emerald-400 underline hover:text-emerald-300 font-bold"
            >
              Terms of Service
            </button>
            ,{' '}
            <button
              type="button"
              onClick={() => onOpenLegalModal && onOpenLegalModal('privacy')}
              className="text-emerald-400 underline hover:text-emerald-300 font-bold"
            >
              Privacy Policy
            </button>
            , and{' '}
            <button
              type="button"
              onClick={() => onOpenLegalModal && onOpenLegalModal('disclaimer')}
              className="text-amber-400 underline hover:text-amber-300 font-bold"
            >
              Medical Disclaimer
            </button>
            .
          </p>
        </div>
      </div>
    </div>
  );
};
