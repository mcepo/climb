<template>
  <v-form ref="form" v-model="valid">
    <v-card text color="transparent" flat>

      <v-card-title>
        {{ 'Adding a pitch for - ' + route.name}}
      </v-card-title>

      <v-card-text class='pa-0'>
        <grade-input v-model="formData.grades" :multipitch="false"></grade-input>
      </v-card-text>

      <v-subheader>Length (m)</v-subheader>

      <v-card-text class="pt-0">
        <v-layout row>
          <v-flex class="px-3">
            <v-slider v-model="formData.length" max="70" min="0"/>
          </v-flex>
          <v-flex shrink style="width: 80px">
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
import GradeInput from '../common/GradeInput.vue'
import api from '../../store/api'

import drawers from '../../services/drawer.service'

export default {
  props: ['pitch', 'route'],
  components: {
    GradeInput
  },
  data: () => ({
    valid: true,
    formData: {}
  }),
  created () {
    this.formDefaultValues()
    if (this.pitch) {
      this.assignPropToFormData(this.pitch)
    }
  },

  setup () {
    return {
      drawers
    }
  },

  watch: {
    pitch (newPitch) {
      if (newPitch) {
        this.assignPropToFormData(this.newPitch)
      } else {
        this.formDefaultValues()
      }
    }
  },
  methods: {
    close () {
      this.$store.dispatch('form/close')
    },
    assignPropToFormData (pitch) {
      for (const prop in pitch) {
        this.formData[prop] = this.pitch[prop]
      }
    },
    formDefaultValues () {
      this.formData = {
        length: 0,
        grades: []
      }
    },
    submit () {
      if (this.pitch && this.pitch.id) {
        this.$store.dispatch('snackbar/show', 'Updating pitch ... ')
        api.put('pitch/' + this.pitch.id, this.formData)
          .then(
            () => {
              // there is no id in formData so i need to add one
              // before adding pitch to the store
              this.formData.id = this.pitch.id
              this.afterSubmit(this.formData)
            }
          )
      } else {
        this.$store.dispatch('snackbar/show', 'Adding pitch ... ')
        // eslint-disable-next-line @typescript-eslint/camelcase
        this.formData.route_id = this.route.id
        api.post('pitch', this.formData)
          .then(
            ({ data }) => {
              // api returns id of newly added pitch
              // appending id to created pitch
              this.formData.id = data
              // eslint-disable-next-line @typescript-eslint/camelcase
              this.afterSubmit(this.formData)
              // adding newly created area to parent area array of child areas
              this.$store.commit('route/appendPitch', { pitchId: data, routeId: this.route.id })
            }
          )
      }
    },
    afterSubmit (pitch) {
      this.$store.commit('pitch/add', pitch)
      this.$store.dispatch('snackbar/success', 'Done!')
      if (this.$vuetify.breakpoint.xs) {
        this.drawers.right = false
      }
      this.drawers.left = true
      this.close()
    }
  }
}
</script>
