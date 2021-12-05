<template>
<div class='map'>
  <v-btn
    class='map-button'
    title="My location"
    aria-label='My location'
    fab
    small
    style='position: fixed'
    @click='toggleTracking()'
    >
    <v-icon v-if='tracking'>gps_off</v-icon>
    <v-icon v-else>gps_fixed</v-icon>
  </v-btn>
  <div id="leaflet-map" class="map"></div>
  <v-overlay :absolute='true' :opacity='0.5' :z-index='199' :value='loading'>
    <v-progress-circular indeterminate :size='64'></v-progress-circular>
  </v-overlay>
</div>
</template>

<script>
import { LatLngBounds, LatLng, Map, control, Canvas } from 'leaflet'
import setupTiles from '../../utils/tiles'
import layerService from '../../services/layer.service'

import drawers from '../../services/drawer.service'

export default {
  map: null,
  computed: {
    loading () {
      return this.$store.state.area.loading
    },
    tracking: {
      get () {
        return this.$store.state.tracking
      },
      set (value) {
        this.$store.commit('tracking', value)
      }
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
      zoomControl: false,
      renderer: new Canvas({
        tolerance: 5
      })
    })

    setupTiles(this.$options.map)

    layerService.map = this.$options.map

    if (this.tracking) {
      import(/* webpackChunkName: "myLocation.service" */ '../../services/myLocation.service')
        .then(myLocationService => {
          myLocationService.default.startTracking(this.$options.map)
        })
    }

    control.zoom({ position: 'bottomright' }).addTo(this.$options.map)
    control.scale().addTo(this.$options.map)

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
    toggleTracking () {
      import(/* webpackChunkName: "myLocation.service" */ '../../services/myLocation.service')
        .then(myLocationService => {
          if (this.tracking) {
            myLocationService.default.stopTracking()
            this.tracking = false
          } else {
            myLocationService.default.startTracking(this.$options.map)
            this.tracking = true
          }
        })
    }
  },

  destroyed () {
    layerService.map = null
      import(/* webpackChunkName: "myLocation.service" */ '../../services/myLocation.service')
        .then(myLocationService => {
          myLocationService.default.removeMap()
        })
  }
}
</script>
