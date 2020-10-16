import { RouteFilters, Area } from '@/models'

export function areaPassesFilter (area: Area, filters: RouteFilters) {
  // length filter
  if (filters.length) {
    let lengthPassed = false

    for (const length in area.length_stats) {
      const lengthNumber: number = parseInt(length)

      if (lengthNumber >= filters.length[0] && lengthNumber <= filters.length[1]) {
        lengthPassed = true
        break
      }
    }
    if (!lengthPassed) return false
  }

  // orientation filter
  if (filters.orientation && filters.orientation.length !== 0) {
    // if area orientations isn't in the filtered orientations
    // check underlying stats
    const orientationPassed = filters.orientation.indexOf(area.orientation) !== -1 ||
      (
        area.orientations &&
        filters.orientation.some(orientation => {
          return area.orientations[orientation] !== 0
        })
      )

    if (!orientationPassed) return false
  }

  // grade filters
  if (filters.gradeWeights) {
    let gradesPassed = false

    for (const gradeType in filters.gradeWeights) {
      const gradeWeights = filters.gradeWeights[gradeType]

      if (area.grade_stats[gradeType]) {
        if (area.grade_stats[gradeType] &&
          Object.keys(area.grade_stats[gradeType])
            .map(gw => parseInt(gw))
            .some(gw => gw > gradeWeights[0] && gw < gradeWeights[1])) {
          gradesPassed = true
          break
        }
      }
    }
    if (!gradesPassed) return false
  }

  return true
}
