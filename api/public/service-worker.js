importScripts("/assets/precache-manifest.aa3f29a5cc5f77ff1f7b871189c7ce83.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

// this is an ugly solution but i needed it so the service worker will
// detect the change in the root url '/', but also serve it once offline
// because i am serving index.html throu laravel, and the actual file is
// in /resources/views/
self.__precacheManifest = self.__precacheManifest.map(cache => {
  if (cache.url === '/assets/index.html') {
    cache.url = '/'
  }
  return cache
})

workbox.precaching.precacheAndRoute(self.__precacheManifest)

// background sync

const bgSyncPlugin = new workbox.backgroundSync.Plugin('backgroundSyncQueue', {
  maxRetentionTime: 24 * 60 // Retry for max of 24 Hours (specified in minutes)
})

// cache all request except image requests
// because i can't upload image while offline anyways
const matchCb = /\/api\/(((?!image).)*$)/

const handleCb = new workbox.strategies.NetworkOnly({
  plugins: [bgSyncPlugin]
})

workbox.routing.registerRoute(matchCb, handleCb, 'POST')

workbox.routing.registerRoute(matchCb, handleCb, 'PUT')

workbox.routing.registerRoute(matchCb, handleCb, 'DELETE')

