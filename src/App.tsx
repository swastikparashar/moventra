import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { SplashScreen } from './components/SplashScreen';
import {
  auth,
  onAuthStateChanged,
  doc,
  getDoc,
  db,
  logoutUser,
  FirestoreUserProfile,
} from './services/firebase';
import { initFCM } from './services/fcmService';
import {
  mockDailyLog,
  mockWorkoutPlans,
  mockMeals,
  mockChallenges,
  mockBadges,
  mockPosts,
  mockLeaderboard,
  mockAnnouncements,
} from './data/mockData';
import {
  DailyLog,
  WorkoutPlan,
  Meal,
  Challenge,
  Badge,
  CommunityPost,
  LeaderboardUser,
  Announcement,
  UserProfile,
} from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { LegalModal } from './components/LegalModal';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { Footer } from './components/Footer';
import { ActiveWorkoutSession } from './components/ActiveWorkoutSession';
import { DashboardView } from './components/views/DashboardView';
import { WorkoutView } from './components/views/WorkoutView';
import { AiTrainerView } from './components/views/AiTrainerView';
import { NutritionView } from './components/views/NutritionView';
import { ProgressView } from './components/views/ProgressView';
import { ChallengesView } from './components/views/ChallengesView';
import { RemindersView } from './components/views/RemindersView';
import { CommunityView } from './components/views/CommunityView';
import { AdminPanelView } from './components/views/AdminPanelView';
import { Megaphone, X } from 'lucide-react';

export default function App() {
  // Firebase Auth Profile State - Persisted across sessions
  const [currentUser, setCurrentUser] = useState<FirestoreUserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('moventra_saved_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // App Data State
  const [dailyLog, setDailyLog] = useState<DailyLog>(mockDailyLog);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>(mockWorkoutPlans);
  const [meals, setMeals] = useState<Meal[]>(mockMeals);
  const [challenges, setChallenges] = useState<Challenge[]>(mockChallenges);
  const [badges, setBadges] = useState<Badge[]>(mockBadges);
  const [posts, setPosts] = useState<CommunityPost[]>(mockPosts);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>(mockLeaderboard);
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);

  // Active Navigation & View Modals
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [showSplash, setShowSplash] = useState<boolean>(true);

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState<boolean>(false);
  const [legalModalTab, setLegalModalTab] = useState<'terms' | 'privacy' | 'disclaimer' | 'refund'>('terms');
  const [activeWorkoutSession, setActiveWorkoutSession] = useState<WorkoutPlan | null>(null);
  const [announcementBannerClosed, setAnnouncementBannerClosed] = useState<boolean>(false);

  const handleOpenLegal = (tab: 'terms' | 'privacy' | 'disclaimer' | 'refund' = 'terms') => {
    setLegalModalTab(tab);
    setIsLegalModalOpen(true);
  };

  // Firebase Auth Listener & FCM Init
  useEffect(() => {
    // Initialize FCM Messaging
    initFCM().catch((e) => console.log('FCM Init:', e));

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            const profile = snap.data() as FirestoreUserProfile;
            setCurrentUser(profile);
            localStorage.setItem('moventra_saved_user', JSON.stringify(profile));
          }
        } catch (err) {
          console.warn('Error fetching Firestore user profile:', err);
        }
      } else {
        const saved = localStorage.getItem('moventra_saved_user');
        if (!saved) {
          setCurrentUser(null);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Handlers for Water & Step Updates
  const handleUpdateWater = (ml: number) => {
    setDailyLog((prev) => ({
      ...prev,
      waterMl: prev.waterMl + ml,
    }));
  };

  const handleUpdateSteps = (additionalSteps: number) => {
    setDailyLog((prev) => ({
      ...prev,
      steps: prev.steps + additionalSteps,
      caloriesBurned: prev.caloriesBurned + Math.round((additionalSteps / 1000) * 45),
    }));
  };

  const handleAddMeal = (meal: Meal) => {
    setMeals((prev) => [meal, ...prev]);
    setDailyLog((prev) => ({
      ...prev,
      caloriesBurned: Math.max(0, prev.caloriesBurned - 50),
    }));
  };

  const handleWorkoutComplete = (calories: number, durationMinutes: number) => {
    setActiveWorkoutSession(null);
    setDailyLog((prev) => ({
      ...prev,
      caloriesBurned: prev.caloriesBurned + calories,
    }));
    if (currentUser) {
      setCurrentUser((prev) =>
        prev
          ? {
              ...prev,
              xpPoints: (prev.xpPoints || 0) + 150,
              streakDays: (prev.streakDays || 0) + 1,
            }
          : null
      );
    }
  };

  const handleCheckInChallengeDay = (challengeId: string) => {
    setChallenges((prev) =>
      prev.map((ch) => {
        if (ch.id === challengeId) {
          const newCompleted = [...ch.completedDays];
          newCompleted[ch.currentDay - 1] = true;
          return {
            ...ch,
            completedDays: newCompleted,
            currentDay: Math.min(ch.totalDays, ch.currentDay + 1),
          };
        }
        return ch;
      })
    );
  };

  const handleAddPost = (content: string) => {
    if (!currentUser) return;
    const newPost: CommunityPost = {
      id: `post_${Date.now()}`,
      userId: currentUser.uid,
      userName: currentUser.fullName,
      userAvatar: currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      timestamp: 'Just now',
      content,
      likes: 0,
      isLiked: false,
      comments: [],
    };
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            likes: p.isLiked ? p.likes - 1 : p.likes + 1,
            isLiked: !p.isLiked,
          };
        }
        return p;
      })
    );
  };

  const handleAddComment = (postId: string, commentText: string) => {
    if (!currentUser) return;
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [
              ...p.comments,
              {
                id: `c_${Date.now()}`,
                userId: currentUser.uid,
                userName: currentUser.fullName,
                userAvatar: currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
                text: commentText,
                timestamp: 'Just now',
              },
            ],
          };
        }
        return p;
      })
    );
  };

  // Adapter for components expecting traditional UserProfile type
  const legacyUserProfile: UserProfile = {
    id: currentUser?.uid || 'u1',
    name: currentUser?.fullName || 'SWASTIK PARASHAR',
    email: currentUser?.email || 'swastik.parashar@example.com',
    avatar: currentUser?.avatar || '/swastik_ceo.jpg',
    title: currentUser?.isAdmin ? 'C.E.O & FOUNDER' : 'Athlete Member',
    role: currentUser?.isAdmin ? 'C.E.O & FOUNDER' : 'User',
    age: 28,
    gender: 'male',
    weight: 76,
    height: 180,
    targetWeight: 72,
    goal: 'muscle_gain',
    level: 'intermediate',
    dailyStepGoal: 10000,
    dailyWaterGoalMl: 3000,
    dailyCalorieGoal: 2400,
    proteinGoalG: 160,
    streakDays: currentUser?.streakDays || 14,
    xpPoints: currentUser?.xpPoints || 3450,
    isAdmin: currentUser?.isAdmin,
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            user={legacyUserProfile}
            dailyLog={dailyLog}
            onUpdateWater={handleUpdateWater}
            onUpdateSteps={handleUpdateSteps}
            featuredWorkouts={workoutPlans}
            onStartWorkout={(plan) => setActiveWorkoutSession(plan)}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        );
      case 'workouts':
        return (
          <WorkoutView
            workoutPlans={workoutPlans}
            currentUser={currentUser}
            onStartWorkout={(plan) => setActiveWorkoutSession(plan)}
            onAddCustomWorkout={(plan) => setWorkoutPlans((prev) => [plan, ...prev])}
          />
        );
      case 'ai-trainer':
        return (
          <AiTrainerView
            user={legacyUserProfile}
            currentUser={currentUser}
            onSaveGeneratedPlan={(plan) => {
              setWorkoutPlans((prev) => [plan, ...prev]);
              setActiveTab('workouts');
            }}
            onStartWorkout={(plan) => setActiveWorkoutSession(plan)}
          />
        );
      case 'nutrition':
        return (
          <NutritionView
            user={legacyUserProfile}
            meals={meals}
            onAddMeal={handleAddMeal}
            onUpdateWater={handleUpdateWater}
            waterMl={dailyLog.waterMl}
          />
        );
      case 'progress':
        return <ProgressView user={legacyUserProfile} badges={badges} />;
      case 'challenges':
        return (
          <ChallengesView
            challenges={challenges}
            onCheckInDay={handleCheckInChallengeDay}
          />
        );
      case 'reminders':
        return <RemindersView />;
      case 'community':
        return (
          <CommunityView
            user={legacyUserProfile}
            posts={posts}
            leaderboard={leaderboard}
            onAddPost={handleAddPost}
            onLikePost={handleLikePost}
            onAddComment={handleAddComment}
          />
        );
      case 'admin':
        return <AdminPanelView currentUser={currentUser} />;
      default:
        return (
          <DashboardView
            user={legacyUserProfile}
            dailyLog={dailyLog}
            onUpdateWater={handleUpdateWater}
            onUpdateSteps={handleUpdateSteps}
            featuredWorkouts={workoutPlans}
            onStartWorkout={(plan) => setActiveWorkoutSession(plan)}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        );
    }
  };

  const appContent = (
    <div className={`min-h-screen w-full max-w-full overflow-x-hidden ${isDarkMode ? 'bg-[#09090b] text-white' : 'bg-slate-50 text-slate-900'} transition-colors font-sans antialiased flex flex-col relative`}>
      {/* Welcome Intro Splash Screen */}
      <AnimatePresence>
        {showSplash && (
          <SplashScreen
            onComplete={() => {
              setShowSplash(false);
              const savedUser = localStorage.getItem('moventra_saved_user');
              if (!currentUser && !savedUser) {
                setIsAuthOpen(true);
              }
            }}
            creatorName="SWASTIK PARASHAR"
            creatorRole="C.E.O. & FOUNDER"
          />
        )}
      </AnimatePresence>

      {/* Top Header */}
      <Header
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onReplaySplash={() => setShowSplash(true)}
        onOpenLegalModal={() => handleOpenLegal('terms')}
      />

      {/* Broadcast Announcement Banner */}
      {announcements.length > 0 && !announcementBannerClosed && (
        <div className="bg-gradient-to-r from-emerald-600 to-green-500 text-black px-3 sm:px-4 py-2 text-xs font-bold flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2 max-w-4xl mx-auto flex-1 min-w-0">
            <Megaphone className="w-4 h-4 shrink-0 fill-black" />
            <span className="truncate text-[11px] sm:text-xs">
              <strong>{announcements[0].title}:</strong> {announcements[0].message}
            </span>
          </div>
          <button
            onClick={() => setAnnouncementBannerClosed(true)}
            className="p-1 hover:bg-black/10 rounded-lg transition-colors ml-2 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main View Area - Fluid auto-fit container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 pb-28 lg:pb-12 overflow-x-hidden">
        {renderActiveView()}
      </main>

      {/* Footer & Legal Compliance */}
      <Footer onOpenLegalModal={handleOpenLegal} />

      {/* Mobile Bottom Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Modals & Banners */}
      <CookieConsentBanner onOpenLegalModal={handleOpenLegal} />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onAuthSuccess={(profile) => {
          setCurrentUser(profile);
          localStorage.setItem('moventra_saved_user', JSON.stringify(profile));
          setIsAuthOpen(false);
        }}
        onOpenLegalModal={handleOpenLegal}
      />

      <LegalModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
        defaultTab={legalModalTab}
      />

      {currentUser && (
        <UserProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          user={currentUser}
          onLogout={async () => {
            localStorage.removeItem('moventra_saved_user');
            await logoutUser();
            setCurrentUser(null);
            setIsProfileOpen(false);
          }}
        />
      )}

      {activeWorkoutSession && (
        <ActiveWorkoutSession
          workout={activeWorkoutSession}
          onClose={() => setActiveWorkoutSession(null)}
          onComplete={handleWorkoutComplete}
        />
      )}
    </div>
  );

  return appContent;
}
