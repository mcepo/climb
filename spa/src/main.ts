import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

import './material-design-icons.css'
import './styles.css'

import { App as CapacitorApp } from '@capacitor/app'

import { sync } from 'vuex-router-sync'

// TODO: disable serviceworker for android
import wb from './registerServiceWorker'
Vue.prototype.$workbox = wb

sync(store, router, { moduleName: 'url' })

Vue.config.productionTip = false

// mobile backbutton listener

CapacitorApp.addListener('backButton', () => {
  if (window.history.length < 5 && router.currentRoute.path === '/') {
    CapacitorApp.exitApp()
  } else {
    router.back()
  }
})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
  created () {
    // login if a token is in url
    // used for "forgotten password" and "verify email" features

    // check only if a user isn't logged in
    if (!this.$store.getters['auth/check']) {
      // get query from url
      const urlParams = new URLSearchParams(window.location.search)

      // get token from query
      const token = urlParams.get('token')

      // if there is a token in url login user
      if (token) {
        // login user to application
        this.$store.dispatch('auth/login', urlParams.get('token'))

        // remove token from url
        const uri = window.location.toString()
        const cleanUri = uri.substring(0, uri.indexOf('?'))
        window.history.replaceState({}, document.title, cleanUri)
      }
    }
  }
}).$mount('#app')
