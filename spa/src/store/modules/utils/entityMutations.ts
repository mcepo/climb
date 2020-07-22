import Vue from 'vue'
import { Tag } from '@/models'

export default {
  loading (state, loadingState: boolean) {
    state.loading = loadingState
  },

  add (state, item) {
    let newItem = item

    if (state.allIds.includes(item.id)) {
      newItem = {
        ...state.byIds[item.id],
        ...item
      }
    } else {
      state.allIds.push(item.id)
    }
    Vue.set(state.byIds, newItem.id, newItem)
  },
  remove (state, item) {
    const index = state.allIds.findIndex(id => id === item.id)

    if (index !== -1) {
      Vue.delete(state.byIds, item.id)
      state.allIds.splice(index, 1)
    }
  },
  storeMapTag (state, tag: Tag) {
    // reassigning object in the store so that i am sure that i will trigger
    // the recalculation of the getters
    // so the data will be updated on the view
    // eslint-disable-next-line @typescript-eslint/camelcase
    const item = { ...state.byIds[tag.tagged_id] }
    // eslint-disable-next-line @typescript-eslint/camelcase
    item.map_tag = tag
    state.byIds[tag.tagged_id] = item
  },
  removeMapTag (state, itemId) {
    // reassigning object in the store so that i am sure that i will trigger
    // the recalculation of the getters
    // so the data will be updated on the view
    // eslint-disable-next-line @typescript-eslint/camelcase
    const item = { ...state.byIds[itemId] }
    // eslint-disable-next-line @typescript-eslint/camelcase
    item.map_tag = null
    state.byIds[itemId] = item
  }
}
