import { initializeApp, getApps, getApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import { db, auth } from './firebase';
import { collection, addDoc, doc, updateDoc, onSnapshot, query, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

export interface PushNotificationPayload {
  id?: string;
  userId?: string;
  type: 'workout_reminder' | 'goal_achievement' | 'community_interaction' | 'general';
  title: string;
  body: string;
  icon?: string;
  timestamp?: string;
  read?: boolean;
  data?: Record<string, any>;
}

// Global state for FCM
let messagingInstance: ReturnType<typeof getMessaging> | null = null;
let currentFcmToken: string | null = null;

/**
 * Initialize Firebase Cloud Messaging & Request Web Push Permissions
 */
export const initFCM = async (): Promise<string | null> => {
  if (typeof window === 'undefined') return null;

  try {
    const supported = await isSupported();
    if (!supported) {
      console.warn('Firebase Cloud Messaging is not supported in this browser environment.');
      return null;
    }

    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    messagingInstance = getMessaging(app);

    // Register Service Worker if supported
    if ('serviceWorker' in navigator) {
      try {
        await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      } catch (swErr) {
        console.warn('Service worker registration warning:', swErr);
      }
    }

    // Request Browser Notification Permission
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        // Retrieve FCM Registration Token
        try {
          const vapidKey = import.meta.env.VITE_FCM_VAPID_KEY || undefined;
          const token = await getToken(messagingInstance, vapidKey ? { vapidKey } : undefined);
          if (token) {
            currentFcmToken = token;
            saveFcmTokenToUser(token);
          }
        } catch (tokenErr) {
          console.log('FCM Token generation fallback active:', tokenErr);
        }
      }
    }

    // Foreground Message Listener
    onMessage(messagingInstance, (payload) => {
      console.log('FCM Foreground Push Message Received:', payload);
      const title = payload.notification?.title || 'Moventra Alert';
      const body = payload.notification?.body || '';
      dispatchNativeWebPush(title, body, payload.notification?.icon);
    });

    return currentFcmToken;
  } catch (err) {
    console.warn('Error initializing Firebase Cloud Messaging:', err);
    return null;
  }
};

/**
 * Save FCM token to logged-in user profile in Firestore
 */
const saveFcmTokenToUser = async (token: string) => {
  if (auth.currentUser) {
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        fcmToken: token,
        lastFcmTokenUpdate: new Date().toISOString()
      });
    } catch (e) {
      console.warn('Could not update user fcmToken in Firestore:', e);
    }
  }
};

/**
 * Helper to display native Browser Push Notification
 */
export const dispatchNativeWebPush = (title: string, body: string, icon?: string) => {
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: icon || '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'moventra-push-' + Date.now(),
      });
    } catch (e) {
      console.warn('Could not display Web Push notification:', e);
    }
  }
};

/**
 * Primary Push Dispatcher: Sends FCM Push Notification & Stores Record in Firestore
 */
export const sendPushNotification = async (payload: PushNotificationPayload): Promise<PushNotificationPayload> => {
  const finalPayload: PushNotificationPayload = {
    ...payload,
    userId: auth.currentUser?.uid || 'anonymous',
    timestamp: new Date().toISOString(),
    read: false,
  };

  // 1. Dispatch Native Browser Push Notification
  dispatchNativeWebPush(finalPayload.title, finalPayload.body, finalPayload.icon);

  // 2. Persist to Firestore push_notifications collection
  try {
    const pushRef = collection(db, 'push_notifications');
    const docRef = await addDoc(pushRef, {
      ...finalPayload,
      serverTime: serverTimestamp()
    });
    return { ...finalPayload, id: docRef.id };
  } catch (e) {
    console.warn('Error saving push notification record:', e);
    return finalPayload;
  }
};

/**
 * Specialized Push Notification Trigger: Workout Reminder
 */
export const sendWorkoutReminderPush = async (workoutTitle: string, scheduledTimeStr: string) => {
  return sendPushNotification({
    type: 'workout_reminder',
    title: `⏰ Workout Reminder: ${workoutTitle}`,
    body: `Your scheduled session starts at ${scheduledTimeStr}! Put on your gear and stay consistent today.`,
    icon: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=100&q=80',
  });
};

/**
 * Specialized Push Notification Trigger: Goal Achievement
 */
export const sendGoalAchievementPush = async (achievementTitle: string, achievementMessage: string) => {
  return sendPushNotification({
    type: 'goal_achievement',
    title: `🏆 Goal Unlocked: ${achievementTitle}`,
    body: `${achievementMessage} You've leveled up your fitness streak!`,
    icon: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=100&q=80',
  });
};

/**
 * Specialized Push Notification Trigger: Community Interaction
 */
export const sendCommunityInteractionPush = async (actorName: string, actionText: string, targetPostTitle?: string) => {
  return sendPushNotification({
    type: 'community_interaction',
    title: `💬 Community Interaction: ${actorName}`,
    body: `${actorName} ${actionText}${targetPostTitle ? ` on "${targetPostTitle}"` : ''}. Check out the activity!`,
    icon: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
  });
};

/**
 * Subscribe to Push Notifications in real-time
 */
export const subscribeToPushNotifications = (callback: (notifications: PushNotificationPayload[]) => void) => {
  const pushRef = collection(db, 'push_notifications');
  const q = query(pushRef, orderBy('timestamp', 'desc'), limit(30));

  return onSnapshot(q, (snapshot) => {
    const list: PushNotificationPayload[] = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as PushNotificationPayload),
    }));
    callback(list);
  }, (err) => {
    console.warn('Error listening to push notifications:', err);
    callback([]);
  });
};
