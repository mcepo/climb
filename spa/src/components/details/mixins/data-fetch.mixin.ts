
import store from '../../../store'

function fetchData (to) {
  const params = to.params

  params.areaId && store.dispatch('area/fetch', params.areaId)
  params.imageId && store.dispatch('image/fetch', params.imageId)
  params.routeId && store.dispatch('route/fetch', params.routeId)
}

export default {
  beforeRouteEnter (to, from, next) {
    fetchData(to)
    next()
  },
  beforeRouteUpdate (to, from, next) {
    fetchData(to)
    next()
  }
}
