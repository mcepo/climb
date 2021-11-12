import { Position } from '@capacitor/geolocation'
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

    console.log('starting watch')

    this._watchId = navigator.geolocation.watchPosition(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (position?: Position | null) => {
        callback(position, null)
      },
      (positionError) => {
        callback(null, positionError)
      },
      this.positionOptions
    )
  }

  stopWatch (): void {
    if (this._watchId) {
      console.log('stopping watch')
      navigator.geolocation.clearWatch(this._watchId)
      this._watchId = undefined
    }
  }
}

const webProvider = new WebProvider()

export default webProvider
