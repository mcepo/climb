// import 'leaflet.gridlayer.googlemutant'
import { Map, TileLayer, control } from 'leaflet'

const first = {
  name: 'Cartodb',
  url:
    'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png'
}

const tiles = [
  // {
  //   name: "Mapbox satelite",
  //   url:
  //     "https://api.mapbox.com/styles/v4/mapbox/mapbox.satellite/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWNlcG8iLCJhIjoiY2plbzhoNGZ4MDRvejJ3cG1ucmY5dnVwMyJ9.SyFJxAI-4v75fSimj03izA"
  // },
  {
    name: 'OpenCycleMap',
    url:
      'https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=f570d731fdd34004a64587d87a02c81d'
  },
  {
    name: 'Transport',
    url:
      'https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=f570d731fdd34004a64587d87a02c81d'
  },
  {
    name: 'Landscape',
    url:
      'https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=f570d731fdd34004a64587d87a02c81d'
  },
  {
    name: 'Outdoors',
    url:
      'https://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=f570d731fdd34004a64587d87a02c81d'
  },
  {
    name: 'Transport Dark',
    url:
      'https://tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png?apikey=f570d731fdd34004a64587d87a02c81d'
  },
  {
    name: 'Spinal Map',
    url:
      'https://tile.thunderforest.com/spinal-map/{z}/{x}/{y}.png?apikey=f570d731fdd34004a64587d87a02c81d'
  },
  {
    name: 'Pioneer',
    url:
      'https://tile.thunderforest.com/pioneer/{z}/{x}/{y}.png?apikey=f570d731fdd34004a64587d87a02c81d'
  },
  {
    name: 'Mobile Atlas',
    url:
      'https://tile.thunderforest.com/mobile-atlas/{z}/{x}/{y}.png?apikey=f570d731fdd34004a64587d87a02c81d'
  },
  {
    name: 'Neighbourhood',
    url:
      'https://tile.thunderforest.com/neighbourhood/{z}/{x}/{y}.png?apikey=f570d731fdd34004a64587d87a02c81d'
  }
]

// interface GoogleTile {
//   name: string;
//   type: gridLayer.GoogleMutantType;
// }

// const googleTiles: GoogleTile[] = [
//   {
//     name: 'Google roadmap',
//     type: 'roadmap'
//   },
//   {
//     name: 'Google terrain',
//     type: 'terrain'
//   },
//   {
//     name: 'Google hybrid',
//     type: 'hybrid'
//   },
//   {
//     name: 'Google satelite',
//     type: 'satellite'
//   }
// ]

export default function (map: Map) {
  const controls = control.layers().addTo(map)

  // loading all of the other tiles to the map

  const defaultLayer = new TileLayer(first.url, {
    crossOrigin: true
  })
  map.addLayer(defaultLayer)
  controls.addBaseLayer(defaultLayer, first.name)

  tiles.forEach(tile => {
    controls.addBaseLayer(new TileLayer(tile.url), tile.name)
  })

  // loading google tiles to map

  // googleTiles.forEach((tile: GoogleTile) => {
  //   controls.addBaseLayer(gridLayer.googleMutant({
  //     type: tile.type
  //   }), tile.name)
  // })
}
