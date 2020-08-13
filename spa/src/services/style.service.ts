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

function getStarSvg (color: string) {
  return '<path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" fill="' + color + '"/>'
}

function getCircleSvg (color: string) {
  return '<circle cx="12" cy="12" r="6" fill="' + color + '"/>'
}

function setPolylineStyle (layer: Polyline, color: string) {
  layer.setStyle(
    {
      color
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

  style (layer: Marker, className: string, name: string) {
    const html = '<div class="climb-area">' + name + '</div>'

    layer.setIcon(
      new DivIcon({
        className,
        html
      })
    )
  },

  default (obj: StylingMarker) {
    this.style(obj.layer, 'climb-area-none', obj.item.name)
  },
  highlight (obj: StylingMarker) {
    this.style(obj.layer, 'climb-area-highlight', obj.item.name)
  },
  selected (obj: StylingMarker) {
    this.style(obj.layer, 'climb-area-selected', obj.item.name)
  }
}

const routeLeafletLayerStyle = {

  default (obj: StylingMarker) {
    setMarkerStyle(obj.layer, getStarSvg('red'))
  },
  highlight (obj: StylingMarker) {
    setMarkerStyle(obj.layer, getStarSvg('blue'))
  },
  selected (obj: StylingMarker) {
    setMarkerStyle(obj.layer, getStarSvg('orange'))
  }
}

const routeImageLayerStyle = {

  default (obj: StylingPolyline) {
    setPolylineStyle(obj.layer, 'red')
  },
  highlight (obj: StylingPolyline) {
    setPolylineStyle(obj.layer, 'blue')
  },
  selected (obj: StylingPolyline) {
    setPolylineStyle(obj.layer, 'orange')
  }
}

const imageLayerStyle = {

  default (obj: StylingMarker) {
    setMarkerStyle(obj.layer, getCircleSvg('red'))
  },
  highlight (obj: StylingMarker) {
    setMarkerStyle(obj.layer, getCircleSvg('blue'))
  },
  selected (obj: StylingMarker) {
    setMarkerStyle(obj.layer, getCircleSvg('orange'))
  }
}

const pitchLayerStyle = {

  default (obj: StylingPolyline) {
    setPolylineStyle(obj.layer, 'red')
  },
  highlight (obj: StylingPolyline) {
    setPolylineStyle(obj.layer, 'blue')
  },
  selected (obj: StylingPolyline) {
    setPolylineStyle(obj.layer, 'orange')
  }
}

const trailLayerStyle = {

  default (obj: StylingPolyline) {
    setPolylineStyle(obj.layer, 'green')
  },
  highlight (obj: StylingPolyline) {
    setPolylineStyle(obj.layer, 'blue')
  },
  selected (obj: StylingPolyline) {
    setPolylineStyle(obj.layer, 'orange')
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const style: Record<string, Record<TaggedType, any>> = {
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
  }
}

export default style
