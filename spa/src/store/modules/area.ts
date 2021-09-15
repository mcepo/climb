import { Module } from 'vuex'
import { RootState } from '..'

import api from '../api'
import { Area, Tag, Route } from '../../models'
import { normalizeRelations } from '../utils/normalization'
import entityMutations from './utils/entityMutations'
import typeService, { AreaDatabaseId } from '@/services/type.service'
import { areaPassesFilter } from '../utils/areaFilters'

import drawers from '../../services/drawer.service'

export interface AreaState {
  byIds: Record<string, Area>;
  allIds: Array<number>;
  loading: boolean;
  rootIds: Array<number>;
  recentlyViewedIds: Array<number>;
}

const namespaced = true

const normalizationAtributes = [
  'ancestors',
  'areas',
  'images',
  'trails',
  'moderators',
  'routes'
]

const area: Module<AreaState, RootState> = {
  namespaced,
  state: {
    byIds: {},
    allIds: [],
    loading: true,
    rootIds: [],
    recentlyViewedIds: []
  },
  mutations: {
    ...entityMutations,
    appendArea (state: AreaState, { parentId, areaId }) {
      if (parentId) {
        const parent = state.byIds[parentId]
        if (parent && parent.areas && !parent.areas.includes(areaId)) {
          state.byIds[parentId].areas.push(areaId)
        }
      }
    },
    appendRootIds (state: AreaState, { areaId }) {
      const area = state.byIds[areaId]

      if (!area || area.parent_id !== null) return

      if (!state.rootIds.includes(areaId)) { state.rootIds.push(areaId) }
    },
    appendImage (state: AreaState, payload) {
      state.byIds[payload.id].images.push(payload.imageId)
    },
    appendTrail (state: AreaState, payload) {
      const area = state.byIds[payload.id]

      if (!Array.isArray(area.trails)) {
        area.trails = []
      }

      state.byIds[payload.id].trails.push(payload.trailId)
    },
    updateRouteIds (state: AreaState, payload) {
      state.byIds[payload.id].routes = payload.routes
    },
    removeArea (state: AreaState, { parentId, areaId }) {
      const item = state.byIds[parentId]

      const index = item && item.areas?.findIndex((id) => id === areaId)
      index && item.areas.splice(index, 1)
    },

    addModerator (state: AreaState, { area, moderator }) {
      const item = state.byIds[area.id]

      item.moderators.push(moderator.id)
    },

    removeModerator (state: AreaState, { area, moderator }) {
      const item = state.byIds[area.id]

      const index = item.moderators.findIndex((id) => id === moderator.id)
      item.moderators.splice(index, 1)
    },
    addRecentlyViewed (state: AreaState, areaId) {
      const recentlyViewedIds = state.recentlyViewedIds.filter((id) => id !== areaId)

      recentlyViewedIds.unshift(areaId)

      if (recentlyViewedIds.length > 8) {
        recentlyViewedIds.pop()
      }

      state.recentlyViewedIds = recentlyViewedIds
    }
  },
  actions: {
    storeRelation ({ commit }, { items, fun, root = false }) {
      for (const id in items) {
        commit(fun, items[id], { root })
      }
    },

    updateRoutePositions ({ commit }, { id, routes }) {
      for (let i = 0; i < routes.length; i++) {
        commit('route/updatePosition', { id: routes[i], position: i + 1 }, { root: true })
      }

      commit('updateRouteIds', { id, routes })
    },

    normalizeData ({ commit, dispatch }, area: Area) {
      area.routes &&
        dispatch('storeRelation', {
          items: area.routes,
          fun: 'route/add',
          root: true
        })

      commit('add', normalizeRelations(area, normalizationAtributes))

      area.areas &&
        dispatch('storeRelation', { items: area.areas, fun: 'add' })
      area.ancestors &&
        dispatch('storeRelation', { items: area.ancestors, fun: 'add' })
      area.trails &&
        dispatch('storeRelation', {
          items: area.trails,
          fun: 'trail/add',
          root: true
        })
      area.images &&
        dispatch('storeRelation', {
          items: area.images,
          fun: 'image/add',
          root: true
        })
      area.moderators &&
        dispatch('storeRelation', {
          items: area.moderators,
          fun: 'user/add',
          root: true
        })
    },

    fetch ({ state, commit, dispatch }, id) {
      const fullyLoaded = state.byIds[id]?.fullyLoaded

      if (fullyLoaded && Number.isInteger(fullyLoaded)) {
        const miliSecSincLastRefresh = Date.now() - fullyLoaded

        // don't refresh if less then an hour has passed
        if (miliSecSincLastRefresh < 3600000) {
          commit('loading', false) // just in case, also needed when opening sector
          setTimeout(() => {
            drawers.left = true
          }, 1000)
          return
        }
      } else {
        commit('loading', true)
      }

      api
        .get<Area>('area/' + id)
        .then(({ data }) => {
          data.fullyLoaded = Date.now()

          dispatch('normalizeData', data)

          // will not add countries to recently viewed because its in the same component
          data.type_id !== AreaDatabaseId.Country && commit('addRecentlyViewed', data.id)

          drawers.left = true

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const parent: any = data.parent_id && data.ancestors.pop()

          if (parent && typeService.mustLoadAsParent(parent)) {
            dispatch('fetch', data.parent_id)
          } else {
            commit('loading', false)
          }
        })
        .catch(() => {
          commit('loading', false)
        })
    },
    fetchMany ({ commit }, query: string|null) {
      if (query == null) {
        commit('loading', true)
      }

      const params = query ? { query } : {}

      api
        .get('area', {
          params
        })
        .then(({ data }) => {
          data.areas.forEach((area) => {
            commit('add', area)
            if (area.parent_id === null) {
              commit('appendRootIds', { areaId: area.id })
            }
          })

          drawers.left = true
        })
        .finally(() => {
          commit('loading', false)
        })
    }
  },
  getters: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get (state: AreaState, _: any, rootState: RootState, rootGetters: any) {
      const areaId =
        rootState.url?.params.areaId || rootGetters['route/get']?.area_id
      return areaId && state.byIds[areaId]
    },
    find: (state: AreaState) => (id: number) => {
      return state.byIds[id]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getFiltered: (state: AreaState, _: any, __: RootState, rootGetters: any) => (id: number|null, query: string|null) => {
      let areaIds: number[]|string[]

      if (id) {
        areaIds = state.byIds[id].areas
      } else {
        if (query) {
          areaIds = Object.keys(state.byIds)
        } else {
          return []
        }
      }

      const areas: Array<Area> = []

      const routeFilters = rootGetters['route/filters']

      areaIds.forEach((id) => {
        const area = state.byIds[id]

        areaPassesFilter(area, routeFilters, query) && areas.push(area)
      })

      return areas
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tags (
      state: AreaState,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      getters: any,
      _: RootState,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rootGetters: any
    ) {
      let area: Area = getters.get

      let tags: Array<Tag> = []

      // if area isn't set then get root areas
      // that is areas where parent is null
      if (!area) {
        state.rootIds.forEach((id: number) => {
          if (state.byIds[id]?.map_tag) {
            tags.push(state.byIds[id].map_tag)
          }
        })

        return tags
      }

      tags = tags.concat(getters.tagsFor(area))

      const parent = state.byIds[area.parent_id]

      // if an area has to load a parent then show parent tags on the map
      if (parent && typeService.mustLoadAsParent(parent)) {
        tags = tags.concat(getters.tagsFor(parent))
        area = parent
      }

      if (area.map_tag) {
        tags.push(area.map_tag)
      } else {
        area.ancestors &&
          area.ancestors
            .slice()
            .reverse()
            .some((ancestorId: number) => {
              if (state.byIds[ancestorId]?.map_tag) {
                tags.push(state.byIds[ancestorId].map_tag)
                return true
              }
              return false
            })
      }

      rootGetters['route/getFiltered'].forEach((route: Route) => {
        route.map_tag && tags.push(route.map_tag)
      })

      return tags
    },
    tagsFor: (
      _: AreaState,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      getters: any,
      rootState: RootState
    ) => (currentArea: Area) => {
      const tags: Array<Tag> = []

      getters.getFiltered(currentArea.id).forEach((area: Area) => {
        area.map_tag && tags.push(area.map_tag)
      })

      currentArea.trails &&
      currentArea.trails.forEach((id: number) => {
        if (rootState.trail?.byIds[id]?.map_tag) {
          tags.push(rootState.trail.byIds[id].map_tag)
        }
      })

      currentArea.images &&
        currentArea.images.forEach((id: number) => {
          if (rootState.image?.byIds[id]?.map_tag) {
            tags.push(rootState.image.byIds[id].map_tag)
          }
        })

      return tags
    }
  }
}

export default area
