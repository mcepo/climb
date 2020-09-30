<template>
  <v-btn
    text
    :icon='!showText'
    :title="'Tag ' + type + ' at my current location'"
    @click.stop="setTag()"
    :block='showText'
    :class="{'menu-button': showText}"
  >
    <v-icon>gps_fixed</v-icon>
    <span v-if='showText'> Tag {{type}} at my location</span>
  </v-btn>
</template>

<script>

import drawingService from '../../services/drawing.service'

export default {
  props: {
    type: String,
    item: Object,
    showText: Boolean
  },
  methods: {
    setTag () {
      drawingService.setTagAtCurrentLocation(this.type, this.item)
    }
  }
}
</script>
