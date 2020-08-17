<template>
  <canvas :id="divId" height='250'></canvas>
</template>

<script>
import Chart from 'chart.js'

import gradeService from '../../services/grade.service'

export default {
  props: ['type', 'stats'],
  computed: {
    divId () {
      return 'statistics-chart' + this.type
    },
    gradeTypeObject () {
      return gradeService.types[this.type]
    },
    gradeChartArray () {
      return gradeService.charts[this.gradeTypeObject.charts[0]]
    },
    data () {
      const arrayData = []

      for (const key in this.gradeChartArray) {
        if (this.stats[key]) {
          arrayData.push(this.stats[key])
        } else {
          arrayData.push(0)
        }
      }
      return arrayData
    }
  },
  mounted () {
    const ctx = document.getElementById(this.divId)
    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.gradeChartArray,
        datasets: [
          {
            label: 'Climbs ',
            data: this.data
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        title: {
          text: this.gradeTypeObject.name,
          display: true
        },
        elements: {
          rectangle: {
            backgroundColor: 'grey'
          }
        }
      }
    })
  }
}
</script>
