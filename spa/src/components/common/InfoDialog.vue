<template>
  <div class="text-center">
    <v-dialog v-model="show" width="500">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          {{title}}
        </v-card-title>

        <v-card-text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
          {{description}}
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="show = false"> I accept </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

import { mapState } from 'vuex'

export default {
  data () {
    return {
      dialog: true
    }
  },
  computed: {
    ...mapState({
      title: s => s.infoDialog.title,
      description: s => s.infoDialog.description
    }),
    show: {
      get () {
        return this.$store.state.infoDialog.show
      },
      set () {
        this.$store.commit('infoDialog/close')
      }
    }
  }
}
</script>
