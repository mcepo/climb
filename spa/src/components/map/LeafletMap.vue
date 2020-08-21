<template>
<div class='map'>
  <v-btn class='map-button'
    title="My location"
    fab
    style='position: absolute'
    @click='showLocation()'
    >
    <v-icon>gps_fixed</v-icon>
  </v-btn>
  <div id="leaflet-map" class="map"></div>
</div>
</template>

<script>
import { LatLngBounds, LatLng, Map, control, Marker } from 'leaflet'
import setupTiles from '../../utils/tiles'
import layerService from '../../services/layer.service'
import geolocationService from '../../services/geolocation.service'

export default {
  map: null,
  locationMarker: null,

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

    // this.setupAimer(this.$options.map, true)

    this.showLocation()
  },

  methods: {

    showLocation () {
      geolocationService.registerWatch(this.moveMarker)

      // TODO: style the location marker

      // TODO: map my trail, when walking it should map a trail show it on the map and be able
      // to store it to the server
    },

    moveMarker (position) {
      if (!position) return

      if (this.$options.locationMarker) {
        this.$options.locationMarker.remove()
      }

      this.$options.locationMarker = new Marker([position.coords.latitude, position.coords.longitude])

      this.$options.locationMarker.addTo(this.$options.map)
    }
  },

  destroyed () {
    layerService.map = null
  }
}
</script>
