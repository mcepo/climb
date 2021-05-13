<template>
  <v-list>
    <v-list-item v-if='searchable'>
      <v-list-item-content>
        <v-text-field label="Search areas" v-model="areaQueryString" :loading='loading && searchable'></v-text-field>
      </v-list-item-content>
    </v-list-item>
    <v-list-item v-if='wasFiltered'>
      <filtering-alert type='areas'></filtering-alert>
    </v-list-item>
    <v-list-item v-if='loading && searchable'>
      <v-list-item-content>
        <v-progress-circular
          indeterminate
        ></v-progress-circular>
      </v-list-item-content>
    </v-list-item>
    <area-list-item v-else v-for="area in areas" :key="area.id" :area='area' :taggable='taggable' />
  </v-list>
</template>

<script>
import AreaListItem from '../listItems/AreaListItem'
import FilteringAlert from '../common/FilteringAlert'
import { mapState } from 'vuex'

export default {
  cancelToken: null,
  props: {
    area: Object,
    areaIds: Array,
    taggable: {
      type: Boolean,
      default: true
    },
    searchable: {
      type: Boolean,
      default: false
    }
  },
  components: {
    AreaListItem,
    FilteringAlert
  },

  computed: {
    wasFiltered () {
      const filters = this.$store.state.route.filters

      return this.area &&
        this.area.areas.length !== this.areas.length &&
        filters &&
        (
          filters.gradeTypes ||
          filters.gradeWeights ||
          (
            filters.orientation && filters.orientation.length !== 0
          ) ||
          filters.query ||
          filters.length
        )
    },
    ...mapState({
      loading: s => s.area.loading,
      query: s => s.area.query
    }),
    areaQueryString: {
      get () {
        return this.query
      },
      set (query) {
        query = query !== '' ? query : null

        this.$store.commit('area/setQueryString', query)
        // remotely searching areas only if
        // there is no open area
        // because if an area is open
        // all the subareas are already fetched
        if (!this.area && query) {
          this.loadAreasOnce()
        }
      }
    },
    areas () {
      if (this.areaIds) {
        const areas = []

        this.areaIds.forEach((id) => {
          const area = this.$store.state.area.byIds[id]

          area && areas.push(area)
        })

        return areas
      }

      return this.$store.getters['area/getFiltered']()
    }
  },
  methods: {
    loadAreasOnce () {
      this.$store.commit('area/loading', true)
      this.$options.cancelToken && clearTimeout(this.$options.cancelToken)
      this.$options.cancelToken = setTimeout(() => this.$store.dispatch('area/fetchMany'), 500)
    }
  }
}
</script>
