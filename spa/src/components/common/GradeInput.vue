<template>
  <v-container fluid>
    <v-layout column>
      <v-flex v-for="(filter, index) in filters" :key="index">
        <v-card text class="pa-1">
          <v-card-title class="pa-0 justify-center">{{typeName(index)}}</v-card-title>
          <v-card-text class="pa-0">
            <v-slider
              v-model="filters[index]"
              :max="maxGrades[index]"
              thumb-label="always"
              ticks="always"
              thumb-size="34"
              @change="updateValue()"
            >
              <template slot="thumb-label" slot-scope="props">
                <span>{{ tickLabels[index][props.value] }}</span>
              </template>
            </v-slider>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import gradeService from '../../services/grade.service'

// TODO: here i am using objects and looping throu properties
// not the best solution, better would be looping throu items in array
// array of objects

export default {
  props: ['value'],
  data: () => ({
    filters: {},
    maxGrades: {},
    tickLabels: {}
  }),
  created () {
    gradeService.getGradesFor(this.$vnode.key).forEach(gradeType => {
      this.maxGrades[gradeType.id] =
        gradeService.charts[gradeType.charts[0]].length - 1

      this.filters[gradeType.id] = 0

      this.tickLabels[gradeType.id] = gradeService.charts[gradeType.charts[0]]
    })

    this.value.forEach((grade) => {
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
