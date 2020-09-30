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
    open ({ commit }, payload) {
      commit('drawers/setLeft', false, { root: true })
      commit('drawers/setRight', true, { root: true })
      commit('open', payload)
    },
    authorizeAndOpen ({ dispatch }, { form, item }) {
      // authorize based on the item the user wants to edit
      dispatch('auth/authorize', item, { root: true }).then(
        () => {
          dispatch('open', form)
        },
        () => {
          /* so the error won't get dumped in the console */
        }
      )
    },
    onlyAdminOpen ({ dispatch }, payload) {
      // if authorizing admin then the item isn't needed
      dispatch('auth/authorizeOnlyAdmin', null, { root: true }).then(
        () => {
          dispatch('open', payload)
        },
        () => {
          /* so the error won't get dumped in the console */
        }
      )
    },
    close ({ commit }) {
      commit('drawers/setRight', false, { root: true })
      commit('close')
      commit('drawers/setLeft', true, { root: true })
    }
  }
}

export default form
