import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import './plugins/social-auth'

import 'material-design-icons-iconfont/dist/material-design-icons.css'
import './styles.css'

import { sync } from 'vuex-router-sync'

import wb from './registerServiceWorker'
Vue.prototype.$workbox = wb

sync(store, router, { moduleName: 'url' })

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
