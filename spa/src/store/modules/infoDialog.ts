import { Module } from 'vuex'
import { RootState } from '..'

export interface InfoDialogState {
  title: string;
  description: string;
  show: boolean;
}

const namespaced = true

const infoDialog: Module<InfoDialogState, RootState> = {
  namespaced,
  state: {
    title: '',
    description: '',
    show: false
  },
  mutations: {
    show (state, { title, description }) {
      state.title = title
      state.description = description
      state.show = true
    },
    close (state) {
      state.title = ''
      state.description = ''
      state.show = false
    }
  }
}

export default infoDialog
