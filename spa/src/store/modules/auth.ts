import { Module } from 'vuex'
import { RootState } from '../index'
import { User, Role, Area, Trail, Route, Tag, Image } from '../../models'

export interface AuthState {
  token: string;
  user?: User;
}

function getAuthFromStorage<AuthState> () {
  const auth = window.localStorage.getItem('auth')

  if (auth) {
    return JSON.parse(auth)
  }
  return {
    token: '',
    user: null
  }
}

function setAuthToStorage (auth: AuthState) {
  window.localStorage.setItem('auth', JSON.stringify(auth))
}

const namespaced = true

const auth: Module<AuthState, RootState> = {

  namespaced,

  state: getAuthFromStorage(),

  mutations: {
    login (state, auth) {
      state.token = auth.token
      state.user = auth.user
    },
    logout (state) {
      state.token = ''
      state.user = undefined
    }
  },
  actions: {
    login ({ commit, dispatch }, auth) {
      commit('login', auth)
      setAuthToStorage(auth)
      commit('snackbar/success', 'Successfully logged in!', { root: true })
      dispatch('form/close', null, { root: true })
    },
    authorize (store, { item, callback }) {
      const user = store.state.user

      if (user) {
        if (store.getters.authorize(item)) {
          callback()
        } else {
          store.commit('snackbar/throwError', 403, { root: true })
        }
      } else {
        store.dispatch('form/open', { component: 'login-form', params: null }, { root: true })
        store.commit('snackbar/throwError', 401, { root: true })
      }
    }
  },
  getters: {
    // check if a user is logged in
    check (state) {
      return !!state.token && !!state.user
    },
    // check if a user has specific permission
    authorize: (state, getters) => (item: Area|Trail|Image|Route|Tag) => {
      if (getters.isAdmin) return true

      if (!item.path) return false

      const pathPermissions = state.user?.path_permissions

      if (pathPermissions) {
        pathPermissions.find((p) => {
          return item.path.startsWith(p)
        })
      }

      // TODO: allow actions if user is owner of item

      return false
    },
    isAdmin (state) {
      return state.user && state.user.role_id === Role.ADMIN
    },

    username (state, getters) {
      if (getters.check) {
        return state.user?.name
      }

      return 'User not logged in!'
    }

  }
}

export default auth
