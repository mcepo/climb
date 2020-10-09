<template>
  <v-container fluid>
    <v-layout column>
      <v-subheader>Grade</v-subheader>
      <v-flex v-for="(primaryGrade, index) in primaryGrades" :key="index">
        <v-card text class="pa-1" flat>
          <v-subheader class="pa-0 justify-center">{{
            primaryGrade.grade.name
          }}</v-subheader>
          <v-card-text class="pa-0">
            <v-slider
              v-model="filters[index]"
              :max="primaryGrade.maxGrades"
              thumb-label="always"
              ticks="always"
              thumb-size="34"
              @change="updateValue()"
            >
              <template slot="thumb-label" slot-scope="props">
                <span>{{ primaryGrade.tickLabels[props.value] }}</span>
              </template>
            </v-slider>
          </v-card-text>
        </v-card>
      </v-flex>

    <v-expansion-panels flat>
    <v-expansion-panel>
      <v-expansion-panel-header>
        <v-subheader class="pa-0">
          More grades ...
        </v-subheader>
      </v-expansion-panel-header>
      <v-expansion-panel-content>

      <v-flex v-for="(moreGrade, index) in moreGrades" :key="index">
        <v-card text class="pa-1" flat>
          <v-subheader class="pa-0 justify-center">{{
            moreGrade.grade.name
          }}</v-subheader>
          <v-card-text class="pa-0">
            <v-slider
              v-model="filters[index]"
              :max="moreGrade.maxGrades"
              thumb-label="always"
              ticks="always"
              thumb-size="34"
              @change="updateValue()"
            >
              <template slot="thumb-label" slot-scope="props">
                <span>{{ moreGrade.tickLabels[props.value] }}</span>
              </template>
            </v-slider>
          </v-card-text>
        </v-card>
      </v-flex>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
    </v-layout>
  </v-container>
</template>

<script>
import gradeService from '../../services/grade.service'

// TODO: here i am using objects and looping throu properties
// not the best solution, better would be looping throu items in array
// array of objects

export default {
  props: ['value', 'multipitch'],
  data: () => ({
    filters: {}
  }),
  computed: {
    primaryGrades () {
      return gradeService.getGradesForSliders(this.multipitch, true)
    },
    moreGrades () {
      return gradeService.getGradesForSliders(this.multipitch, false)
    }
  },
  created () {
    // init filters to zero
    for (let i = 0; i < gradeService.types.length; i++) {
      this.filters[i] = 0
    }

    // addd values to filters from input
    this.value &&
      this.value.forEach(grade => {
        this.filters[grade[0]] = grade[1]
      })
    this.updateValue()
  },
  methods: {
    typeName (index) {
      return gradeService.types[index].name
    },
    updateValue () {
      const grades = []

      // filtering out grades that are zero, they aren't set
      for (const prop in this.filters) {
        if (this.filters[prop] !== 0) {
          grades.push([parseInt(prop), this.filters[prop]])
        }
      }
      this.$emit('input', grades)
    }
  }
}
</script>
