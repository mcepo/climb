<template>
    <v-alert
      dense
      border="left"
      type="warning"
    >
      Some {{type}} aren't displayed due to filters! <route-filters-button>Adjust filters</route-filters-button>
    </v-alert>
</template>

<script>

import RouteFiltersButton from '../buttons/RouteFiltersButton'

export default {
  props: {
    type: {
      type: String,
      default: 'items'
    }
  },
  components: {
    RouteFiltersButton
  }
}
</script>
