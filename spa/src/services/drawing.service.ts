import layerService from './layer.service'
import store from '../store'
import { TaggedType, Tag } from '@/models'
import api from '@/store/api'
import '@geoman-io/leaflet-geoman-free'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'

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

    if (store.getters.openImage) {
      this._drawingType = drawingTypes.image[type] || drawingTypes.map[type]
    } else {
      this._drawingType = drawingTypes.map[type]
    }

    return this._map
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createTag (type: TaggedType, item: any) {
    // authorize this action
    store.dispatch('auth/authorize').then(() => {
      // if there is no map stop drawing
      if (!this.setMapAndType(type)) return

      store.commit('snackbar/show', 'Adding tag for ' + (item.name || type))

      store.commit('setDrawingMode', true)

      this._layer = null

      this._item = item

      // register a listener for drawing on the map
      this.registerListenerOnDraw()

      // enable drawing on the map with a specific layer type (Marker or Polyline)
      this.enableDrawing()
    }).catch(() => { /* so the error won't get dumped in the console */ })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editTag (type: TaggedType, item: any) {
    const key = type + item.id

    if (!layerService.hasTag(key)) {
      store.commit('snackbar/show', "Tag doesn't exist!")
      return
    }

    this._tag = layerService.getTag(key)

    store
      .dispatch('auth/authorize', { item: this._tag })
      .then(() => {
        layerService.hideTag(key)

        // if there is no map stop drawing
        if (!this.setMapAndType(type)) return

        this._item = item

        store.commit('snackbar/show', 'Editing tag for ' + (item.name || type))

        store.commit('setDrawingMode', true)

        this.createDrawingLayer()
      })
      .catch(() => {
        this._tag = null
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
      image_id: store.getters.openImage || null,

      geometry: this._layer.toGeoJSON().geometry,

      // eslint-disable-next-line @typescript-eslint/camelcase
      tagged_type: this._taggedType,

      // eslint-disable-next-line @typescript-eslint/camelcase
      tagged_id: this._item.id
    } as Tag
  }

  storeTag () {
    store.commit('snackbar/show', 'Storing tag')

    const request = this.createRequest()

    const apiCall = this._tag
      ? api.put('tag/' + this._tag?.id, request)
      : api.post('tag', request)

    apiCall
      .then(({ data }) => {
        store.commit('snackbar/success', 'Tag stored')

        if (data && request.id == null) request.id = data

        if (store.getters.openImage) {
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

    store.commit('snackbar/error', 'Changes discarded!')
  }
}

const drawingService = new DrawingService()

export default drawingService
