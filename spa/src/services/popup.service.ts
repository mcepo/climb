import { LatLng } from 'leaflet'
import { Feature } from './layer.service'

import popups from '../components/popups'

const popupService = {
  // i have to import these dynamicly because otherwise the router is undefined
  // in the popup component

  // NOTE *** POPUP MOUSE LOCATION ***
  // i need to pass in click location in lat lng and the map and then
  // open the popup to map, not binding it to layer

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createPopup (feature: Feature, location: LatLng) {
    const capitalizedType =
      feature.tag.tagged_type.charAt(0).toUpperCase() +
      feature.tag.tagged_type.slice(1)

    const Popup = popups[capitalizedType]

    feature.layer
      .bindPopup(
        new Popup({
          propsData: { item: feature.item, tag: feature.tag }
        }).$mount().$el
      )
      .openPopup(location)
  }
}

export default popupService
