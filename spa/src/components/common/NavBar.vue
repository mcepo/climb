<template>
  <div>
    <!-- has to have z-index in style, can't be a class because it get run over -->
    <v-navigation-drawer
      v-model="drawers.left"
      app
      clipped
      width="400"
      id="drawerLeft"
      fill-height
      style='z-index:200;'
      stateless
      v-touch='{
          left: () => swipeLeft()
        }'
    >
      <router-view></router-view>
    </v-navigation-drawer>

    <v-app-bar app clipped-right clipped-left style='z-index:900'>
      <v-app-bar-nav-icon @click.stop="drawers.left = !drawers.left"></v-app-bar-nav-icon>
      <ancestor-breadcrumbs :trim=3></ancestor-breadcrumbs>
      <v-spacer></v-spacer>
      <v-menu
        left
        bottom
        :close-on-click='true'
        :close-on-content-click="true"
        z-index='901'
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>more_vert</v-icon>
          </v-btn>
        </template>

        <v-list v-if='checkAuth()'>
          <v-list-item>
            <v-list-item-title><v-icon>perm_identity</v-icon>{{getUserName()}}</v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item @click="openAuthorizedForm({form: {component: 'change-password-form', params: null}})">
            <v-list-item-title>Change password</v-list-item-title>
          </v-list-item>
          <v-list-item @click="logout()">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item v-if='installable' @click='installApp()'>
            <v-list-item-title><v-icon>mobile_friendly</v-icon>Install app</v-list-item-title>
          </v-list-item>
          <v-list-item @click='$router.push("/admin")'>
            <v-list-item-title><v-icon>build</v-icon>Admin area</v-list-item-title>
          </v-list-item>
        </v-list>

        <v-list v-else>
          <v-list-item @click="openForm({component: 'login-form', params: null})">
            <v-list-item-title>Sign in / Register</v-list-item-title>
          </v-list-item>
          <v-divider v-if='installable'></v-divider>
          <v-list-item v-if='installable' @click='installApp()'>
            <v-list-item-title><v-icon>mobile_friendly</v-icon>Install app</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

    </v-app-bar>
      <!-- has to have z-index in style, can't be a class because it get run over -->
    <v-navigation-drawer
      v-model="drawers.right"
      right
      clipped
      app
      width="400"
      style='z-index:201;'
      disable-resize-watcher
      disable-route-watch
      touchless
      stateless
      >
      <form-layout></form-layout>
      </v-navigation-drawer>
  </div>
</template>

<script>
// @ is an alias to /src
import Vue from 'vue'
import FormLayout from '../layouts/FormLayout'
import { mapActions, mapGetters } from 'vuex'
import AncestorBreadcrumbs from '../common/AncestorBreadcrumbs'

import drawers from '../../services/drawer.service'

export default Vue.extend({

  deferredPrompt: null,
  data () {
    return {
      installed: false,
      hasDeferrerPrompt: false
    }
  },

  setup () {
    return {
      drawers
    }
  },

  computed: {
    installable () {
      return !this.installed && this.hasDeferrerPrompt
    }
  },

  created () {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Stash the event so it can be triggered later.
      this.$options.deferredPrompt = e

      this.hasDeferrerPrompt = true
    })

    window.addEventListener('appinstalled', () => {
      this.$store.dispatch('snackbar/success', 'Succesfully installed, enjoy!')
    })

    window.addEventListener('DOMContentLoaded', () => {
      this.installed = navigator.standalone || window.matchMedia('(display-mode: standalone)').matches
    })
  },
  methods: {
    ...mapActions({
      openForm: 'form/open',
      openAuthorizedForm: 'form/authorizeAndOpen',
      logout: 'auth/logout'
    }),
    ...mapGetters({
      checkAuth: 'auth/check',
      getUserName: 'auth/username'
    }),
    swipeLeft () {
      this.drawers.left = false
    },
    installApp () {
      // Show the install prompt
      this.$options.deferredPrompt.prompt()
      // Wait for the user to respond to the prompt
      this.$options.deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          this.$store.dispatch('snackbar/success', 'Instaling on home screen')
        } else {
          this.$store.dispatch('snackbar/error', 'Not installing :(')
        }
      })
    }
  },
  components: {
    FormLayout,
    AncestorBreadcrumbs
  }
})
</script>
