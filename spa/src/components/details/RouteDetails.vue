<template>
  <details-loading v-if="loading"></details-loading>
  <details-layout v-else :item="route" :type="type">
    <template slot="item-details">
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
  </details-layout>
</template>
<script>
import DetailsLayout from '../layouts/DetailsLayout.vue'
import DetailsLoading from '../common/DetailsLoading.vue'
import typeService, { ItemType } from '../../services/type.service'
import { mapGetters } from 'vuex'
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
    orientation () {
      return !this.loading && this.route && typeService.orientation.getLabel(this.route.orientation || this.area.orientation)
    },
    grade () {
      return this.route?.grades && gradeService.forge(this.route.grades)
    },
    type () {
      return ItemType.Route
    }
  },
  components: {
    DetailsLayout,
    DetailsLoading
  }
}
</script>
