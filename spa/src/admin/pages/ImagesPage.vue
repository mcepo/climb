<template>
<div>
  <image-list v-if='images.length' :images='images' style='height:95vh; overflow:auto'></image-list>
  <div v-else> All images are reviewed!</div>
</div>
</template>

<script>

import ImageList from '../components/lists/ImageList'

export default {
  computed: {
    images () {
      return this.$store.getters['image/notReviewed']
    }
  },
  created () {
    this.$store.dispatch('image/fetchAll')
  },
  components: {
    ImageList
  }
}
</script>
