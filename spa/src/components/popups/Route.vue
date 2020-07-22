<template>
  <popup :tag='tag' :item='item' type='route'>
    <template v-slot:header>
      {{item.name}}
    </template>
    <template v-slot:content>
      Pretty little route
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
