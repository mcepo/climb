<template>
  <v-form ref="form" v-model="valid">
    <v-card text color="transparent" flat class='ma-2'>
      <v-card-title>
        {{ area ? 'Editing - ' + area.name : 'Adding area'}}
      </v-card-title>
      <v-card-text>
        <v-text-field v-model="formData.name" :rules="nameRules" label="Area name" required></v-text-field>
      </v-card-text>

      <v-card-text class="pt-0">
        <v-select
          v-model="formData.type_id"
          :items="types"
          :rules="typeRules"
          label="Area type"
          required
        ></v-select>
      </v-card-text>
      <orientation v-if='allowedOrientation' v-model='formData.orientation'/>

      <v-subheader>Minimum and maximum altitude in this area (m)</v-subheader>

      <v-card-text class="pt-0">
        <v-layout row>
          <v-flex shrink style="width: 50px">
            <v-text-field
              v-model="formData.altitude[0]"
              class="mt-0"
              hide-details
              single-line
              type="number"
            ></v-text-field>
          </v-flex>
          <v-flex class="px-3">
            <v-range-slider
              v-model="formData.altitude"
              :max="altitudeLimits[1]"
              :min="altitudeLimits[0]"
            ></v-range-slider>
          </v-flex>
          <v-flex shrink style="width: 50px">
            <v-text-field
              v-model="formData.altitude[1]"
              class="mt-0"
              hide-details
              single-line
              type="number"
            ></v-text-field>
          </v-flex>
        </v-layout>
      </v-card-text>

      <v-layout justify-center>
        <v-card-actions>
          <v-btn :disabled="!valid" color="success" @click="submit">Submit</v-btn>

          <v-btn color="error" @click="close">Cancel</v-btn>
        </v-card-actions>
      </v-layout>
    </v-card>
  </v-form>
</template>

<script>
import typeService from '../../services/type.service'

import Orientation from '../common/Orientation'

import api from '../../store/api'

export default {
  props: ['area', 'parent'],
  components: {
    Orientation
  },
  areaHierarchy: [
    // Country can have : Area, Mountain, Peak, Climbing site, Crag
    [1, 2, 3, 5, 6],
    // Area can have : Area, Mountain, Peak, Climbing site, Crag
    [1, 2, 3, 5, 6],
    // Mountain can have: Peak, Climbing site, Crag, Mountain side
    [3, 4, 5, 6],
    // peak can have: Climbing site, Crag, Mountain side
    [4, 5, 6],
    // mountain side can have: Climbing site, Crag, sector
    [5, 6, 7],
    // climbing site can have: Crag, sector
    [6, 7],
    // crag can have: sector
    [7]
  ],
  data: () => ({
    valid: true,
    nameRules: [v => !!v || 'Name is required'],
    typeRules: [v => v !== null || 'Must select an area type'],
    formData: {}
  }),
  computed: {
    allowedOrientation () {
      // type_id of areas that can have orientation
      return typeService.orientation.areaTypes.find((id) => id === this.formData.type_id)
    },
    types () {
      if (!this.parent) {
        // if there is no parent of newly added area, the area type can only be country
        return [
          {
            text: typeService.area[0],
            value: 0
          }
        ]
      }

      const types = []
      this.$options.areaHierarchy[this.parent.type_id].forEach(typeId => {
        types.push({
          text: typeService.area[typeId],
          value: typeId
        })
      })
      return types
    },
    altitudeLimits () {
      return [
        this.parent?.altitude[0] || 0,
        this.parent?.altitude[1] || 8848
      ]
    }
  },
  created () {
    this.formDefaultValues()
    this.area && this.assignPropToFormData(this.area)
  },
  watch: {
    area (newArea) {
      newArea && this.assignPropToFormData(newArea)
    }
  },
  methods: {
    assignPropToFormData (area) {
      this.formDefaultValues()
      for (const prop in this.formData) {
        this.formData[prop] = area[prop]
      }
    },
    formDefaultValues () {
      this.formData = {
        name: '',
        // eslint-disable-next-line @typescript-eslint/camelcase
        type_id: null,
        altitude: this.altitudeLimits,
        orientation: null
      }
    },
    close () {
      this.$store.dispatch('form/close')
    },
    submit () {
      if (this.area && this.area.id) {
        this.$store.commit('snackbar/show', 'Updating area ... ')
        api.put('area/' + this.area.id, this.formData)
          .then(
            () => {
              // there is no id in formData so i need to add one
              // before adding area to the store
              this.formData.id = this.area.id
              this.afterSubmit(this.formData)
            }
          )
      } else {
        this.$store.commit('snackbar/show', 'Adding area ... ')
        // eslint-disable-next-line @typescript-eslint/camelcase
        this.formData.parent_id = this.parent?.id || null
        api.post('area', this.formData)
          .then(
            ({ data }) => {
              // api returns id of newly added area
              // appending id to created area
              this.formData.id = data.id
              // eslint-disable-next-line @typescript-eslint/camelcase
              this.formData.map_tag = null
              this.afterSubmit(this.formData)
              // adding newly created area to parent area array of child areas
              this.$store.commit('area/appendArea', { areaId: data.id, parentId: data.parent_id })
            }
          )
      }
    },
    afterSubmit (area) {
      this.$store.commit('area/add', area)
      this.$store.commit('snackbar/success', 'Changes stored!')
      if (this.$vuetify.breakpoint.xs) {
        this.$store.commit('drawers/setRight', false)
      }
      this.$store.commit('drawers/setLeft', true)
      this.close()
    }
  }
}
</script>
