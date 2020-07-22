<template>
  <details-loading v-if="loading"></details-loading>
  <details-layout v-else :item="area" :ancestor-ids="area.ancestors" type="area">
    <template slot="item-details">
      <v-btn
        text
        icon
        @click.stop="openForm({component: 'area-form', params: {area, parent} })"
      >
        <v-icon>edit</v-icon>
      </v-btn>

      <v-btn text icon v-if='canAdopt' title="Move item into this area" @click.stop="setAdoptingParent(area.id)">
        <v-icon>pin_drop</v-icon>
      </v-btn>

      <v-btn text icon title="Move this area to another area" @click.stop="setChildForAdoption({type: 'area', item: area})">
        <v-icon>import_export</v-icon>
      </v-btn>
      <v-btn text icon title="Add a moderator for this area" @click.stop="openForm({component: 'moderator-form', params: {area} })">
        <v-icon>person_add</v-icon>
      </v-btn>
      <tag-control type="area" :item="area"></tag-control>
      <delete-button type='area' :item="area" return-back></delete-button>
      <v-layout row v-if='area.altitude[0] || area.altitude[1]'>
        <v-flex>
          <strong>Altitude:</strong>
        </v-flex>
        <v-flex>{{area.altitude[0] + 'm - ' + area.altitude[1] + 'm'}}</v-flex>
      </v-layout>
      <v-divider></v-divider>
      <v-layout row>
        <v-flex>
          <strong>Orientation:</strong>
        </v-flex>
        <v-flex>{{orientation}}</v-flex>
      </v-layout>
      <v-divider></v-divider>
      <v-layout row style='font-weight:bold'>
        <div class="statType">
          Statistics:
        </div>
        <div class="statValueItem">Min</div>
        <div class="statValueItem">Avg</div>
        <div class="statValueItem">Max</div>
      </v-layout>
      <v-layout row v-for="(stat, type) in statistics" :key="type">
        <div class="statType">{{ typeName(type) }}</div>
        <div class="statValueItem">{{stat[0]}}</div>
        <div class="statValueItem">{{stat[1]}}</div>
        <div class="statValueItem">{{stat[2]}}</div>
      </v-layout>
      <v-divider></v-divider>
      <moderator-list :moderators='moderators' :area='area'></moderator-list>
      <v-divider></v-divider>
    </template>
  </details-layout>
</template>
<style>
.statType {
  width: 150px;
}
.statValue {
  width: 180px;
}
.statValueItem {
  width: 60px;
}
</style>

<script>
import DetailsLayout from '../layouts/DetailsLayout.vue'
import DeleteButton from '../buttons/DeleteButton.vue'
import DetailsLoading from '../common/DetailsLoading.vue'
import TagControl from '../common/TagControl'
import ModeratorList from '../lists/ModeratorList'
import { mapGetters, mapActions } from 'vuex'

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
    canAdopt () {
      const adoption = this.$store.state.adoption
      return adoption.item && // has item for moving
      !(adoption.type === 'area' &&
        (
          adoption.item.id === this.area.id || // can't adopt myself
          this.area.ancestors.includes(adoption.item.id) // my child can't adopt me
        )
      )
    },

    moderators () {
      if (!this.area && !this.area.moderators) return []

      const moderators = []

      this.area.moderators.forEach(moderatorId => {
        moderators.push(this.$store.getters['user/find'](moderatorId))
      })

      return moderators
    },

    parent () {
      const parentId = this.area?.ancestors?.length !== 0 && this.area.ancestors[this.area.ancestors.length - 1]

      if (parentId) {
        return this.$store.state.area.byIds[parentId]
      }
      return null
    },
    statistics () {
      const statistics = {}

      const showStats = [0, 1, 2, 3, 5, 10]

      let min, max, avg, count, i

      if (!this.area) return

      for (const gradeType in this.area.statistics) {
        if (!showStats.includes(parseInt(gradeType))) continue

        min = 100000
        max = 0
        avg = 0
        count = 0

        for (const gradeWeight in this.area.statistics[gradeType]) {
          i = parseInt(gradeWeight)
          if (min > i) min = i
          if (max < i) max = i
          avg += i * this.area.statistics[gradeType][gradeWeight]
          count += this.area.statistics[gradeType][gradeWeight]
        }

        statistics[gradeType] = [
          gradeService.charts[gradeService.types[gradeType].charts[0]][min],
          gradeService.charts[gradeService.types[gradeType].charts[0]][Math.round(avg / count)],
          gradeService.charts[gradeService.types[gradeType].charts[0]][max]
        ]
      }

      return statistics
    },
    orientation () {
      return typeService.orientation.getLabel(this.area.orientation)
    }
  },

  components: {
    DetailsLayout,
    DetailsLoading,
    DeleteButton,
    TagControl,
    ModeratorList
  },
  methods: {
    ...mapActions({
      openForm: 'form/open',
      setChildForAdoption: 'adoption/setChild',
      setAdoptingParent: 'adoption/setParent'
    }),
    typeName (type) {
      return gradeService.types[type].name
    }
  }
}
</script>
