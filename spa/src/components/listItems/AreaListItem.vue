<template>
  <tr
    @mouseenter="onMouseOver()"
    @mouseleave="onMouseOut()"
    @click="link()"
    :class="{area_list_hover: highlight}"
  >
    <td style='max-width:160px; min-width:120px'>
      <v-list-item-subtitle class="area_type">{{typeName}}</v-list-item-subtitle>
      <v-list-item-title >{{area.name}}</v-list-item-title>
    </td>
    <td>
      <v-icon>timeline</v-icon>{{ (area.tag_coverage * 100).toFixed(2) }} %
    </td>
    <td>
      <v-icon>photo_library</v-icon>{{ area.image_count }}
    </td>
  </tr>
</template>

<style>
.area_list_hover {
  background-color: lightgray;
}
.area_type {
  color: rgba(0, 0, 0, 0.6);
  font-size: 0.875rem;
}
</style>

<script>
import typeService, { ItemType } from '../../services/type.service'

import { getUrl } from '../../router'

import highlight from '../../services/highlight.service'

export default {
  props: {
    area: Object
  },
  computed: {
    key () {
      return this.type + this.area.id
    },
    highlight () {
      return highlight.key === this.key
    },
    typeName () {
      return typeService.getTypeName(this.type, this.area.type_id)
    },
    type () {
      return ItemType.Area
    }
  },
  methods: {
    link () {
      this.onMouseOut()

      this.$router.push(getUrl(this.type, this.area.id))
    },
    onMouseOver () {
      highlight.key = this.key
    },
    onMouseOut () {
      highlight.key = null
    }
  }
}
</script>
