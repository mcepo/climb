<template>
  <v-card flat class='popup-box'>
    <slot name='header'></slot>
    <router-link :to='link' style='white-space: nowrap'>
      <slot name='item'></slot>
    </router-link>
    <slot name="content"></slot>
    <v-divider></v-divider>
    <v-card-actions>
      <tag-control :type="type" :item="item"></tag-control>
      <delete-button type="tag" :item="tag"></delete-button>
    </v-card-actions>
  </v-card>
</template>

<script>
import Vue from 'vue'
import DeleteButton from '../buttons/DeleteButton.vue'
import TagControl from '../common/TagControl.vue'
import store from '../../store'
import vuetify from '../../plugins/vuetify'
import router, { getUrl } from '../../router'

export default Vue.extend({
  store,
  vuetify,
  router,
  props: ['tag', 'item', 'type', 'url'],
  components: {
    TagControl,
    DeleteButton
  },
  computed: {
    link () {
      return this.url || getUrl(this.type, this.item.id)
    }
  }
})
</script>
