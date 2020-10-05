import { Module } from 'vuex'
import { RootState } from '../index'

export interface HighlightState {
  key: string|null;
}

const namespaced = true

const highlight: Module<HighlightState, RootState> = {

  namespaced,

  state: {
    key: null
  },

  mutations: {
    set (state, payload = null) {
      state.key = payload
    }
  }
}

export default highlight
