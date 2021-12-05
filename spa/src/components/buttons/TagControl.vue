<template>
  <div v-if="canTag" style="display: inline;">
    <v-btn v-if="edit" text :icon='!showText' @click="editTag($event)" :title="'Edit ' + addingTypeText"  :block='showText' :class="{'menu-button': showText}">
      <v-icon>edit_location</v-icon>
      <div v-if="showText">Edit {{type}} {{addingTypeText}}</div>
    </v-btn>
    <v-btn v-else text :icon='!showText' @click="createTag($event)" :title="'Add ' + addingTypeText"  :block='showText' :class="{'menu-button': showText}">
      <v-icon>add_location</v-icon>
      <div v-if="showText">Add {{type}} {{addingTypeText}}</div>
    </v-btn>
  </div>
</template>

<script>
import Vue from 'vue'
import drawers from '../../services/drawer.service'
import { ItemType } from '../../services/type.service'

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
    },
    addingTypeText () {
      if (ItemType.Area === this.type || (ItemType.Route === this.type && !this.$store.getters.imageOpen)) {
        return 'location'
      }

      return 'topo'
    }
  },
  methods: {
    createTag (e) {
      this.stop && e.stopPropagation()
      this.closeDrawerIfMobile()
      import(/* webpackChunkName: "drawing.service" */ '../../services/drawing.service')
        .then(drawingService => {
          drawingService.default.createTag(this.type, this.item)
        })
    },
    editTag (e) {
      this.stop && e.stopPropagation()
      this.closeDrawerIfMobile()
      import(/* webpackChunkName: "drawing.service" */ '../../services/drawing.service')
        .then(drawingService => {
          drawingService.default.editTag(this.type, this.item)
        })
    },
    closeDrawerIfMobile () {
      if (this.$vuetify.breakpoint.xs) {
        drawers.setLeft(false)
      }
    }
  }
})
</script>
