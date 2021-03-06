import { Activity } from '../../models'
import { Module } from 'vuex'
import { RootState } from '..'
import api from '../api'
import Vue from 'vue'

import entityMutations from './utils/entityMutations'
import { normalizeRelations } from '../utils/normalization'

export interface ActivityState {
  byIds: Record<number, Activity>;
  allIds: Array<number>;
  loading: boolean;
}

const BASE_URL = 'admin/'

const namespaced = true
const activity: Module<ActivityState, RootState> = {
  namespaced,
  state: {
    byIds: {},
    allIds: [],
    loading: false
  },
  mutations: {
    ...entityMutations,
    resolveActivity (state, activityId) {
      const activity = {
        ...state.byIds[activityId],
        // eslint-disable-next-line @typescript-eslint/camelcase
        status: true
      }

      Vue.set(state.byIds, activityId, activity)
    }
  },
  actions: {
    normalizeData ({ commit }, activity: Activity) {
      commit('add', normalizeRelations(activity, ['subject', 'causer']))
      commit('add', activity)
      if (activity.causer) {
        commit('user/add', activity.causer, { root: true })
      }
    },
    fetchNotApproved ({ commit, dispatch }) {
      commit('loading', true)

      dispatch('snackbar/show', 'Loading activities!', { root: true })

      api
        .get(BASE_URL + 'getNotApprovedActivities')
        .then(({ data }) => {
          data.forEach((activity) => {
            dispatch('normalizeData', activity)
          })

          dispatch('snackbar/success', 'Done!', { root: true })
        })
        .finally(() => {
          commit('loading', false)
        })
    },
    approveActivity ({ commit, dispatch }, activityId) {
      dispatch('snackbar/show', 'Approving activity ...', { root: true })

      api
        .get(BASE_URL + 'approveActivity/' + activityId)
        .then(() => {
          commit('resolveActivity', activityId)

          dispatch('snackbar/success', 'Activity approved', { root: true })
        })
        .finally(() => {
          commit('loading', false)
        })
    },
    revertActivity ({ commit, dispatch }, activityId) {
      dispatch('snackbar/show', 'Reverting activity ...', { root: true })

      api
        .get(BASE_URL + 'revertActivity/' + activityId)
        .then(() => {
          commit('resolveActivity', activityId)

          dispatch('snackbar/success', 'Activity reverted', { root: true })
        })
        .finally(() => {
          commit('loading', false)
        })
    }
  },
  getters: {
    find: (state: ActivityState) => (id: number) => {
      return state.byIds[id]
    },
    notApproved (state: ActivityState) {
      const notApprovedActivities: Activity[] = []

      state.allIds.forEach((id) => {
        if (state.byIds[id].status === null) {
          notApprovedActivities.push(state.byIds[id])
        }
      })

      return notApprovedActivities
    }
  }
}

export default activity
