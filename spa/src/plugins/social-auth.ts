import Vue from 'vue'
import VueSocialauth from 'vue-social-auth'
import api from '../store/api'

Vue.use(VueSocialauth, {
  providers: {
    google: {
      clientId: '272921548264-ulgt9t470ppue02lr2n6a6n4su1rh42s.apps.googleusercontent.com',
      redirectUri: 'http://localhost:8081' // Your client app URL
    }
  }
})

Object.defineProperties(Vue.prototype, {

  axios: {
    get () {
      return api
    }
  },

  $http: {
    get () {
      return api
    }
  }

})
