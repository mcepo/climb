<template>
  <popup :tag='tag' :item='item' type='area'>
    <template v-slot:header>
      {{item.name}}
    </template>
    <template v-slot:content>
      Pretty little area
    </template>
  </popup>
</template>
<script>
import Vue from 'vue'
import Popup from './Popup'

export default Vue.extend({
  props: ['item', 'tag'],
  components: {
    Popup
  }
})
</script>
