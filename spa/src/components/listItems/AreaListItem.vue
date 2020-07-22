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
    </v-list-item-content>
    <v-list-item-action>
      <tag-control type="area" :item="area"></tag-control>
    </v-list-item-action>
  </v-list-item>
</template>
<script>
import typeService from '../../services/type.service'
import TagControl from '../common/TagControl'

import { getUrl } from '../../router'

export default {
  props: ['area'],
  computed: {
    key () {
      return 'area' + this.area.id
    },
    highlight () {
      return this.$store.state.highlight.key === this.key
    },
    typeName () {
      return typeService.area[this.area.type_id]
    }
  },
  methods: {
    link () {
      this.onMouseOut()

      this.$router.push(getUrl('area', this.area.id))
    },
    onMouseOver () {
      this.$store.commit('highlight/set', this.key)
    },
    onMouseOut () {
      this.$store.commit('highlight/set', null)
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
