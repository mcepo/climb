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
import { ItemType } from '../../services/type.service'

import drawers from '../../services/drawer.service'

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
  setup () {
    return {
      drawers
    }
  },
  methods: {
    open (item = null) {
      if (item) {
        if (item.area_id) {
          // this is a route
          // check first if the route is already open
          item.id !== parseInt(this.$store.state.url.params.routeId) && this.$router.push(getUrl(ItemType.Route, item.id))
        } else {
          // check first if the area is already open
          item.id !== parseInt(this.$store.state.url.params.areaId) && this.$router.push(getUrl(ItemType.Area, item.id))
        }
      } else {
        if (this.$route.path !== '/') {
          this.$router.push(getUrl(ItemType.Area, null))
        }
      }
      this.drawers.left = true
      this.drawers.right = false
    }
  }
}
</script>
