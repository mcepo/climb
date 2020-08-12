<template>
  <popup :tag='tag' :item='item' type='pitch' :url='url'>
    <template v-slot:header>
      <v-chip>Pitch</v-chip>
    </template>
    <template v-slot:item>
      <h2>{{route.name}}</h2>
    </template>
    <template v-slot:content>
      <v-layout justify-space-between>
        <div>{{grade}}</div>
        <div>{{length}}</div>
      </v-layout>
    </template>
  </popup>
</template>
<script>
import Vue from 'vue'
import Popup from './Popup.vue'
import { getUrl } from '../../router'
import store from '../../store'
import gradeService from '../../services/grade.service'

export default Vue.extend({
  props: ['item', 'tag'],
  components: {
    Popup
  },
  computed: {
    url () {
      return getUrl('route', this.item.route_id)
    },
    route () {
      return store.state.route.byIds[this.item.route_id]
    },
    grade () {
      return this.item && gradeService.forge(this.item.grades)
    },
    length() {
      return this.item.length ? this.item.length + 'm' : ''
    }
  }
})
</script>
