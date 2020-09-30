<template>
  <div v-if="images.length">
    <image-list-item v-for="image in images" :key="image.id" :image='image'></image-list-item>
  </div>
</template>
<script>
import ImageListItem from '../listItems/ImageListItem'

export default {
  props: {
    imageIds: Array
  },
  computed: {
    images () {
      const images = []

      this.imageIds.forEach((id) => {
        const image = this.$store.state.image.byIds[id]

        image && images.push(image)
      })

      return images
    }
  },
  components: {
    ImageListItem
  }
}
</script>
