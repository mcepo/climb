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

import drawingService from '../../services/drawing.service'

import { mapState } from 'vuex'

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
