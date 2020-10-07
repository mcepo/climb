<template>
  <popup :tag="tag" :item="item" type="image">
    <template v-slot:item>
      <v-img
        :src="imageLink(item.id)"
        onerror="this.style.display='none'"
        width="100%"
        @load="loading = false"
        contain
      >

        <v-skeleton-loader
          v-if="loading"
          type="image"
          :height='height'
        ></v-skeleton-loader>

        <v-overlay :absolute="true" :value="true" v-if="!loading">
          Click me
        </v-overlay>

      </v-img>
    </template>
  </popup>
</template>

<script>
import Vue from 'vue'
import Popup from './Popup.vue'

export default Vue.extend({
  props: ['item', 'tag'],
  components: {
    Popup
  },
  data () {
    return {
      loading: true,
    }
  },
  computed: {
    height () {
      const aspect = this.item.size[1]/this.item.size[0]
      return (200 * aspect) + 'px'
    }
  },
  methods: {
    imageLink (id) {
      return '/api/image/' + id + '/thumbnail'
    }
  }
})
</script>
