<template>
    <v-snackbar absolute v-model="drawing" :timeout=0 top class='action-snackbar'>
        <v-btn text @click="save" class='ma-0 pa-0'>
          Save
        </v-btn>
        <v-btn text @click="discard" class='ma-0 pa-0'>
          Discard
        </v-btn>
    </v-snackbar>
</template>

<style>
.action-snackbar{
  margin: auto;
  max-width:200px;
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
