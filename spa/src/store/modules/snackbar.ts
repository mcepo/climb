import { Module } from 'vuex'
import { RootState } from '..'

interface SnackbarMessage {
  message: string;
  status: 'show' | 'error' | 'success' | 'warning';
}

interface SnackbarState {
  queue: Array<SnackbarMessage>;
}

interface ErrorMessage {
  message?: string;
  code?: number;
}

const namespaced = true

const snackbar: Module<SnackbarState, RootState> = {
  namespaced,
  state: {
    queue: []
  },
  getters: {
    get (state: SnackbarState) {
      return state.queue.length !== 0 ? state.queue[0] : null
    }
  },
  mutations: {

    push (state, snackbarMessage: SnackbarMessage) {
      const existingMessage = state.queue.find((notification) => {
        return notification.message === snackbarMessage.message
      })
      if (!existingMessage) { state.queue.push(snackbarMessage) }
    },

    pop (state) {
      state.queue.shift()
    }
  },
  actions: {
    show ({ commit }, message: string) {
      commit('push', { message, status: 'show' })
    },
    error ({ commit }, message: string) {
      commit('push', { message, status: 'error' })
    },
    success ({ commit }, message: string) {
      commit('push', { message, status: 'success' })
    },
    warning ({ commit }, message: string) {
      commit('push', { message, status: 'warning' })
    },

    throwError ({ commit }, status: ErrorMessage) {
      const snackbarMessage: SnackbarMessage = {
        status: 'error',
        message: ''
      }

      switch (status.code) {
        case 400:
          snackbarMessage.message = 'Failed login attempt.'
          break
        case 401:
          snackbarMessage.message =
            'You have to have an active account<br>and be logged in to perform this action.'
          break
        case 403:
          snackbarMessage.message = "You don't have permissions to perform this action."
          break
        case 404:
          snackbarMessage.message = "Requested resource wasn't found."
          break
        case 500:
          snackbarMessage.message = 'Internal server error! Will look into it :).'
          break
        case 409:
          snackbarMessage.message = 'Seems this email is already taken.'
          break
        case 422:
          snackbarMessage.message = 'Please verify your email before using the application.'
          break
        default:
          snackbarMessage.message = status.message || 'Well this is awkward :/'
      }

      commit('push', snackbarMessage)
    }
  }
}

export default snackbar
