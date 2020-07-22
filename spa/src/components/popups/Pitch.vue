<template>
  <popup :tag='tag' :item='item' type='pitch' :url='url'>
    <template v-slot:header>
      {{route.name}}
    </template>
    <template v-slot:content>
      Pretty little pitch
    </template>
  </popup>
</template>
<script>
import Vue from 'vue'
import Popup from './Popup.vue'
import { getUrl } from '../../router'
import store from '../../store'

export default Vue.extend({
  props: ['item', 'tag'],
  components: {
    Popup
  },
  computed: {
    url () {
      return getUrl('route', this.item.route_id)
    },
    route () {
      return store.state.route.byIds[this.item.route_id]
    }
  }
})
</script>
