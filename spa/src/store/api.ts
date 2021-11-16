import { Capacitor } from '@capacitor/core'
import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import store from '.'
import router from '../router'

const baseURL = Capacitor.isNativePlatform() ? 'https://climbline.net/api/' : '/api/'

export { baseURL }

// add default api end point to store
const api = axios.create({
  baseURL
})

// Add a request interceptor
api.interceptors.request.use(function (config: AxiosRequestConfig) {
  const token = store.state.auth && store.state.auth.token

  // right now i only request
  if (token && (config.url?.includes('climbline') || config.url?.includes('localhost'))) {
    config.headers.Authorization = 'Bearer ' + token
  }
  return config
})

api.interceptors.response.use(
  (response) => {
    // if a response from the server has a authentication header
    // store that header in the store
    // effectivly logging the user in
    const authHeader = response.headers.authorization

    if (authHeader) {
      const token = authHeader.split(' ')[1]

      store.dispatch('auth/login', token)
    }
    return response
  },
  (error: AxiosError) => {
    if (!store.state.online) {
      if (error.config.method === 'get') {
        store.dispatch('snackbar/error', 'Resource unavailable, working offline.')
      } else {
        store.dispatch('snackbar/show', 'No internet connection, changes not stored.')
      }

      return Promise.resolve(true)
    }

    // if we are online and the request returns 404 means user has requested something that doesn't exist on te server
    // return him to home
    if (error.response) {
      store.dispatch('snackbar/throwError', { code: error.response.status, message: error.response.data })
      if (error.response.status === 404) {
        router.push('/')
      }
    }

    return Promise.reject(error)
  }
)

export default api
