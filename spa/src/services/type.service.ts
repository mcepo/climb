export default {
  orientation: {
    items: [
      { labelShort: 'N', label: 'North', value: 0 },
      { labelShort: 'NE', label: 'Northeast', value: 45 },
      { labelShort: 'E', label: 'East', value: 90 },
      { labelShort: 'SE', label: 'South-East', value: 135 },
      { labelShort: 'S', label: 'South', value: 180 },
      { labelShort: 'SW', label: 'South-West', value: 225 },
      { labelShort: 'W', label: 'West', value: 270 },
      { labelShort: 'NW', label: 'North-West', value: 315 }
    ],
    getLabel (value: number) {
      const item = this.items.find(item => {
        const min: number = item.value - 22.5
        const max: number = item.value + 22.5
        return (min < value) && (value < max)
      })
      return item ? item.label : 'Not set'
    }
  },
  area: [
    'Country', // 0
    'Area', // 1
    'Mountain', // 2
    'Peak', // 3
    'Mountain side', // 4
    'Climbing site', // 5
    'Crag', // 6
    'Sector' // 7
  ],
  route: [
    'Multipitch',
    'Singlepitch',
    'Waterfall',
    'Boulder'
  ]
}
