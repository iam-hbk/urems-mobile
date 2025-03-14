/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (

      new Promise(resolve => {
        if ("document" in self) {
          const script = document.createElement("script");
          script.src = uri;
          script.onload = resolve;
          document.head.appendChild(script);
        } else {
          nextDefineUri = uri;
          importScripts(uri);
          resolve();
        }
      })

        .then(() => {
          let promise = registry[uri];
          if (!promise) {
            throw new Error(`Module ${uri} didn’t register its module`);
          }
          return promise;
        })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-1e54d6fe'], (function (workbox) {
  'use strict';

  importScripts("/fallback-development.js");
  self.skipWaiting();
  workbox.clientsClaim();

  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "/~offline",
    "revision": "development"
  }], {
    "ignoreURLParametersMatching": [/^utm_/, /^fbclid$/, /ts/]
  });
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute("/", new workbox.NetworkFirst({
    "cacheName": "start-url",
    plugins: [{
      cacheWillUpdate: async ({
        response: e
      }) => e && "opaqueredirect" === e.type ? new Response(e.body, {
        status: 200,
        statusText: "OK",
        headers: e.headers
      }) : e
    }, {
      handlerDidError: async ({
        request: e
      }) => "undefined" != typeof self ? self.fallback(e) : Response.error()
    }]
  }), 'GET');
  workbox.registerRoute(/.*/i, new workbox.NetworkOnly({
    "cacheName": "dev",
    plugins: [{
      handlerDidError: async ({
        request: e
      }) => "undefined" != typeof self ? self.fallback(e) : Response.error()
    }]
  }), 'GET');

}));


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


// notification service worker
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