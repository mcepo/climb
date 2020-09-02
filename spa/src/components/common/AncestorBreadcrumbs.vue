<template>
<div class='d-flex align-center'>
    <v-btn
      icon
      text
      @click="open(null)"
    >
      <v-icon>home</v-icon>
    </v-btn>
  <v-breadcrumbs :items="breadcrumbs" divider="/" class='pa-0'>
    <template v-slot:item="props">
      <a
        @click="open(props.item)"
      >{{ props.item.name }}</a>
    </template>
  </v-breadcrumbs>
</div>
</template>

<script>

import { getUrl } from '../../router'

export default {
  props: {
    trim: Number
  },
  computed: {
    breadcrumbs () {
      const breadcrumbs = this.$store.getters.breadcrumbs || []
      let trimIndex = breadcrumbs.length - this.trim

      if (trimIndex < 0 || !this.$vuetify.breakpoint.xs) {
        trimIndex = 0
      }
      return this.trim ? breadcrumbs.slice(trimIndex, breadcrumbs.length) : breadcrumbs
    }
  },
  methods: {
    open (item = null) {
      if (item) {
        if (item.area_id) {
          // this is a route
          // check first if the route is already open
          item.id !== parseInt(this.$store.state.url.params.routeId) && this.$router.push(getUrl('route', item.id))
        } else {
          // check first if the area is already open
          item.id !== parseInt(this.$store.state.url.params.areaId) && this.$router.push(getUrl('area', item.id))
        }
      } else {
        if (this.$route.path !== '/') {
          this.$router.push(getUrl('area', null))
        }
      }
      this.$store.commit('drawers/setRight', false)
      this.$store.commit('drawers/setLeft', true)
    }
  }
}
</script>
