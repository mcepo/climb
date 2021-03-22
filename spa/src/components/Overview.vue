<template>
  <v-container fluid flat style="padding: 0px 0px 300px 0px">
    <v-layout column>
      <div class="d-flex pa-2">
        <v-btn text icon title="Close sidebar" @click.stop="drawers.left = false">
          <v-icon>arrow_back</v-icon>
        </v-btn>
        <h3 class="headline pa-2">Countries</h3>
        <v-spacer></v-spacer>
        <v-btn
          title="Add country"
          text
          icon
          @click.stop="
            openOnlyAdminForm({ component: 'area-form', params: null })
          "
        >
          <v-icon>add</v-icon>
        </v-btn>
      </div>
      <area-list :areaIds="areaIds" />
    </v-layout>
    <v-layout column v-if="recentlyViewedIds.length !== 0">
      <div class="d-flex pa-2">
        <h3 class="headline pa-2">Recently viewed</h3>
      </div>
      <area-list :areaIds="recentlyViewedIds" :taggable="false" />
    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import AreaList from './lists/AreaList'

import drawers from '../services/drawer.service'

export default {
  computed: {
    ...mapState({
      areaIds: s => s.area.rootIds,
      recentlyViewedIds: s => s.area.recentlyViewedIds
    })
  },

  setup () {
    return {
      drawers
    }
  },

  created () {
    this.$store.dispatch('area/fetchRootAreas')
  },
  methods: {
    ...mapActions({
      openOnlyAdminForm: 'form/onlyAdminOpen'
    })
  },
  components: {
    AreaList
  }
}
</script>
