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
    <v-list-item-action v-if="canTag(route)">
      <tag-control type="route" :item="route"></tag-control>
    </v-list-item-action>
  </v-list-item>
</template>
<script>
import typeService from '../../services/type.service'
import TagControl from '../buttons/TagControl'
import { getUrl } from '../../router'
import gradeService from '../../services/grade.service'
import { mapGetters } from 'vuex'

export default {
  props: ['route'],
  computed: {
    ...mapGetters({
      canTag: 'route/canTag'
    }),
    highlight () {
      return this.$store.state.highlight.key === this.key
    },
    typeName () {
      return typeService.route[this.route.type_id]
    },
    key () {
      return 'route' + this.route.id
    },
    grade () {
      return this.route && gradeService.forge(this.route.grades)
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
          return area.name
        }
      }

      return ''
    }
  },
  methods: {
    link () {
      this.onMouseOut()
      this.$router.push(getUrl('route', this.route.id))
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
.route_list_hover {
  background-color: lightgray;
}
</style>
