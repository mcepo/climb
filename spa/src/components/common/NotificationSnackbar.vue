<template>
    <v-snackbar :color='state.status' v-model='show' :timeout='timeout' bottom style='z-index: 3000'>
        <div v-html='state.text'></div>
        <v-btn icon text @click="show = false"><v-icon>close</v-icon></v-btn>
    </v-snackbar>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  computed: {
    state () {
      return this.$store.state.snackbar
    },
    timeout () {
      return 1000 + 100 * this.state.text.length
    },
    show: {
      get () {
        return this.$store.state.snackbar.show
      },
      set () {
        return this.$store.commit('snackbar/close')
      }
    }
  }
})
</script>
