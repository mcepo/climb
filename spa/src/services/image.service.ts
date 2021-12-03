import {
  LatLng,
  LatLngBounds,
  imageOverlay,
  Map as LeafletMap,
  ImageOverlay
} from 'leaflet'
import { Image } from '@/models'
import store, { RootState } from '@/store'
import api from '@/store/api'
import { Filesystem, Directory } from '@capacitor/filesystem'

export class ImageService {
  private _imageOverlay!: ImageOverlay
  private _imageOverlayThumbnail!: ImageOverlay
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
    this._unWatchStore = store.watch(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (state: RootState, getters: any) => {
        return getters['image/get']
      },
      (image: Image, oldImage: Image) => {
        if (image && image.id !== oldImage?.id) {
          this.open(image)
        }
      },
      { immediate: true }
    )
  }

  // TODO: remove this after all images have bounderies
  getBoundsDepricated (bounds: number[]) {
    const [width, height] = bounds

    return new LatLngBounds(
      new LatLng(0, 0),
      new LatLng(height / 10, width / 10)
    )
  }

  getBounds (bounds: number[]) {
    const [latitudeBoundary, longitudeBoundary] = bounds

    return new LatLngBounds(
      new LatLng(-latitudeBoundary, longitudeBoundary),
      new LatLng(latitudeBoundary, -longitudeBoundary)
    )
  }

  // extending max bounds by 30%
  getMaxBounds (bounds: LatLngBounds) {
    return bounds.pad(0.3)
  }

  async open (image: Image) {
    const bounds = image.boundary
      ? this.getBounds(image.boundary)
      : this.getBoundsDepricated(image.size)

    this._map.setMaxBounds(this.getMaxBounds(bounds))

    this._map.fitBounds(bounds)

    if (this._imageOverlayThumbnail) {
      this._map.removeLayer(this._imageOverlayThumbnail)
    }

    if (this._imageOverlay) {
      this._map.removeLayer(this._imageOverlay)
    }

    // thumbnail image gets displayed right away, so that a user has something to see while the
    // real image gets loaded in the background
    this._imageOverlayThumbnail = imageOverlay(
      await this.getImage(image.id, 'thumbnail'),
      bounds
    )

    this._map.addLayer(this._imageOverlayThumbnail)

    this._imageOverlay = imageOverlay(await this.getImage(image.id), bounds, {
      zIndex: 2
    })

    this._map.addLayer(this._imageOverlay)
  }

  async getImage (id: number, type: string | null = null): Promise<string> {
    let src = 'image/' + id

    if (type) {
      src += '/' + type
    }

    type = type ?? 'full'

    return await this.fetchImage(type + '-' + id, src)
  }

  async fetchImage (cacheKey: string, src: string, type = 'jpeg') {
    const base64image = await this.loadImageFromCache(cacheKey, type) || await this.getAndCacheImage(cacheKey, src)

    if (base64image) {
      return base64image
    }

    return src
  }

  async loadImageFromCache (cacheKey: string, imageType): Promise<string|null> {
    try {
      const content = await Filesystem.readFile({
        path: cacheKey,
        directory: Directory.Cache
      })
      // for some reason type isn't stored in the cache only the base64data
      // but when retrieving the image from server then it has the type in front
      // but that type isn't being stored in the cache
      return 'data:image/' + imageType + ';base64,' + content.data
    } catch (e) {
      return null
    }
  }

  async getAndCacheImage (cacheKey, src: string): Promise<string|null> {
    const base64image = await this.getBase64Image(src)

    if (!base64image) {
      return null
    }

    Filesystem.writeFile({
      path: cacheKey,
      data: base64image,
      directory: Directory.Cache
    })

    return base64image
  }

  async getBase64Image (src): Promise<string | null> {
    try {
      const response = await api.get(src, {
        responseType: 'blob'
      })
      return (await this.convertToBase64(response.data)) as string
    } catch (e) {
      return null
    }
  }

  async convertToBase64 (blob: Blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onerror = reject
      reader.onload = () => {
        resolve(reader.result)
      }
      reader.readAsDataURL(blob)
    })
  }
}

const imageService = new ImageService()
export default imageService
