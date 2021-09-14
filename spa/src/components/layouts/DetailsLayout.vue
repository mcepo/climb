<template>
  <v-container fluid flat style='padding: 0px 0px 300px 0px'>
    <v-layout column>
      <v-layout class='pa-2 align-center'>
          <back-button></back-button>
        <v-layout column class='pl-2'>
          <v-card-subtitle class='pa-0'>{{itemType}}</v-card-subtitle>
          <v-card-title class='pa-0'>
            {{item.name}}
          </v-card-title>
        </v-layout>
        <v-spacer></v-spacer>
        <get-directions :item='item' :type='type'></get-directions>
        <v-btn icon title="Close drawer" @click.stop="closeDrawer">
          <v-icon>map</v-icon>
        </v-btn>
        <item-menu v-if='checkAuth' :item='item' :type='type'></item-menu>
      </v-layout>
      <v-card text flat>
        <v-card-text>
          <slot name="item-details" />
        </v-card-text>
      </v-card>
      <external-link-list v-if='item.link && item.links.length' :links='item.links'></external-link-list>

      <v-tabs v-model="tabs" grow mobile-break-point=300>
        <v-tab v-if="hasAreas" href="#areas">Areas</v-tab>
        <v-tab v-if="hasRoutes" href="#routes">Routes</v-tab>
        <v-tab v-if="hasPitches" href="#pitches">Pitches</v-tab>
        <v-tab v-if="hasImages" href="#pictures" >Photos</v-tab>
        <v-tabs-items v-model="tabs" class="mt-2">

          <v-tab-item v-if="hasAreas" value="areas">
            <area-list :area="item" :searchable='item.areas.length > 10'/>
          </v-tab-item>

          <v-tab-item v-if="hasRoutes" value="routes">
            <route-list />
          </v-tab-item>

          <v-tab-item v-if="hasPitches" value="pitches">
            <pitch-list :route="item" />
          </v-tab-item>

          <v-tab-item value="pictures" v-if='hasImages' eager>
            <image-list v-if="item.images" :imageIds="item.images" />
          </v-tab-item>

        </v-tabs-items>
      </v-tabs>
    </v-layout>
  </v-container>
</template>

<script>
import ImageList from '../lists/ImageList'
import AreaList from '../lists/AreaList'
import RouteList from '../lists/RouteList'
import PitchList from '../lists/PitchList'
import ExternalLinkList from '../lists/ExternalLinkList'
import ItemMenu from '../common/ItemMenu'
import { mapActions, mapGetters } from 'vuex'
import typeService from '../../services/type.service'
import GetDirections from '../buttons/GetDirections'
import { getUrl } from '../../router'
import BackButton from '../buttons/BackButton'

import drawers from '../../services/drawer.service'

export default {
  props: ['item', 'type'],
  data: () => ({
    tabs: null
  }),
  computed: {
    hasImages () {
      return this.item.images && this.item.images.length
    },
    hasRoutes () {
      return typeService.hasRoutes(this.type, this.item.type_id)
    },
    hasPitches () {
      return this.item.pitches && this.item.pitches.length
    },
    hasAreas () {
      return this.item.areas && this.item.areas.length !== 0
    },
    itemType () {
      return typeService.getTypeName(this.type, this.item.type_id)
    },
    ...mapGetters({
      checkAuth: 'auth/check'
    })
  },
  setup () {
    return {
      drawers
    }
  },
  methods: {
    ...mapActions({
      openAuthorizedForm: 'form/authorizeAndOpen'
    }),
    closeDrawer () {
      this.$router.push(getUrl('image', null))
      this.drawers.left = false
    },
    setTitle () {
      if (this.item && !document.title.includes(this.item.name)) {
        document.title = 'ClimbLine' + (' - ' + this.item.name)
      }
    }
  },
  created () {
    this.setTitle()
  },
  watch: {
    item (newItem) {
      // fix for messed up tabs when switching between areas that have
      // pictures and those that dont have
      this.tabs = newItem && this.item.children ? 'areas' : 'pitches'
      this.setTitle()
    }
  },
  components: {
    ImageList,
    AreaList,
    RouteList,
    ExternalLinkList,
    PitchList,
    ItemMenu,
    GetDirections,
    BackButton
  }
}
</script>
