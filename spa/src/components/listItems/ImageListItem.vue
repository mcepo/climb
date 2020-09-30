<template>
  <v-img
    :key="image.id"
    :src="src(image.id)"
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
      Click me to view routes.
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

export default {
  props: ['image'],
  data () {
    return {
      loading: true
    }
  },
  methods: {
    src (id) {
      return '/api/image/' + id + '/thumbnail'
    },
    open (id) {
      this.$router.push(getUrl('image', id))
      this.$store.commit('drawers/setLeft', false)
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
