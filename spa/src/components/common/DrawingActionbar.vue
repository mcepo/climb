<template>
    <v-snackbar v-if='drawing' absolute v-model="drawing" :timeout=-1 top class='action-snackbar'>
        <div class='d-flex flex-row justify-center'>
            <v-btn text @click="save">
                Save
            </v-btn>
            <v-btn text @click="discard">
                Discard
            </v-btn>
        </div>
    </v-snackbar>
</template>

<style scoped>
.action-snackbar{
  margin: auto;
  max-width:150px;
  top:70px;
  z-index:199;
}
</style>

<script>

import { mapState } from 'vuex'

export default {

  computed: {
    ...mapState(['drawing'])
  },
  methods: {
    save () {
      import(/* webpackChunkName: "drawing.service" */ '../../services/drawing.service')
        .then(drawingService => {
          drawingService.default.storeTag()
        })
    },
    discard () {
      import(/* webpackChunkName: "drawing.service" */ '../../services/drawing.service')
        .then(drawingService => {
          drawingService.default.discardLayer()
        })
    }
  }
}
</script>
