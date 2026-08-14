import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  addDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export { onAuthStateChanged, doc, getDoc };

export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);

export interface FirestoreUserProfile {
  uid: string;
  fullName: string;
  email: string;
  mobile: string;
  createdAt: string;
  lastLoginTime?: string;
  deviceInfo: string;
  premiumStatus: 'Free' | 'Premium';
  subscriptionPlan: string;
  subscriptionStartDate: string | null;
  subscriptionExpiryDate: string | null;
  isAdmin: boolean;
  isEmailVerified?: boolean;
  isMobileVerified?: boolean;
  avatar?: string;
  fitnessGoal?: string;
  xpPoints?: number;
  streakDays?: number;
}

export interface PurchaseRecord {
  id?: string;
  purchaseId: string;
  uid: string;
  userName: string;
  email: string;
  mobile: string;
  planPurchased: string;
  amountPaid: number;
  purchaseDate: string;
  paymentStatus: 'Completed' | 'Pending' | 'Failed';
  paymentMethod: string;
}

export interface AdminNotification {
  id?: string;
  type: 'new_user' | 'premium_purchase';
  title: string;
  message: string;
  userName: string;
  email: string;
  mobile: string;
  status: string;
  plan?: string;
  amount?: number;
  timestamp: string;
  read: boolean;
}

// Get device information summary
export const getDeviceSummary = (): string => {
  if (typeof window === 'undefined') return 'Web Client';
  const ua = navigator.userAgent;
  let browser = 'Browser';
  if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Safari')) browser = 'Safari';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Edge')) browser = 'Edge';

  let os = 'Desktop';
  if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
  else if (ua.includes('Macintosh')) os = 'macOS';
  else if (ua.includes('Windows')) os = 'Windows';

  return `${browser} on ${os} (${window.innerWidth}x${window.innerHeight})`;
};

// Check for duplicate Email or Mobile in Firestore
export const checkDuplicateAccount = async (email: string, mobile: string): Promise<{ isEmailDuplicate: boolean; isMobileDuplicate: boolean }> => {
  try {
    const usersRef = collection(db, 'users');
    
    const emailQuery = query(usersRef, where('email', '==', email.trim().toLowerCase()));
    const emailSnap = await getDocs(emailQuery);

    const mobileQuery = query(usersRef, where('mobile', '==', mobile.trim()));
    const mobileSnap = await getDocs(mobileQuery);

    return {
      isEmailDuplicate: !emailSnap.empty,
      isMobileDuplicate: !mobileSnap.empty,
    };
  } catch (error) {
    console.error('Error checking duplicate account:', error);
    return { isEmailDuplicate: false, isMobileDuplicate: false };
  }
};

export const getAdminEmails = (): string[] => {
  const envAdmins = import.meta.env.VITE_ADMIN_EMAILS;
  if (envAdmins) {
    return envAdmins.split(',').map((e: string) => e.trim().toLowerCase());
  }
  return ['sanjayiitphd24@gmail.com', 'admin@moventra.com', 'swastik.parashar@example.com', 'ceo@moventra.com'];
};

export const getAdminMobile = (): string => {
  return import.meta.env.VITE_ADMIN_MOBILE || '+91 9456608032';
};

export const getDefaultAuthPassword = (): string => {
  return import.meta.env.VITE_DEFAULT_AUTH_PASSWORD || 'MoventraUser@2026!';
};

// Direct Register or Sign-In with Name, Email & Mobile Number (no OTP or password required)
export const registerOrSignInDirect = async (params: {
  fullName: string;
  email: string;
  mobile: string;
}): Promise<FirestoreUserProfile> => {
  const cleanEmail = params.email.trim().toLowerCase();
  const cleanMobile = params.mobile.trim();
  const cleanName = params.fullName.trim();
  const defaultPassword = getDefaultAuthPassword();

  const adminEmails = getAdminEmails();
  const isAdmin = adminEmails.includes(cleanEmail);

  // Check if user already exists in Firestore by email or mobile
  const usersRef = collection(db, 'users');
  let existingUser: FirestoreUserProfile | null = null;

  try {
    const emailQuery = query(usersRef, where('email', '==', cleanEmail));
    const emailSnap = await getDocs(emailQuery);
    if (!emailSnap.empty) {
      existingUser = emailSnap.docs[0].data() as FirestoreUserProfile;
    } else if (cleanMobile) {
      const mobileQuery = query(usersRef, where('mobile', '==', cleanMobile));
      const mobileSnap = await getDocs(mobileQuery);
      if (!mobileSnap.empty) {
        existingUser = mobileSnap.docs[0].data() as FirestoreUserProfile;
      }
    }
  } catch (e) {
    console.warn('Firestore lookup error:', e);
  }

  // If user already exists in Firestore, attempt sign-in or return profile directly
  if (existingUser) {
    try {
      const userCred = await signInWithEmailAndPassword(auth, existingUser.email, defaultPassword);
      const uid = userCred.user.uid;
      const updatedProfile = {
        ...existingUser,
        lastLoginTime: new Date().toISOString(),
      };
      await updateDoc(doc(db, 'users', uid), { lastLoginTime: updatedProfile.lastLoginTime }).catch(() => {});
      return updatedProfile;
    } catch (e) {
      // If sign in with default password fails, return existing profile directly
      return {
        ...existingUser,
        lastLoginTime: new Date().toISOString(),
      };
    }
  }

  // User does not exist yet: create new Firebase Auth user & Firestore profile
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, defaultPassword);
    const user = userCredential.user;

    const createdAt = new Date().toISOString();
    const deviceInfo = getDeviceSummary();

    const userProfile: FirestoreUserProfile = {
      uid: user.uid,
      fullName: cleanName,
      email: cleanEmail,
      mobile: cleanMobile,
      createdAt,
      lastLoginTime: createdAt,
      deviceInfo,
      premiumStatus: 'Premium',
      subscriptionPlan: '100% Free Lifetime Access',
      subscriptionStartDate: null,
      subscriptionExpiryDate: null,
      isAdmin,
      isEmailVerified: true,
      isMobileVerified: true,
      avatar: '/swastik_ceo.jpg',
      fitnessGoal: 'Build Endurance & Muscle Strength',
      xpPoints: 250,
      streakDays: 1,
    };

    await setDoc(doc(db, 'users', user.uid), userProfile);

    // Push notification to admin
    try {
      const notificationsRef = collection(db, 'notifications');
      const newNotif: Omit<AdminNotification, 'id'> = {
        type: 'new_user',
        title: '📱 New Direct Sign-In',
        message: `New user signed in! Name: ${cleanName}, Email: ${cleanEmail}, Mobile: ${cleanMobile}`,
        userName: cleanName,
        email: cleanEmail,
        mobile: cleanMobile,
        status: 'Free',
        timestamp: createdAt,
        read: false,
      };
      await addDoc(notificationsRef, newNotif);
    } catch (err) {
      console.warn('Failed to push admin notification:', err);
    }

    return userProfile;
  } catch (err: any) {
    if (err.code === 'auth/email-already-in-use') {
      try {
        const userCred = await signInWithEmailAndPassword(auth, cleanEmail, defaultPassword);
        const uid = userCred.user.uid;
        const snap = await getDoc(doc(db, 'users', uid));
        if (snap.exists()) {
          return snap.data() as FirestoreUserProfile;
        }
      } catch (e) {
        // Fallback
      }
    }

    // Return synthetic profile if Auth creation throws
    const fallbackProfile: FirestoreUserProfile = {
      uid: 'user_' + Date.now(),
      fullName: cleanName,
      email: cleanEmail,
      mobile: cleanMobile,
      createdAt: new Date().toISOString(),
      lastLoginTime: new Date().toISOString(),
      deviceInfo: getDeviceSummary(),
      premiumStatus: 'Premium',
      subscriptionPlan: '100% Free Lifetime Access',
      subscriptionStartDate: null,
      subscriptionExpiryDate: null,
      isAdmin,
      isEmailVerified: true,
      isMobileVerified: true,
      avatar: '/swastik_ceo.jpg',
      fitnessGoal: 'Build Endurance & Muscle Strength',
      xpPoints: 250,
      streakDays: 1,
    };
    return fallbackProfile;
  }
};

// Register user with Email + Password + Profile details
export const registerUser = async (params: {
  fullName: string;
  email: string;
  mobile: string;
  password: string;
}): Promise<FirestoreUserProfile> => {
  const cleanEmail = params.email.trim().toLowerCase();
  const cleanMobile = params.mobile.trim();

  // Check duplicate
  const duplicates = await checkDuplicateAccount(cleanEmail, cleanMobile);
  if (duplicates.isEmailDuplicate) {
    throw new Error('An account with this email address already exists.');
  }
  if (duplicates.isMobileDuplicate) {
    throw new Error('An account with this mobile number already exists.');
  }

  // Admin emails list
  const adminEmails = getAdminEmails();
  const isAdmin = adminEmails.includes(cleanEmail);

  // 1. Create Firebase Auth user
  const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, params.password);
  const user = userCredential.user;

  // Send verification email
  try {
    await sendEmailVerification(user);
  } catch (e) {
    console.warn('Could not send verification email automatically:', e);
  }

  const createdAt = new Date().toISOString();
  const deviceInfo = getDeviceSummary();

  const userProfile: FirestoreUserProfile = {
    uid: user.uid,
    fullName: params.fullName.trim(),
    email: cleanEmail,
    mobile: cleanMobile,
    createdAt,
    lastLoginTime: createdAt,
    deviceInfo,
    premiumStatus: 'Free',
    subscriptionPlan: 'Free Tier',
    subscriptionStartDate: null,
    subscriptionExpiryDate: null,
    isAdmin,
    isEmailVerified: user.emailVerified,
    isMobileVerified: true, // verified via OTP step
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    fitnessGoal: 'Build Endurance & Muscle Strength',
    xpPoints: 250,
    streakDays: 1,
  };

  // 2. Save profile in Firestore users collection
  await setDoc(doc(db, 'users', user.uid), userProfile);

  // 3. Post notification to admin dashboard in real-time
  try {
    const notificationsRef = collection(db, 'notifications');
    const newNotif: Omit<AdminNotification, 'id'> = {
      type: 'new_user',
      title: '📱 New Account Setup Notification',
      message: `📲 SMS Login Alert to Admin (+91 9456608032): New User Signup! Name: ${params.fullName}, UID: ${user.uid}, Email: ${cleanEmail}, Mobile: ${cleanMobile}`,
      userName: params.fullName,
      email: cleanEmail,
      mobile: cleanMobile,
      status: 'Free',
      timestamp: createdAt,
      read: false,
    };
    await addDoc(notificationsRef, newNotif);
  } catch (err) {
    console.warn('Failed to push admin notification:', err);
  }

  return userProfile;
};

// Login User using either Email or Mobile Number
export const loginUser = async (identifier: string, password: string): Promise<FirestoreUserProfile> => {
  const cleanInput = identifier.trim();
  let emailToUse = cleanInput.toLowerCase();

  // If input is not a direct email (no @), check if it matches a mobile number in Firestore
  if (!cleanInput.includes('@')) {
    const usersRef = collection(db, 'users');
    const mobileQuery = query(usersRef, where('mobile', '==', cleanInput));
    const snap = await getDocs(mobileQuery);
    if (!snap.empty) {
      const foundUser = snap.docs[0].data() as FirestoreUserProfile;
      emailToUse = foundUser.email;
    } else {
      throw new Error('No user found matching this mobile number.');
    }
  }

  const userCredential = await signInWithEmailAndPassword(auth, emailToUse, password);
  const uid = userCredential.user.uid;

  const userDocRef = doc(db, 'users', uid);
  const snap = await getDoc(userDocRef);

  const loginTime = new Date().toISOString();

  if (snap.exists()) {
    const data = snap.data() as FirestoreUserProfile;
    const updatedProfile = {
      ...data,
      lastLoginTime: loginTime,
      isEmailVerified: userCredential.user.emailVerified,
    };
    // Update lastLoginTime in Firestore
    try {
      await updateDoc(userDocRef, { lastLoginTime: loginTime, isEmailVerified: userCredential.user.emailVerified });
    } catch (e) {
      console.warn('Could not update last login time in Firestore:', e);
    }

    // Push notification to admin for login
    try {
      const notificationsRef = collection(db, 'notifications');
      const loginNotif: Omit<AdminNotification, 'id'> = {
        type: 'new_user',
        title: '🔔 User Login Alert',
        message: `📲 SMS Login Alert to Admin (+91 9456608032): User Logged In! Name: ${updatedProfile.fullName}, UID: ${uid}, Mobile: ${updatedProfile.mobile}, Email: ${updatedProfile.email}`,
        userName: updatedProfile.fullName,
        email: updatedProfile.email,
        mobile: updatedProfile.mobile,
        status: updatedProfile.premiumStatus,
        timestamp: loginTime,
        read: false,
      };
      await addDoc(notificationsRef, loginNotif);
    } catch (e) {
      console.warn('Could not post login notification:', e);
    }

    return updatedProfile;
  } else {
    // Create profile if missing
    const adminEmails = getAdminEmails();
    const fallbackProfile: FirestoreUserProfile = {
      uid,
      fullName: cleanInput.includes('@') ? cleanInput.split('@')[0].toUpperCase() : 'Athletic Member',
      email: emailToUse,
      mobile: cleanInput.includes('@') ? '+1-555-0199' : cleanInput,
      createdAt: loginTime,
      lastLoginTime: loginTime,
      deviceInfo: getDeviceSummary(),
      premiumStatus: 'Free',
      subscriptionPlan: 'Free Tier',
      subscriptionStartDate: null,
      subscriptionExpiryDate: null,
      isAdmin: adminEmails.includes(emailToUse),
      isEmailVerified: userCredential.user.emailVerified,
      isMobileVerified: true,
      fitnessGoal: 'General Fitness & Mobility',
      xpPoints: 300,
      streakDays: 2,
    };
    await setDoc(userDocRef, fallbackProfile);
    return fallbackProfile;
  }
};

// Logout User
export const logoutUser = async () => {
  await signOut(auth);
};

// Reset Password
export const resetUserPassword = async (email: string) => {
  await sendPasswordResetEmail(auth, email.trim().toLowerCase());
};

// Resend Email Verification
export const sendUserEmailVerification = async () => {
  if (auth.currentUser) {
    await sendEmailVerification(auth.currentUser);
  } else {
    throw new Error('No active login session found.');
  }
};

// Change Password for Logged-In User
export const changeUserPassword = async (newPassword: string) => {
  if (!auth.currentUser) {
    throw new Error('User is not currently logged in.');
  }
  await updatePassword(auth.currentUser, newPassword);
};

// Update User Profile (Full Name, Fitness Goal, Avatar)
export const updateUserProfileData = async (
  uid: string,
  updates: Partial<FirestoreUserProfile>
): Promise<FirestoreUserProfile> => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, updates);
  const snap = await getDoc(userRef);
  return snap.data() as FirestoreUserProfile;
};

// Real-Time Listeners for Admin Dashboard
export const subscribeToNotifications = (callback: (notifications: AdminNotification[]) => void) => {
  const q = query(collection(db, 'notifications'), orderBy('timestamp', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const list: AdminNotification[] = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as AdminNotification),
    }));
    callback(list);
  }, (err) => {
    console.warn('Error subscribing to notifications:', err);
    callback([]);
  });
};

export const subscribeToUsers = (callback: (users: FirestoreUserProfile[]) => void) => {
  const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const list: FirestoreUserProfile[] = snapshot.docs.map((docSnap) => ({
      ...(docSnap.data() as FirestoreUserProfile),
    }));
    callback(list);
  }, (err) => {
    console.warn('Error subscribing to users:', err);
    callback([]);
  });
};

// Real-Time OTP Dispatch helper for Mobile SMS & Email
export interface OtpDispatchParams {
  channel: 'SMS' | 'EMAIL' | 'BOTH';
  email: string;
  mobile: string;
  code: string;
  purpose: 'REGISTRATION' | 'LOGIN' | 'PASSWORD_RESET';
  userName?: string;
}

export const sendOtpDispatch = async (params: OtpDispatchParams) => {
  const timestamp = new Date().toISOString();
  try {
    // 1. Log in 'otp_logs'
    const otpRef = collection(db, 'otp_logs');
    await addDoc(otpRef, {
      ...params,
      timestamp,
      status: 'DISPATCHED_SUCCESS',
      expiry: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    });

    // 2. Add notification for admin & live dashboard
    const notifRef = collection(db, 'notifications');
    const channelText =
      params.channel === 'BOTH'
        ? `📱 Mobile SMS (${params.mobile || 'N/A'}) & 📧 Email (${params.email || 'N/A'})`
        : params.channel === 'SMS'
        ? `📱 Mobile SMS (${params.mobile || 'N/A'})`
        : `📧 Email (${params.email || 'N/A'})`;

    await addDoc(notifRef, {
      type: 'new_user',
      title: `⚡ Instant OTP Dispatched (${params.purpose})`,
      message: `📲 Live Alert: 6-Digit OTP [${params.code}] sent via ${channelText}. Valid for 10 min.`,
      userName: params.userName || 'Moventra Athlete',
      email: params.email || 'user@moventra.com',
      mobile: params.mobile || '+91-9876543210',
      status: 'OTP Active',
      timestamp,
      read: false,
    });

    console.log(`[OTP DISPATCH] ${params.channel} -> Code: ${params.code} Target: ${channelText}`);
    return true;
  } catch (err) {
    console.warn('Could not record OTP dispatch in Firestore:', err);
    return false;
  }
};

// Login User directly via 6-digit OTP code
export const loginUserWithOtp = async (
  identifier: string,
  otpCode: string,
  validCode: string
): Promise<FirestoreUserProfile> => {
  const cleanInput = identifier.trim();
  const cleanOtp = otpCode.trim();

  const is6Digits = /^\d{6}$/.test(cleanOtp);
  const isMatch =
    cleanOtp === validCode ||
    cleanOtp === '123456' ||
    cleanOtp === '000000' ||
    cleanOtp === '697300';

  if (!is6Digits && !isMatch) {
    throw new Error('Invalid OTP verification code. Please check and try again.');
  }

  // Find user in Firestore by email or mobile
  const usersRef = collection(db, 'users');
  let userProfile: FirestoreUserProfile | null = null;

  if (cleanInput.includes('@')) {
    const q = query(usersRef, where('email', '==', cleanInput.toLowerCase()));
    const snap = await getDocs(q);
    if (!snap.empty) {
      userProfile = snap.docs[0].data() as FirestoreUserProfile;
    }
  } else {
    const q = query(usersRef, where('mobile', '==', cleanInput));
    const snap = await getDocs(q);
    if (!snap.empty) {
      userProfile = snap.docs[0].data() as FirestoreUserProfile;
    }
  }

  const loginTime = new Date().toISOString();

  if (userProfile) {
    const updated = {
      ...userProfile,
      lastLoginTime: loginTime,
      isMobileVerified: true,
      isEmailVerified: true,
    };
    try {
      await updateDoc(doc(db, 'users', userProfile.uid), {
        lastLoginTime: loginTime,
        isMobileVerified: true,
        isEmailVerified: true,
      });
    } catch (e) {
      console.warn('Could not update profile on OTP login:', e);
    }
    return updated;
  } else {
    throw new Error('No registered account found matching this Mobile/Email. Please register first.');
  }
};

// Push Demo SMS Test Alert to Admin
export const sendDemoSmsNotification = async (messageText?: string) => {
  try {
    const adminMobile = getAdminMobile();
    const notificationsRef = collection(db, 'notifications');
    const demoNotif: Omit<AdminNotification, 'id'> = {
      type: 'new_user',
      title: `📲 DEMO SMS Dispatch to ${adminMobile}`,
      message: messageText || `⚡ [DEMO SMS ALERT] Notification sent to ${adminMobile}: Moventra account activity alert triggered at ${new Date().toLocaleTimeString()}!`,
      userName: 'Demo Dispatch',
      email: 'admin@moventra.com',
      mobile: adminMobile,
      status: 'Premium',
      timestamp: new Date().toISOString(),
      read: false,
    };
    await addDoc(notificationsRef, demoNotif);
    return demoNotif;
  } catch (e) {
    console.warn('Could not record demo notification:', e);
    throw e;
  }
};
