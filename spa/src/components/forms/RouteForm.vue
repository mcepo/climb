<template>
  <v-form ref="form" v-model="valid">
    <v-card text color="transparent" flat>
      <v-card-title>
        {{ route ? 'Editing - ' + route.name : 'Adding route'}}
      </v-card-title>
      <v-card-text>
        <v-text-field v-model="formData.name" :rules="nameRules" label="Route name" required></v-text-field>
      </v-card-text>

      <v-card-text class="pt-0">
        <v-select
          v-model="formData.type_id"
          :items="types"
          :rules="typeRules"
          label="Route type"
          required
        ></v-select>
      </v-card-text>

      <orientation v-model='formData.orientation'/>

      <v-card-text class='pa-0'>
        <grade-input v-model="formData.grades" :type='formData.type_id' :key='formData.type_id'></grade-input>
      </v-card-text>

      <v-subheader>Length (m)</v-subheader>

      <v-card-text class="pt-0">
        <v-layout row>
          <v-flex class="px-3">
            <v-slider v-model="formData.length" max="3000" min="0"/>
          </v-flex>
          <v-flex shrink style="width: 50px">
            <v-text-field
              v-model="formData.length"
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
import GradeInput from '../common/GradeInput'

export default {
  props: ['route', 'area'],
  components: {
    GradeInput,
    Orientation
  },
  data: () => ({
    valid: true,
    nameRules: [v => !!v || 'Name is required'],
    typeRules: [v => v !== null || 'Must select an route type'],
    formData: {}
  }),
  computed: {
    types () {
      const types = []
      typeService.route.forEach((text, value) => {
        types.push({
          text,
          value
        })
      })
      return types
    }
  },
  created () {
    this.formDefaultValues()
    this.route && this.assignPropToFormData(this.route)
  },
  watch: {
    route (newRoute) {
      newRoute && this.assignPropToFormData(newRoute)
    }
  },
  methods: {
    close () {
      this.$store.dispatch('form/close')
    },
    assignPropToFormData (route) {
      for (const prop in this.formData) {
        this.formData[prop] = route[prop]
      }
    },
    formDefaultValues () {
      this.formData = {
        name: '',
        length: 0,
        grades: [],
        // eslint-disable-next-line @typescript-eslint/camelcase
        type_id: null,
        orientation: this.area.orientation
      }
    },
    submit () {
      if (this.route && this.route.id) {
        this.$store.commit('snackbar/show', 'Updating route ... ')
        api.put('route/' + this.route.id, this.formData)
          .then(
            () => {
              // there is no id in formData so i need to add one
              // before adding route to the store
              this.formData.id = this.route.id
              this.afterSubmit(this.formData)
            }
          )
      } else {
        this.$store.commit('snackbar/show', 'Adding route ... ')
        // eslint-disable-next-line @typescript-eslint/camelcase
        this.formData.area_id = this.area.id
        api.post('route', this.formData)
          .then(
            ({ data }) => {
              // api returns id of newly added item
              // appending id to created item
              this.formData.id = data
              this.afterSubmit(this.formData)
              // adding newly created item to area routes list
              this.$store.commit('area/appendRoute', { routeId: data, areaId: this.area.id })
            }
          )
      }
    },
    afterSubmit (route) {
      this.$store.commit('route/add', route)
      this.$store.commit('snackbar/success', 'Done!')
      if (window.innerWidth < 1264) {
        /// hack
        this.$store.commit('drawers/setRight', false)
      }
      this.$store.commit('drawers/setLeft', true)
      this.close()
    }
  }
}
</script>
