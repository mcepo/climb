<template>
  <popup :tag='tag' :item='item' type='area'>
    <template v-slot:header>
      <v-chip>{{type}}</v-chip>
    </template>
    <template v-slot:item>
      <h2>{{item.name}}</h2>
    </template>
    <template v-slot:content>
    </template>
  </popup>
</template>
<script>
import Vue from 'vue'
import Popup from './Popup'

import typeService, { ItemType } from '../../services/type.service'

export default Vue.extend({
  props: ['item', 'tag'],
  components: {
    Popup
  },
  computed: {
    type () {
      return typeService.getTypeName(ItemType.Area, this.item.type_id)
    }
  }
})
</script>
