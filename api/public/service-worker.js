importScripts("/assets/precache-manifest.7d689a461b825e2d31cb39dfb11ab5c1.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");


self.__precacheManifest.push({
  url: '/', revision: Date.now()
})

self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', () => {
  clients.claim()
})

workbox.precaching.precacheAndRoute(self.__precacheManifest)

// caching map tiles, only for default tiles

workbox.routing.registerRoute(
  new RegExp('https:\/\/cartodb-basemaps-.*png'),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'cartodb-basemaps'
  })
)

// caching apps images + thumbnails + data

workbox.routing.registerRoute(
  new RegExp('\/api\/'),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'app-data'
  })
)

// background sync

const bgSyncPlugin = new workbox.backgroundSync.Plugin('backgroundSyncQueue', {
  maxRetentionTime: 24 * 60 // Retry for max of 24 Hours (specified in minutes)
});

const matchCb = /\/api\/.*/

const handleCb =   new workbox.strategies.NetworkOnly({
  plugins: [bgSyncPlugin]
})

workbox.routing.registerRoute(
  matchCb,
  handleCb,
  'POST'
);

workbox.routing.registerRoute(
  matchCb,
  handleCb,
  'PUT'
);

workbox.routing.registerRoute(
  matchCb,
  handleCb,
  'DELETE'
);
