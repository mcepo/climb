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
          Drop {{this.type}} here
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

        <add-trail v-if='!openImage && isArea' :area='item' show-text/>

        <tag-control v-if='canTag' :type="type" :item="item" show-text />

        <current-location-tagger v-if='canTag' :type='type' :item='item'  show-text/>

        <delete-button :type='type' :item="item" return-back show-text />
      </div>

    </v-menu>
</template>

<script>

import DeleteButton from '../buttons/DeleteButton'
import TagControl from '../buttons/TagControl'
import CurrentLocationTagger from '../buttons/CurrentLocationTagger'
import AddTrail from '../buttons/AddTrail'

import { mapActions, mapGetters } from 'vuex'

export default {

  props: [
    'type',
    'item'
  ],

  computed: {
    ...mapGetters({
      openImage: 'openImage'
    }),
    canAdopt () {
      // route can't have items
      if (this.isRoute) return false

      const adoption = this.$store.state.adoption
      return adoption.item && // has item for moving
      !(adoption.type === 'area' &&
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
      if (this.isRoute) {
        return this.$store.getters['route/canTag'](this.item)
      }

      return true
    },
    isArea () {
      return this.type === 'area'
    },
    isRoute () {
      return this.type === 'route'
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
          this.$store.commit('snackbar/throwError', 500)
          return
        }

        this.openAuthorizedForm(actionPayload)
      }
    })
  }
}
</script>
