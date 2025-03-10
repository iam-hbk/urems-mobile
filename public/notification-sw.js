// notification-sw.js
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('push', (event) => {
  const options = {
    body: event.data?.text() || 'No payload',
    icon: '/web-app-manifest-192x192.png',
    badge: '/web-app-manifest-192x192.png'
  };

  event.waitUntil(
    self.registration.showNotification('Just Gig', options)
  );
});