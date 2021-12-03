
import store from '../../../store'

function fetchData (to, from) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params: any = {}

  for (const key of Object.keys(to.params)) {
    if (!from.params[key] || (from.params[key] !== to.params[key])) {
      params[key] = to.params[key]
    }
  }

  params.areaId && store.dispatch('area/fetch', params.areaId)
  params.imageId && store.dispatch('image/fetch', params.imageId)
  params.routeId && store.dispatch('route/fetch', params.routeId)
}

export default {
  beforeRouteEnter (to, from, next) {
    fetchData(to, from)
    next()
  },
  beforeRouteUpdate (to, from, next) {
    fetchData(to, from)
    next()
  }
}
