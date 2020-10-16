<template>
  <v-list>
    <v-list-item v-if='wasFiltered'>
      <filtering-alert type='areas'></filtering-alert>
    </v-list-item>
    <area-list-item v-for="area in areas" :key="area.id" :area='area' :taggable='taggable' />
  </v-list>
</template>

<script>
import AreaListItem from '../listItems/AreaListItem'
import FilteringAlert from '../common/FilteringAlert'

export default {
  props: {
    area: Object,
    areaIds: Array,
    taggable: {
      type: Boolean,
      default: true
    }
  },
  components: {
    AreaListItem,
    FilteringAlert
  },
  computed: {
    wasFiltered () {
      return this.area.areas.length !== this.areas.length
    },
    areas () {
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
  }
}
</script>
