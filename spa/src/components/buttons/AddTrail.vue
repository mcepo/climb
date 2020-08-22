<template>
  <div v-if="!drawing" style="display: inline;">
    <v-btn text icon @click.stop="createTag" title="Add trail">
      <v-icon>timeline</v-icon>
    </v-btn>
  </div>
</template>

<script>
import Vue from 'vue'
import drawingService from '../../services/drawing.service'

export default Vue.extend({
  props: {
    area: Object
  },
  computed: {
    drawing () {
      return this.$store.state.drawing
    }
  },
  methods: {
    createTag () {
      // i am packing area id in the item id field, because
      // i need it in the back end to know in what area is this 
      // trail located
      // not a very good solution, but the easiest for now
      drawingService.createTag('trail', {id: this.area.id})
    }
  }
})
</script>