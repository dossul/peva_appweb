// OneSignal Service Worker
// This file is required for OneSignal push notifications to work properly

// Import OneSignal SDK Service Worker
importScripts('https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js');

// Additional service worker functionality can be added here
// This worker will handle push notifications in the background

self.addEventListener('push', function(event) {
  console.log('Push notification received:', event);
});

self.addEventListener('notificationclick', function(event) {
  console.log('Notification clicked:', event);
  event.notification.close();
  
  // Handle notification click - you can add custom logic here
  event.waitUntil(
    clients.openWindow('/')
  );
});