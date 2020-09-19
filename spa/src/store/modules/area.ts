import { Module } from 'vuex'
import { RootState } from '..'

import api from '../api'
import { Area, Tag, Route } from '../../models'
import { normalizeRelations } from '../utils/normalization'
import entityMutations from './utils/entityMutations'
import typeService from '@/services/type.service'

export interface AreaState {
  byIds: Record<string, Area>;
  allIds: Array<number>;
  loading: boolean;
  rootIds: Array<number>;
}

const namespaced = true

const normalizationAtributes = ['ancestors', 'areas', 'images', 'trails', 'moderators']

const area: Module<AreaState, RootState> = {
  namespaced,
  state: {
    byIds: {},
    allIds: [],
    loading: true,
    rootIds: []
  },
  mutations: {
    ...entityMutations,
    appendArea (state: AreaState, { parentId, areaId }) {
      if (parentId) {
        state.byIds[parentId].areas.push(areaId)
      } else {
        state.rootIds.push(areaId)
      }
    },
    appendImage (state: AreaState, payload) {
      state.byIds[payload.id].images.push(payload.imageId)
    },
    appendTrail (state: AreaState, payload) {
      state.byIds[payload.id].trails.push(payload.trailId)
    },
    removeArea (state: AreaState, { parentId, areaId }) {
      const item = state.byIds[parentId]

      const index = item && item.areas?.findIndex(id => id === areaId)
      index && item.areas.splice(index, 1)
    },

    addModerator (state: AreaState, { area, moderator }) {
      const item = state.byIds[area.id]

      item.moderators.push(moderator.id)
    },

    removeModerator (state: AreaState, { area, moderator }) {
      const item = state.byIds[area.id]

      const index = item.moderators.findIndex(id => id === moderator.id)
      item.moderators.splice(index, 1)
    }
  },
  actions: {

    storeRelation ({ commit }, { items, fun, root = false }) {
      for (const id in items) {
        commit(fun, items[id], { root })
      }
    },

    normalizeData ({ commit, dispatch }, area: Area) {
      area.routes && dispatch('storeRelation', { items: area.routes, fun: 'route/add', root: true })

      // with the area i only send routes that are directly under it, so there are no more rutes of that area
      if (area.routes.length !== 0) {
        commit('route/setHasMore', false, { root: true })
      }

      commit('add', normalizeRelations(area, normalizationAtributes))

      area.areas && dispatch('storeRelation', { items: area.areas, fun: 'add' })
      area.ancestors && dispatch('storeRelation', { items: area.ancestors, fun: 'add' })
      area.trails && dispatch('storeRelation', { items: area.trails, fun: 'trail/add', root: true })
      area.images && dispatch('storeRelation', { items: area.images, fun: 'image/add', root: true })
      area.moderators && dispatch('storeRelation', { items: area.moderators, fun: 'user/add', root: true })
    },

    fetch ({ state, commit, dispatch }, id) {
      // if the area already has all the data loaded then just show the area
      // and in the background refresh area data
      // if not show the loading display
      if (state.byIds[id]?.fullyLoaded) {
        commit('loading', false) // just in case, also needed when opening sector
        setTimeout(() => { commit('drawers/setLeft', true, { root: true }) }, 1000)
      } else {
        dispatch('snackbar/show', 'Loading area...', { root: true })
        commit('loading', true)
      }

      api
        .get<Area>('area/' + id)
        .then(({ data }) => {
          data.fullyLoaded = true

          dispatch('normalizeData', data)

          state.loading && dispatch('snackbar/success', 'Done!', { root: true })

          commit('drawers/setLeft', true, { root: true })

          if (typeService.mustLoadParent(data)) {
            dispatch('fetch', data.parent_id)
          } else {
            commit('loading', false)
          }
        }).catch(() => {
          commit('loading', false)
        })
    },
    fetchRootAreas ({ state, commit, dispatch }) {
      if (state.rootIds.length !== 0) {
        return
      }

      commit('loading', true)

      api
        .get('area')
        .then(({ data }) => {
          data.areas.forEach(area => {
            commit('add', area)
            commit('appendArea', { areaId: area.id, parentId: null })
          })

          data.routes.forEach(route => {
            commit('route/add', route, { root: true })
          })

          dispatch('snackbar/success', 'Done!', { root: true })

          commit('drawers/setLeft', true, { root: true })
        }).finally(() => {
          commit('loading', false)
        })
    }
  },
  getters: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get (state: AreaState, _: any, rootState: RootState, rootGetters: any) {
      const areaId = rootState.url?.params.areaId || rootGetters['route/get']?.area_id
      return areaId && state.byIds[areaId]
    },
    find: (state: AreaState) => (id: number) => {
      return state.byIds[id]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tags (state: AreaState, getters: any, rootState: RootState, rootGetters: any) {
      let area: Area = getters.get

      const tags: Array<Tag> = []

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

      // if an area has to load a parent then show parent tags on the map
      if (typeService.mustLoadParent(area)) {
        area = state.byIds[area.parent_id]
      }

      if (area.map_tag) {
        tags.push(area.map_tag)
      } else {
        area.ancestors && area.ancestors.slice()
          .reverse()
          .some((ancestorId: number) => {
            if (state.byIds[ancestorId]?.map_tag) {
              tags.push(state.byIds[ancestorId].map_tag)
              return true
            }
            return false
          })
      }

      area.areas && area.areas.forEach((id: number) => {
        if (state.byIds[id]?.map_tag) {
          tags.push(state.byIds[id].map_tag)
        }
      })

      rootGetters['route/getFiltered'].forEach((route: Route) => {
        route.map_tag && tags.push(route.map_tag)
      })

      area.trails && area.trails.forEach((id: number) => {
        if (rootState.trail?.byIds[id]?.map_tag) {
          tags.push(rootState.trail.byIds[id].map_tag)
        }
      })

      area.images && area.images.forEach((id: number) => {
        if (rootState.image?.byIds[id]?.map_tag) {
          tags.push(rootState.image.byIds[id].map_tag)
        }
      })

      return tags
    }
  }
}

export default area
