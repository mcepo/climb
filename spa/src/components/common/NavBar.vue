<template>
  <div>
    <!-- has to have z-index in style, can't be a class because it get run over -->
    <v-navigation-drawer
      v-model="drawerLeft"
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
      <v-app-bar-nav-icon @click.stop="drawerLeft = !drawerLeft"></v-app-bar-nav-icon>
      <ancestor-breadcrumbs :trim=3></ancestor-breadcrumbs>
      <v-spacer></v-spacer>
      <v-menu
        left
        bottom
        v-if='checkAuth()'
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
            <v-icon>perm_identity</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item>
            <v-list-item-title>{{getUserName()}}</v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item @click="openAuthorizedForm({form: {component: 'change-password-form', params: null}})">
            <v-list-item-title>Change password</v-list-item-title>
          </v-list-item>
          <v-list-item @click="logout()">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item @click='$router.push("/admin")'>
            <v-list-item-title><v-icon>build</v-icon>Admin area</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-btn v-else text title="Sign in" @click.stop="openForm({component: 'login-form', params: null})">
        Sign in
      </v-btn>

    </v-app-bar>
      <!-- has to have z-index in style, can't be a class because it get run over -->
    <v-navigation-drawer
      v-model="drawerRight"
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

export default Vue.extend({

  computed: {
    drawerLeft: {
      get () {
        return this.$store.state.drawers.left
      },
      set (value) {
        this.$store.commit('drawers/setLeft', value)
      }
    },
    drawerRight: {
      get () {
        return this.$store.state.drawers.right
      },
      set (value) {
        this.$store.commit('drawers/setRight', value)
      }
    }
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
      this.drawerLeft = false
    }
  },
  components: {
    FormLayout,
    AncestorBreadcrumbs
  }
})
</script>
