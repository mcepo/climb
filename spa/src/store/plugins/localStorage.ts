import { Store } from 'vuex'
import { RootState } from '..'

export default function (store: Store<RootState>) {
  const storeKey = 'state'

  const state = localStorage.getItem(storeKey)

  if (state) {
    const savedState = { ...store.state, ...JSON.parse(state) }

    store.replaceState(savedState)
  }
  const mutationsForStorage = [
    'area/loading', 'route/loading', 'image/loading'
  ]

  const storageTimeout = 5000

  let cancelToken: number

  function update (state: RootState) {
    const saveState = {
      area: state.area,
      route: state.route,
      image: state.image,
      trail: state.trail
    }

    localStorage.setItem(storeKey, JSON.stringify(saveState))
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  store.subscribe((mutation: any, state: RootState) => {
    if (mutationsForStorage.includes(mutation.type)) {
      cancelToken && clearTimeout(cancelToken)
      cancelToken = setTimeout(() => update(state), storageTimeout)
    }
  })
}
