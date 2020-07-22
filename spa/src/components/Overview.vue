<template>
  <div>
    <h3>Countries </h3>
    <v-btn
      title="Add country"
      text
      icon
      @click.stop="openForm({component: 'area-form', params: {parent: null}})"
    >
      <v-icon>add</v-icon>
    </v-btn>
    <area-list :areaIds="areaIds" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import AreaList from './lists/AreaList'
export default {

  computed: {
    ...mapState({
      areaIds: s => s.area.rootIds
    })
  },

  created () {
    this.$store.dispatch('area/fetchRootAreas')
  },
  methods: {
    ...mapActions({
      openForm: 'form/open'
    })
  },
  components: {
    AreaList
  }
}
</script>
