<template>
  <v-btn
    text
    icon
    :title="'Set my current location as ' + type + ' location'"
    @click.stop="setTag()"
  >
    <v-icon>gps_fixed</v-icon>
  </v-btn>
</template>

<script>

import drawingService from '../../services/drawing.service'

export default {
  props: ['type', 'item'],
  methods: {
    setTag () {
      drawingService.setTagAtCurrentLocation(this.type, this.item)
    }
  }
}
</script>
