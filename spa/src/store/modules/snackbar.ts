import { Module } from 'vuex'
import { RootState } from '..'

interface SnackbarState {
  text: string;
  status: 'show' | 'error' | 'success';
  show: boolean;
}

interface ErrorMessage {
  message?: string;
  code?: number;
}

const namespaced = true

const snackbar: Module<SnackbarState, RootState> = {
  namespaced,
  state: {
    text: '',
    status: 'show',
    show: false
  },
  mutations: {
    show (state: SnackbarState, text: string) {
      state.text = text
      state.status = 'show'
      state.show = true
    },
    error (state: SnackbarState, text: string) {
      state.text = text
      state.status = 'error'
      state.show = true
    },
    success (state: SnackbarState, text: string) {
      state.text = text
      state.status = 'success'
      state.show = true
    },
    close (state: SnackbarState) {
      state.show = false
    },

    throwError (state: SnackbarState, status: ErrorMessage) {
      state.status = 'error'
      state.show = true

      if (status.message && status.message !== '') {
        state.text = status.message
        return
      }

      switch (status.code) {
        case 400:
          state.text = 'Failed login attempt.'
          break
        case 401:
          state.text =
            'You have to have an active account<br>and be logged in to perform this action.'
          break
        case 403:
          state.text = "You don't have permissions to perform this action."
          break
        case 404:
          state.text = "Requested resource wasn't found."
          break
        case 500:
          state.text = 'Internal server error! Will look into it :).'
          break
        case 409:
          state.text = 'Seems this email is already taken.'
          break
        default:
          state.text = 'Well this is awkward :/'
      }
    }
  }
}

export default snackbar
