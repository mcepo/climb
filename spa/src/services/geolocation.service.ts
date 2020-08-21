import store from '../store'

// TODO: handle low accuracy locations

class GeolocationService {
  watchCallbacks: Function[]

  watchId: number|null;

  lastPosition: Position|undefined;

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

    if(this.lastPosition) {
      callback(this.lastPosition)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        callback(position)
      },
      error => {
        this._errorMessage(error)
        callback()
      }),
      {
        timeout: 1000,
        maximumAge: Infinity
      }
  }

  _initWatch () {
    if (!this._hasLocation()) {
      this._noSupportMessage()
    }

    this.watchId = navigator.geolocation.watchPosition((position) => {
      this.lastPosition = position
      this.resolveResponse(position)
    },
    (error) => {
      this.lastPosition = undefined
      this._errorMessage(error)
      this.resolveResponse()
    })
  }

  resolveResponse (position?: Position) {
    this.watchCallbacks.forEach(callback => {
      callback(position)
    })
  }

  unregisterWatch (callback: Function) {
    this.watchCallbacks = this.watchCallbacks.filter(c => {
      return c !== callback
    })
  }

  _hasLocation () {
    return 'geolocation' in navigator
  }

  _noSupportMessage () {
    store.commit('snackbar/error', "Your current browser doesn't support this feature")
  }

  _errorMessage (error) {
    store.commit('snackbar/info', "Climbers guide doesn't have permission to use your location")
  }
}

const geolocationService = new GeolocationService()

export default geolocationService
