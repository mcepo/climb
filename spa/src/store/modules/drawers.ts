import { Module } from 'vuex'
import { RootState } from '../index'

export interface DrawersState {
  left: boolean;
  right: boolean;
}

const namespaced = true

const drawers: Module<DrawersState, RootState> = {

  namespaced,

  state: {
    left: false,
    right: false
  } as DrawersState,

  mutations: {
    setLeft (state: DrawersState, status: boolean) {
      state.left = status
    },
    setRight (state: DrawersState, status: boolean) {
      state.right = status
    }
  }

}

export default drawers
