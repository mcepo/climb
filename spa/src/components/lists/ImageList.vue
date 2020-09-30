<template>
  <div>
    <div v-if="images.length">
      <image-list-item v-for="image in renderedImages" :key="image.id" :image='image'></image-list-item>
      <v-progress-circular
        v-if="images.length !== renderedImages.length"
        stroke="1"
        :size="25"
        indeterminate
      ></v-progress-circular>
      <div v-else style="width: 100%; display:flex;justify-content:space-around">
        <div>No more pictures</div>
      </div>
    </div>
    <div v-else style="width: 100%; display:flex;justify-content:space-around">
      <div>No pictures of this item!</div>
    </div>
    <div id="listBottom"></div>
  </div>
</template>

<style>

.image-controls {
  position:absolute;
  bottom:0;
  right:0;
}

</style>
<script>
import scrollMonitor from 'scrollmonitor'
import ImageListItem from '../listItems/ImageListItem'

export default {
  props: {
    imageIds: Array
  },
  data: () => ({
    renderedImages: []
  }),
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
  methods: {
    addImages () {
      if (this.images.length > 5) {
        if (this.renderedImages.length < this.images.length) {
          this.renderedImages = this.renderedImages.concat(
            this.images.slice(
              this.renderedImages.length,
              this.renderedImages.length + 5
            )
          )
        }
      } else {
        this.renderedImages = this.images
      }
    },
    registerScrollListener () {
      const containerElement = document.getElementById('drawerLeft')

      const containerMonitor = scrollMonitor.createContainer(containerElement)

      const childElement = document.getElementById('listBottom')
      const elementWatcher = containerMonitor.create(childElement, 0)

      elementWatcher.enterViewport(() => {
        this.addImages()
      })
    }
  },
  mounted () {
    this.registerScrollListener()
  },
  watch: {
    images: {
      immediate: true,
      handler () {
        this.renderedImages = []
        this.addImages()
      }
    }
  },
  components: {
    ImageListItem
  }
}
</script>
