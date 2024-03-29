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

      <v-card-text>
        <v-select
          v-model="formData.position"
          :items="routes"
          label="Left to right place route before"
          item-value='position'
          item-text='name'
          required
        ></v-select>
      </v-card-text>

      <orientation v-model='formData.orientation'/>

      <v-card-text class='pa-0'>
        <grade-input v-model="formData.grades" :multipitch='multipitch'></grade-input>
      </v-card-text>

      <v-subheader>Length (m)</v-subheader>

      <v-card-text class="pt-0">
        <v-layout row>
          <v-flex class="px-3">
            <v-slider v-model="formData.length" :max="maxLength" min="0"/>
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
import typeService, { RouteDatabaseId } from '../../services/type.service'

import Orientation from '../common/Orientation'

import api from '../../store/api'
import GradeInput from '../common/GradeInput'

import drawers from '../../services/drawer.service'

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
      return typeService.getRouteTypes()
    },
    maxLength () {
      const minAltitude = this.area.altitude[0] || 0
      const maxAltitude = this.area.altitude[1] || 1500

      const calcLength = (maxAltitude - minAltitude) * 3
      const maxLength = typeService.getMaxLength(this.formData.type_id)

      return maxLength && (maxLength < calcLength) ? maxLength : calcLength
    },
    multipitch () {
      return this.formData.type_id === RouteDatabaseId.Multipitch || this.formData.type_id === RouteDatabaseId.Waterfall
    },
    routes () {
      const routeIds = this.area.routes
      const routes = []

      routeIds.forEach(id => {
        const route = this.$store.state.route.byIds[id]

        if (!route || this.route?.id === route.id) return

        routes.push(route)
      })

      routes.push({
        position: routeIds.length + 1,
        name: 'End of ' + this.area.name
      })

      routes.forEach(route => {
        console.log(route.id, route.position)
      })

      return routes
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

      this.formData.position = this.formData.position + 1
    },
    formDefaultValues () {
      this.formData = {
        name: '',
        length: 0,
        grades: [],
        // eslint-disable-next-line @typescript-eslint/camelcase
        type_id: null,
        orientation: this.area.orientation,
        position: this.routes.length
      }
    },
    submit () {
      if (this.route && this.route.id) {
        this.$store.dispatch('snackbar/show', 'Updating route ... ')
        api.put('route/' + this.route.id, this.formData)
          .then(
            ({ data }) => {
              // there is no id in formData so i need to add one
              // before adding route to the store
              this.formData.id = this.route.id
              this.afterSubmit(this.formData, data.routes)
            }
          )
      } else {
        this.$store.dispatch('snackbar/show', 'Adding route ... ')
        // eslint-disable-next-line @typescript-eslint/camelcase
        this.formData.area_id = this.area.id
        api.post('route', this.formData)
          .then(
            ({ data }) => {
              // api returns id of newly added item
              // appending id to created item
              this.formData.id = data.id
              // path format is being defined all over the place
              // this could be a problem in the future
              this.formData.path = (this.area.path != null ? this.area.path + '.' : '') + this.area.id
              this.afterSubmit(this.formData, data.routes)
            }
          )
      }
    },
    afterSubmit (route, routes) {
      this.$store.commit('route/add', route)
      this.$store.dispatch('area/updateRoutePositions', { id: this.area.id, routes })
      this.$store.dispatch('snackbar/success', 'Done!')
      if (this.$vuetify.breakpoint.xs) {
        drawers.setRight(false)
      }
      drawers.setLeft(true)
      this.close()
    }
  }
}
</script>
