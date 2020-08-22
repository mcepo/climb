<template>
  <div v-if="!drawing" style="display: inline;">
    <v-btn v-if="edit" text icon @click.stop="editTag" title="Edit tag">
      <v-icon>edit_location</v-icon>
    </v-btn>
    <v-btn v-else text icon @click.stop="createTag" title="Add tag">
      <v-icon>add_location</v-icon>
    </v-btn>
  </div>
</template>

<script>
import Vue from 'vue'
import drawingService from '../../services/drawing.service'

export default Vue.extend({
  props: {
    type: String,
    item: Object
  },
  computed: {
    drawing () {
      return this.$store.state.drawing
    },
    edit () {
      return this.$store.getters.hasTag(this.type + this.item.id)
    }
  },
  methods: {
    createTag () {
      this.closeDrawerIfMobile()
      drawingService.createTag(this.type, this.item)
    },
    editTag () {
      this.closeDrawerIfMobile()
      drawingService.editTag(this.type, this.item)
    },
    closeDrawerIfMobile () {
      if (window.innerWidth < 1264) {
        /// hack
        this.$store.commit('drawers/setLeft', false)
      }
    }
  }
})
</script>
