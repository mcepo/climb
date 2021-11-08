import { Store } from 'vuex'
import { RootState } from '..'
import { set, get } from 'idb-keyval'

export default function (store: Store<RootState>) {
  const storeKey = 'state'

  get(storeKey).then((state) => {
    if (typeof state === 'object' && state !== null) {
      const auth = store.state.auth

      // if user logges with token keep auth data
      if (auth?.user !== undefined) {
        state = { ...state, auth }
      }

      typeof state === 'object' && store.replaceState({ ...store.state, ...state })
    }
  })

  const storageTimeout = 1000

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
    cancelToken && clearTimeout(cancelToken)
    cancelToken = setTimeout(() => update(state), storageTimeout)
  })
}
