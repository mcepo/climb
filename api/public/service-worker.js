importScripts("/assets/precache-manifest.682aa78a1d7ccbb0a7391cb1702f4edd.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

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

// caching map tiles, only for default tiles

workbox.routing.registerRoute(
  new RegExp('https://cartodb-basemaps-.*png'),
  new workbox.strategies.CacheFirst({
    cacheName: 'cartodb-basemaps'
  })
)

// caching apps images + thumbnails

workbox.routing.registerRoute(
  new RegExp('/api/image/\\d+($|/thumbnail)'),
  new workbox.strategies.CacheFirst({
    cacheName: 'app-images'
  })
)

// caching area/route information

workbox.routing.registerRoute(
  new RegExp('/api/(area|route)/*'),
  new workbox.strategies.NetworkFirst({
    cacheName: 'app-information'
  })
)

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

