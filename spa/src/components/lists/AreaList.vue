<template>
  <v-list>
    <v-list-item v-if='searchable'>
      <v-list-item-content>
        <v-text-field label="Search areas" v-model="areaQueryString"></v-text-field>
      </v-list-item-content>
    </v-list-item>
    <v-list-item v-if='wasFiltered'>
      <filtering-alert type='areas'></filtering-alert>
    </v-list-item>
    <area-list-item v-for="area in areas" :key="area.id" :area='area' :taggable='taggable' />
    <v-list-item v-if='loading'>
      <v-list-item-content>
        <v-progress-circular
          indeterminate
        ></v-progress-circular>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
import AreaListItem from '../listItems/AreaListItem'
import FilteringAlert from '../common/FilteringAlert'
import RouteFiltersButton from '../buttons/RouteFiltersButton'
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
    RouteFiltersButton,
    FilteringAlert
  },

  data() {
    return {
      query: ''
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
      loading: s => s.area.loading
    }),
    areaQueryString: {
      get () {
        return this.query
      },
      set (query) {
        this.query = query
        this.loadAreasOnce(query)
      }
    },
    areas () {

      if(this.areaQueryString && this.areaQueryString !== '') {
        return this.$store.getters['area/getFiltered']();
      }

      if (this.area) {
        return this.$store.getters['area/getFiltered'](this.area.id)
      }

      if (this.areaIds) {
        const areas = []

        this.areaIds.forEach((id) => {
          const area = this.$store.state.area.byIds[id]

          area && areas.push(area)
        })

        return areas
      }

      return []
    }
  },
  methods: {
    loadAreasOnce (query) {
      this.$options.cancelToken && clearTimeout(this.$options.cancelToken)
      this.$options.cancelToken = setTimeout(() => this.$store.dispatch('area/fetchMany', query), 1000)
    }
  }
}
</script>
