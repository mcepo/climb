import store from '../../store'
import { Geolocation, Position } from '@capacitor/geolocation'

import { Capacitor } from '@capacitor/core'

class GeolocationService {
  watchCallbacks: Function[]

  private _provider = undefined

  positionOptions: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 40000,
    maximumAge: 10000
  }

  constructor (provider) {
    this.watchCallbacks = []
    this._provider = provider
  }

  registerWatch (callback: Function) {
    this.watchCallbacks.push(callback)

    this._initWatch()
  }

  getCurrentLocation (callback: Function) {
    let accuratePosition: Position | null = null

    while (!accuratePosition) {
      Geolocation.getCurrentPosition(this.positionOptions).then(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (position: any) => {
          if (position.coords.accuracy < 30) {
            accuratePosition = position
          }
        },
        () => {
          this._errorMessage()
          callback()
        }
      )
    }

    callback(accuratePosition)
  }

  _initWatch () {
    Geolocation.watchPosition(
      this.positionOptions,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (position?: Position | null | undefined, err?: any) => {
        if (err) {
          this._errorMessage()
          return
        }

        if (position) {
          if (position.coords.accuracy < 50) {
            this.watchCallbacks.forEach((callback) => {
              callback(position)
            })
          }
        } else {
          store.dispatch('snackbar/show', 'Waiting for location...')
        }
      }
    )
  }

  unregisterWatch (callback: Function) {
    this.watchCallbacks = this.watchCallbacks.filter((c) => {
      return c !== callback
    })
  }

  _errorMessage () {
    store.dispatch(
      'snackbar/show',
      'Make sure that GPS is on and application has permission to use it. '
    )
  }
}

const geolocationProvider = Capacitor.isNativePlatform() ? await import(/* webpackChunkName: "geolocation-native-provider" */ '../geolocation/providers/native.provider') : await import(/* webpackChunkName: "geolocation-web-provider" */ '../geolocation/providers/web.provider')

const geolocationService = new GeolocationService(geolocationProvider)

export default geolocationService
