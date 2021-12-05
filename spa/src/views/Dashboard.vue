<template>
  <v-app>
    <nav-bar></nav-bar>

    <v-main style='padding:0px' v-if='loadMain'>
      <drawing-actionbar></drawing-actionbar>
      <router-view name='map'></router-view>
    </v-main>

    <notification-snackbar></notification-snackbar>

  </v-app>
</template>

<script>
// @ is an alias to /src
import Vue from 'vue'
import DrawingActionbar from '../components/common/DrawingActionbar.vue'
import NotificationSnackbar from '../components/common/NotificationSnackbar.vue'
import NavBar from '../components/common/NavBar.vue'
import 'leaflet/dist/leaflet.css'

import drawers from '../services/drawer.service'

export default Vue.extend({

  components: {
    DrawingActionbar,
    NavBar,
    NotificationSnackbar
  },
  computed: {
    loadMain () {
      return window.innerWidth > 500 || drawers.state.left === false
    }
  }
})
</script>

<style>
.map{
  height: 100vh;
}
</style>
