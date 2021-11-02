<template>
<div class='map'>
  <v-btn
    class='map-button'
    title="My location"
    aria-label='My location'
    fab
    small
    style='position: fixed'
    @click='showLocation()'
    >
    <v-icon>gps_fixed</v-icon>
  </v-btn>
  <div id="leaflet-map" class="map"></div>
  <v-overlay :absolute='true' :opacity='0.5' :z-index='199' :value='loading'>
    <v-progress-circular indeterminate :size='64'></v-progress-circular>
  </v-overlay>
</div>
</template>

<script>
import { LatLngBounds, LatLng, Map, control, Marker, Circle, Polyline } from 'leaflet'
import setupTiles from '../../utils/tiles'
import layerService from '../../services/layer.service'
import styleService from '../../services/style.service'
import geolocationService from '../../services/geolocation.service'

import drawers from '../../services/drawer.service'

export default {
  map: null,
  location: {
    marker: null,
    circle: null,
    trail: null
  },
  goToRequest: false,

  computed: {
    loading () {
      return this.$store.state.area.loading
    }
  },

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

    this.$options.location.trail = new Polyline([])
    this.$options.location.trail.addTo(this.$options.map)

    // recording current map bounds here
    // so that when the map gets recreated it
    // will go back where it was before it was destroyed
    this.$options.map.on('moveend', () => {
      // only record if the left drawer is close
      // otherwise i get wrong map bounds because the map div is being reduced
      // and this event gets fired
      if (!drawers.state.left) {
        layerService.lastMapBounds = this.$options.map.getBounds()
      }
    })
  },

  methods: {

    showLocation () {
      this.$store.dispatch('snackbar/show', 'Getting location,<br>this may take some time ...')

      geolocationService.registerWatch(this.moveMarker)

      this.$options.goToRequest = true

      // TODO: map my trail, when walking it should map a trail show it on the map and be able
      // to store it to the server
    },

    moveMarker (position) {
      if (!position) return

      if (this.$options.location.marker) {
        this.$options.location.marker.remove()
      }

      if (this.$options.location.circle) {
        this.$options.location.circle.remove()
      }

      const locationCenter = [position.coords.latitude, position.coords.longitude]
      const accuracy = position.coords.accuracy

      this.$options.location.marker = new Marker(locationCenter, { title: 'My Location' })
        .bindTooltip('My Location<br>' + 'Accuracy: ' + accuracy.toFixed(2) + 'm')
      styleService.currentLocation.default(this.$options.location.marker)
      this.$options.location.marker.addTo(this.$options.map)

      if (accuracy > 10) {
        this.$options.location.circle = new Circle(locationCenter, { radius: accuracy, stroke: false })
        this.$options.location.circle.addTo(this.$options.map)
      }

      if (accuracy < 100) {
        this.$options.location.trail.addLatLng(locationCenter)
      }

      if (this.$options.goToRequest) {
        this.$options.goToRequest = false
        this.goToLocation()
      }
    },

    goToLocation () {
      if (this.$options.location.marker) {
        this.$options.map.setView(this.$options.location.marker.getLatLng(), 12)
        this.$options.location.marker.openTooltip()
      }
    }
  },

  destroyed () {
    layerService.map = null
  }
}
</script>
