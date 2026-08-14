import React, { useState } from 'react';
import {
  ShieldCheck,
  FileText,
  Lock,
  AlertTriangle,
  X,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Mail,
  Phone,
} from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'terms' | 'privacy' | 'disclaimer';
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'terms',
}) => {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'disclaimer'>(
    defaultTab === 'refund' ? 'terms' : defaultTab
  );
  const [deletionRequested, setDeletionRequested] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                Legal & Compliance Center
              </h2>
              <p className="text-xs text-zinc-400">
                Moventra Official Policies • Updated August 2026
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors border border-zinc-800"
            title="Close Legal Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Legal Navigation Tabs */}
        <div className="flex border-b border-zinc-800 bg-zinc-900/30 overflow-x-auto px-4 pt-2 scrollbar-none gap-2">
          {[
            { id: 'terms', label: 'Terms of Service', icon: FileText },
            { id: 'privacy', label: 'Privacy Policy (DPDP/GDPR)', icon: Lock },
            { id: 'disclaimer', label: 'Medical & AI Disclaimer', icon: AlertTriangle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 font-bold text-xs rounded-t-2xl border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-emerald-500 text-emerald-400 bg-zinc-900'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-zinc-300 text-xs sm:text-sm leading-relaxed">
          
          {/* TERMS OF SERVICE */}
          {activeTab === 'terms' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Legally Binding Agreement: </span>
                  By downloading, registering, or using the Moventra fitness platform, you acknowledge that you have read, understood, and agreed to be bound by these Terms of Service.
                </div>
              </div>

              <section className="space-y-2">
                <h3 className="text-base font-extrabold text-white">1. Eligibility & User Accounts</h3>
                <p>
                  You must be at least 13 years of age (or the legal age of digital consent in your jurisdiction) to create an account on Moventra. You are responsible for maintaining the confidentiality of your account login credentials and for all activities occurring under your account.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-extrabold text-white">2. 100% Free Access Policy</h3>
                <p>
                  Moventra is 100% Free for all athletes worldwide. All premium AI Trainer features, 50+ workouts, nutrition planning, voice note logging, and progress analytics are available without any mandatory subscriptions, fees, or paywalls.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-zinc-400 text-xs">
                  <li>No recurring subscription charges or hidden fees.</li>
                  <li>Full unlimited access to all AI coaching and exercise modules.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-extrabold text-white">3. Intellectual Property Rights</h3>
                <p>
                  All proprietary code, AI algorithm training systems, exercise animation models, graphics, logos, and UI designs contained in Moventra belong exclusively to Moventra Fitness Inc. (Founder & C.E.O. Swastik Parashar). Unapproved scraping, copying, reverse engineering, or redistribution is strictly prohibited under Indian & International IP Laws.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-extrabold text-white">4. Prohibited Conduct</h3>
                <p>Users agree not to engage in:</p>
                <ul className="list-disc pl-5 space-y-1 text-zinc-400 text-xs">
                  <li>Harassment, offensive speech, or impersonation in Community Feed posts.</li>
                  <li>Automated bot scraping, exploit injection, or denial-of-service attempts.</li>
                  <li>Sharing illegal, harmful, or fraudulent payment details.</li>
                </ul>
              </section>

              <section className="space-y-2 border-t border-zinc-800 pt-3">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Governing Law</h3>
                <p className="text-xs text-zinc-500">
                  These terms are governed by the laws of India. Any legal disputes shall be subject to the exclusive jurisdiction of the courts located in India.
                </p>
              </section>
            </div>
          )}

          {/* PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div className="p-4 bg-cyan-950/20 border border-cyan-500/30 rounded-2xl text-cyan-300 text-xs flex items-start gap-3">
                <Lock className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">DPDP Act (India) & GDPR Compliant: </span>
                  Moventra respects your privacy rights. We store your data securely using Google Cloud Firebase Firestore and encrypt communications over HTTPS/TLS.
                </div>
              </div>

              <section className="space-y-2">
                <h3 className="text-base font-extrabold text-white">1. Information We Collect</h3>
                <ul className="list-disc pl-5 space-y-1 text-zinc-400 text-xs">
                  <li><strong className="text-zinc-200">Account Credentials:</strong> Full name, email address, mobile phone number, profile photo.</li>
                  <li><strong className="text-zinc-200">Fitness Metrics:</strong> Height, weight, calorie goals, workout completion logs, step counts, meal logs.</li>
                  <li><strong className="text-zinc-200">Voice Notes:</strong> Optional user-recorded audio clips stored locally for nutrition and workout notes.</li>
                  <li><strong className="text-zinc-200">Device & Usage Data:</strong> Anonymized browser type, OS version, and session timestamps for security logs.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-extrabold text-white">2. How We Use Your Data</h3>
                <p>
                  Your information is strictly used to deliver personalized AI coaching, compute accurate daily calorie/protein targets, send workout reminders, and prevent unauthorized account access.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-extrabold text-white">3. Third-Party Service Providers</h3>
                <p>
                  We do NOT sell, rent, or trade your personal data to third-party advertisers. Data is processed solely through trusted infrastructure partners:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-zinc-400 text-xs">
                  <li><strong className="text-zinc-200">Google Cloud Firebase:</strong> Encrypted user authentication and database persistence.</li>
                  <li><strong className="text-zinc-200">Google Gemini AI:</strong> Anonymized text prompts for personal trainer response generation.</li>
                </ul>
              </section>

              <section className="space-y-2 bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <Trash2 className="w-4 h-4 text-red-400" />
                  Your Right to Data Erasure & Account Deletion
                </h3>
                <p className="text-xs text-zinc-400">
                  Under the Digital Personal Data Protection (DPDP) Act 2023 and GDPR, you have the right to inspect, export, or permanently delete all your stored profile data at any time.
                </p>
                {deletionRequested ? (
                  <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-red-300 text-xs font-bold">
                    ✓ Data Deletion Request Registered. Your account data will be permanently wiped within 24 hours. Contact privacy@moventra.app for assistance.
                  </div>
                ) : (
                  <button
                    onClick={() => setDeletionRequested(true)}
                    className="mt-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Request Full Account Data Erasure</span>
                  </button>
                )}
              </section>
            </div>
          )}

          {/* MEDICAL & AI DISCLAIMER */}
          {activeTab === 'disclaimer' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-950/30 border border-amber-500/40 rounded-2xl text-amber-200 text-xs flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold uppercase tracking-wide block mb-1">CRITICAL MEDICAL & HEALTH DISCLAIMER:</span>
                  Moventra provides artificial intelligence fitness guidance and educational information only. It is NOT a medical device and DOES NOT provide medical advice, diagnosis, or treatment.
                </div>
              </div>

              <section className="space-y-2">
                <h3 className="text-base font-extrabold text-white">1. Not a Substitute for Professional Medical Advice</h3>
                <p>
                  The contents of Moventra (including AI Personal Trainer responses, auto-generated workout plans, calorie/macro calculations, and exercise tutorial videos) are created for general physical wellness and informational purposes only.
                </p>
                <p>
                  Always seek the advice of a qualified physician or licensed healthcare provider prior to commencing any new fitness routine, dietary change, or weight loss program—especially if you have pre-existing cardiovascular, musculoskeletal, or metabolic health conditions.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-extrabold text-white">2. Assumption of Physical Risk</h3>
                <p>
                  Participating in physical exercise carries inherent risk of bodily injury or strain. By following exercise routines displayed in Moventra, you voluntarily assume all risks associated with physical activity. Discontinue exercise immediately and consult a doctor if you experience pain, dizziness, nausea, chest discomfort, or shortness of breath.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-extrabold text-white">3. Artificial Intelligence Disclaimer</h3>
                <p>
                  AI Personal Trainer features utilize Google Gemini machine learning models. While designed for accuracy, AI responses may occasionally contain errors or unverified recommendations. Users must apply common sense and prioritize personal safety when interpreting AI outputs.
                </p>
              </section>
            </div>
          )}

        </div>

        {/* Modal Footer / Official Contact Details */}
        <div className="p-4 sm:p-5 border-t border-zinc-800 bg-zinc-900/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-4 text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              <span>support@moventra.app</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-cyan-400" />
              <span>Support Desk Online</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black rounded-xl transition-colors shadow-lg shadow-emerald-500/20"
          >
            I Accept & Agree
          </button>
        </div>

      </div>
    </div>
  );
};
