<template>
  <popup :tag="tag" :item="item" type="image">
    <template v-slot:item>
      <v-img
        :src="src"
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
import imageService from '../../services/image.service'

export default Vue.extend({
  props: ['item', 'tag'],
  components: {
    Popup
  },
  data () {
    return {
      loading: true,
      src: ''
    }
  },
  created () {
    if (this.item) {
      import(/* webpackChunkName: "image.service" */ '../../services/image.service').then(imageService => {
        imageService.default.getImage(this.item.id, 'thumbnail').then((data) => {
          this.src = data
        })
      })
    }
  },
  computed: {
    height () {
      const aspect = this.item.size[1] / this.item.size[0]
      return (200 * aspect) + 'px'
    }
  }
})
</script>
