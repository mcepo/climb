<template>
  <v-container>
    <v-layout row v-if="item.altitude[0] || item.altitude[1]">
      <div class="stat_name">
        <strong>Altitude:</strong>
      </div>
      <div>{{ item.altitude[0] + 'm - ' + item.altitude[1] + 'm' }}</div>
    </v-layout>
    <v-layout row v-if='hasOrientation'>
      <div class="stat_name">
        <strong>Orientation:</strong>
      </div>
      <div>{{orientation}}</div>
    </v-layout>
    <v-layout row>
      <div class="stat_name">
        <strong>Tag coverage:</strong>
      </div>
      <div>{{ (item.tag_coverage * 100).toFixed(2) }} %</div>
    </v-layout>
    <v-layout row>
      <div class="stat_name">
        <strong>Photos:</strong>
      </div>
      <div>{{ item.image_count }}</div>
    </v-layout>
    <v-layout row>
      <div class="stat_name">
        <strong>Trails:</strong>
      </div>
      <div>{{ item.trail_count }}</div>
    </v-layout>
    <v-layout row v-for="id in Object.keys(routeStats)" :key="id">
      <div class="stat_name">
        <strong>{{ routeType(id) }}:</strong>
      </div>
      <div>{{ routeStats[id] }}</div>
    </v-layout>
  </v-container>
</template>
<style>
.stat_name {
  width: 120px;
}
</style>
<script>
import Vue from 'vue'

import typeService, { ItemType } from '../../services/type.service'

export default Vue.extend({
  props: ['item'],
  computed: {
    routeStats () {
      const routeStats = {}

      this.item &&
        this.item.route_stats.forEach((count, index) => {
          if (count !== 0) routeStats[index] = count
        })

      return routeStats
    },
    hasOrientation () {
      return this.item && typeService.hasOrientation(ItemType.Area, this.item.type_id)
    },
    orientation () {
      return typeService.orientation.getLabel(this.item.orientation)
    }
  },
  methods: {
    routeType (typeId) {
      return typeService.getTypeName(ItemType.Route, parseInt(typeId))
    }
  }
})
</script>
