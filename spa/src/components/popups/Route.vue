<template>
  <popup :tag='tag' :item='item' type='route'>
    <template v-slot:header>
      <v-chip>{{type}}</v-chip>
    </template>
    <template v-slot:item>
      <h2>{{item.name}}</h2>
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

import typeService from '../../services/type.service'
import gradeService from '../../services/grade.service'

export default Vue.extend({
  props: ['item', 'tag'],
  components: {
    Popup
  },
  computed: {
    type () {
      return typeService.route[this.item.type_id]
    },
    grade () {
      return this.item && gradeService.forge(this.item.grades)
    },
    length () {
      return this.item.length ? this.item.length + 'm' : ''
    }
  }
})
</script>
