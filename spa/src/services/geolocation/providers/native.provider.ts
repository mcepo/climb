import { registerPlugin } from '@capacitor/core'
import { BackgroundGeolocationPlugin, CallbackError, Location } from '@capacitor-community/background-geolocation'
import { GeolocationProvider } from '../geolocation.service'
const BackgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>(
  'BackgroundGeolocation'
)
class NativeProvider implements GeolocationProvider {
  private _watcherId: string|undefined

  startWatch (callbackService: Function): void {
    if (this._watcherId) return

    // To start listening for changes in the device's location, add a new watcher.
    // You do this by calling 'addWatcher' with an options object and a callback. A
    // Promise is returned, which resolves to the callback ID used to remove the
    // watcher in the future. The callback will be called every time a new location
    // is available. Watchers can not be paused, only removed. Multiple watchers may
    // exist simultaneously.
    BackgroundGeolocation.addWatcher(
      {
        // If the "backgroundMessage" option is defined, the watcher will
        // provide location updates whether the app is in the background or the
        // foreground. If it is not defined, location updates are only
        // guaranteed in the foreground. This is true on both platforms.

        // On Android, a notification must be shown to continue receiving
        // location updates in the background. This option specifies the text of
        // that notification.
        backgroundMessage: 'Close app to stop tracking.',

        // The title of the notification mentioned above. Defaults to "Using
        // your location".
        backgroundTitle: 'Tracking your path.',

        // Whether permissions should be requested from the user automatically,
        // if they are not already granted. Defaults to "true".
        requestPermissions: true,

        // If "true", stale locations may be delivered while the device
        // obtains a GPS fix. You are responsible for checking the "time"
        // property. If "false", locations are guaranteed to be up to date.
        // Defaults to "false".
        stale: false,

        // The minimum number of metres between subsequent locations. Defaults
        // to 0.
        distanceFilter: 10
      },
      function callback (location?: Location, error?: CallbackError) {
        if (error) {
          if (error.code === 'NOT_AUTHORIZED') {
            if (
              window.confirm(
                error.message + '\n\n' +
                  'Open settings now?'
              )
            ) {
              // It can be useful to direct the user to their device's
              // settings when location permissions have been denied. The
              // plugin provides the 'openSettings' method to do exactly
              // this.
              BackgroundGeolocation.openSettings()
            }
          }
        }

        callbackService(location, error)
      } // after_the_watcher_has_been_added
    ).then((watcherId) => {
      this._watcherId = watcherId
    })
  }

  stopWatch (): void {
    if (!this._watcherId) return

    BackgroundGeolocation.removeWatcher({
      id: this._watcherId
    })
  }
}

const nativeProvider = new NativeProvider()

export default nativeProvider
