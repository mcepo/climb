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
    if (store.state.online === false) {
      store.commit('snackbar/show', 'No internet connection, changes will be saved when connection returns.')

      if (error.config.method === 'put') {
        return Promise.resolve()
      }

      return Promise.reject(error)
    }

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
