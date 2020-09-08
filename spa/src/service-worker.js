/* eslint-disable no-undef */
import { precacheAndRoute } from 'workbox-precaching/precacheAndRoute'
import { registerRoute } from 'workbox-routing'
import { CacheFirst } from 'workbox-strategies'

registerRoute(
  'http://localhost:8000/',
  new CacheFirst()
)
precacheAndRoute(self.__WB_MANIFEST)
