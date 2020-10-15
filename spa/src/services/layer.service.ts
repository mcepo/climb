import {
  Map as LeafletMap,
  FeatureGroup,
  Marker,
  Polyline,
  Layer,
  LeafletMouseEvent,
  CircleMarker
} from 'leaflet'
import { Tag, MapType, Area, Route, Pitch, Image } from '@/models'
import store, { RootState } from '@/store'
import styleService from './style.service'
import tooltipService from './tooltip.service'
import { ItemType } from './type.service'

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

  constructor () {
    this._layerGroup = new FeatureGroup()

    this._features = new Map()
    this._anchors = new Map()
    this._selected = []

    this._tooltipsClosed = false

    this.registerHighlightWatch()
  }

  set map (map: LeafletMap) {
    this.removeLayers()

    this._map = map

    if (this._map === null) {
      this._unwatchTags && this._unwatchTags()
    } else {
      this._mapType = store.getters.imageOpen ? 'image' : 'map'
      this._layerGroup.addTo(map)
      this.registerTagsWatch()
    }
  }

  get map () {
    return this._map
  }

  registerHighlightWatch () {
    store.watch(
      (state: RootState) => {
        return state.highlight?.key
      },
      (highlightedKey: string | undefined | null) => {
        this.highlightFeature(highlightedKey)
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
      // removing the Id part of route parameter
      // adding the id of the item thus forming the key
      const key = id.slice(0, -2) + params[id]

      this._selected.push(key)
    }
  }

  isSelectedFeature (key: string) {
    return this._selected.includes(key)
  }

  highlightFeature (highlightedKey: string | undefined | null) {
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

        this.setDefaultStyle(key, feature)

        this.registerListeners(key, feature)

        // adding tooltip only if on image
        if (
          (this._mapType === 'image' && tooltipService[tag.tagged_type]) ||
          tag.tagged_type === ItemType.Trail
        ) {
          tooltipService[tag.tagged_type](feature)
        }

        // adding layer to map
        this._layerGroup.addLayer(layer)

        if (
          store.getters.imageOpen &&
          (tag.tagged_type === ItemType.Route ||
            tag.tagged_type === ItemType.Pitch)
        ) {
          const anchor = this.createAnchor(tag.geometry.coordinates)

          this._anchors.set(key, anchor)
          this._layerGroup.addLayer(anchor)
        }
      }
    })

    if (store.getters.imageOpen) {
      return
    }

    if (this._layerGroup.getLayers().length === 0) {
      return
    }

    // setting map view point on the layers

    const mapBounds = this._map.getBounds()
    const layerGroupBounds = this._layerGroup.getBounds()

    let zoom = 18

    if (this._features.size === 1) {
      this._features.forEach((feature) => {
        const path = feature.item.path
        const zoomOffset = 7
        zoom = path ? (zoomOffset + path.split('.').length * 2) : zoomOffset
      })
    }

    if(!mapBounds.equals(layerGroupBounds)) {
      this._map.fitBounds(layerGroupBounds, {
        padding: [100, 100],
        maxZoom: zoom
      })
    }
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
        store.commit('highlight/set', key)

        // hide tooltip if open
        e.target.getTooltip() && e.target.closeTooltip()
      })
      .on('mouseout', (e) => {
        // remove highlight when mouse out
        store.commit('highlight/set', null)

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
