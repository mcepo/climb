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
}

const namespaced = true

const route: Module<RouteState, RootState> = {
  namespaced,
  state: {
    byIds: {},
    allIds: [],
    loading: false,
    filters: {}
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
      const fullyLoaded = state.byIds[id]?.fullyLoaded

      if (fullyLoaded && Number.isInteger(fullyLoaded)) {
        const miliSecSincLastRefresh = Date.now() - fullyLoaded

        // don't refresh if less then an hour has passed
        if (miliSecSincLastRefresh < 3600000) {
          setTimeout(() => {
            commit('drawers/setLeft', true, { root: true })
          }, 1000)
          return
        }
      } else {
        commit('loading', true)
      }

      api
        .get<Route>('route/' + id)
        .then(({ data }) => {
          data.fullyLoaded = Date.now()
          dispatch('normalizeData', data)

          dispatch('area/fetch', data.area_id, { root: true })

          commit('loading', false)
        })
        .catch(() => {
          commit('loading', false)
        })
    },
    loadFiltered ({ state, commit, getters, dispatch, rootGetters }, filters = null) {
      if (state.loading) {
        return
      }

      filters && commit('setFilters', filters)

      const area = rootGetters['area/get']

      if (area && area.routes.length) return

      commit('loading', true)

      const params = getters.filters

      params.offset = getters.getFiltered.length

      dispatch('snackbar/show', 'Loading routes ...', { root: true })

      api
        .get<Route[]>('route', {
          params
        })
        .then(({ data }) => {
          data.forEach((route) => {
            commit('add', route)
          })

          dispatch('snackbar/success', 'Done!', { root: true })

          commit('loading', false)
        })
        .catch(() => {
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
    getFiltered (state: RouteState, getters: any, _: RootState, rootGetters: any): Route[] {
      const area = rootGetters['area/get']

      const filters = getters.filters

      const filtered: Route[] = []

      const routeIds: Array<string> = (area && area.routes.length !== 0) ? area.routes : state.allIds

      routeIds.forEach(id => {
        const route = state.byIds[id]
        route && routePassesFilter(route, filters) && filtered.push(route)
      })

      return filtered
    },
    find: (state: RouteState) => (id: number) => {
      return state.byIds[id]
    }
  }
}

export default route
