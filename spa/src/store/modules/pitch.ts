import { Pitch } from '../../models'
import { Module } from 'vuex'
import { RootState } from '..'
import entityMutations from './utils/entityMutations'

interface PitchState {
  byIds: Record<number, Pitch>;
  allIds: Array<number>;
}

const namespaced = true

const pitch: Module<PitchState, RootState> = {
  namespaced,
  state: {
    byIds: {},
    allIds: []
  },
  mutations: {
    ...entityMutations
  },
  getters: {
    find: (state: PitchState) => (id: number) => {
      return state.byIds[id]
    }
  }
}

export default pitch
