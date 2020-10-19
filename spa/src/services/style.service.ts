import { DivIcon, Marker, Icon, Polyline } from 'leaflet'
import { Area, TaggedType } from '@/models'
import { svgIconUrl } from '../utils/svg'

interface StylingMarker {
  layer: Marker;
  item: Area;
}

interface StylingPolyline {
  layer: Polyline;
  item: Area;
}

const highlighColor = '#3490dc'

function getStarSvg (color: string) {
  return '<path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" fill="' + color + '"/>'
}

function getCircleSvg (color: string) {
  return '<circle cx="12" cy="12" r="6" fill="' + color + '"/>'
}

function getPhotoSvg (color: string) {
  return '<path d="M0 0h24v24H0z" fill="none"/><circle cx="12" cy="12" r="3.2" fill="' + color + '"/><path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" fill="' + color + '"/>'
}

function setPolylineStyle (layer: Polyline, color: string, dashArray?: string) {
  layer.setStyle(
    {
      color,
      dashArray
    }
  )
}

function setMarkerStyle (layer: Marker, svg: string) {
  layer.setIcon(
    new Icon({
      iconUrl: svgIconUrl(svg),
      iconSize: [18, 18],
      iconAnchor: [9, 9]
    })
  )
}

const areaLayerStyle = {

  style (layer: Marker, className: string, item: Area, zIndex?: number) {
    const html = '<div class="climb-area">' + item.name + '</div>'

    // so when zooming out the areas that are parents will be in front
    // of subareas, crags in front of sectors ...

    zIndex = zIndex || -(item.path ? item.path.length : 0) * 200

    layer.setZIndexOffset(zIndex)

    layer.setIcon(
      new DivIcon({
        className,
        html
      })
    )
  },

  default (obj: StylingMarker) {
    this.style(obj.layer, 'climb-area-none', obj.item)
  },
  highlight (obj: StylingMarker) {
    this.style(obj.layer, 'climb-area-highlight', obj.item, 1000)
  },
  selected (obj: StylingMarker) {
    this.style(obj.layer, 'climb-area-selected', obj.item)
  }
}

const routeLeafletLayerStyle = {

  default (obj: StylingMarker) {
    setMarkerStyle(obj.layer, getStarSvg('black'))
  },
  highlight (obj: StylingMarker) {
    setMarkerStyle(obj.layer, getStarSvg(highlighColor))
  },
  selected (obj: StylingMarker) {
    setMarkerStyle(obj.layer, getStarSvg('orangered'))
  }
}

const routeImageLayerStyle = {

  default (obj: StylingPolyline) {
    setPolylineStyle(obj.layer, 'red')
  },
  highlight (obj: StylingPolyline) {
    setPolylineStyle(obj.layer, highlighColor)
  },
  selected (obj: StylingPolyline) {
    setPolylineStyle(obj.layer, 'yellow')
  }
}

const imageLayerStyle = {

  default (obj: StylingMarker) {
    setMarkerStyle(obj.layer, getPhotoSvg('black'))
  },
  highlight (obj: StylingMarker) {
    setMarkerStyle(obj.layer, getPhotoSvg(highlighColor))
  },
  selected (obj: StylingMarker) {
    setMarkerStyle(obj.layer, getPhotoSvg('orangered'))
  }
}

const pitchLayerStyle = {

  default (obj: StylingPolyline) {
    setPolylineStyle(obj.layer, 'red')
  },
  highlight (obj: StylingPolyline) {
    setPolylineStyle(obj.layer, highlighColor)
  },
  selected (obj: StylingPolyline) {
    setPolylineStyle(obj.layer, 'yellow')
  }
}

const trailLayerStyle = {

  default (obj: StylingPolyline) {
    setPolylineStyle(obj.layer, 'green', '10 5')
  },
  highlight (obj: StylingPolyline) {
    setPolylineStyle(obj.layer, highlighColor, '10 5')
  },
  selected (obj: StylingPolyline) {
    setPolylineStyle(obj.layer, 'orangered', '10 5')
  }
}

const currentLocationStyle = {
  default (layer: Marker) {
    setMarkerStyle(layer, getCircleSvg('#4285F4'))
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const style: Record<string, Record<TaggedType, any>|any> = {
  map: {
    area: areaLayerStyle,
    trail: trailLayerStyle,
    pitch: null, // pitch can't be tagged on a map so no need for style
    route: routeLeafletLayerStyle,
    image: imageLayerStyle
  },
  image: {
    area: areaLayerStyle,
    trail: trailLayerStyle,
    pitch: pitchLayerStyle,
    route: routeImageLayerStyle,
    image: imageLayerStyle
  },
  currentLocation: currentLocationStyle
}

export default style
