<template>
  <div class='map'>
    <v-layout column style='position: fixed; height: 90px' class='map-button justify-space-between'>
      <v-btn
        title="Toogle tooltips"
        fab
        small
        @click='toogleAllTooltips()'
        >
        <v-icon>chat_bubble_outline</v-icon>
      </v-btn>
      <v-btn
        title="Open map"
        fab
        small
        @click='openMap()'
        >
        <v-icon>map</v-icon>
      </v-btn>
    </v-layout>

    <div id="image-map" class="map"></div>
  </div>
</template>

<script>
import '../../plugins/leaflet'
import { Map, control, CRS, Canvas } from 'leaflet'
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
      crs: CRS.Simple,
      renderer: new Canvas({
        tolerance: 5
      })
    })

    imageService.map = this.$options.map
    layerService.map = this.$options.map

    // this.setupAimer(true) // change this to false

    control.zoom({ position: 'bottomright' }).addTo(this.$options.map)
  },
  methods: {
    openMap () {
      this.$router.push(getUrl('image', null))
    },
    toogleAllTooltips () {
      layerService.toggleAllTooltips()
    }
  },

  destroyed () {
    layerService.map = null
    imageService.map = null
  }
}
</script>

<style>
.map-button{
  z-index: 191;
  bottom: 100px;
  right: 7px;
}

.leaflet-pane {
  z-index: 190;
}

.leaflet-control {
  z-index: 190;
}

.leaflet-top {
  top: 70px;
  z-index: 190;
}

.leaflet-bottom {
  position: fixed;
  z-index: 190;
}

/* Default icon URLs */
/* this is a fix for marker not shown when drawing */
.leaflet-default-icon-path {
	background-image: none;
}
</style>

