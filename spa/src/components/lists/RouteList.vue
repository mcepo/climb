<template>
<div>
  <v-toolbar flat>
    <route-filters-button icon></route-filters-button>
    <v-text-field label="Search" v-model="routeQueryString"></v-text-field>
  </v-toolbar>
  <v-list two-line>
    <v-list-item v-if='wasFiltered'>
      <filtering-alert type='routes'></filtering-alert>
    </v-list-item>
    <route-list-item v-for="route in routes" :key="route.id" :route='route'/>
    <v-list-item>
      <v-list-item-content>
        <div v-intersect='loadOnIntersect'></div>
      </v-list-item-content>
    </v-list-item>
    <v-list-item v-if='loading'>
      <v-list-item-content>
        <v-progress-circular
          indeterminate
        ></v-progress-circular>
      </v-list-item-content>
    </v-list-item>
  </v-list>
  </div>
</template>

<script>
import RouteListItem from '../listItems/RouteListItem'
import RouteFiltersButton from '../buttons/RouteFiltersButton'
import FilteringAlert from '../common/FilteringAlert'
import { mapGetters, mapActions, mapMutations, mapState } from 'vuex'

export default {
  cancelToken: null,
  components: {
    RouteListItem,
    RouteFiltersButton,
    FilteringAlert
  },
  created () {
    if (this.routes.length === 0) {
      this.loadRoutesOnce(100)
    }
  },
  computed: {
    ...mapGetters({
      routes: 'route/getFiltered',
      filters: 'route/filters',
      area: 'area/get'
    }),
    wasFiltered () {
      const filters = this.$store.state.route.filters

      return filters &&
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
      loading: s => s.route.loading
    }),
    routeQueryString: {
      get () {
        return this.filters.query
      },
      set (value) {
        this.setQueryString(value)
        this.loadRoutesOnce(1000)
      }
    }
  },
  methods: {
    ...mapActions({
      loadRoutes: 'route/loadFiltered',
      openAuthorizedForm: 'form/authorizeAndOpen'
    }),
    ...mapMutations({
      setQueryString: 'route/setQueryString'
    }),
    loadOnIntersect (entries) {
      entries[0].isIntersecting && this.loadRoutesOnce(100)
    },
    loadRoutesOnce (timeout) {
      this.$options.cancelToken && clearTimeout(this.$options.cancelToken)
      this.$options.cancelToken = setTimeout(() => this.loadRoutes(), timeout)
    }
  }
}
</script>
