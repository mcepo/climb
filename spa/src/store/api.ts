import axios, { AxiosError } from 'axios'
import store from '.'
import router from '../router'

const baseURL = 'api/'

export { baseURL }

// add default api end point to store
const api = axios.create({
  baseURL
})

// Add a request interceptor
api.interceptors.request.use(function (config) {
  const token = store.state.auth && store.state.auth.token

  if (token) {
    config.headers.Authorization = 'Bearer ' + token
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const message = error.response.data.message || error.response.data

      store.commit('snackbar/throwError', { code: error.response.status, message })
      if (error.response.status === 404) {
        router.push('/')
      }
    }

    return Promise.reject(error)
  }
)

export default api
