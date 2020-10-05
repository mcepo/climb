<template>
  <v-list>
    <area-list-item v-for="area in areas" :key="area.id" :area='area' :taggable='taggable' />
  </v-list>
</template>

<script>
import AreaListItem from '../listItems/AreaListItem'

export default {
  props: {
    areaIds: Array,
    taggable: {
      type: Boolean,
      default: true
    }
  },
  components: {
    AreaListItem
  },
  computed: {
    areas () {
      const areas = []

      this.areaIds && this.areaIds.forEach((id) => {
        const area = this.$store.state.area.byIds[id]

        area && areas.push(area)
      })

      return areas
    }
  }
}
</script>
