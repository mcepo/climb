import '../../node_modules/leaflet/dist/leaflet.css'
import { svgIconUrl } from '../utils/svg'
import { Marker, Icon } from 'leaflet'

const _defaultIcon = new Icon({
  iconUrl: svgIconUrl('<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/><path d="M0 0h24v24H0z" fill="none"/>'),
  iconSize: [20, 32],
  iconAnchor: [10, 24]
})

Marker.prototype.options.icon = _defaultIcon
