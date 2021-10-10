<template>
  <div v-if="!drawing" style="display: inline;">
    <v-btn text :icon='!showText' @click="createTag" title="Add trail" :block='showText' :class="{'menu-button': showText}">
      <v-icon>timeline</v-icon>
      <span v-if='showText'>Add trail</span>
    </v-btn>
  </div>
</template>

<script>
import Vue from 'vue'
import drawingService from '../../services/drawing.service'

import drawers from '../../services/drawer.service'

export default Vue.extend({
  props: {
    area: Object,
    showText: Boolean
  },
  computed: {
    drawing () {
      return this.$store.state.drawing
    }
  },
  methods: {
    createTag () {
      this.closeDrawerIfMobile()
      // i am packing area id in the item id field, because
      // i need it in the back end to know in what area is this
      // trail located
      // not a very good solution, but the easiest for now
      drawingService.createTag('trail', { id: this.area.id })
    },
    closeDrawerIfMobile () {
      if (this.$vuetify.breakpoint.xs) {
        drawers.setLeft(false)
      }
    }
  }
})
</script>
