import {
  Map as LeafletMap,
  FeatureGroup,
  Marker,
  Polyline,
  Layer,
  LeafletMouseEvent,
  CircleMarker,
  LatLngBounds
} from 'leaflet'
import { Tag, MapType, Area, Route, Pitch, Image } from '@/models'
import store, { RootState } from '@/store'
import styleService from './style.service'
import tooltipService from './tooltip.service'
import { ItemType } from './type.service'

import highlight from './highlight.service'

export interface Feature {
  layer: Layer;
  item: Area | Route | Pitch | Image;
  tag: Tag;
}

export class LayerService {
  private _map!: LeafletMap

  // connection between layers and the map
  // used to handle layers as a group
  private _layerGroup: FeatureGroup

  private _mapType!: MapType

  private _tooltipsClosed: boolean

  // record of all the layers so that it will be easier to
  // handle them individually

  private _features: Map<string, Feature>
  private _anchors: Map<string, CircleMarker>

  private _unwatchTags!: Function

  // list of currently selected entites
  // getting them from url when tags change
  // because thats when selected entity changes
  private _selected: Array<string>

  // last bounds defined by the displayed layers
  // created when the map layers are loaded
  private _lastLayerBounds: LatLngBounds | undefined
  // surface that those layers take up
  private _lastLayerSurfaceSize: number

  // when ever a map changes it bounds it is recorded here
  // so when the map is recreated we have a starting point for the viewpoint
  public lastMapBounds: LatLngBounds | undefined

  constructor () {
    this._layerGroup = new FeatureGroup()

    this._features = new Map()
    this._anchors = new Map()
    this._selected = []

    this._tooltipsClosed = false

    this._lastLayerBounds = undefined
    this._lastLayerSurfaceSize = 1000

    this.registerHighlightWatch()
  }

  set map (map: LeafletMap) {
    this.removeLayers()

    this._map = map

    if (this._map === null) {
      this._unwatchTags && this._unwatchTags()
    } else {
      if (store.getters.imageOpen) {
        this._mapType = 'image'
        this.lastMapBounds = undefined
      } else {
        this._mapType = 'map'
      }

      this._layerGroup.addTo(map)
      this.registerTagsWatch()
    }
  }

  get map () {
    return this._map
  }

  registerHighlightWatch () {
    store.watch(
      () => {
        return highlight.key
      },
      (highlightedKey: string | undefined | null) => {
        this.refreshStyle(highlightedKey)
      }
    )
  }

  registerTagsWatch () {
    this._unwatchTags = store.watch(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (_state: RootState, getters: any) => {
        return getters.tags
      },
      (tags: Tag[]) => {
        if (store.getters.loading) return

        this.setSelectedKeys()
        this.addTagsToView(tags)
      },
      { immediate: true }
    )
  }

  setSelectedKeys () {
    this._selected = []
    const params = store.state.url?.params

    for (const id in params) {
      // removing the Id part of route parameter (areaId, routeId)
      // adding the id of the item thus forming the key

      const itemType = id.slice(0, -2)
      const itemId = params[id]

      const key = itemType + itemId

      this._selected.push(key)

      // if its a multipitch route pitches should be set as selected as well as
      // route
      if (itemType === ItemType.Route) {
        const route = store.getters[ItemType.Route + '/find'](itemId)
        if (route && route.pitches) {
          for (const pitchId of route.pitches) {
            this._selected.push(ItemType.Pitch + pitchId)
          }
        }
      }
    }
  }

  isSelectedFeature (key: string) {
    return this._selected.includes(key)
  }

  refreshStyle (highlightedKey?: string | undefined | null) {
    this._features.forEach((feature, key) => {
      if (highlightedKey === key) {
        this.setStyle('highlight', feature)
      } else {
        this.setDefaultStyle(key, feature)
      }
    })
  }

  removeLayers () {
    this._features.forEach((feature) => {
      this._layerGroup.removeLayer(feature.layer)
    })

    this._features.clear()

    this._anchors.forEach((anchor) => {
      this._layerGroup.removeLayer(anchor)
    })

    this._anchors.clear()
  }

  hideTag (key: string) {
    const feature = this._features.get(key)

    feature && this._layerGroup.removeLayer(feature.layer)

    // if has anchor remove it as well

    const anchor = this._anchors.get(key)

    anchor && this._layerGroup.removeLayer(anchor)
  }

  showTag (tag: Tag) {
    const feature = this._features.get(tag.tagged_type + tag.tagged_id)

    feature && this._layerGroup.addLayer(feature.layer)
  }

  hasTag (key: string) {
    return this._features.has(key)
  }

  getTag (key: string) {
    return this._features.get(key)?.tag
  }

  addTagsToView (tags: Tag[]) {
    this.removeLayers()
    this._tooltipsClosed = false

    tags.forEach((tag: Tag) => {
      const item =
        tag.tagged_type &&
        store.getters[tag.tagged_type + '/find'](tag.tagged_id)
      if (item) {
        const layer = this.createLayer(tag)

        const feature = {
          layer,
          item,
          tag
        }

        const key = tag.tagged_type + tag.tagged_id

        this._features.set(key, feature)

        this.registerListeners(key, feature)

        // adding tooltip only if on image
        if (this._mapType === 'image' && tooltipService[tag.tagged_type]) {
          tooltipService[tag.tagged_type](feature)
        }

        // adding layer to map
        this._layerGroup.addLayer(layer)
      }
    })

    this.refreshStyle()

    if (store.getters.imageOpen) {
      this.addAnchors()
      return
    }

    this.setMapViewpoint()
  }

  addAnchors () {
    // drawing anchors after tags
    // because in svg the draw order matters
    // in order for anchors to be on top of routes/pitches
    // they need to be added after tags
    this._features.forEach((feature: Feature, key: string) => {
      if (
        feature.tag.tagged_type === ItemType.Route ||
        feature.tag.tagged_type === ItemType.Pitch
      ) {
        const anchor = this.createAnchor(feature.tag.geometry.coordinates)

        this._anchors.set(key, anchor)
        this._layerGroup.addLayer(anchor)
      }
    })
  }

  setMapViewpoint () {
    // setting map viewpoint depending on the layers size

    if (this._layerGroup.getLayers().length === 0) {
      return
    }

    const layerBounds = this._layerGroup.getBounds()

    const layerSurfaceSize = this.calculateSurface(layerBounds)

    let zoom = 18

    if (this._features.size === 1) {
      this._features.forEach((feature) => {
        const path = feature.item.path
        const zoomOffset = 10
        zoom = path ? zoomOffset + path.split('.').length * 2 : zoomOffset
      })
    }

    const noSurfaceSizeChange = Math.abs(this._lastLayerSurfaceSize - layerSurfaceSize) < 0.0001

    const layersOverlap = this._lastLayerBounds && (this._lastLayerBounds.overlaps(layerBounds) || this._lastLayerBounds?.equals(layerBounds))

    // if there was no big move on map keep current map view
    if (noSurfaceSizeChange && layersOverlap && this.lastMapBounds) {
      this._map.fitBounds(this.lastMapBounds)
      return
    }

    this._lastLayerBounds = layerBounds
    this._lastLayerSurfaceSize = layerSurfaceSize

    this.lastMapBounds = undefined

    this._map.fitBounds(this._lastLayerBounds, {
      padding: [100, 100],
      maxZoom: zoom
    })
  }

  calculateSurface (bounds: LatLngBounds) {
    const x = bounds.getWest() - bounds.getEast()
    const y = bounds.getNorth() - bounds.getSouth()
    return Math.abs(x * y)
  }

  setDefaultStyle (key: string, feature: Feature) {
    if (this.isSelectedFeature(key)) {
      this.setStyle('selected', feature)
    } else {
      this.setStyle('default', feature)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setStyle (styleType: string, feature: Feature) {
    const type = feature.tag.tagged_type

    styleService[this._mapType][type] &&
      styleService[this._mapType][type][styleType]({
        layer: feature.layer,
        item: feature.item
      })
  }

  createLayer (tag: Tag) {
    let layer: Marker | Polyline

    switch (tag.geometry.type) {
      case 'Point':
        layer = this.createMarker(tag.geometry.coordinates)
        break
      case 'LineString':
        layer = this.createPolyline(tag.geometry.coordinates)
        break
    }

    return layer
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createAnchor (coordinates: any) {
    // making sure i get last point in pitch/route for anchor location
    // comparing first and last item in array and taking the one with bigger latitude
    // as the anchor point
    const first = coordinates[0]
    const last = coordinates[coordinates.length - 1]

    const coords = last[1] > first[1] ? last : first

    return new CircleMarker([coords[1], coords[0]], {
      radius: 5,
      stroke: false,
      fillOpacity: 1,
      fillColor: 'white'
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createMarker (coordinates: any) {
    return new Marker([coordinates[1], coordinates[0]])
  }

  toggleAllTooltips () {
    let methodName: string

    if (this._tooltipsClosed) {
      methodName = 'openTooltip'
      this._tooltipsClosed = false
    } else {
      methodName = 'closeTooltip'
      this._tooltipsClosed = true
    }

    this._features.forEach((feature) => {
      feature.layer[methodName]()
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createPolyline (coordinates: any) {
    // i have to switch the coordinates in array because geojson writes lng then lat
    // and leaflet layers accept first lat then lng :/
    const latLngSwitchedArray: Array<[number, number]> = []

    coordinates.forEach((coordinate: [number, number]) => {
      latLngSwitchedArray.push([coordinate[1], coordinate[0]])
    })

    return new Polyline(latLngSwitchedArray)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerListeners (key: string, feature: Feature) {
    feature.layer
      .on('mouseover', (e) => {
        // highlight layer
        highlight.key = key

        // hide tooltip if open
        e.target.getTooltip() && e.target.closeTooltip()
      })
      .on('mouseout', (e) => {
        // remove highlight when mouse out
        highlight.key = null

        // show tooltip if has any
        e.target.getTooltip() && e.target.openTooltip()
      })
      .on('click', (e: LeafletMouseEvent) => {
        if (e.target.getPopup() === undefined) {
          import(
            /* webpackChunkName: "popup.service" */ './popup.service'
          ).then(({ default: popupService }) => {
            popupService.createPopup(feature, e.latlng)
          })
        }
      })
  }
}

const layerService = new LayerService()
export default layerService
