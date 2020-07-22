import { Module } from 'vuex'
import { RootState } from '..'

interface FormState {
  component: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: Record<string, any> | null;
}

const namespaced = true

const form: Module<FormState, RootState> = {
  namespaced,
  state: {
    component: null,
    params: null
  },
  mutations: {
    open (state, payload) {
      state.component = payload.component
      state.params = payload.params
    },
    close (state) {
      state.component = null
      state.params = null
    }
  },
  actions: {
    open ({ commit, rootGetters }, payload) {
      commit('drawers/setLeft', false, { root: true })
      commit('drawers/setRight', true, { root: true })

      if (payload.component === 'login-form' || payload.component === 'register-form') {
        commit('open', payload)
        return
      }

      if (rootGetters['auth/check']) {
        commit('open', payload)
      } else {
        commit('open', { component: 'login-form', params: null })
        commit('snackbar/show', 'You have to have an active account<br>and be logged in to perform this action', { root: true })
      }
    },
    close ({ commit }) {
      commit('drawers/setRight', false, { root: true })
      commit('close')
      commit('drawers/setLeft', true, { root: true })
    }
  }
}

export default form
