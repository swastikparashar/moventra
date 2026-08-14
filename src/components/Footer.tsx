import React from 'react';
import { ShieldCheck, Lock, FileText, AlertTriangle, RefreshCw, Heart } from 'lucide-react';

interface FooterProps {
  onOpenLegalModal: (tab?: 'terms' | 'privacy' | 'disclaimer' | 'refund') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegalModal }) => {
  return (
    <footer className="mt-16 border-t border-zinc-800/80 bg-zinc-950/60 pt-10 pb-24 md:pb-12 px-4 sm:px-8 text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Main Footer Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-zinc-900 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-white tracking-wider">MOVENTRA</span>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-[10px] font-bold">
                PRO FIT
              </span>
            </div>
            <p className="text-zinc-400 text-xs max-w-md leading-relaxed">
              AI-Powered Personal Training, Real-time Exercise Computer Vision Guidance, Nutrition Macro Calculations, & Fitness Community.
            </p>
          </div>

          {/* Legal Nav Links */}
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <button
              onClick={() => onOpenLegalModal('terms')}
              className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 font-bold"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Terms of Service</span>
            </button>
            <button
              onClick={() => onOpenLegalModal('privacy')}
              className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 font-bold"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Privacy Policy</span>
            </button>
            <button
              onClick={() => onOpenLegalModal('disclaimer')}
              className="hover:text-amber-400 transition-colors flex items-center gap-1.5 font-bold text-amber-500/90"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Medical Disclaimer</span>
            </button>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="p-4 bg-zinc-900/50 border border-zinc-800/80 rounded-2xl space-y-1.5 text-[11px] text-zinc-500 leading-relaxed">
          <p className="font-bold text-zinc-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            Legal & Medical Compliance Notice:
          </p>
          <p>
            Moventra and its AI Personal Trainer features are designed strictly for educational and general fitness wellness purposes. Moventra does not provide professional medical diagnosis, treatment, or physician services. Consult a healthcare professional prior to starting any exercise program. Moventra is 100% free with no subscriptions or hidden fees.
          </p>
        </div>

        {/* Copyright & Leadership */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-500 pt-2">
          <div>
            © 2026 Moventra Fitness Inc. All rights reserved. • C.E.O. & Founder: <strong className="text-zinc-300">Swastik Parashar</strong>
          </div>
          <div className="flex items-center gap-1 text-zinc-500">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500" />
            <span>for health & athletic excellence</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
