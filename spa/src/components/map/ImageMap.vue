<template>
<div class='map'>
  <v-btn class='map-button'
    title="Open map"
    fab
    style='position: absolute'
    @click='openMap()'
    >
    <v-icon>map</v-icon>
  </v-btn>
  <div id="image-map" class="map"></div>
</div>
</template>

<style>
.map-button{
  z-index: 1000;
  top: 20px;
  left: 20px;
}
</style>

<script>
import { Map, control, CRS } from 'leaflet'
import imageService from '../../services/image.service'
import layerService from '../../services/layer.service'
import { getUrl } from '../../router'

export default {
  map: null,
  mounted () {
    this.$options.map = new Map('image-map', {
      center: [0, 0],
      zoom: 3,
      minZoom: 1,
      maxZoom: 13,
      maxBoundsViscosity: 1.0,
      zoomControl: false,
      crs: CRS.Simple
    })

    imageService.map = this.$options.map
    layerService.map = this.$options.map

    // this.setupAimer(true) // change this to false

    control.zoom({ position: 'bottomright' }).addTo(this.$options.map)
  },
  methods: {
    openMap () {
      this.$router.push(getUrl('image', null))
    }
  },

  destroyed () {
    layerService.map = null
    imageService.map = null
  }
}
</script>
