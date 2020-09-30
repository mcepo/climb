<template>
  <popup :tag='tag' :item='item' type='area'>
    <template v-slot:header>
      <v-card-subtitle class='pa-0'>{{type}}</v-card-subtitle>
    </template>
    <template v-slot:item>
      <h2>{{item.name}}</h2>
    </template>
    <template v-slot:content>
      <v-container>
        <v-layout row v-if='item.altitude[0] || item.altitude[1]'>
          <div class='stat_name'>
            <strong>Altitude:</strong>
          </div>
          <div>{{item.altitude[0] + 'm - ' + item.altitude[1] + 'm'}}</div>
        </v-layout>
        <v-layout row>
          <div class='stat_name'>
            <strong>Tag coverage:</strong>
          </div>
          <div>{{ item.tag_coverage * 100 }} %</div>
        </v-layout>
        <v-layout row>
          <div class='stat_name'>
            <strong># of Photos:</strong>
          </div>
          <div>{{item.image_count}}</div>
        </v-layout>
        <v-layout row>
          <div class='stat_name'>
            <strong># of Trail tags:</strong>
          </div>
          <div>{{item.trail_count}}</div>
        </v-layout>
        <v-layout row v-for='id in Object.keys(routeStats)' :key="id">
          <div class='stat_name'>
            <strong>{{ routeType(id)}}:</strong>
          </div>
          <div>{{routeStats[id]}}</div>
        </v-layout>
      </v-container>
    </template>
  </popup>
</template>

<style>

.stat_name {
  width: 100px;
}

</style>
<script>
import Vue from 'vue'
import Popup from './Popup'

import typeService, { ItemType } from '../../services/type.service'

export default Vue.extend({
  props: ['item', 'tag'],
  components: {
    Popup
  },
  computed: {
    type () {
      return typeService.getTypeName(ItemType.Area, this.item.type_id)
    },
    routeStats () {
      const routeStats = {}

      this.item && this.item.route_stats.forEach((count, index) => {
        if (count !== 0) routeStats[index] = count
      })

      return routeStats
    }
  },
  methods: {
    routeType (typeId) {
      return typeService.getTypeName(ItemType.Route, parseInt(typeId))
    }
  }
})
</script>
