<template>
    <v-menu
      left
      bottom
      :close-on-click='true'
      :close-on-content-click="true"
      z-index='3000'
    >
      <template v-slot:activator="{ on, attrs }">

        <v-btn text icon title="Show menu"
          v-bind="attrs"
          v-on="on">
          <v-icon>more_vert</v-icon>
        </v-btn>

      </template>

      <div class='d-flex flex-column align-stretch' style='background: white;'>
        <v-btn
          text
          title="Edit this area"
          @click.stop="openEditForm()"
          class='justify-start'
        >
          <v-icon>edit</v-icon>
          Edit
        </v-btn>

        <v-btn
          text
          v-if='canAdopt'
          title="Move item into this area"
          @click="setAdoptingParent(item.id)"
          class='justify-start'
        >
          <v-icon>pin_drop</v-icon>
          Drop item here
        </v-btn>

        <v-btn
          text
          v-if='canMove'
          :title="'Move this ' + this.type + ' to another area'"
          @click="setChildForAdoption({type, item})"
          class='justify-start'
        >
          <v-icon>import_export</v-icon>
          Move {{this.type}}
        </v-btn>

        <tag-control v-if='canTag' :type="type" :item="item" show-text :stop='false'/>

        <current-location-tagger v-if='canTagCurrentLocation' :type='type' :item='item'  show-text/>

        <v-btn
          text
          v-if='canGetDirections'
          title="Get directions for this area"
          @click="openInGoogle()"
          class='justify-start'
        >
          <v-icon>directions_car</v-icon>
          Get directions
        </v-btn>

        <delete-button :type='type' :item="item" return-back show-text />

        <add-trail v-if='hasTrails' :area='item' show-text/>

        <v-btn
          text
          v-if='isArea'
          title="Add a moderator for this area"
          @click="openOnlyAdminForm({component: 'moderator-form', params: {area: item} })"
          class='justify-start'
        >
          <v-icon>person_add</v-icon>
          Add moderator
        </v-btn>

        <v-btn
          v-if='canHaveArea'
          title="Add area"
          text
          class='justify-start'
          @click.stop="openAuthorizedForm({form: {component: 'area-form', params: {parent: item}}})"
        >
          <v-icon>add</v-icon>
          Add subarea
        </v-btn>

        <v-btn
          v-if="canAddRoute"
          text
          title="Add route"
          class='justify-start'
          @click.stop="openAuthorizedForm({form: {component: 'route-form', params: {area: item}}})"
        >
          <v-icon>add</v-icon>
          Add route
        </v-btn>

        <v-btn
          v-if="canHavePitch"
          text
          title="Add pitch"
          class='justify-start'
          @click.stop="openAuthorizedForm({form: {component: 'pitch-form', params: {route: item }}})"
        >
          <v-icon>add</v-icon>
          Add pitch
        </v-btn>

        <v-btn
          text
          title="Upload photo"
          v-if='canAddImage'
          class='justify-start'
          @click.stop="openAuthorizedForm({form: {component: 'image-upload-form', params: {type, id: item.id}}})"
        >
          <v-icon>add_photo_alternate</v-icon>
          Upload photo
        </v-btn>
      </div>

    </v-menu>
</template>

<script>

import DeleteButton from '../buttons/DeleteButton'
import TagControl from '../buttons/TagControl'
import CurrentLocationTagger from '../buttons/CurrentLocationTagger'
import AddTrail from '../buttons/AddTrail'

import { mapActions } from 'vuex'
import typeService, { ItemType } from '../../services/type.service'

export default {

  props: [
    'type',
    'item'
  ],

  computed: {
    canAdopt () {
      // route can't have items
      if (this.isRoute) return false

      const adoption = this.$store.state.adoption
      return adoption.item && // has item for moving
      !(adoption.type === ItemType.Area &&
        (
          adoption.item.id === this.item.id || // can't adopt myself
          this.item.ancestors.includes(adoption.item.id) // my child can't adopt me
        )
      )
    },
    parentId () {
      if (!this.item) return null

      return this.item.parent_id || this.item.area_id || null
    },
    canMove () {
      return this.parentId !== null
    },
    canTag () {
      return typeService.canTag(this.type, this.item.type_id)
    },
    canTagCurrentLocation () {
      return typeService.canTagCurrentLocation(this.type, this.item.type_id)
    },
    hasTrails () {
      return typeService.hasTrails(this.type, this.item.type_id)
    },
    canGetDirections () {
      return typeService.canGetDirections(this.type, this.item)
    },
    canHaveArea () {
      return typeService.hasAreas(this.type, this.item)
    },
    isArea () {
      return this.type === ItemType.Area
    },
    isRoute () {
      return this.type === ItemType.Route
    },
    canAddImage () {
      return typeService.canAddImage(this.type, this.item.type_id)
    },
    canAddRoute () {
      return typeService.canAddRoute(this.type, this.item.type_id)
    },
    canHavePitch () {
      return typeService.hasPitches(this.type, this.item.type_id)
    }
  },

  components: {
    TagControl,
    DeleteButton,
    CurrentLocationTagger,
    AddTrail
  },

  methods: {
    ...mapActions({
      openAuthorizedForm: 'form/authorizeAndOpen',
      openOnlyAdminForm: 'form/onlyAdminOpen',
      setChildForAdoption: 'adoption/setChild',
      setAdoptingParent: 'adoption/setParent',

      getParent () {
        return this.parentId ? this.$store.state.area.byIds[this.parentId] : null
      },

      openInGoogle () {
        const coordinates = this.item.map_tag.geometry.coordinates
        const win = window.open('https://www.google.com/maps/dir/?api=1&travelmode=driving&destination=' + coordinates[1] + ',' + coordinates[0], '_blank')
        win.focus()
      },

      openEditForm () {
        const parent = this.getParent()

        const actionPayload = {
          form: {
            component: this.type + '-form',
            params: {}
          },
          item: this.item
        }

        if (this.isArea) {
          actionPayload.form.params = {
            area: this.item,
            parent
          }
        } else if (this.isRoute) {
          actionPayload.form.params = {
            route: this.item,
            area: parent
          }
        } else {
          this.$store.dispatch('snackbar/throwError', 500)
          return
        }

        this.openAuthorizedForm(actionPayload)
      }
    })
  }
}
</script>
