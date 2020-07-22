import { Trail } from '../../models'
import { Module } from 'vuex'
import { RootState } from '..'

import entityMutations from './utils/entityMutations'

export interface TrailState {
  byIds: Record<number, Trail>;
  allIds: Array<number>;
}

const namespaced = true

const trail: Module<TrailState, RootState> = {
  namespaced,
  state: {
    byIds: {},
    allIds: []
  },
  mutations: {
    ...entityMutations
  },
  actions: {

    normalizeData ({ commit }, trail: Trail) {
      commit('add', trail)
    }
  },
  getters: {
    find: (state: TrailState) => (id: number) => {
      return state.byIds[id]
    }
  }
}

export default trail
