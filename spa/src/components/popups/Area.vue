<template>
  <popup :tag='tag' :item='item' type='area'>
    <template v-slot:header>
      <v-card-subtitle class='pa-0'>{{type}}</v-card-subtitle>
    </template>
    <template v-slot:item>
      <h2>{{item.name}}</h2>
    </template>
    <template v-slot:content>
      <area-stats :item='item'></area-stats>
    </template>
  </popup>
</template>
<script>
import Vue from 'vue'
import Popup from './Popup'
import AreaStats from '../common/AreaStats'

import typeService, { ItemType } from '../../services/type.service'

export default Vue.extend({
  props: ['item', 'tag'],
  components: {
    Popup,
    AreaStats
  },
  computed: {
    type () {
      return typeService.getTypeName(ItemType.Area, this.item.type_id)
    }
  }
})
</script>
