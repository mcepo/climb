<template>
  <div v-if="canTag" style="display: inline;">
    <v-btn v-if="edit" text :icon='!showText' @click="editTag($event)" title="Edit tag"  :block='showText' :class="{'menu-button': showText}">
      <v-icon>edit_location</v-icon>
      <div v-if="showText">Edit {{type}} tag</div>
    </v-btn>
    <v-btn v-else text :icon='!showText' @click="createTag($event)" title="Add tag"  :block='showText' :class="{'menu-button': showText}">
      <v-icon>add_location</v-icon>
      <div v-if="showText">Add {{type}} tag</div>
    </v-btn>
  </div>
</template>

<script>
import Vue from 'vue'
import drawingService from '../../services/drawing.service'

export default Vue.extend({
  props: {
    type: String,
    item: Object,
    showText: Boolean,
    stop: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    canTag () {
      return !this.$store.state.drawing
    },
    edit () {
      return this.$store.getters.hasTag(this.type + this.item.id)
    }
  },
  methods: {
    createTag (e) {
      this.stop && e.stopPropagation()
      this.closeDrawerIfMobile()
      drawingService.createTag(this.type, this.item)
    },
    editTag (e) {
      this.stop && e.stopPropagation()
      this.closeDrawerIfMobile()
      drawingService.editTag(this.type, this.item)
    },
    closeDrawerIfMobile () {
      if (this.$vuetify.breakpoint.xs) {
        this.$store.commit('drawers/setLeft', false)
      }
    }
  }
})
</script>
