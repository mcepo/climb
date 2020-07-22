<template>
    <v-snackbar absolute v-model="drawing" :timeout=0 top>
        <v-btn text @click="save">
          Save
        </v-btn>
        <v-btn text @click="discard">
          Discard
        </v-btn>
    </v-snackbar>
</template>
<script>

import { mapState } from 'vuex'

const drawingService = import('../../services/drawing.service')

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
