<template>
  <v-container fluid flat style="padding: 0px 0px 300px 0px">
    <v-layout column>
      <area-list searchable/>
      <div class="d-flex pa-2">
        <h3 class="headline pa-2">Countries</h3>
        <v-spacer></v-spacer>
        <v-btn
          title="Add country"
          text
          icon
          aria-label="Add country"
          @click.stop="
            openOnlyAdminForm({ component: 'area-form', params: null })
          "
        >
          <v-icon>add</v-icon>
        </v-btn>
      </div>
      <area-list :areaIds="rootIds" :showType='false'/>
    </v-layout>
    <v-layout column v-if='recentlyViewedIds.length !== 0'>
      <div class="d-flex pa-2">
        <h3 class="headline pa-2">Recently viewed</h3>
      </div>
      <area-list :areaIds="recentlyViewedIds"/>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import AreaList from './lists/AreaList'
import { set as setPageTitle } from '../utils/pageTitle'

import DataFetchMixin from './details/mixins/data-fetch.mixin'

export default {
  mixins: [DataFetchMixin],
  data () {
    return {
      areaQueryString: ''
    }
  },
  computed: {
    ...mapState({
      rootIds: s => s.area.rootIds,
      recentlyViewedIds: s => s.area.recentlyViewedIds
    })
  },

  created () {
    setPageTitle()
    this.$store.dispatch('area/fetchMany')
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
