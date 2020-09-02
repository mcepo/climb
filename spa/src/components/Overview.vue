<template>
  <v-container fluid flat style='padding: 0px 0px 300px 0px'>
    <v-layout column>
      <div class='d-flex pa-2'>
        <v-btn text icon title="Close sidebar" @click.stop="closeDrawer">
          <v-icon>arrow_back</v-icon>
        </v-btn>
        <h3 class="headline pa-2">
          Countries
        </h3>
        <v-spacer></v-spacer>
        <v-btn
          title="Add country"
          text
          icon
          @click.stop="openOnlyAdminForm({component: 'area-form', params: null})"
        >
          <v-icon>add</v-icon>
        </v-btn>
      </div>
      <area-list :areaIds="areaIds" />
    </v-layout>
  </v-container>
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
      openOnlyAdminForm: 'form/onlyAdminOpen'
    }),
    closeDrawer () {
      this.$store.commit('drawers/setLeft', false)
    }
  },
  components: {
    AreaList
  }
}
</script>
