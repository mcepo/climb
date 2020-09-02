<template>
  <details-loading v-if="loading"></details-loading>
  <details-layout v-else :item="area" type="area">
    <template slot="item-details">
      <v-divider></v-divider>
      <v-layout row v-if='area.altitude[0] || area.altitude[1]'>
        <v-flex>
          <strong>Altitude:</strong>
        </v-flex>
        <v-flex>{{area.altitude[0] + 'm - ' + area.altitude[1] + 'm'}}</v-flex>
      </v-layout>
      <v-layout row v-if='allowedOrientation'>
        <v-flex>
          <strong>Orientation:</strong>
        </v-flex>
        <v-flex>{{orientation}}</v-flex>
      </v-layout>
      <statistics-chart :type='type' :stats='stats' v-for="(stats, type) in area.statistics" :key="type + area.id"></statistics-chart>
      <length-chart v-if='area.lengthStatistics.length !== 0' :stats='area.lengthStatistics' :key="'length' + area.id"></length-chart>
      <moderator-list :moderators='moderators' :area='area'></moderator-list>
    </template>
  </details-layout>
</template>

<script>
import DetailsLayout from '../layouts/DetailsLayout.vue'
import DetailsLoading from '../common/DetailsLoading.vue'
import StatisticsChart from '../common/StatisticsChart'
import LengthChart from '../common/LengthChart'
import ModeratorList from '../lists/ModeratorList'
import { mapGetters } from 'vuex'

import gradeService from '../../services/grade.service'

import typeService from '../../services/type.service'

export default {
  computed: {
    ...mapGetters({
      area: 'area/get'
    }),
    loading () {
      return this.$store.state.area.loading || !this.area
    },
    allowedOrientation () {
      // type_id of areas that can have orientation
      return typeService.orientation.areaTypes.find((id) => id === this.area.type_id)
    },
    moderators () {
      if (!this.area && !this.area.moderators) return []

      const moderators = []

      this.area.moderators.forEach(moderatorId => {
        moderators.push(this.$store.getters['user/find'](moderatorId))
      })

      return moderators
    },
    orientation () {
      return typeService.orientation.getLabel(this.area.orientation)
    }
  },

  components: {
    DetailsLayout,
    DetailsLoading,
    ModeratorList,
    StatisticsChart,
    LengthChart
  },
  methods: {
    typeName (type) {
      return gradeService.types[type].name
    }
  }
}
</script>
