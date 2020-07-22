import { RouteFilters, Route } from '@/models'

export function routePassesFilter (route: Route, filters: RouteFilters) {
  // check route in selected area
  if (filters.path && !route.path.startsWith(filters.path)) return false

  // check route has required length
  if (filters.length && (route.length < filters.length[0] || route.length > filters.length[1])) return false

  // check route has required gradess
  for (const id in route.grades) {
    const type = route.grades[id][0]
    const value = route.grades[id][1]

    if (filters.gradeTypes && filters.gradeTypes.includes(type)) return false

    if (filters.gradeWeights && filters.gradeWeights[type]) {
      if (filters.gradeWeights[type][0] <= value || filters.gradeWeights[type][1] >= value) return false
    }
  }

  if (filters.query && !route.name.toLocaleLowerCase().includes(filters.query.toLocaleLowerCase())) return false

  return true
}
