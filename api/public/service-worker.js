importScripts("/precache-manifest.57a0d4f7382bd7d89d8582af1e11547e.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");


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

