<template>
  <v-card-text class="pt-0">
    <v-select
      v-model="model"
      :items="items"
      item-text='label'
      item-value='value'
      label="Orientation"
      required
      @change='$emit("input", model)'
      :chips='multiple'
      :multiple='multiple'
    ></v-select>
  </v-card-text>
</template>
<script>
import typeService from '../../services/type.service'
export default {
  props: {
    value: [Array, Number],
    multiple: Boolean
  },
  data: () => ({
    model: null
  }),
  created () {
    this.model = this.value
  },
  computed: {
    items () {
      return typeService.orientation.items
    }
  }
}
</script>
