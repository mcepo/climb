import { Store } from 'vuex'
import { RootState } from './index'
import { Route } from 'vue-router'

function registerRouteWatch (store: Store<RootState>) {
  store.watch((state: RootState) => {
    return state.url
  },
  (url?: Route, oldUrl?: Route) => {
    if (url?.path === oldUrl?.path) {
      return
    }

    if (url?.params.areaId !== undefined && oldUrl?.params.areaId !== url?.params.areaId) {
      store.dispatch('area/fetch', url?.params.areaId)
    }

    if (url?.params.imageId !== undefined && oldUrl?.params.imageId !== url?.params.imageId) {
      store.dispatch('image/fetch', url?.params.imageId)
    }

    if (url?.params.routeId !== undefined && oldUrl?.params.routeId !== url?.params.routeId) {
      store.dispatch('route/fetch', url?.params.routeId)
    }
  },
  { immediate: true })
}

function registerOnlineWatch (store: Store<RootState>) {
  window.addEventListener('online', () => {
    store.commit('updateOnlineStatus', true)
    store.dispatch('snackbar/success', 'Online!')
  })

  window.addEventListener('offline', () => {
    store.commit('updateOnlineStatus', false)
    store.dispatch('snackbar/error', 'Working offline!')
  })
}

export default function (store: Store<RootState>) {
  registerRouteWatch(store)
  registerOnlineWatch(store)
}
