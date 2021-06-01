<template>
  <v-list-item
    @mouseenter.native="onMouseOver()"
    @mouseleave.native="onMouseOut()"
    :class="{area_list_hover: highlight, area_list: true}"
    @click.prevent="link()"
  >
    <v-list-item-icon size="100">
      <v-chip>{{typeName}}</v-chip>
    </v-list-item-icon>
    <v-list-item-content>
      <v-list-item-title>{{area.name}}</v-list-item-title>
      <v-list-item-subtitle>
        <div style='display:inline; margin-right:20px' title='Topos coverage'>
          <v-icon>timeline</v-icon><b>{{ (area.tag_coverage * 100).toFixed(2) }} %</b>
        </div>
        <div style='display:inline; margin-right:20px' title='Number of photos'>
          <v-icon>photo_library</v-icon><b>{{ area.image_count }}</b>
        </div>
      </v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action v-if='taggable'>
      <tag-control :type="type" :item="area"></tag-control>
    </v-list-item-action>
  </v-list-item>
</template>
<script>
import typeService, { ItemType } from '../../services/type.service'
import TagControl from '../buttons/TagControl'

import { getUrl } from '../../router'

import highlight from '../../services/highlight.service'

export default {
  props: {
    area: Object,
    taggable: {
      type: Boolean,
      default: true
    }
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
  },
  components: {
    TagControl
  }
}
</script>

<style>
.area_list_hover {
  background-color: lightgray;
}
.area_list{
  cursor: pointer;
}
</style>
