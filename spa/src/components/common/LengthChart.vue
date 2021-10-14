<template>
  <canvas v-if='show' :id="divId" height='250'></canvas>
</template>

<script>

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
    },
    show () {
      return this.stats && (!Array.isArray(this.stats))
    }
  },
  mounted () {
    if (!this.show) return

    import(/* webpackChunkName: "chart-js" */ 'chart.js')
      .then(
        ({ default: Chart }) => {
          const ctx = document.getElementById(this.divId)
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const myChart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: this.keys,
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
