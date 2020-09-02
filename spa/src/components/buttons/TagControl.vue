<template>
  <div v-if="canTag" style="display: inline;">
    <v-btn v-if="edit" text :icon='!showText' @click.stop="editTag" title="Edit tag"  :block='showText' :class="{'menu-button': showText}">
      <v-icon>edit_location</v-icon>
      <div v-if="showText">Edit {{type}} tag</div>
    </v-btn>
    <v-btn v-else text :icon='!showText' @click.stop="createTag" title="Add tag"  :block='showText' :class="{'menu-button': showText}">
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
    showText: Boolean
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
    createTag () {
      this.closeDrawerIfMobile()
      drawingService.createTag(this.type, this.item)
    },
    editTag () {
      this.closeDrawerIfMobile()
      drawingService.editTag(this.type, this.item)
    },
    closeDrawerIfMobile () {
      if (this.$vuetify.breakpoint.mobile) {
        this.$store.commit('drawers/setLeft', false)
      }
    }
  }
})
</script>
