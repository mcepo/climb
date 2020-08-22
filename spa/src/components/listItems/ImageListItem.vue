<template>
  <v-img
    :key="image.id"
    :src="src(image.id)"
    @click.native="open(image.id)"
    class='image-item'
    contain
  >
  <div class='image-controls'>
    <tag-control type="image" :item="image"></tag-control>
    <delete-button type="image" :item="image" return-back></delete-button>
  </div>
  </v-img>
</template>

<style>

.image-controls {
  position:absolute;
  bottom:0;
  right:0;
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
  methods: {
    src (id) {
      return '/api/image/' + id + '/thumbnail'
    },
    open (id) {
      this.$router.push(getUrl('image', id))
    }
  },
  components: {
    TagControl,
    DeleteButton
  }
}
</script>
