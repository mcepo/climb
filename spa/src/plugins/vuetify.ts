import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import Touch from 'vuetify/lib/directives/touch'

Vue.use(Vuetify, {
  directives: {
    Touch
  }
})

const vuetify = new Vuetify({
  icons: {
    iconfont: 'md'
  }
})

export default vuetify
