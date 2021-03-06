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
    setChild ({ commit, dispatch }, payload) {
      // authorization - parent changing, only admin can change parent
      dispatch('auth/authorizeOnlyAdmin', null, { root: true }).then(() => {
        commit('set', payload)
        dispatch(
          'snackbar/show',
          'Moving ' +
            payload.type +
            ' ... now go to the area you want to move it to',
          { root: true }
        )
      }).catch(() => { /* so the error won't get dumped in the console */ })
    },
    setParent ({ state, commit, dispatch }, parentId) {
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

            dispatch('snackbar/success', 'Item was moved to the new area', {
              root: true
            })
          })
    }
  }
}

export default parent
