<template>
  <v-list-item
    @mouseenter.native="onMouseOver()"
    @mouseleave.native="onMouseOut()"
    @click.prevent="link()"
    :class="{route_list_hover: highlight}"
  >
    <v-list-item-icon size="90">
      <v-chip>{{typeName}}</v-chip>
    </v-list-item-icon>
    <v-list-item-content>
      <v-list-item-subtitle>
        {{nextAreaName}}
      </v-list-item-subtitle>
      <v-list-item-title>{{route.name}}</v-list-item-title>
      <v-list-item-subtitle>
        <v-layout justify-space-between>
          <div>{{grade}}</div>
          <div>{{length}}</div>
        </v-layout>
      </v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action v-if="canTag">
      <tag-control :type='type' :item="route"></tag-control>
    </v-list-item-action>
  </v-list-item>
</template>
<script>
import typeService, { ItemType } from '../../services/type.service'
import TagControl from '../buttons/TagControl'
import { getUrl } from '../../router'
import gradeService from '../../services/grade.service'

import highlight from '../../services/highlight.service'

export default {
  props: ['route'],
  computed: {
    canTag () {
      return typeService.canTag(this.type, this.route.type_id)
    },
    highlight () {
      return highlight.key === this.key
    },
    typeName () {
      return typeService.getTypeName(this.type, this.route.type_id)
    },
    key () {
      return this.type + this.route.id
    },
    grade () {
      return this.route && gradeService.forge(this.route.grades)
    },
    type () {
      return ItemType.Route
    },
    length () {
      return this.route.length ? this.route.length + 'm' : ''
    },
    nextAreaName () {
      if (!this.route) return ''

      const areas = this.route.path.split('.')

      const currentAreaId = this.$router.currentRoute.params.areaId

      if (!currentAreaId) return ''

      const currentAreaIndex = areas.indexOf(currentAreaId)

      if (currentAreaIndex !== -1) {
        const nextAreaIndex = currentAreaIndex + 1
        let area = null
        if (nextAreaIndex < areas.length) {
          area = this.$store.state.area.byIds[areas[nextAreaIndex]]
        } else {
          area = this.$store.state.area.byIds[currentAreaId]
        }

        if (area) {
          return typeService.getTypeName(ItemType.Area, area.type_id) + ': ' + area.name
        }
      }

      return ''
    }
  },
  methods: {
    link () {
      this.onMouseOut()
      this.$router.push(getUrl(this.type, this.route.id))
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
.route_list_hover {
  background-color: lightgray;
}
</style>
