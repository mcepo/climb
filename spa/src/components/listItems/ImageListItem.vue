<template>
  <v-img
    :key="image.id"
    :src="src"
    @click.native="open(image.id)"
    class='image-item'
    contain
    @load='imageLoaded()'
    eager
  >

    <v-skeleton-loader
      v-if='loading'
      class="mx-auto"
      width="400"
      type="image, actions"
    ></v-skeleton-loader>

    <v-overlay
      v-if='!loading'
      :absolute="true"
      :value="true"
    >
      Click me
    </v-overlay>
  <div class='image-controls' v-if='!loading'>
    <tag-control type="image" :item="image"></tag-control>
    <delete-button type="image" :item="image"></delete-button>
  </div>
  </v-img>
</template>

<style>

.image-controls {
  position:absolute;
  bottom:0;
  right:0;
  z-index:20
}

.image-item {
  width: 400px;
  max-height: 100%;
  padding: 5px;
}

</style>
<script>
import TagControl from '../buttons/TagControl'
import DeleteButton from '../buttons/DeleteButton'
import { getUrl } from '../../router'
import imageService from '../../services/image.service'

import drawers from '../../services/drawer.service'

export default {
  props: ['image'],
  data () {
    return {
      loading: true,
      src: ''
    }
  },
  created () {
    if (this.image) {
      imageService.getImage(this.image.id, 'thumbnail').then((data) => {
        console.log(data)
        this.src = data
      })
    }
  },
  methods: {
    open (id) {
      this.$router.push(getUrl('image', id))
      drawers.setLeft(false)
    },
    imageLoaded () {
      this.loading = false
    }
  },
  components: {
    TagControl,
    DeleteButton
  }
}
</script>
