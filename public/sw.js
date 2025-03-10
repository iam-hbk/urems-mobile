// Push event listener for receiving push notifications
self.addEventListener('push', function (event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon || '/web-app-manifest-192x192.png',
      badge: '/web-app-manifest-192x192.png',
      vibrate: [100, 50, 100], // Vibration pattern: 100ms on, 50ms off, 100ms on
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '2',
      },
    };
    // Show the notification with the title and options
    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

// Notification click event listener
self.addEventListener('notificationclick', function (event) {
  console.log('Notification click received.');
  // Close the notification
  event.notification.close();

  // Define the target URL based on environment or data
  // uncomment this, when code is hosted
  // const targetUrl = event.notification.data?.url ||
  //   (self.location.hostname === 'localhost'
  //     ? 'http://localhost:3000'
  //     : 'https://justgig.vercel.app');

  const targetUrl = 'http://localhost'

  // Open the window with the target URL
  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if a window is already open and focus it
        for (const client of clientList) {
          if (client.url === targetUrl && 'focus' in client) {
            return client.focus();
          }
        }
        // If no matching window is found, open a new one
        return clients.openWindow(targetUrl);
      })
  );
});