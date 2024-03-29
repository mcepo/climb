import Vue from 'vue'
import Vuex from 'vuex'

import modules from './modules'
import { AuthState } from './modules/auth'
import { Route } from 'vue-router'
import { ImageState } from './modules/image'
import { AreaState } from './modules/area'
import { RouteState } from './modules/route'
import { TrailState } from './modules/trail'
import { Tag } from '@/models'
import { UserState } from './modules/user'

import persistentStorage from './plugins/persistent.storage'
import { PitchState } from './modules/pitch'
import { ItemType } from '@/services/type.service'

import { set as setPageTitle } from '@/utils/pageTitle'

import drawers from '../services/drawer.service'

Vue.use(Vuex)

// don't request entites for 3 minutes from the server after they have been fully loaded
export const staleAfter = 180000

export function shouldLoadEntity (fullyLoaded: number, commit: Function) {
  if (fullyLoaded && Number.isInteger(fullyLoaded)) {
    const miliSecSincLastRefresh = Date.now() - fullyLoaded

    // don't refresh if less then a minute has passed
    if (miliSecSincLastRefresh < staleAfter) {
      commit('loading', false) // just in case, also needed when opening sector
      setTimeout(() => {
        drawers.setLeft(true)
      }, 1000)
      return false
    }
  }

  // if the entity is fully loaded we are just refreshing the entity
  // so don't show the loading progress
  !fullyLoaded && commit('loading', true)

  return true
}

export interface RootState {
  url?: Route; // route vuex sync module, will contain vue router route data
  auth?: AuthState;
  image?: ImageState;
  area?: AreaState;
  route?: RouteState;
  trail?: TrailState;
  pitch?: PitchState;
  drawing: boolean;
  user?: UserState;
  online: boolean;
  tracking: boolean;
}

const store = new Vuex.Store<RootState>({
  state: {
    drawing: false,
    online: navigator.onLine,
    tracking: false
  },
  plugins: [persistentStorage],
  mutations: {
    setDrawingMode (state: RootState, drawing: boolean) {
      state.drawing = drawing
    },
    updateOnlineStatus (state: RootState, online) {
      state.online = online
    },
    tracking (state: RootState, tracking: boolean) {
      state.tracking = tracking
    }
  },
  getters: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tags (state: RootState, getters: any): Tag[] {
      if (getters.loading) return []

      return state.url?.params.imageId ? getters['image/tags'] : getters['area/tags']
    },
    imageOpen (state: RootState) {
      return state.url?.params.imageId
    },
    // used by tag-control to determin if an item has a tag on the map/image
    // TODO: i think it would be useful to optimize this so that complexity
    // isn't O(n), it could be O(1), if i store the tags in an object
    // with key (type+id)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    hasTag: (_state: RootState, getters: any) => (key: string) => {
      return getters.tags.some((tag: Tag) => key === (tag.tagged_type + tag.tagged_id))
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    loading (state: RootState) {
      return state.area?.loading || state.route?.loading || state.image?.loading
    },
    breadcrumbs (state, getters) {
      const area = getters['area/get']

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ancestors: Array<any> = []

      if (area) {
        const ancestorIds = area.ancestors || null
        if (ancestorIds) {
          // making a deep copy before i push the current area id in
          // so i don't add area id in the store
          // TODO: maybe this should be done on the server side or in the store when the area is fetched

          const deepCopyAncestorIds = ancestorIds.slice()
          deepCopyAncestorIds.push(area.id)

          deepCopyAncestorIds.forEach((id) => {
            const ancestor = state.area?.byIds[id]

            ancestor && ancestors.push(ancestor)
          })
        }
      }

      const route = getters['route/get']

      if (route) {
        ancestors.push(route)
      }

      return ancestors
    },
    urlPath: (state) => (itemType: ItemType, id: string) => {
      const item = state[itemType]?.byIds[id]

      setPageTitle()

      if (!item) {
        return null
      }

      const ancestorsIds = item.path ? item.path.split('.').map((a) => parseInt(a)) : []

      const names: Array<string> = []

      ancestorsIds.forEach((id) => {
        const ancestor = state.area?.byIds[id]

        if (ancestor) {
          names.push(ancestor.name)
        }
      })

      if (item.name) {
        setPageTitle(item.name)

        names.push(item.name)
      }

      return names.join('-').toLowerCase().replace(/[^a-zđčćžš0-9\s\\-]/g, '').replace(/\s/g, '_')
    }
  },
  modules
})

window.addEventListener('online', () => {
  store.commit('updateOnlineStatus', true)
  store.dispatch('snackbar/success', 'Online!')
})

window.addEventListener('offline', () => {
  store.commit('updateOnlineStatus', false)
  store.dispatch('snackbar/error', 'Working offline!')
})

export default store
