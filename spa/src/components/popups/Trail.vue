<template>
  <popup :tag='tag' :item='item' type='trail'>
    <template v-slot:header>
      <v-chip>Trail</v-chip>
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
import Popup from './Popup.vue'

export default Vue.extend({
  props: ['item', 'tag'],
  components: {
    Popup
  }
})
</script>
