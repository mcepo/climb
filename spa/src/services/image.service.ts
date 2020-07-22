import { LatLng, LatLngBounds, imageOverlay, Map as LeafletMap, ImageOverlay } from 'leaflet'
import { Image } from '@/models'
import store, { RootState } from '@/store'
import { baseURL } from '@/store/api'

export class ImageService {
  private _imageOverlay!: ImageOverlay
  private _map!: LeafletMap

  private _unWatchStore!: Function

  set map (map: LeafletMap) {
    this._map = map
    if (this._map) {
      this.registerImageWatch()
    } else {
      this._unWatchStore && this._unWatchStore()
    }
  }

  registerImageWatch () {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this._unWatchStore = store.watch((state: RootState, getters: any) => {
      return getters['image/get']
    },
    (image: Image, oldImage: Image) => {
      if (image && image.id !== oldImage?.id) {
        this.open(image)
      }
    },
    { immediate: true })
  }

  getBounds (bounds: number[]) {
    const [width, height] = bounds

    return new LatLngBounds(
      new LatLng(0, 0),
      new LatLng(height / 10, width / 10)
    )
  }

  open (image: Image) {
    const bounds = this.getBounds(image.size)

    if (this._imageOverlay) {
      this._map.removeLayer(this._imageOverlay)
    }

    this._imageOverlay = imageOverlay(baseURL + 'image/' + image.id, bounds)

    this._map.addLayer(this._imageOverlay)
    this._map.setMaxBounds(bounds)
  }
}

const imageService = new ImageService()
export default imageService
