import { User } from '../../models'
import { Module } from 'vuex'
import { RootState } from '..'
import api from '../api'

import entityMutations from './utils/entityMutations'

export interface UserState {
  byIds: Record<number, User>;
  allIds: Array<number>;
  loading: boolean;
}

const namespaced = true

const user: Module<UserState, RootState> = {
  namespaced,
  state: {
    byIds: {},
    allIds: [],
    loading: false
  },
  mutations: {
    ...entityMutations
  },
  actions: {

    normalizeData ({ commit }, user: User) {
      commit('add', user)
    },
    fetchAll ({ commit }) {
      commit('loading', true)

      commit('snackbar/show', 'Loading users!', { root: true })

      api
        .get('user')
        .then(({ data }) => {
          data.forEach(user => {
            commit('add', user)
          })

          commit('snackbar/success', 'Done!', { root: true })
        }).finally(() => {
          commit('loading', false)
        })
    }
  },
  getters: {
    find: (state: UserState) => (id: number) => {
      return state.byIds[id]
    }
  }
}

export default user
