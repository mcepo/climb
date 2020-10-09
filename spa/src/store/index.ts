import Vue from 'vue'
import Vuex from 'vuex'
import registerWatches from './watches'

import modules from './modules'
import { AuthState } from './modules/auth'
import { Route } from 'vue-router'
import { ImageState } from './modules/image'
import { AreaState } from './modules/area'
import { RouteState } from './modules/route'
import { TrailState } from './modules/trail'
import { Tag } from '@/models'
import { HighlightState } from './modules/highlight'
import { UserState } from './modules/user'

import localStorage from './plugins/localStorage'
import { PitchState } from './modules/pitch'

Vue.use(Vuex)

export interface RootState {
  url?: Route; // route vuex sync module, will contain vue router route data
  auth?: AuthState;
  image?: ImageState;
  area?: AreaState;
  route?: RouteState;
  trail?: TrailState;
  pitch?: PitchState;
  drawing: boolean;
  highlight?: HighlightState;
  user?: UserState;
  online: boolean;
}

const store = new Vuex.Store<RootState>({
  state: {
    drawing: false,
    online: navigator.onLine
  },
  plugins: [localStorage],
  mutations: {
    setDrawingMode (state: RootState, drawing: boolean) {
      state.drawing = drawing
    },
    updateOnlineStatus (state: RootState, online) {
      state.online = online
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
    }
  },
  modules
})

registerWatches(store)

export default store
