import Vue from 'vue'
import { Module } from 'vuex'
import { RootState } from '..'

import api from '../api'
import { Tag, Route, Image } from '../../models'
import entityMutations from './utils/entityMutations'

export interface ImageState {
  byIds: Record<number, Image>;
  allIds: Array<number>;
  loading: boolean;
}

const namespaced = true

const image: Module<ImageState, RootState> = {
  namespaced,
  state: {
    byIds: {},
    allIds: [],
    loading: false
  },
  mutations: {
    ...entityMutations,
    storeImageTag (state: ImageState, tag: Tag) {
      // creating a deep copy of image and then adding the image tag
      // because thats the only way i can trigger redraw of the
      // layer on the image
      const item = { ...state.byIds[tag.image_id] }

      const index = item.tags.findIndex((t) => t.id === tag.id)
      index !== -1 && item.tags.splice(index, 1)

      item.tags.push(tag)

      Vue.set(state.byIds, tag.image_id, item)
    },
    removeImageTag (state: ImageState, { imageId, tag }) {
      const item = { ...state.byIds[imageId] }

      const index = item.tags.findIndex((t) => t.id === tag.id)
      index !== -1 && item.tags.splice(index, 1)

      Vue.set(state.byIds, imageId, item)
    }
  },
  actions: {

    normalizeData ({ commit }, image: Image) {
      // adding to store parent of this image
      commit(image.captured_type + '/add', image.captured, { root: true })

      delete image.captured

      // adding tagged entities to store
      image.tags && image.tags.forEach((tag: Tag) => {
        commit(tag.tagged_type + '/add', tag.tagged, { root: true })
        delete tag.tagged
      })

      // adding routes to store
      image.routes && image.routes.forEach((route: Route) => {
        commit('route/add', route, { root: true })
      })

      delete image.routes

      // adding image to store
      commit('add', image)
    },

    fetch ({ state, commit, dispatch }, id) {
      if (!state.byIds[id]?.fullyLoaded) {
        commit('snackbar/show', 'Loading image...', { root: true })

        commit('loading', true)
      }

      api
        .get<Image>('image/' + id + '/tags')
        .then(({ data }) => {
          data.fullyLoaded = true
          dispatch('normalizeData', data)

          state.loading && commit('snackbar/success', 'Done!', { root: true })

          commit('loading', false)
        })
        .catch(() => {
          commit('loading', false)
        })
    },
    fetchAll ({ commit }) {
      commit('loading', true)

      commit('snackbar/show', 'Loading images!', { root: true })

      api
        .get('admin/getImages')
        .then(({ data }) => {
          data.forEach(image => {
            commit('add', image)
          })

          commit('snackbar/success', 'Done!', { root: true })
        }).finally(() => {
          commit('loading', false)
        })
    }
  },
  getters: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get (state: ImageState, _: any, rootState: RootState): Image|undefined {
      return (
        rootState.url?.params.imageId &&
        state.byIds[rootState.url.params.imageId]
      )
    },
    find: (state: ImageState) => (id: number) => {
      return state.byIds[id]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tags (_state: ImageState, getters: any) {
      return (getters.get && getters.get.tags) || []
    },
    notReviewed (state) {
      const imageArray: Image[] = []

      state.allIds.forEach(id => {
        const image = state.byIds[id]
        if (!image.reviewer_id) {
          imageArray.push(image)
        }
      })

      return imageArray
    }
  }
}

export default image
