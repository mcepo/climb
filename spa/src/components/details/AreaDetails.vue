<template>
  <details-loading v-if="loading"></details-loading>
  <details-layout v-else :item="area" :type="type">
    <template slot="item-details">
      <area-stats :item='area'></area-stats>
      <v-divider></v-divider>
      <statistics-chart :type='type' :stats='stats' v-for="(stats, type) in area.grade_stats" :key="type + area.id"></statistics-chart>
      <length-chart v-if='area.length_stats' :stats='area.length_stats' :key="'length' + area.id"></length-chart>
      <moderator-list :moderators='moderators' :area='area'></moderator-list>
    </template>
  </details-layout>
</template>

<script>
import DetailsLayout from '../layouts/DetailsLayout.vue'
import DetailsLoading from '../common/DetailsLoading.vue'
import StatisticsChart from '../common/StatisticsChart'
import AreaStats from '../common/AreaStats'
import LengthChart from '../common/LengthChart'
import ModeratorList from '../lists/ModeratorList'
import { mapGetters } from 'vuex'

import gradeService from '../../services/grade.service'

import { ItemType } from '../../services/type.service'

export default {
  computed: {
    ...mapGetters({
      area: 'area/get'
    }),
    loading () {
      return this.$store.state.area.loading || !this.area
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
    }
  },

  components: {
    DetailsLayout,
    DetailsLoading,
    ModeratorList,
    StatisticsChart,
    LengthChart,
    AreaStats
  },
  methods: {
    typeName (type) {
      return gradeService.types[type].name
    }
  }
}
</script>
