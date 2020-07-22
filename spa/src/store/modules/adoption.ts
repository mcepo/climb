import { Module } from 'vuex'
import { RootState } from '../index'
import api from '../api'

// this module is used to change parent of area or route
// if you want to move route or area to another area

export interface AdoptionState {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: Record<string, any> | null;
}

const namespaced = true

const parent: Module<AdoptionState, RootState> = {
  namespaced,

  state: {
    type: '',
    item: null
  },

  mutations: {
    set (state, { type, item }) {
      state.type = type
      state.item = item
    },
    remove (state) {
      state.type = ''
      state.item = null
    }
  },
  actions: {
    setChild ({ commit, rootGetters, dispatch }, payload) {
      // authorization - parent changing, only admin can change parent
      if (rootGetters['auth/check']) {
        if (!rootGetters['auth/isAdmin']) {
          commit('snackbar/throwError', 403, { root: true })
        } else {
          commit('set', payload)
          commit(
            'snackbar/show',
            'Moving ' +
              payload.type +
              ' ... now go to the area you want to move it to',
            { root: true }
          )
        }
      } else {
        commit('snackbar/throwError', 401, { root: true })
        dispatch('form/open', { component: 'login-form', params: null }, { root: true })
      }
    },
    setParent ({ state, commit }, parentId) {
      state.item &&
        api
          .put(state.type + '/' + state.item.id + '/move', { id: parentId })
          .then(({ data }) => {
            /// with the quotes making sure its a text
            const path = data + ''
            const ancestors = path.split('.').map((a) => parseInt(a))

            if (state.type === 'route') {
              // change the route ancestors, path and area_id in store
              state.item &&
                commit(
                  'route/add',
                  { ...state.item, ancestors, path },
                  { root: true }
                )
            } else {
              // removing area from the former parent
              state.item &&
                commit(
                  'area/removeArea',
                  { parentId: state.item.parent_id, areaId: state.item.id },
                  { root: true }
                )
              // adding area to the new parent areas array
              state.item &&
                commit(
                  'area/appendArea',
                  { parentId, areaId: state.item.id },
                  { root: true }
                )
              // changing area ancestors so the display will be nice
              state.item &&
                commit(
                  'area/add',
                  { ...state.item, path, ancestors },
                  { root: true }
                )
              // TODO: change paths in all the nessesry routes
            }

            commit('remove')

            commit('snackbar/success', 'Item was moved to the new area', {
              root: true
            })
          })
    }
  }
}

export default parent
