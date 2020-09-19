<template>
  <v-card flat class='popup-box'>
    <slot name='header'></slot>
    <a style='white-space: nowrap' @click='openItem()'>
      <slot name='item'></slot>
    </a>
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
import TagControl from '../buttons/TagControl.vue'
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
  },
  methods: {
    openItem () {
      this.$router.push(this.link)
      if (this.type !== 'image') {
        this.$store.commit('drawers/setLeft', true)
      } else {
        this.$store.commit('drawers/setLeft', false)
      }
    }
  }
})
</script>
