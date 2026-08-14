import React, { useState } from 'react';
import {
  FirestoreUserProfile,
  changeUserPassword,
  updateUserProfileData,
  sendUserEmailVerification,
} from '../services/firebase';
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  Smartphone,
  ShieldCheck,
  Lock,
  KeyRound,
  Edit3,
  Check,
  Target,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: FirestoreUserProfile;
  onLogout: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user.fullName || '');
  const [fitnessGoal, setFitnessGoal] = useState(user.fitnessGoal || 'Build Muscle & Fitness');
  
  // Password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status message
  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const formatDate = (isoStr: string | null | undefined) => {
    if (!isoStr) return 'N/A';
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoStr;
    }
  };

  const handleSaveProfile = async () => {
    setErrorMsg('');
    setStatusMsg('');
    if (!fullName.trim()) {
      setErrorMsg('Full Name cannot be empty.');
      return;
    }
    setIsSubmitting(true);
    try {
      await updateUserProfileData(user.uid, {
        fullName: fullName.trim(),
        fitnessGoal: fitnessGoal.trim(),
      });
      user.fullName = fullName.trim();
      user.fitnessGoal = fitnessGoal.trim();
      setStatusMsg('Profile details updated successfully!');
      setIsEditing(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setStatusMsg('');

    if (!newPassword || newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      await changeUserPassword(newPassword);
      setStatusMsg('Password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update password. You may need to re-log in first.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendEmailVerification = async () => {
    try {
      await sendUserEmailVerification();
      setStatusMsg('Verification email sent to your inbox!');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send email verification.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative overflow-hidden text-white max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Card Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-zinc-800">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-green-500/20 border-2 border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10 shrink-0">
            <User className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">{user.fullName}</h2>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                {user.isAdmin ? 'FOUNDER & C.E.O' : 'ATHLETE MEMBER'}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">{user.email}</p>
            {user.isAdmin && (
              <span className="inline-block mt-1 text-[10px] font-extrabold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                🛡️ System Administrator
              </span>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800 my-4">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'profile' ? 'bg-emerald-500 text-black shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Personal Profile
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'password' ? 'bg-emerald-500 text-black shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Security & Password
          </button>
        </div>

        {statusMsg && (
          <div className="mb-4 p-3 bg-emerald-950/80 border border-emerald-800 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-950/80 border border-rose-800 rounded-xl text-rose-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Account Credentials & Information
              </h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs text-emerald-400 font-bold flex items-center gap-1 hover:underline"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={handleSaveProfile}
                  disabled={isSubmitting}
                  className="text-xs bg-emerald-500 text-black font-extrabold px-3 py-1 rounded-lg flex items-center gap-1 hover:bg-emerald-400"
                >
                  <Check className="w-3.5 h-3.5" />
                  Save Changes
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-zinc-950 p-3 rounded-2xl border border-emerald-500/30 col-span-1 sm:col-span-2">
                <span className="text-zinc-500 block mb-1 flex items-center gap-1 font-bold text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Unique Athlete User ID (UID)
                </span>
                <div className="flex items-center justify-between bg-zinc-900/90 px-3 py-1.5 rounded-xl border border-zinc-800">
                  <code className="text-emerald-400 font-mono text-xs font-bold tracking-wider">{user.uid}</code>
                  <span className="text-[10px] text-zinc-400 font-semibold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-500/30">
                    Verified System ID
                  </span>
                </div>
              </div>

              <div className="bg-zinc-950 p-3 rounded-2xl border border-zinc-800">
                <span className="text-zinc-500 block mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  Full Name
                </span>
                {isEditing ? (
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-white text-xs"
                  />
                ) : (
                  <strong className="text-white text-sm">{user.fullName}</strong>
                )}
              </div>

              <div className="bg-zinc-950 p-3 rounded-2xl border border-zinc-800">
                <span className="text-zinc-500 block mb-1 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-emerald-400" />
                  Email Address
                </span>
                <strong className="text-white text-sm truncate block">{user.email}</strong>
                {user.isEmailVerified ? (
                  <span className="text-[10px] text-emerald-400 font-semibold mt-0.5 inline-block">✓ Email Verified</span>
                ) : (
                  <button
                    onClick={handleResendEmailVerification}
                    className="text-[10px] text-amber-400 underline font-semibold mt-0.5 inline-block"
                  >
                    Verify Email Address
                  </button>
                )}
              </div>

              <div className="bg-zinc-950 p-3 rounded-2xl border border-zinc-800">
                <span className="text-zinc-500 block mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  Mobile Number
                </span>
                <strong className="text-white text-sm">{user.mobile}</strong>
                <span className="text-[10px] text-emerald-400 font-semibold mt-0.5 inline-block">✓ OTP Verified</span>
              </div>

              <div className="bg-zinc-950 p-3 rounded-2xl border border-zinc-800">
                <span className="text-zinc-500 block mb-1 flex items-center gap-1">
                  <Target className="w-3.5 h-3.5 text-emerald-400" />
                  Fitness Goal
                </span>
                {isEditing ? (
                  <input
                    type="text"
                    value={fitnessGoal}
                    onChange={(e) => setFitnessGoal(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-white text-xs"
                  />
                ) : (
                  <strong className="text-white text-sm">{user.fitnessGoal || 'Build Strength & Fitness'}</strong>
                )}
              </div>

              <div className="bg-zinc-950 p-3 rounded-2xl border border-zinc-800">
                <span className="text-zinc-500 block mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  Registration Date & Time
                </span>
                <strong className="text-white text-sm">{formatDate(user.createdAt)}</strong>
              </div>

              <div className="bg-zinc-950 p-3 rounded-2xl border border-zinc-800">
                <span className="text-zinc-500 block mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  Last Login Time
                </span>
                <strong className="text-white text-sm">{formatDate(user.lastLoginTime || user.createdAt)}</strong>
              </div>
            </div>

            <div className="bg-zinc-950 p-3 rounded-2xl border border-zinc-800 text-xs">
              <span className="text-zinc-500 block mb-1 flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                Device Information
              </span>
              <strong className="text-white text-sm">{user.deviceInfo}</strong>
            </div>
          </div>
        )}

        {/* CHANGE PASSWORD TAB */}
        {activeTab === 'password' && (
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-black font-extrabold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              <KeyRound className="w-4 h-4" />
              <span>{isSubmitting ? 'Updating Password...' : 'Update Password'}</span>
            </button>
          </form>
        )}

        {/* Privacy Note & Sign Out */}
        <div className="pt-4 mt-6 border-t border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
            <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Private & Encrypted Account</span>
          </div>

          <button
            onClick={onLogout}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-rose-950 hover:text-rose-400 text-zinc-300 font-bold text-xs transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};
