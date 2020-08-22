<template>
  <details-loading v-if="loading"></details-loading>
  <details-layout v-else :item="area" :ancestor-ids="area.ancestors" type="area">
    <template slot="item-details">
      <v-btn
        text
        icon
        title="Edit this area"
        @click.stop="openAuthorizedForm({form: {component: 'area-form', params: {area, parent} }, item: area})"
      >
        <v-icon>edit</v-icon>
      </v-btn>

      <v-btn text icon v-if='canAdopt' title="Move item into this area" @click.stop="setAdoptingParent(area.id)">
        <v-icon>pin_drop</v-icon>
      </v-btn>

      <v-btn text icon title="Move this area to another area" @click.stop="setChildForAdoption({type: 'area', item: area})">
        <v-icon>import_export</v-icon>
      </v-btn>
      <v-btn text icon title="Add a moderator for this area" @click.stop="openOnlyAdminForm({component: 'moderator-form', params: {area} })">
        <v-icon>person_add</v-icon>
      </v-btn>
      <add-trail :area='area'/>
      <delete-button type='area' :item="area" return-back></delete-button>
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
      <statistics-chart :type='type' :stats='stats' v-for="(stats, type) in area.statistics" :key="type"></statistics-chart>
      <length-chart v-if='area.lengthStatistics.length !== 0' :stats='area.lengthStatistics'></length-chart>
      <moderator-list :moderators='moderators' :area='area'></moderator-list>
    </template>
    <template slot="tag">
      <tag-control type="area" :item="area"></tag-control>
      <current-location-tagger type='area' :item='area' />
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
import TagControl from '../buttons/TagControl'
import CurrentLocationTagger from '../buttons/CurrentLocationTagger'
import AddTrail from '../buttons/AddTrail'
import StatisticsChart from '../common/StatisticsChart'
import LengthChart from '../common/LengthChart'
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

    parent () {
      const parentId = this.area?.ancestors?.length !== 0 && this.area.ancestors[this.area.ancestors.length - 1]

      if (parentId) {
        return this.$store.state.area.byIds[parentId]
      }
      return null
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
    ModeratorList,
    StatisticsChart,
    LengthChart,
    CurrentLocationTagger,
    AddTrail
  },
  methods: {
    ...mapActions({
      openAuthorizedForm: 'form/authorizeAndOpen',
      openOnlyAdminForm: 'form/onlyAdminOpen',
      setChildForAdoption: 'adoption/setChild',
      setAdoptingParent: 'adoption/setParent'
    }),
    typeName (type) {
      return gradeService.types[type].name
    }
  }
}
</script>
