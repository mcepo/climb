<template>
  <canvas :id="divId" height="250"></canvas>
</template>

<script>

import gradeService from '../../services/grade.service'
import { routeDifficultyGradeColors } from '../../services/style.service'

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
  async mounted () {

    const backgroundColor = this.type == 10 ? routeDifficultyGradeColors : 'grey'

    import(/* webpackChunkName: "chart-js" */ 'chart.js')
      .then(
        ({ default: Chart }) => {
          const ctx = document.getElementById(this.divId)
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const myChart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: this.gradeChartArray,
              datasets: [
                {
                  label: 'Routes ',
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
                  backgroundColor
                }
              },
              scales: {
                yAxes: [
                  {
                    ticks: {
                      beginAtZero: true,
                      precision: 0
                    }
                  }
                ]
              }
            }
          })
        })
  }
}
</script>
