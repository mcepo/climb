<template>
  <v-list-item
    @mouseenter.native="onMouseOver()"
    @mouseleave.native="onMouseOut()"
    :class="{area_list_hover: highlight, area_list: true}"
    @click.prevent="link()"
  >
      <div style='width:200px'>
        <v-list-item-subtitle>{{typeName}}</v-list-item-subtitle>
        <v-list-item-title >{{area.name}}</v-list-item-title>
      </div>
      <div>
        <div style='display:inline-block; width:90px' title='Topos coverage'>
          <v-icon>timeline</v-icon
          ><b>{{ (area.tag_coverage * 100).toFixed(2) }} %</b>
        </div>
        <div style='display:inline-block; width:50px' title='Number of photos'>
          <v-icon>photo_library</v-icon>
          <b>{{ area.image_count }}</b>
        </div>
      </div>
  </v-list-item>
</template>
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
