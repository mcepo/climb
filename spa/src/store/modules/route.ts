import { Route } from '../../models'
import { Module } from 'vuex'
import { RootState } from '..'

import api from '../api'
import { normalizeRelations } from '../utils/normalization'
import { RouteFilters } from '@/models/routeFilters'
import { routePassesFilter } from '../utils/routeFilters'
import entityMutations from './utils/entityMutations'

export interface RouteState {
  byIds: Record<number, Route>;
  allIds: Array<number>;
  loading: boolean;
  filters: RouteFilters;
  // if there are more routes on server side to be loaded
  hasMore: boolean;
}

const namespaced = true

const route: Module<RouteState, RootState> = {
  namespaced,
  state: {
    byIds: {},
    allIds: [],
    loading: false,
    filters: {},
    hasMore: true
  },
  mutations: {
    ...entityMutations,
    setFilters (state: RouteState, filters) {
      state.filters = {
        ...filters,
        query: state.filters.query || null
      }
    },
    setQueryString (state: RouteState, query) {
      state.filters = {
        ...state.filters,
        query
      }
    },
    setHasMore (state: RouteState, has) {
      state.hasMore = has
    },
    appendPitch (state: RouteState, payload) {
      state.byIds[payload.routeId].pitches.push(payload.pitchId)
    }
  },
  actions: {
    storeRelation ({ commit }, { items, commitFun, root = false }) {
      for (const id in items) {
        commit(commitFun, items[id], { root })
      }
    },

    normalizeData ({ commit, dispatch }, route: Route) {
      commit('add', normalizeRelations(route, ['ancestors', 'pitches', 'images']))

      route.pitches &&
        dispatch('storeRelation', {
          items: route.pitches,
          commitFun: 'pitch/add',
          root: true
        })
      route.ancestors &&
        dispatch('storeRelation', {
          items: route.ancestors,
          commitFun: 'area/add',
          root: true
        })

      route.images &&
        dispatch('storeRelation', {
          items: route.images,
          commitFun: 'image/add',
          root: true
        })
    },
    fetch ({ state, commit, dispatch }, id) {
      if (state.byIds[id]?.fullyLoaded) {
        setTimeout(() => {
          commit('drawers/setLeft', true, { root: true })
        }, 1000)
        return
      }

      commit('snackbar/show', 'Loading route...', { root: true })

      commit('loading', true)

      api
        .get<Route>('route/' + id)
        .then(({ data }) => {
          data.fullyLoaded = true
          dispatch('normalizeData', data)

          commit('snackbar/success', 'Done!', { root: true })

          dispatch('area/fetch', data.area_id, { root: true })
        })
        .finally(() => {
          commit('loading', false)
        })
    },
    loadFiltered ({ commit, getters }, filters = null) {
      commit('loading', true)

      filters && commit('setFilters', filters)

      const params = getters.filters

      params.offset = getters.getFiltered.length

      commit('snackbar/show', 'Loading routes ...', { root: true })

      api
        .get<Route[]>('route', {
          params
        })
        .then(({ data }) => {
          commit('setHasMore', data.length === 10)

          data.forEach((route) => {
            commit('add', route)
          })

          commit('snackbar/success', 'Done!', { root: true })
        })
        .finally(() => {
          commit('loading', false)
        })
    }
  },
  getters: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get (state: RouteState, _: any, rootState: RootState): Route {
      return (
        rootState.url?.params.routeId &&
        state.byIds[rootState.url.params.routeId]
      )
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filters (state: RouteState, getters: any, _: RootState, rootGetters: any
    ): RouteFilters {
      const area = rootGetters['area/get']

      const filters = { ...state.filters }

      if (area && area.ancestors) {
        // deep copy array
        const ancestors = area.ancestors.slice()

        ancestors.push(area.id)

        filters.path = ancestors.join('.')
      }

      return filters
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getFiltered (state: RouteState, getters: any): Route[] {
      const filters = getters.filters

      const filtered: Route[] = []

      for (const id in state.byIds) {
        const route = state.byIds[id]

        // filtering by area
        if (routePassesFilter(route, filters)) {
          filtered.push(route)
        }
      }

      return filtered
    },
    find: (state: RouteState) => (id: number) => {
      return state.byIds[id]
    }
  }
}

export default route
