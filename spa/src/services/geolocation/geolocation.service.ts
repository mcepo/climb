import { Capacitor } from '@capacitor/core'
import { Position } from '@capacitor/geolocation'
import nativeProvider from './providers/native.provider'
import webProvider from './providers/web.provider'

export interface GeolocationProvider {
  startWatch(callback: Function): void;
  stopWatch(): void;
}

class GeolocationService {
  private _callbacks: Map<number, Function> = new Map()
  private _callbackCounter = 0

  private _provider: GeolocationProvider

  constructor (provider: GeolocationProvider) {
    this._provider = provider
  }

  registerCallback (callback: Function): number {
    console.log('callback registered')
    if (this._callbacks.size === 0) {
      this._provider.startWatch((position: Position, error) =>
        this._processPosition(position, error)
      )
    }

    this._callbackCounter++

    this._callbacks.set(this._callbackCounter, callback)

    return this._callbackCounter
  }

  private _processPosition (position, error) {
    console.log(position, error)
    if (!error && position) {
      this._callbacks.forEach((callback) => {
        callback(position)
      })
    }
  }

  unregisterCallback (callbackId: number): void {
    this._callbacks.delete(callbackId)

    console.log('callback unregistered')
    if (this._callbacks.size === 0) {
      this._provider.stopWatch()
    }
  }
}

const geolocationProvider = (Capacitor.isNativePlatform()
  ? nativeProvider
  : webProvider) as GeolocationProvider

const geolocationService = new GeolocationService(geolocationProvider)

export default geolocationService
