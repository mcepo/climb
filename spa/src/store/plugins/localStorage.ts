import { Store } from 'vuex'
import { RootState } from '..'
import { set, get } from 'idb-keyval'

export default function (store: Store<RootState>) {
  const storeKey = 'state'

  get(storeKey).then(state => {
    typeof state === 'object' &&
    state !== null &&
    store.replaceState({ ...store.state, ...state })
  })

  const skipMutations = [
    'highlight/set',
  ]

  const storageTimeout = 5000

  let cancelToken: number

  function update (state: RootState) {
    const saveState = {
      auth: state.auth,
      area: state.area,
      route: state.route,
      image: state.image,
      trail: state.trail,
      pitch: state.pitch
    }

    set(storeKey, saveState)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  store.subscribe((mutation: any, state: RootState) => {
    if (skipMutations.includes(mutation.type)) {
      return
    }
    cancelToken && clearTimeout(cancelToken)
    cancelToken = setTimeout(() => update(state), storageTimeout)
  })
}
