import { Geolocation, Position } from '@capacitor/geolocation'
import { GeolocationProvider } from '../geolocation.service'

class CapacitorProvider implements GeolocationProvider {
  private _watchId: string | undefined

  positionOptions: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 40000,
    maximumAge: 10000
  }

  startWatch (callback: Function): void {
    if (this._watchId) {
      return
    }

    Geolocation.watchPosition(
      this.positionOptions,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (position: Position | null, err?: any) => {
        if (position) {
          callback(position.coords, err)
        }
      }
    ).then(watchId => { this._watchId = watchId })
  }

  stopWatch (): void {
    if (this._watchId) {
      Geolocation.clearWatch({ id: this._watchId })
      this._watchId = undefined
    }
  }
}

const capacitorProvider = new CapacitorProvider()

export default capacitorProvider
