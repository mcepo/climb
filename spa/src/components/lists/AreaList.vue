<template>
  <v-container>
    <v-text-field v-if='searchable' label="Search areas" v-model="areaQueryString" :loading='loading && areaQueryString !== null'></v-text-field>
    <filtering-alert v-if='wasFiltered' type='areas'></filtering-alert>
    <details-loading v-if="(loading && !searchable) || (searchable && searching)"></details-loading>
    <v-simple-table style='cursor: pointer;' v-else>
      <template v-slot:default>
        <tbody>
          <area-list-item v-for="area in limitedAreas" :key="area.id" :area='area' />
          <tr v-intersect='loadOnIntersect'></tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-container>
</template>
<script>
import AreaListItem from '../listItems/AreaListItem'
import FilteringAlert from '../common/FilteringAlert'
import DetailsLoading from '../common/DetailsLoading.vue'
import { mapState } from 'vuex'

export default {
  cancelToken: null,
  props: {
    area: Object,
    areaIds: Array,
    searchable: {
      type: Boolean,
      default: false
    }
  },
  components: {
    AreaListItem,
    FilteringAlert,
    DetailsLoading
  },
  data () {
    return {
      areaQueryString: null,
      areaLimit: 10
    }
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
      searching: s => s.area.searching
    }),
    limitedAreas () {
      return this.areas.slice(0, this.areaLimit)
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

      return this.$store.getters['area/getFiltered'](this.area?.id, this.areaQueryString)
    }
  },
  watch: {
    areaQueryString (newQuery) {
      newQuery = newQuery === '' ? null : newQuery
      if (!this.area && newQuery) {
        this.loadAreasOnce(newQuery)
      }
    },
    $route () {
      // when going from one area to another vue recycles the component
      // leaving the value of areaQueryString
      // which produces a side effect that
      // subareas are filtered on newly opened area
      this.areaQueryString = null
    }
  },
  methods: {
    loadAreasOnce (query) {
      this.$options.cancelToken && clearTimeout(this.$options.cancelToken)
      this.$options.cancelToken = setTimeout(() => this.$store.dispatch('area/fetchMany', query), 500)
    },
    loadOnIntersect () {
      this.areaLimit += 10
    }
  }
}
</script>
