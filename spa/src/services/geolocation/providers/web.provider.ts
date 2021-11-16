import { GeolocationProvider } from '../geolocation.service'

class WebProvider implements GeolocationProvider {
  private _watchId: number | undefined

  positionOptions: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 40000,
    maximumAge: 10000
  }

  startWatch (callback: Function): void {
    if (this._watchId) {
      return
    }

    this._watchId = navigator.geolocation.watchPosition(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (position?: GeolocationPosition | null) => {
        if (position) {
          callback(position.coords, null)
        }
      },
      (positionError) => {
        callback(null, positionError)
      },
      this.positionOptions
    )
  }

  stopWatch (): void {
    if (this._watchId) {
      navigator.geolocation.clearWatch(this._watchId)
      this._watchId = undefined
    }
  }
}

const webProvider = new WebProvider()

export default webProvider
