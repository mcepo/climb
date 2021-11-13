import capacitorProvider from './providers/capacitor.provider'

export interface GeolocationProvider {
  startWatch(callback: Function): void;
  stopWatch(): void;
}

// these are the parameters that i am currenty using
// objects returned from native and web plugins differe so
// if you add more atributes here make su to check that it is compatible with
// native and web
export interface PositionInterface {
  latitude: number;
  longitude: number;
  accuracy: number;
}

class GeolocationService {
  private _callbacks: Map<number, Function> = new Map()
  private _callbackCounter = 0

  private _provider: GeolocationProvider

  constructor (provider: GeolocationProvider) {
    this._provider = provider
  }

  registerCallback (callback: Function): number {
    if (this._callbacks.size === 0) {
      this._provider.startWatch((position: PositionInterface, error) =>
        this._processPosition(position, error)
      )
    }

    this._callbackCounter++

    this._callbacks.set(this._callbackCounter, callback)

    return this._callbackCounter
  }

  private _processPosition (position: PositionInterface, error) {
    if (!error && position) {
      this._callbacks.forEach((callback) => {
        callback(position)
      })
    }
  }

  unregisterCallback (callbackId: number): void {
    this._callbacks.delete(callbackId)

    if (this._callbacks.size === 0) {
      this._provider.stopWatch()
    }
  }
}

// const geolocationProvider = (Capacitor.isNativePlatform()
//   ? nativeProvider
//   : webProvider) as GeolocationProvider

const geolocationService = new GeolocationService(capacitorProvider)

export default geolocationService
