<template>
  <v-container fluid flat style='padding: 0px 0px 300px 0px'>
    <v-layout column>
      <v-layout class='pa-2 align-center'>
        <v-btn text icon title="Close sidebar" @click.stop="closeDrawer">
          <v-icon>arrow_back</v-icon>
        </v-btn>
        <v-layout column class='pl-2'>
          <v-card-subtitle class='pa-0'>{{itemType}}</v-card-subtitle>
          <v-card-title class='pa-0'>
            {{item.name}}
          </v-card-title>
        </v-layout>
        <v-spacer></v-spacer>
        <item-menu :item='item' :type='type'></item-menu>
      </v-layout>
      <v-card text>
        <v-card-text>
          <slot name="item-details" />
        </v-card-text>
      </v-card>
      <external-link-list :links='item.links'></external-link-list>

      <v-tabs v-model="tabs" grow mobile-break-point=300>
        <v-tab v-if="hasAreas" href="#areas">Areas</v-tab>
        <v-tab v-if="hasRoutes" href="#routes">Routes</v-tab>
        <v-tab v-if="hasPitches" href="#pitches">Pitches</v-tab>
        <v-tab v-if="hasImages" href="#pictures" >Pictures</v-tab>
        <v-tabs-items v-model="tabs" class="mt-2">

          <v-tab-item v-if="hasAreas" value="areas">
            <v-btn
              title="Add area"
              text
              icon
              @click.stop="openAuthorizedForm({form: {component: 'area-form', params: {parent: item}}})"
            >
              <v-icon>add</v-icon>
            </v-btn>
            <area-list :areaIds="item.areas" />
          </v-tab-item>

          <v-tab-item v-if="hasRoutes" value="routes" eager>
            <route-list />
          </v-tab-item>

          <v-tab-item v-if="hasPitches" value="pitches">
            <v-btn
              text
              title="Add pitch"
              icon
              @click.stop="openAuthorizedForm({form: {component: 'pitch-form', params: {route: item }}})"
            >
              <v-icon>add</v-icon>
            </v-btn>
            <pitch-list :route="item" />
          </v-tab-item>

          <v-tab-item value="pictures" v-if='hasImages' eager>
            <v-btn
              text
              title="Upload photo"
              icon
              v-if='canAddImage'
              @click.stop="openAuthorizedForm({form: {component: 'image-upload-form', params: {type, id: item.id}}})"
            >
              <v-icon>add_photo_alternate</v-icon>
            </v-btn>
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
import { mapActions } from 'vuex'
import typeService from '../../services/type.service'

export default {
  props: ['item', 'type'],
  data: () => ({
    tabs: null
  }),
  computed: {
    hasImages () {
      return typeService.hasImages(this.type, this.item.type_id)
    },
    canAddImage () {
      return typeService.canAddImage(this.type, this.item.type_id)
    },
    hasRoutes () {
      return typeService.hasRoutes(this.type, this.item.type_id)
    },
    canAddRoute () {
      return typeService.canAddRoute(this.type, this.item.type_id)
    },
    hasPitches () {
      return typeService.hasPitches(this.type, this.item.type_id)
    },
    hasAreas () {
      return typeService.hasAreas(this.type, this.item)
    },
    itemType () {
      return typeService.getTypeName(this.type, this.item.type_id)
    }
  },
  methods: {
    ...mapActions({
      openAuthorizedForm: 'form/authorizeAndOpen'
    }),
    closeDrawer () {
      this.$store.commit('drawers/setLeft', false)
    }
  },
  // watch: {
  //   item (newItem) {
  //     this.tabs = newItem && newItem.children ? 'areas' : 'pitches'
  //   }
  // },
  components: {
    ImageList,
    AreaList,
    RouteList,
    ExternalLinkList,
    PitchList,
    ItemMenu
  }
}
</script>
