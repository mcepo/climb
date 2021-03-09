<template>
        <v-btn
          v-if='canGetDirections'
          icon
          title="Get directions for this area"
          @click="openInGoogle()"
        >
          <v-icon>directions_car</v-icon>
        </v-btn>
</template>

<script>

import typeService from '../../services/type.service'

export default {

  props: [
    'type',
    'item'
  ],

  computed: {
    canGetDirections () {
      return typeService.canGetDirections(this.type, this.item)
    }
  },

  methods: {
    openInGoogle () {
      const coordinates = this.item.map_tag.geometry.coordinates
      const win = window.open('https://www.google.com/maps/dir/?api=1&travelmode=driving&destination=' + coordinates[1] + ',' + coordinates[0], '_blank')
      win.focus()
    }
  }
}
</script>
