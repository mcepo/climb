<template>
    <v-snackbar v-if='state' :color='state.status' v-model='show' :timeout='timeout' bottom style='z-index: 3000'>
        <div class='d-flex flex-row justify-space-between'>
            <div v-html='state.message'></div>
            <v-btn icon text @click="show = false"><v-icon>close</v-icon></v-btn>
        </div>
    </v-snackbar>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  data () {
    return {
      show: false
    }
  },
  computed: {
    state () {
      return this.$store.getters['snackbar/get']
    },
    timeout () {
      return 1000 + 50 * this.state.message.length
    }
  },
  watch: {
    state (newState) {
      if (newState !== null) {
        Vue.nextTick(() => {
          this.show = true
        })
      }
    },
    show (newShow) {
      if (newShow === false) {
        this.$store.commit('snackbar/pop')
      }
    }
  }
})
</script>
