import {
  Map as LeafletMap,
  Polyline,
  Circle,
  LatLngExpression,
  Marker
} from 'leaflet'

import store from '../store'

import geolocationService from './geolocation/geolocation.service'

import styleService from '../services/style.service'

class MyLocation {
    // to display accuracy circle
    public circle: Circle|undefined;
    // for logging my trail
    public trail: Polyline = new Polyline([]);
    // my location
    public marker: Marker|undefined;
}

export class MyLocationService {
    private map: LeafletMap| null = null;

    private location: MyLocation

    private trackingId: number|null = null

    constructor () {
      this.location = new MyLocation()
    }

    toggleTracking () {
      if (this.trackingId) {
        store.dispatch('snackbar/show', 'GPS location disabled.')

        geolocationService.unregisterCallback(this.trackingId)

        this.trackingId = null

        this.eraseLocationData()
        return false
      } else {
        store.dispatch('snackbar/show', 'Getting location,<br>this may take some time ...')

        this.trackingId = geolocationService.registerCallback((position) => {
          this.moveMarker(position)
        })
        return true
      }
    }

    isTracking () {
      return !!this.trackingId
    }

    moveMarker (position) {
      if (!position) return

      if (this.location.circle) {
        this.location.circle.remove()
        delete (this.location.circle)
      }

      if (this.location.marker) {
        this.location.marker.remove()
        delete (this.location.marker)
      }

      const locationCenter: LatLngExpression = [position.latitude, position.longitude]
      const accuracy: number = position.accuracy

      if (accuracy > 10) {
        this.location.circle = new Circle(locationCenter, { radius: accuracy, stroke: false })
        this.map && this.location.circle.addTo(this.map)
      }

      this.location.marker = new Marker(locationCenter)
      this.map && this.location.marker.addTo(this.map)
        .bindTooltip('My Location<br>' + 'Accuracy: ' + accuracy.toFixed(2) + 'm')

      styleService.currentLocation.default(this.location.marker)

      if (accuracy < 100) {
        this.location.trail.addLatLng(locationCenter)
      }

      this.goToLocation()
    }

    goToLocation () {
      if (this.map && this.location.marker) {
        this.map.setView(this.location.marker.getLatLng(), 12)
        this.location.marker.openTooltip()
      }
    }

    setMap (map: LeafletMap) {
      this.map = map
      this.trackingId && this.location.trail.addTo(this.map)
      this.trackingId && this.location.circle && this.location.circle.addTo(this.map)
      this.trackingId && this.location.marker && this.location.marker.addTo(this.map)
    }

    removeMap () {
      this.removeLocationFromMap()

      this.map = null
    }

    removeLocationFromMap () {
      if (this.map) {
        this.location.circle && this.location.circle.remove()
        this.location.marker && this.location.marker.remove()
        this.location.trail.remove()
      }
    }

    eraseLocationData () {
      this.removeLocationFromMap()

      this.location.trail = new Polyline([])
      delete (this.location.circle)
      delete (this.location.marker)
    }
}

const myLocationService = new MyLocationService()

export default myLocationService
