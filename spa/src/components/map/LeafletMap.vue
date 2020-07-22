<template>
  <div id="leaflet-map" class="map"></div>
</template>

<script>
import { LatLngBounds, LatLng, Map, control } from 'leaflet'
import setupTiles from '../../utils/tiles'
import layerService from '../../services/layer.service'

export default {
  map: null,

  mounted () {
    const bounds = new LatLngBounds(
      new LatLng(89, -179),
      new LatLng(-89, 179)
    )

    this.$options.map = new Map('leaflet-map', {
      noWrap: true,
      maxZoom: 18,
      minZoom: 2,
      zoom: 2,
      maxBounds: bounds,
      maxBoundsViscosity: 1.0,
      center: [0, 0],
      zoomControl: false
    })

    setupTiles(this.$options.map)
    layerService.map = this.$options.map

    control.zoom({ position: 'bottomright' }).addTo(this.$options.map)
    control.scale().addTo(this.$options.map)

  //  this.setupAimer(this.$options.map, true)
  },

  destroyed () {
    layerService.map = null
  }
}
</script>
