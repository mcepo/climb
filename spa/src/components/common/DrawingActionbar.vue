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

import drawingService from '../../services/drawing.service'

export default {

  computed: {
    ...mapState(['drawing'])
  },
  methods: {
    save () {
      drawingService.storeTag()
    },
    discard () {
      drawingService.discardLayer()
    }
  }
}
</script>
