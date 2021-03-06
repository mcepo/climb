import layerService from './layer.service'
import store from '../store'
import { TaggedType, Tag } from '@/models'
import api from '@/store/api'
import '@geoman-io/leaflet-geoman-free'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
import geolocationService from './geolocation.service'

const drawingTypes = {
  map: {
    area: 'Marker',
    route: 'Marker',
    trail: 'Line',
    image: 'Marker'
  },
  image: {
    pitch: 'Line',
    route: 'Line'
  }
}

class DrawingService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _map!: any

  private _drawingType!: string

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _layer!: any

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _item!: any

  private _tag!: Tag | undefined | null

  private _taggedType!: string

  setMapAndType (type: TaggedType) {
    this._map = layerService.map
    this._taggedType = type

    if (store.getters.imageOpen) {
      this._drawingType = drawingTypes.image[type] || drawingTypes.map[type]
    } else {
      this._drawingType = drawingTypes.map[type]
    }

    return this._map
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createTag (type: TaggedType, item: any) {
    // authorize this action, only checking if user is logged in
    store.dispatch('auth/authorize').then(() => {
      // if there is no map stop drawing
      if (!this.setMapAndType(type)) return

      store.dispatch('snackbar/show', 'Adding tag for ' + (item?.name || type))

      store.commit('setDrawingMode', true)

      this._layer = null

      this._item = item

      // register a listener for drawing on the map
      this.registerListenerOnDraw()

      // enable drawing on the map with a specific layer type (Marker or Polyline)
      this.enableDrawing()
    }).catch((error) => {
      console.log(error)
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editTag (type: TaggedType, item: any) {
    const key = type + item.id

    if (!layerService.hasTag(key)) {
      store.dispatch('snackbar/show', "Tag doesn't exist!")
      return
    }

    this._tag = layerService.getTag(key)

    store
      .dispatch('auth/authorize', this._tag)
      .then(() => {
        layerService.hideTag(key)

        // if there is no map stop drawing
        if (!this.setMapAndType(type)) return

        this._item = item

        store.dispatch('snackbar/show', 'Editing tag for ' + (item.name || type))

        store.commit('setDrawingMode', true)

        this.createDrawingLayer()
      })
      .catch(() => {
        this._tag = null
      })
  }

  // TODO: add method for adding/editing map tag to the current location
  // of the user

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setTagAtCurrentLocation (type: TaggedType, item: any) {
    store.dispatch('snackbar/show', "Tagging '" + item.name + "' at your current location<br/>Depending on your device/browser, this may take some time ...")

    const key = type + item.id

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let tag: any

    if (layerService.hasTag(key)) {
      tag = layerService.getTag(key)
    } else {
      tag = {
        // eslint-disable-next-line @typescript-eslint/camelcase
        tagged_type: type,
        // eslint-disable-next-line @typescript-eslint/camelcase
        tagged_id: item.id
      }
    }

    store
      .dispatch('auth/authorize', tag.id ? tag : null)
      .then(() => {
        geolocationService.getCurrentLocation(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (position: any) => {
            if (!position) return

            if (position.coords.accuracy > 50) {
              store.dispatch('snackbar/error', 'Location accuracy too low (' + position.coords.accuracy + ' m), try later!')
              return
            }

            tag.geometry = {
              type: 'Point',
              coordinates: [position.coords.longitude, position.coords.latitude]
            }
            this.storeTag(tag)
          }
        )
      })
      .catch(() => {
      /* so i dont get an error */
      })
  }

  createDrawingLayer () {
    this._layer = this._tag && layerService.createLayer(this._tag)

    this._layer.addTo(this._map)

    this._layer.pm.enable()
  }

  registerListenerOnDraw () {
    this._map.once('pm:create', (e) => {
      this._map.pm.disableDraw(this._drawingType)

      this._layer = e.layer

      this._layer.pm.enable()
    })

    // added this so that i can save the layer without actually
    // finishing it
    // useful for mobile phone users
    this._map.once('pm:drawstart', ({ workingLayer }) => {
      workingLayer.on('pm:vertexadded', e => {
        this._layer = e.workingLayer
      })
    })
  }

  enableDrawing () {
    this._map.pm.enableDraw(this._drawingType, {
      snappable: true,

      snapDistance: 20,

      snapMiddle: true
    })
  }

  createRequest () {
    return {
      id: this._tag?.id || null,

      // eslint-disable-next-line @typescript-eslint/camelcase
      image_id: store.getters.imageOpen || null,

      geometry: this._layer.toGeoJSON().geometry,

      // eslint-disable-next-line @typescript-eslint/camelcase
      tagged_type: this._taggedType,

      // eslint-disable-next-line @typescript-eslint/camelcase
      tagged_id: this._item?.id || null
    } as Tag
  }

  storeTrailTag (request: Tag) {
    api.post('trail', request).then(
      ({ data }) => {
        store.commit('trail/add', data)
        store.commit('area/appendTrail', { id: data.area_id, trailId: data.id })
        store.dispatch('snackbar/success', 'Tag stored')
      })
      .catch(() => {
        this.discardLayer()
      })
      .finally(() => {
        this.afterDrawing()
      })
  }

  storeTag (tag?: Tag) {
    store.dispatch('snackbar/show', 'Storing tag')

    const request = tag || this.createRequest()

    if (request.tagged_type === 'trail' && request.id === null) {
      this.storeTrailTag(request)
      return
    }

    const apiCall = request.id
      ? api.put('tag/' + request.id, request)
      : api.post('tag', request)

    apiCall
      .then(({ data }) => {
        store.dispatch('snackbar/success', 'Tag stored')

        if (data && request.id == null) request.id = data

        if (store.getters.imageOpen) {
          store.commit('image/storeImageTag', request)
        } else {
          store.commit(request.tagged_type + '/storeMapTag', request)
        }
      })
      .catch(() => {
        this.discardLayer()
      })
      .finally(() => {
        this.afterDrawing()
      })
  }

  afterDrawing () {
    this._layer && this._layer.remove()

    this._map && this._map.pm.disableDraw(this._drawingType)

    store.commit('setDrawingMode', false)

    this._drawingType = ''

    this._tag = null

    this._layer = null

    this._item = null

    this._map = null
  }

  discardLayer () {
    this._tag && layerService.showTag(this._tag)

    this.afterDrawing()

    store.commit('setDrawingMode', false)

    store.dispatch('snackbar/error', 'Changes discarded!')
  }
}

const drawingService = new DrawingService()

export default drawingService
