import store from '../store'

class GeolocationService {
  watchCallbacks: Function[];

  watchId: number | null;

  lastPosition: Position | undefined;

  positionOptions: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  }

  constructor () {
    this.watchCallbacks = []
    this.watchId = null
  }

  registerWatch (callback: Function) {
    this.watchCallbacks.push(callback)

    if (!this.watchId) {
      this._initWatch()
    }
  }

  getCurrentLocation (callback: Function) {
    if (!this._hasLocation()) {
      this._noSupportMessage()
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this._updatedMessage(position)
        callback(position)
      },
      () => {
        this._errorMessage()
        callback()
      },
      this.positionOptions
    )
  }

  _initWatch () {
    if (!this._hasLocation()) {
      this._noSupportMessage()
    }

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this._updatedMessage(position)
        this.lastPosition = position
        this.resolveResponse(position)
      },
      () => {
        this.lastPosition = undefined
        this._errorMessage()
        this.resolveResponse()
      },
      this.positionOptions
    )
  }

  resolveResponse (position?: Position) {
    this.watchCallbacks.forEach((callback) => {
      callback(position)
    })
  }

  unregisterWatch (callback: Function) {
    this.watchCallbacks = this.watchCallbacks.filter((c) => {
      return c !== callback
    })
  }

  _hasLocation () {
    return 'geolocation' in navigator
  }

  _noSupportMessage () {
    store.commit(
      'snackbar/error',
      "Your current browser doesn't support this feature"
    )
  }

  _errorMessage () {
    store.commit(
      'snackbar/show',
      "Climbers guide doesn't have permission to use your location"
    )
  }

  _updatedMessage (position: Position) {
    let accuMsg: string, type: string

    if (position.coords.accuracy < 100) {
      accuMsg = 'Good accuracy (' + position.coords.accuracy + ' m)'
      type = 'success'
    } else {
      accuMsg = 'Low accuracy (' + position.coords.accuracy + ' m)'
      type = 'error'
    }
    store.commit(
      'snackbar/' + type,
      'Your location info updated<br>' + accuMsg
    )
  }
}

const geolocationService = new GeolocationService()

export default geolocationService
