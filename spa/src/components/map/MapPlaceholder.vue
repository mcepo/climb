<template>
  <component :is="map"></component>
</template>

<script>
export default {

  computed: {
    map () {
      return this.$store.getters.imageOpen ? 'image-map' : 'leaflet-map'
    }
  },

  components: {
    'leaflet-map': () => import(/* webpackChunkName: "leaflet.map" */'./LeafletMap.vue'),
    'image-map': () => import(/* webpackChunkName: "image.map" */'./ImageMap.vue')
  }
}
</script>

<style>
.map{
  height: 100vh;
}
</style>
