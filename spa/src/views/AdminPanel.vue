<template>
  <v-app>
    <nav-bar></nav-bar>

    <v-main>
      <router-view name='content'></router-view>
    </v-main>

    <notification-snackbar></notification-snackbar>
  </v-app>
</template>

<script>
// @ is an alias to /src
import Vue from 'vue'
import NotificationSnackbar from '../components/common/NotificationSnackbar.vue'
import NavBar from '../components/common/NavBar.vue'

export default Vue.extend({

  components: {
    NavBar,
    NotificationSnackbar
  }
})
</script>
