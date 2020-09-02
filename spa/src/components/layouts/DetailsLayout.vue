<template>
  <v-container fluid flat style='padding: 0px 0px 300px 0px'>
    <v-layout column>
      <div class='d-flex pa-2'>
        <v-btn text icon title="Close sidebar" @click.stop="closeDrawer">
          <v-icon>arrow_back</v-icon>
        </v-btn>
        <h3 class="headline pa-2">
          {{item.name}}
        </h3>
        <v-spacer></v-spacer>
        <item-menu :item='item' :type='type'></item-menu>
      </div>
      <v-card text>
        <v-card-text>
          <slot name="item-details" />
        </v-card-text>
      </v-card>
      <external-link-list :links='item.links'></external-link-list>

      <v-tabs v-model="tabs" grow mobile-break-point=300>
        <v-tab v-if="item.areas" href="#areas">Areas</v-tab>
        <v-tab v-if="type === 'area'" href="#routes">Routes</v-tab>
        <v-tab v-if="item.pitches && item.length > 50" href="#pitches">Pitches</v-tab>
        <v-tab v-if="item.type_id !== undefined && picturesAllowed" href="#pictures" >Pictures</v-tab>
        <v-tabs-items v-model="tabs" class="mt-2">
          <v-tab-item v-if="item.areas" value="areas">
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
          <v-tab-item v-if="type === 'area'" value="routes">
            <route-list />
          </v-tab-item>
          <v-tab-item value="pitches">
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
          <v-tab-item value="pictures" v-if='picturesAllowed'>
            <v-btn
              text
              title="Upload photo"
              icon
              v-if='canAddPicture'
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

export default {
  props: ['item', 'type'],
  data: () => ({
    tabs: null
  }),
  computed: {
    picturesAllowed () {
      if (this.type === 'area') {
        // type_id of areas that can have a picture
        return [2, 3, 4, 5, 6, 7].find((id) => id === this.item.type_id) !== undefined
      }
      return true
    },
    canAddPicture () {
      return this.type === 'area' && this.picturesAllowed
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
  watch: {
    item (newItem) {
      this.tabs = newItem && newItem.children ? 'areas' : 'pitches'
    }
  },
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
