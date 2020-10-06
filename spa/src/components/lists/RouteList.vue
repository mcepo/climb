<template>
<div>
  <v-toolbar flat>
    <v-btn text title="Filters" icon @click.stop="openAuthorizedForm({form: {component: 'route-filters-form'}})">
      <v-icon>filter_list</v-icon>
    </v-btn>
    <v-text-field label="Search" v-model="routeQueryString"></v-text-field>
  </v-toolbar>
  <v-list two-line>
    <route-list-item v-for="route in routes" :key="route.id" :route='route'/>
    <v-list-item v-if='loading'>
      <v-list-item-content>
        <v-progress-circular
          indeterminate
        ></v-progress-circular>
      </v-list-item-content>
    </v-list-item>
    <v-list-item>
      <v-list-item-content>
        <div v-intersect='loadOnIntersect'></div>
      </v-list-item-content>
    </v-list-item>
  </v-list>
  </div>
</template>

<script>
import RouteListItem from '../listItems/RouteListItem'
import { mapGetters, mapActions, mapMutations, mapState } from 'vuex'

export default {
  cancelToken: null,
  components: {
    RouteListItem
  },
  created () {
    if (this.routes.length === 0) {
      this.loadRoutes()
    }
  },
  computed: {
    ...mapGetters({
      routes: 'route/getFiltered',
      filters: 'route/filters',
      area: 'area/get'
    }),
    ...mapState({
      loading: s => s.route.loading
    }),
    routeQueryString: {
      get () {
        return this.filters.query
      },
      set (value) {
        this.setQueryString(value)
        this.loadRoutesOnce()
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
      entries[0].isIntersecting && this.loadRoutes()
    },
    loadRoutesOnce () {
      this.$options.cancelToken && clearTimeout(this.$options.cancelToken)
      this.$options.cancelToken = setTimeout(() => this.loadRoutes(), 1000)
    }
  }
}
</script>
