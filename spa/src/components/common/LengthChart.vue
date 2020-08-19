<template>
  <canvas :id="divId" height='250'></canvas>
</template>

<script>
import Chart from 'chart.js'

export default {
  props: ['stats'],
  computed: {
    divId () {
      return 'length-chart'
    },
    data () {
      return Object.values(this.stats)
    },
    keys () {
      const lengths = []
      for (const length in this.stats) {
        lengths.push(length + 'm')
      }
      return lengths
    }
  },
  mounted () {
    const ctx = document.getElementById(this.divId)
    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.keys,
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
          text: 'Route lengths',
          display: true
        },
        elements: {
          rectangle: {
            backgroundColor: 'grey'
          }
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    })
  }
}
</script>
