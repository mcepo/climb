<template>
  <v-btn
    text
    :icon='!showText'
    :title="'Tag ' + type + ' at my current location'"
    @click="setTag()"
    :block='showText'
    :class="{'menu-button': showText}"
  >
    <v-icon>gps_fixed</v-icon>
    <span v-if='showText'> Tag {{type}} at my location</span>
  </v-btn>
</template>

<script>

export default {
  props: {
    type: String,
    item: Object,
    showText: Boolean
  },
  methods: {
    setTag () {
      import(/* webpackChunkName: "drawing.service" */ '../../services/drawing.service')
        .then(drawingService => {
          drawingService.default.setTagAtCurrentLocation(this.type, this.item)
        })
    }
  }
}
</script>
