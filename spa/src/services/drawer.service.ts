import Vue from 'vue'
import VueCompositionApi, { reactive } from '@vue/composition-api'

Vue.use(VueCompositionApi)

export default reactive({
  left: true,
  right: false
})
