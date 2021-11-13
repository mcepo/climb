import { Store } from 'vuex'
import { RootState } from '..'
import { Filesystem, Directory, ReadFileResult } from '@capacitor/filesystem'

export default function (store: Store<RootState>) {
  const storeKey = 'state'

  Filesystem.readFile({
    path: storeKey,
    directory: Directory.Cache
  }).then(({ data }: ReadFileResult) => {
    if (!data) return

    let state = JSON.parse(data)

    if (typeof state === 'object' && state !== null) {
      const auth = store.state.auth

      // if user logges with token keep auth data
      if (auth?.user !== undefined) {
        state = { ...state, auth }
      }

      typeof state === 'object' && store.replaceState({ ...store.state, ...state })
    }
  })

  const storageTimeout = 300

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

    try {
      Filesystem.writeFile({
        path: storeKey,
        data: JSON.stringify(saveState),
        directory: Directory.Cache
      })
    } catch (e) {
      console.log(e)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  store.subscribe((mutation: any, state: RootState) => {
    cancelToken && clearTimeout(cancelToken)
    cancelToken = setTimeout(() => update(state), storageTimeout)
  })
}
