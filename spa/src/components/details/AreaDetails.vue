<template>
  <details-loading v-if="loading"></details-loading>
  <details-layout v-else :item="area" :type="type">
    <template slot="item-details">
      <v-divider></v-divider>
      <v-layout row v-if='area.altitude[0] || area.altitude[1]'>
        <v-flex>
          <strong>Altitude:</strong>
        </v-flex>
        <v-flex>{{area.altitude[0] + 'm - ' + area.altitude[1] + 'm'}}</v-flex>
      </v-layout>
      <v-layout row v-if='hasOrientation'>
        <v-flex>
          <strong>Orientation:</strong>
        </v-flex>
        <v-flex>{{orientation}}</v-flex>
      </v-layout>
      <statistics-chart :type='type' :stats='stats' v-for="(stats, type) in area.statistics" :key="type + area.id"></statistics-chart>
      <length-chart v-if='lengthStatistics !== 0' :stats='area.lengthStatistics' :key="'length' + area.id"></length-chart>
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

import typeService, { ItemType } from '../../services/type.service'

export default {
  computed: {
    ...mapGetters({
      area: 'area/get'
    }),
    loading () {
      return this.$store.state.area.loading || !this.area
    },
    hasOrientation () {
      return this.area && typeService.hasOrientation(this.type, this.area.type_id)
    },
    type () {
      return ItemType.Area
    },
    moderators () {
      if (!this.area || !this.area.moderators) return []

      const moderators = []

      this.area.moderators.forEach(moderatorId => {
        moderators.push(this.$store.getters['user/find'](moderatorId))
      })

      return moderators
    },
    lengthStatistics () {
      return (this.area && this.area.lengthStatistics) ? this.area.lengthStatistics.length : 0
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
