<template>
  <v-container fluid>
    <v-form ref="form" v-model="valid">
      <v-layout column>
        <v-card-title>
          Route filters
        </v-card-title>

        <v-flex>
          <v-card flat class="pa-1">
            <orientation v-model='orientation' multiple/>
          </v-card>
        </v-flex>

        <v-flex>
          <v-card flat class="pa-1">
            <v-card-title class="pa-0 justify-center">Length (m)</v-card-title>
            <v-card-text class="pa-0">
              <v-range-slider
                v-model="length"
                :max="maxLength"
                :min="minLength"
                thumb-label="always"
                thumb-size="34"
              ></v-range-slider>
            </v-card-text>
          </v-card>
        </v-flex>

        <v-flex v-for="(filter, index) in filters" :key="index">
          <v-card flat class="pa-1">
            <v-card-title class="pa-0 justify-center">{{typeName(index)}}</v-card-title>
            <v-card-text class="pa-0">
              <v-range-slider
                v-model="filters[index]"
                :max="maxGrades[index]"
                thumb-label="always"
                ticks="always"
                thumb-size="34"
              >
                <template slot="thumb-label" slot-scope="props">
                  <span>{{ tickLabels[index][props.value] }}</span>
                </template>
              </v-range-slider>
            </v-card-text>
          </v-card>
        </v-flex>

      </v-layout>

      <v-btn class='ma-1' color="success" @click="apply">Apply</v-btn>
      <v-btn class='ma-1' color="warning" @click="disableAll">Disable all</v-btn>
      <v-btn class='ma-1' color="error" @click="close">Cancel</v-btn>
    </v-form>
  </v-container>
</template>

<script>
import Vue from 'vue'

import Orientation from '../common/Orientation.vue'

import gradeService from '../../services/grade.service'

export default {
  data: () => ({
    valid: true,
    filters: [],
    maxGrades: [],
    tickLabels: [],
    // TODO: get min and max route length from server
    // when this component opens
    length: [0, 2000],
    maxLength: 2000,
    minLength: 0,
    orientation: []
  }),
  components: {
    Orientation
  },
  created () {
    const storedFilters = this.$store.getters['route/filters']

    gradeService.types.forEach((type, index) => {
      this.maxGrades.push(
        gradeService.charts[type.charts[0]].length - 1
      )

      let range
      if (storedFilters.gradeWeights && storedFilters.gradeWeights[index]) {
        range = storedFilters.gradeWeights[index]
      } else if (storedFilters.gradeTypes && storedFilters.gradeTypes.find((type) => (type === index)) !== undefined) {
        range = [0, 0]
      } else {
        range = [
          0,
          gradeService.charts[type.charts[0]].length - 1
        ]
      }

      this.filters.push(range)

      this.tickLabels.push(gradeService.charts[type.charts[0]])

      if (storedFilters.length) {
        this.length = storedFilters.length
      }

      if (storedFilters.orientation) {
        this.orientation = storedFilters.orientation
      }
    })
  },
  methods: {
    typeName (index) {
      return gradeService.types[index].name
    },
    apply () {
      const filters = {
        gradeWeights: {},
        gradeTypes: []
      }
      // i think  this is a very bad/ugly solution
      // TODO: change this to a more pleasant solution
      let hasGradeWeights = false
      let hasGradeTypes = false

      // adding only filters that are actually filtering
      this.filters.forEach((filter, index) => {
        if (
          filter[0] !== 0 ||
          (filter[1] !== this.maxGrades[index] && filter[1] !== 0)
        ) {
          hasGradeWeights = true
          filters.gradeWeights[index] = filter
        }
        if (filter[0] === 0 && filter[1] === 0) {
          hasGradeTypes = true
          filters.gradeTypes.push(index)
        }
      })

      // adding filtering by length
      if (
        this.length[0] !== this.minLength ||
        this.length[1] !== this.maxLength
      ) {
        filters.length = this.length
      }

      if (!hasGradeWeights) {
        delete (filters.gradeWeights)
      }

      if (!hasGradeTypes) {
        delete (filters.gradeTypes)
      }

      // adding filtering by orientation

      if (this.orientation !== []) {
        filters.orientation = this.orientation
      }

      this.$store.dispatch('route/loadFiltered', filters)
      this.close()
    },
    close () {
      this.$store.dispatch('form/close')
    },
    disableAll () {
      this.filters.forEach((filter, index, arr) => {
        Vue.set(arr, index, [0, 0])
      })

      this.length = [0, 0]
    }
  }
}
</script>
