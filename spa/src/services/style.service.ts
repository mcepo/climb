import { DivIcon, Marker, Icon, Polyline } from 'leaflet'
import { Area, TaggedType, Route } from '@/models'
import { svgIconUrl } from '../utils/svg'

interface StylingMarker {
  layer: Marker;
  item: Area|Route;
}

interface StylingPolyline {
  layer: Polyline;
  item: Route;
}

// #ff0000 - crvena
// #ff9900 - narančasta
// #ffff00 - žuta
// #00ff00 - zelena
// #00ffff - plava
// #6600ff - ljubičasta
// #ff00ff - ružičasta

const highlighColor = '#3490dc'

// currentlly unused
// function getStarSvg (color: string) {
//   return '<path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" fill="' + color + '"/>'
// }

function getCircleSvg (color: string) {
  return '<circle cx="12" cy="12" r="6" fill="' + color + '"/>'
}

function getPhotoSvg (color: string) {
  return '<path d="M0 0h24v24H0z" fill="none"/><circle cx="12" cy="12" r="3.2" fill="' + color + '"/><path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" fill="' + color + '"/>'
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

// 73 ocjene trenutno imamo
export const routeDifficultyGradeColors = ['#01579B', '#43A047', '#43A047', '#43A047', '#43A047', '#43A047', '#43A047', '#43A047', '#388E3C', '#388E3C', '#388E3C', '#388E3C', '#388E3C', '#388E3C', '#388E3C', '#388E3C', '#388E3C', '#388E3C', '#388E3C', '#1B5E20', '#1B5E20', '#1B5E20', '#1B5E20', '#1B5E20', '#1B5E20', '#1B5E20', '#1B5E20', '#1B5E20', '#1B5E20', '#1B5E20', '#1B5E20', '#FB8C00', '#FB8C00', '#FB8C00', '#FB8C00', '#F57C00', '#F57C00', '#F57C00', '#F57C00', '#EF6C00', '#EF6C00', '#EF6C00', '#EF6C00', '#E53935', '#E53935', '#E53935', '#E53935', '#D32F2F', '#D32F2F', '#D32F2F', '#D32F2F', '#C62828', '#C62828', '#C62828', '#C62828', '#8E24AA', '#8E24AA', '#8E24AA', '#8E24AA', '#7B1FA2', '#7B1FA2', '#7B1FA2', '#7B1FA2', '#6A1B9A', '#6A1B9A', '#6A1B9A', '#6A1B9A', '#4A148C', '#4A148C', '#4A148C', '#4A148C', '#4A148C', '#4A148C']

const areaLayerStyle = {

  style (layer: Marker, className: string, item: Area|Route, zIndex?: number) {
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
    setMarkerStyle(obj.layer, getCircleSvg('black'))
  },
  highlight (obj: StylingMarker) {
    setMarkerStyle(obj.layer, getCircleSvg(highlighColor))
  },
  selected (obj: StylingMarker) {
    setMarkerStyle(obj.layer, getCircleSvg('orangered'))
  }
}

const routeImageLayerStyle = {

  default (obj: StylingPolyline) {
    const routeDifficulty = obj.item.grades.find((grade) => {
      return grade[0] === 10
    })

    obj.layer.setStyle({
      color: routeDifficultyGradeColors[routeDifficulty ? routeDifficulty[1] : 0],
      weight: 3
    })
  },
  highlight (obj: StylingPolyline) {
    obj.layer.setStyle({
      color: highlighColor,
      weight: 5
    })
  },
  selected (obj: StylingPolyline) {
    obj.layer.setStyle({
      color: 'yellow',
      weight: 5
    })
    obj.layer.bringToFront()
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
    const routeDifficulty = obj.item.grades.find((grade) => {
      return grade[0] === 10
    })

    obj.layer.setStyle({
      color: routeDifficultyGradeColors[routeDifficulty ? routeDifficulty[1] : 0],
      weight: 3
    })
  },
  highlight (obj: StylingPolyline) {
    obj.layer.setStyle({
      color: highlighColor,
      weight: 5
    })
  },
  selected (obj: StylingPolyline) {
    obj.layer.setStyle({
      color: 'yellow',
      weight: 5
    })
    obj.layer.bringToFront()
  }
}

const trailLayerStyle = {

  dashArray: '10 5',

  default (obj: StylingPolyline) {
    obj.layer.setStyle({
      color: 'green',
      dashArray: this.dashArray

    })
  },
  highlight (obj: StylingPolyline) {
    obj.layer.setStyle({
      color: highlighColor,
      dashArray: this.dashArray

    })
  },
  selected (obj: StylingPolyline) {
    obj.layer.setStyle({
      color: 'orangered',
      dashArray: this.dashArray
    })
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
