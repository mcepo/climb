<template>
  <v-list-item
    @mouseenter.native="onMouseOver()"
    @mouseleave.native="onMouseOut()"
    :class="{area_list_hover: highlight, area_list: true}"
    @click.prevent="link()"
  >
      <div style='width:400px'>
        <v-list-item-subtitle>{{typeName}}</v-list-item-subtitle>
        <v-list-item-title >{{area.name}}</v-list-item-title>
      </div>
      <v-list-item-subtitle style='font-weight:bold'>
        <div style='display:inline-block; width:90px' title='Topos coverage'>
          <v-icon>timeline</v-icon
          >{{ (area.tag_coverage * 100).toFixed(2) }} %
        </div>
        <div style='display:inline-block; width:50px' title='Number of photos'>
          <v-icon>photo_library</v-icon>
          {{ area.image_count }}
        </div>
      </v-list-item-subtitle>
  </v-list-item>
</template>

<style>
.area_list_hover {
  background-color: lightgray;
}
.area_list{
  cursor: pointer;
  padding: 0px 10px 10px 15px;
  border-bottom: 1px solid lightgray;
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
