<template>
  <table>
    <tbody>
      <tr v-if="item.altitude[0] !== null && item.altitude[1] !== null">
        <td class='stat_name'>Altitude</td>
        <td>{{ item.altitude[0] + 'm - ' + item.altitude[1] + 'm' }}</td>
      </tr>
      <tr v-if='hasOrientation'>
        <td class='stat_name'>Orientation</td>
        <td>{{orientation}}</td>
      </tr>
      <tr>
        <td class='stat_name'>Topos coverage</td>
        <td>{{ (item.tag_coverage * 100).toFixed(2) }} %</td>
      </tr>
      <tr>
        <td class='stat_name'>Photos</td>
        <td>{{ item.image_count }}</td>
      </tr>
      <tr>
        <td class='stat_name'>Trails</td>
        <td>{{ item.trail_count }}</td>
      </tr>
      <tr v-for="id in Object.keys(routeStats)" :key="id">
        <td class='stat_name'>{{ routeType(id) }}</td>
        <td>{{ routeStats[id] }}</td>
      </tr>
    </tbody>
  </table>
</template>
<style>
.stat_name {
  font-weight: bold;
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

      this.item && this.item.route_stats &&
        this.item.route_stats.forEach((count, index) => {
          if (count !== 0) routeStats[index] = count
        })

      return routeStats
    },
    hasOrientation () {
      return this.item &&
        this.item.orientation !== null &&
        typeService.hasOrientation(ItemType.Area, this.item.type_id)
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
