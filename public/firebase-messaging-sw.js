// Firebase Cloud Messaging Background Service Worker
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyANZdGtZu7nrQlxX-D2cfJTOsGqBB4qnHs",
  authDomain: "splendid-cistern-69v0l.firebaseapp.com",
  projectId: "splendid-cistern-69v0l",
  storageBucket: "splendid-cistern-69v0l.firebasestorage.app",
  messagingSenderId: "36623751266",
  appId: "1:36623751266:web:778f7e9aa57d82b5cbd93b"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification?.title || payload.data?.title || 'Moventra Push Alert';
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || 'You have a new update from Moventra!',
    icon: payload.notification?.icon || '/images/icon-192.png',
    badge: '/images/icon-192.png',
    data: payload.data || {}
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
