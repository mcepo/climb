<template>
  <canvas v-if='orientations' :id="divId" height="250"></canvas>
</template>

<script>

export default {
  props: ['orientations'],
  computed: {
    divId () {
      return 'orientations-chart'
    }
  },
  async mounted () {
    if (!this.orientations) return

    import(/* webpackChunkName: "chart-js" */ 'chart.js')
      .then(
        ({ default: Chart }) => {
          const ctx = document.getElementById(this.divId)
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const myChart = new Chart(ctx, {
            type: 'radar',
            data: {
              labels: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'],
              datasets: [
                {
                  label: 'Route orientations (%)',
                  data: Object.values(this.orientations)
                }
              ]
            },
            options: {
              scale: {
                ticks: {
                  suggestedMin: 0,
                  suggestedMax: 50
                }
              }
            }
          })
        })
  }
}
</script>
