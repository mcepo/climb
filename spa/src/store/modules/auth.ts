import { Module } from 'vuex'
import { RootState } from '../index'
import { User, Role, Area, Trail, Route, Tag, Image } from '../../models'

export interface AuthState {
  token: string;
  user?: User;
}

const storageKey = 'auth'

function getAuthFromStorage<AuthState> () {
  const auth = window.localStorage.getItem(storageKey)

  if (auth) {
    return JSON.parse(auth)
  }
  return {
    token: '',
    user: null
  }
}

function setAuthToStorage (auth: AuthState) {
  window.localStorage.setItem(storageKey, JSON.stringify(auth))
}

function clearAuthFromStorage () {
  window.localStorage.removeItem(storageKey)
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
    login ({ commit, dispatch, state }, token: string) {
      const auth = {
        token,
        user: JSON.parse(atob(token.split('.')[1]))
      }

      commit('login', auth)
      setAuthToStorage(auth)
      dispatch('snackbar/success', 'Successfully logged in<br> Welcome, ' + state.user?.name, { root: true })
      dispatch('form/close', null, { root: true })
    },
    logout ({ commit }) {
      clearAuthFromStorage()
      commit('logout')
    },
    authorize ({ getters, dispatch }, item) {
      // if there is no item to authorize agains
      // just set it to true
      // that way i limit the add forms to only loggedin users
      const isAuthorized = item ? getters.authorize(item) : true

      return dispatch('authorizationHandler', { isAuthorized })
    },
    authorizeOnlyAdmin ({ getters, dispatch }) {
      return dispatch('authorizationHandler', {
        isAuthorized: getters.isAdmin
      })
    },
    authorizationHandler ({ state, dispatch }, { isAuthorized }) {
      return new Promise((resolve, reject) => {
        if (!state.user) {
          reject(Error('401'))
          return
        }

        if (!isAuthorized) {
          reject(Error('403'))
          return
        }

        if (state.user && isAuthorized) {
          resolve()
        }
      }).catch((error: Error) => {
        dispatch('unauthorized', error)
        throw error
      })
    },
    unauthorized (store, error) {
      const code = parseInt(error.message)

      store.dispatch('snackbar/throwError', { code }, { root: true })

      if (code === 401) {
        store.dispatch(
          'form/open',
          { component: 'login-form', params: null },
          { root: true }
        )
      }
    }
  },
  getters: {
    // check if a user is logged in
    check (state) {
      return !!state.token && !!state.user
    },
    // check if a user has specific permission
    authorize: (state, getters) => (
      item: Area | Trail | Image | Route | Tag
    ) => {
      if (getters.isAdmin) return true

      if (!item.path) return false

      const pathPermissions = state.user?.path_permissions

      if (pathPermissions) {
        pathPermissions.find((p) => {
          return item.path.startsWith(p)
        })
      }

      return state.user && state.user.id === item.owner_id
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
