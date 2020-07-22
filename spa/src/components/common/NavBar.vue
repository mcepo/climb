<template>
  <div>
    <v-navigation-drawer
      v-model="drawerLeft"
      app
      width="400"
      id="drawerLeft"
      fill-height
      style="z-index:2000"
    >
      <router-view></router-view>
    </v-navigation-drawer>

    <v-app-bar app clipped-right>
      <v-app-bar-nav-icon @click.stop="drawerLeft = !drawerLeft"></v-app-bar-nav-icon>
      <router-link to="/">
      <v-toolbar-title v-text="title"></v-toolbar-title>
      </router-link>

      <v-spacer></v-spacer>

      <v-btn icon  title="Admin area" @click.stop='$router.push("/admin")'>
        <v-icon>build</v-icon>
      </v-btn>

      <v-menu
        left
        bottom
        v-if='checkAuth()'
        style='z-index: 1000'
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
          <v-list-item @click.stop="logout()">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-btn v-else text title="Sign in" @click.stop="openForm({component: 'login-form', params: null})">
        Sign in
      </v-btn>

    </v-app-bar>

    <v-navigation-drawer
      v-model="drawerRight"
      right
      clipped
      app
      width="400"
      style="z-index:2000"
      disable-resize-watcher
      >
      <form-layout></form-layout>
      </v-navigation-drawer>
  </div>
</template>

<script>
// @ is an alias to /src
import Vue from 'vue'
import FormLayout from '../layouts/FormLayout'
import { mapActions, mapGetters, mapMutations } from 'vuex'

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
    },
    title () {
      if (this.$store.state.image) {
        const captured = this.$store.state.image && this.$store.state.image.captured
        if (captured && captured.name) {
          return captured.name
        }
      }
      return 'Climbers guide'
    }
  },
  methods: {
    ...mapActions({
      openForm: 'form/open'
    }),
    ...mapGetters({
      checkAuth: 'auth/check',
      getUserName: 'auth/username'
    }),
    ...mapMutations({
      logout: 'auth/logout'
    })
  },
  components: {
    FormLayout
  }
})
</script>

<style>
.map{
  height:100%;
}
</style>
