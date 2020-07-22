<template>
  <details-loading v-if="loading"></details-loading>
  <details-layout v-else :item="route" :ancestor-ids="ancestorIds" type="route">
    <template slot="item-details">
      <v-btn
        text
        icon
        @click.stop="openForm({component: 'route-form', params: {route: route, area}})"
      >
        <v-icon>edit</v-icon>
      </v-btn>
      <v-btn
        text
        icon
        title="Move item to another area"
        @click.stop="setChildForAdoption({type: 'route', item: route})"
      >
        <v-icon>import_export</v-icon>
      </v-btn>
      <delete-button type='route' :item="route" return-back></delete-button>
      <v-layout column>
        <div>
          <strong>Grade:</strong>
          {{grade}}
        </div>
        <div>
          <strong>Length:</strong>
          {{route.length}}m
        </div>
        <div>
          <strong>Orientation:</strong>
          {{orientation}}
        </div>
      </v-layout>
    </template>
    <template v-if="route.length < 40" slot="tag">
      <tag-control type="route" :item="route" />
    </template>
  </details-layout>
</template>
<script>
import DetailsLayout from '../layouts/DetailsLayout.vue'
import DeleteButton from '../buttons/DeleteButton'
import DetailsLoading from '../common/DetailsLoading.vue'
import TagControl from '../common/TagControl'

import typeService from '../../services/type.service'

import { mapActions, mapGetters } from 'vuex'
import gradeService from '../../services/grade.service'

export default {
  computed: {
    ...mapGetters({
      route: 'route/get'
    }),
    loading () {
      return this.$store.state.route.loading || this.$store.state.area.loading || !this.route
    },
    area () {
      return this.route && this.$store.state.area.byIds[this.route.area_id]
    },
    ancestorIds () {
      return !this.loading && this.route && (this.route.ancestors || [])
    },
    orientation () {
      return !this.loading && this.route && typeService.orientation.getLabel(this.route.orientation || this.area.orientation)
    },
    grade () {
      return this.route?.grades && gradeService.forge(this.route.grades)
    }
  },
  methods: {
    ...mapActions({
      openForm: 'form/open',
      setChildForAdoption: 'adoption/setChild'
    })
  },
  components: {
    DetailsLayout,
    DetailsLoading,
    TagControl,
    DeleteButton
  }
}
</script>
