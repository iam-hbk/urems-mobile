if(!self.define){let n,e={};const s=(s,a)=>(s=new URL(s+".js",a).href,e[s]||new Promise((e=>{if("document"in self){const n=document.createElement("script");n.src=s,n.onload=e,document.head.appendChild(n)}else n=s,importScripts(s),e()})).then((()=>{let n=e[s];if(!n)throw new Error(`Module ${s} didn’t register its module`);return n})));self.define=(a,i)=>{const t=n||("document"in self?document.currentScript.src:"")||location.href;if(e[t])return;let r={};const c=n=>s(n,t),u={module:{uri:t},exports:r,require:c};e[t]=Promise.all(a.map((n=>u[n]||c(n)))).then((n=>(i(...n),r)))}}define(["./workbox-3c9d0171"],(function(n){"use strict";importScripts("/fallback-ce627215c0e4a9af.js"),self.skipWaiting(),n.clientsClaim(),n.precacheAndRoute([{url:"/_next/static/QknFYH0vKan7AnRxwYUkn/_buildManifest.js",revision:"ae4a1e87576840bf199c234a48e66cac"},{url:"/_next/static/QknFYH0vKan7AnRxwYUkn/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/1149-16bb26924e9b65c4.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/118-da5849de611fc98e.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/140-6b197b3f2e0b84b4.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/1413-15191a5c732523f6.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/1496-4e8ceca9591dbcf2.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/1643-b6cf512ad0c57cbd.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/2363-11d65abc32398a69.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/2633-062c630fdfe01c01.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/2640-92c0f81dbb8191d5.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/2850-d7cfcbeb523f6401.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/286.ea544d6bb87f6ef5.js",revision:"ea544d6bb87f6ef5"},{url:"/_next/static/chunks/2908-4c835ca79e04cd0d.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/2934-86f64cfa80ad4b1d.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/2e874054-0e9c45e8489779d4.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/3349-0495cd4fb560eac7.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/3465-921e13849a0a467d.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/3530-d9b488aa77afa149.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/3789-c0c8ac26405a554f.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/3987-37f2b5de7b24e694.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/4271-d5acfda0b3690f4f.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/4388-4618c131ed79b504.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/4887-30dd50fec6eec1c8.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/492-61669a18d101a619.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/4981.3996fdb925bdbf9e.js",revision:"3996fdb925bdbf9e"},{url:"/_next/static/chunks/5096-0abe8e36ec126988.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/514.18aeb4693a2bb46e.js",revision:"18aeb4693a2bb46e"},{url:"/_next/static/chunks/5410-43134516b404008c.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/5730-648e98ebb21cb06c.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/5899e4d3.67617e769ef3a934.js",revision:"67617e769ef3a934"},{url:"/_next/static/chunks/6393-4b967439e482ae0d.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/684-0e68a7323f4d80c6.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/7261-a7dd34fe57e694dd.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/7370-b130c5bd8418c073.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/7549-99c738baba2f9567.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/7929-8cc32e3a345b4db0.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/8111-622326543c7a7bb8.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/8261-78dddc3b76b5e5fd.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/8632-0c4b18a1286ac395.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/8715-56b91b94cc0c0264.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/9177-83f59129d17a0711.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/9276-ed7749718ec4437f.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/9720-de44e71f1ea46ed5.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/app/_not-found/page-6d9c112438c9e3be.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/app/api/auth/check-session/route-ba75a88e9a16c62e.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/app/api/auth/employee/route-6be6af02b3063c0e.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/app/api/auth/login/route-cbdd17788ff141de.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/app/api/auth/logout/route-34bdb79ff0cda1c7.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/app/edit-prf/%5BprfID%5D/assessments/page-00b63f33e7fcf560.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/app/edit-prf/%5BprfID%5D/diagnosis/page-0e5b0cc157586344.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/app/edit-prf/%5BprfID%5D/incident-information/page-864a9d0295055ad9.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/app/edit-prf/%5BprfID%5D/injuries/page-d47fbfb4af1947de.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/app/edit-prf/%5BprfID%5D/intravenous-therapy/page-11f2a35e410b6bc7.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/app/edit-prf/%5BprfID%5D/inventory/page-93e779063d485d6d.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/app/edit-prf/%5BprfID%5D/layout-b37e0ed04b3b6afa.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/app/edit-prf/%5BprfID%5D/mechanism-of-injury/page-4d25de67cdc24cb9.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/app/edit-prf/%5BprfID%5D/medication-administration/page-74ed3887cc26ff9c.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/app/edit-prf/%5BprfID%5D/not-found-1be6809053db4721.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/app/edit-prf/%5BprfID%5D/notes/page-19caacfcce376f8c.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/app/edit-prf/%5BprfID%5D/page-e2a8f6dde2f9ccb7.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/app/edit-prf/%5BprfID%5D/patient-details/page-4276d9698a0617bf.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/app/edit-prf/%5BprfID%5D/patient-handover/page-e4ffc4c9fffecdd6.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/app/edit-prf/%5BprfID%5D/primary-survey/page-273bb69e2d232f20.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/app/edit-prf/%5BprfID%5D/procedures/page-b20075e40039ff53.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/app/edit-prf/%5BprfID%5D/respiratory-distress/page-a3d860c5b33c0751.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/app/edit-prf/%5BprfID%5D/secondary-survey/page-e16de71b8f4e6e56.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/app/edit-prf/%5BprfID%5D/transportation/page-de680263479a1417.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/app/edit-prf/%5BprfID%5D/vital-signs/page-c63816dd9a98aa04.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/app/layout-0a6d08480b0c7ef0.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/app/login/page-0f233c63e68aeacd.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/app/manifest.webmanifest/route-b1cc074dddd60dae.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/app/not-found-74b4039307f1caf8.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/app/page-d216fcce8ba52338.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/app/profile/page-a358d74b36edd84a.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/app/test-print/page-f8e4c26477cbdc58.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/app/~offline/page-2559b04527026f16.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/badf541d.c14814d6479913b6.js",revision:"c14814d6479913b6"},{url:"/_next/static/chunks/c132bf7d.972f638b7030b4a3.js",revision:"972f638b7030b4a3"},{url:"/_next/static/chunks/fc4801df.1f48a6ce54fecb5f.js",revision:"1f48a6ce54fecb5f"},{url:"/_next/static/chunks/framework-ce5889621992c6ee.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/main-app-bfab522645f049ca.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/main-bf9e1b0179b02859.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/pages/_app-b4a4c5c90b1177b2.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/pages/_error-9ac2ec676f686157.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-13f3c12d0bc824d0.js",revision:"QknFYH0vKan7AnRxwYUkn"},{url:"/_next/static/css/e65642d8130861fe.css",revision:"e65642d8130861fe"},{url:"/_next/static/media/01af0fc7b4278e65-s.p.woff2",revision:"6fa778aa9ee280df9ff563f3a08b0350"},{url:"/_next/static/media/8cdee4d3ed444abc-s.woff2",revision:"420e1e96628860fae605e46bd196926d"},{url:"/apple-touch-icon.png",revision:"ade770273c5eb5c431eaf242bd6d3732"},{url:"/fallback-ce627215c0e4a9af.js",revision:"f3db8708ddd21a63c63c3187faacd746"},{url:"/favicon-96x96.png",revision:"8c3fba1e54231d0875df5171dd9d77d7"},{url:"/favicon.svg",revision:"f84d6d11c38b16e2b31ad630f65ceb46"},{url:"/next.svg",revision:"8e061864f388b47f33a1c3780831193e"},{url:"/notification-sw.js",revision:"95f01c8be8b48bda73740dfe2c088550"},{url:"/site.webmanifest",revision:"e4ee890f998ef771686fcc27593b0926"},{url:"/urems-erp.png",revision:"f184438b7797f6ae2844b250dd8c18fa"},{url:"/vercel.svg",revision:"61c6b19abff40ea7acd577be818f3976"},{url:"/web-app-manifest-192x192.png",revision:"76fddba6ca62c0cbc9b059e934c579de"},{url:"/web-app-manifest-512x512.png",revision:"ff2f805ac9bf041e1dc93add20f02c1c"},{url:"/~offline",revision:"QknFYH0vKan7AnRxwYUkn"}],{ignoreURLParametersMatching:[/^utm_/,/^fbclid$/]}),n.cleanupOutdatedCaches(),n.registerRoute("/",new n.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:function(n){return _ref.apply(this,arguments)}},{handlerDidError:function(n){return _ref.apply(this,arguments)}}]}),"GET"),n.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new n.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new n.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3}),{handlerDidError:function(n){return _ref.apply(this,arguments)}}]}),"GET"),n.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new n.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new n.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800}),{handlerDidError:function(n){return _ref.apply(this,arguments)}}]}),"GET"),n.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new n.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new n.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800}),{handlerDidError:function(n){return _ref.apply(this,arguments)}}]}),"GET"),n.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new n.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new n.ExpirationPlugin({maxEntries:64,maxAgeSeconds:2592e3}),{handlerDidError:function(n){return _ref.apply(this,arguments)}}]}),"GET"),n.registerRoute(/\/_next\/static.+\.js$/i,new n.CacheFirst({cacheName:"next-static-js-assets",plugins:[new n.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400}),{handlerDidError:function(n){return _ref.apply(this,arguments)}}]}),"GET"),n.registerRoute(/\/_next\/image\?url=.+$/i,new n.StaleWhileRevalidate({cacheName:"next-image",plugins:[new n.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400}),{handlerDidError:function(n){return _ref.apply(this,arguments)}}]}),"GET"),n.registerRoute(/\.(?:mp3|wav|ogg)$/i,new n.CacheFirst({cacheName:"static-audio-assets",plugins:[new n.RangeRequestsPlugin,new n.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400}),{handlerDidError:function(n){return _ref.apply(this,arguments)}}]}),"GET"),n.registerRoute(/\.(?:mp4|webm)$/i,new n.CacheFirst({cacheName:"static-video-assets",plugins:[new n.RangeRequestsPlugin,new n.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400}),{handlerDidError:function(n){return _ref.apply(this,arguments)}}]}),"GET"),n.registerRoute(/\.(?:js)$/i,new n.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new n.ExpirationPlugin({maxEntries:48,maxAgeSeconds:86400}),{handlerDidError:function(n){return _ref.apply(this,arguments)}}]}),"GET"),n.registerRoute(/\.(?:css|less)$/i,new n.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new n.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400}),{handlerDidError:function(n){return _ref.apply(this,arguments)}}]}),"GET"),n.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new n.StaleWhileRevalidate({cacheName:"next-data",plugins:[new n.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400}),{handlerDidError:function(n){return _ref.apply(this,arguments)}}]}),"GET"),n.registerRoute(/\.(?:json|xml|csv)$/i,new n.NetworkFirst({cacheName:"static-data-assets",plugins:[new n.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400}),{handlerDidError:function(n){return _ref.apply(this,arguments)}}]}),"GET"),n.registerRoute((function(n){var e=n.sameOrigin,s=n.url.pathname;return!(!e||s.startsWith("/api/auth/callback")||!s.startsWith("/api/"))}),new n.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new n.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400}),{handlerDidError:function(n){return _ref.apply(this,arguments)}}]}),"GET"),n.registerRoute((function(n){var e=n.request,s=n.url.pathname,a=n.sameOrigin;return"1"===e.headers.get("RSC")&&"1"===e.headers.get("Next-Router-Prefetch")&&a&&!s.startsWith("/api/")}),new n.NetworkFirst({cacheName:"pages-rsc-prefetch",plugins:[new n.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400}),{handlerDidError:function(n){return _ref.apply(this,arguments)}}]}),"GET"),n.registerRoute((function(n){var e=n.request,s=n.url.pathname,a=n.sameOrigin;return"1"===e.headers.get("RSC")&&a&&!s.startsWith("/api/")}),new n.NetworkFirst({cacheName:"pages-rsc",plugins:[new n.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400}),{handlerDidError:function(n){return _ref.apply(this,arguments)}}]}),"GET"),n.registerRoute((function(n){var e=n.url.pathname;return n.sameOrigin&&!e.startsWith("/api/")}),new n.NetworkFirst({cacheName:"pages",plugins:[new n.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400}),{handlerDidError:function(n){return _ref.apply(this,arguments)}}]}),"GET"),n.registerRoute((function(n){return!n.sameOrigin}),new n.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new n.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600}),{handlerDidError:function(n){return _ref.apply(this,arguments)}}]}),"GET")}));
