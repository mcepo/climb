import { Route, Area } from '@/models'

import store from '../store'

export enum AreaDatabaseId {
  Country = 0,
  Area = 1,
  Mountain = 3,
  MountainSide = 4,
  ClimbingSite = 5,
  Crag = 6,
  Sector = 7,
}
export enum ItemType {
  Area = 'area',
  Route = 'route',
  Trail = 'trail',
  Pitch = 'pitch'
}

export interface AreaType {
  // id of area type in database corresponds with type_id column
  databaseId: AreaDatabaseId;
  // display value
  value: string;
  // description of this area type, primarly used when adding a new area
  // so that the user can make better choice what type to set
  description: string;
  // can i have orientation, for instance Country can't have orientation
  orientation: boolean;
  // can it be tagged on the map
  mapTag: boolean;
  // can it be tagged on the image
  imageTag: boolean;
  // can have trails in it
  trail: boolean;
  // can have images
  image: boolean;
  // can tag area at my current location
  // some area like Country shouldn't be able to tag at my current location
  currentLocationTag: boolean;
  // can it have routes directly in the area, for instance Country can't
  // have a route directly under it
  routes: boolean;
  // what type of areas can this area hold
  parenting: Array<AreaDatabaseId>;
}

export enum RouteDatabaseId {
  Multipitch = 0,
  Singlepitch = 1,
  Waterfall = 2,
  Boulder = 3,
}

export interface RouteType {
  // id of route type in database corresponds with type_id column
  databaseId: RouteDatabaseId;
  // display value
  value: string;
  // description of this route type, primarly used when adding a new route
  // so that the user can make better choice what type to set
  description: string;
  // can it have orientation
  orientation: boolean;
  // can it be tagged on the map
  mapTag: boolean;
  // can it be tagged on the image
  imageTag: boolean;
  // can tag route at my current location
  // some routes like Singlepitch shouldn't be able to tag at my current location,
  // in fact they wont have map tags at all because they area to close together
  currentLocationTag: boolean;
  // can it have pitches, multipitch and waterfall can
  pitches: boolean;
}

export default {
  orientation: {
    items: [
      { labelShort: 'N', label: 'North', value: 0 },
      { labelShort: 'NE', label: 'North-East', value: 45 },
      { labelShort: 'E', label: 'East', value: 90 },
      { labelShort: 'SE', label: 'South-East', value: 135 },
      { labelShort: 'S', label: 'South', value: 180 },
      { labelShort: 'SW', label: 'South-West', value: 225 },
      { labelShort: 'W', label: 'West', value: 270 },
      { labelShort: 'NW', label: 'North-West', value: 315 }
    ],
    getLabel (value: number) {
      const item = this.items.find((item) => {
        const min: number = item.value - 22.5
        const max: number = item.value + 22.5
        return min < value && value < max
      })
      return item ? item.label : 'Not set'
    }
  },
  area: [
    {
      databaseId: AreaDatabaseId.Country,
      value: 'Country',
      description:
        'A country is a political state, nation, or controlled territory. ( Wiki :) )',
      orientation: false,
      mapTag: true,
      imageTag: false,
      image: false,
      trail: false,
      currentLocationTag: false,
      routes: false,
      parenting: [
        AreaDatabaseId.Area,
        AreaDatabaseId.ClimbingSite,
        AreaDatabaseId.Crag,
        AreaDatabaseId.Mountain,
        AreaDatabaseId.MountainSide
      ]
    } as AreaType,
    {
      databaseId: AreaDatabaseId.Area,
      value: 'Area',
      description:
        'A larger territory that has multiple Climbing sites / Mountains / Crags / smaller Areas, such as the Dolomites in Italy.',
      orientation: false,
      mapTag: true,
      imageTag: false,
      trail: false,
      image: false,
      currentLocationTag: false,
      parenting: [
        AreaDatabaseId.Area,
        AreaDatabaseId.ClimbingSite,
        AreaDatabaseId.Crag,
        AreaDatabaseId.Mountain,
        AreaDatabaseId.MountainSide
      ]
    } as AreaType,
    {
      databaseId: AreaDatabaseId.Mountain,
      value: 'Mountain',
      description:
        'A mountain is a large landform that rises above the surrounding land in a limited area, usually in the form of a peak. (Wiki :) )',
      orientation: false,
      mapTag: true,
      imageTag: false,
      trail: true,
      image: true,
      routes: false,
      currentLocationTag: false,
      parenting: [AreaDatabaseId.Crag, AreaDatabaseId.MountainSide]
    } as AreaType,
    {
      databaseId: AreaDatabaseId.MountainSide,
      value: 'Mountain side',
      description: 'Single side of a mountain.',
      orientation: true,
      mapTag: true,
      imageTag: false,
      image: true,
      trail: true,
      routes: true,
      currentLocationTag: false,
      parenting: [AreaDatabaseId.Crag, AreaDatabaseId.Sector]
    } as AreaType,
    {
      databaseId: AreaDatabaseId.ClimbingSite,
      value: 'Climbing site',
      description:
        'Has multiple Crags within 40min walking distance. Such as Paklenica in Croatia. ',
      orientation: false,
      mapTag: true,
      imageTag: false,
      image: true,
      trail: true,
      routes: false,
      currentLocationTag: false,
      parenting: [AreaDatabaseId.Crag]
    } as AreaType,
    {
      databaseId: AreaDatabaseId.Crag,
      value: 'Crag',
      description:
        'Has multiple Sectors and/or multiple climbing routes, all within 15min walking distance',
      orientation: true,
      mapTag: true,
      imageTag: true,
      image: true,
      trail: true,
      routes: true,
      currentLocationTag: true,
      parenting: [AreaDatabaseId.Sector]
    } as AreaType,
    {
      databaseId: AreaDatabaseId.Sector,
      value: 'Sector',
      description: 'Has multiple routes, all within 5min walking distance',
      orientation: true,
      mapTag: true,
      imageTag: true,
      image: true,
      trail: false,
      routes: true,
      currentLocationTag: true,
      parenting: []
    } as AreaType
  ],
  route: [
    {
      databaseId: RouteDatabaseId.Multipitch,
      value: 'Multipitch',
      description: 'Route that has multiple pitches, usually longer then 40m.',
      orientation: true,
      mapTag: true,
      imageTag: false,
      currentLocationTag: true,
      pitches: true
    } as RouteType,
    {
      databaseId: RouteDatabaseId.Singlepitch,
      value: 'Singlepitch',
      description:
        "Short climbing route doesn't have pitches, usually shorter then 40m.",
      orientation: true,
      mapTag: false,
      imageTag: true,
      currentLocationTag: false,
      pitches: false
    } as RouteType,
    {
      databaseId: RouteDatabaseId.Waterfall,
      value: 'Waterfall',
      description:
        'Ice climbing, can be single pitch or have multiple pitches.',
      orientation: true,
      mapTag: true,
      imageTag: true,
      currentLocationTag: true,
      pitches: true
    } as RouteType,
    {
      databaseId: RouteDatabaseId.Boulder,
      value: 'Boulder',
      description: 'No pitches here, just a big stone.',
      orientation: true,
      mapTag: false,
      imageTag: true,
      currentLocationTag: false,
      pitches: false
    } as RouteType
  ],

  hasOrientation (type: ItemType, id: AreaDatabaseId|RouteDatabaseId) {
    const itemType = this.find(type, id)
    return itemType.orientation
  },

  getChildTypes (item: Area|undefined) {
    if (!item) {
      // if item is undefined, that means that i am adding a Country
      // returning only the country
      return [
        this.shapeTypeForSelect(this.area.find(a => a.databaseId === AreaDatabaseId.Country))
      ]
    }

    const parentType = this.area.find(a => a.databaseId === item.type_id)

    return this.area.filter(a => {
      return parentType?.parenting.includes(a.databaseId)
    }).map(a => this.shapeTypeForSelect(a))
  },

  getTypeName (type: ItemType, id: AreaDatabaseId|RouteDatabaseId) {
    const itemType = this.find(type, id)

    return itemType ? itemType.value : ''
  },

  getRouteTypes () {
    return this.route.map(r => this.shapeTypeForSelect(r))
  },

  canTag (type: ItemType, id: AreaDatabaseId|RouteDatabaseId) {
    const itemType = this.find(type, id)

    return store.getters.imageOpen ? itemType.imageTag : itemType.mapTag
  },

  canTagCurrentLocation (type: ItemType, id: AreaDatabaseId|RouteDatabaseId) {
    const itemType = this.find(type, id)

    return store.getters.imageOpen ? false : itemType.currentLocationTag
  },

  hasTrails (type: ItemType, id: AreaDatabaseId|RouteDatabaseId) {
    const itemType = this.find(type, id)

    return type === ItemType.Area && !store.getters.imageOpen && itemType.trail
  },

  hasImages (type: ItemType, id: AreaDatabaseId|RouteDatabaseId) {
    const itemType = this.find(type, id)

    return type === ItemType.Route || itemType.image
  },

  canAddImage (type: ItemType, id: AreaDatabaseId|RouteDatabaseId) {
    const itemType = this.find(type, id)

    return type === ItemType.Area && itemType.image
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hasRoutes (type: ItemType, id: AreaDatabaseId|RouteDatabaseId) {
    return type === ItemType.Area
  },

  canAddRoute (type: ItemType, id: AreaDatabaseId|RouteDatabaseId) {
    const itemType = this.find(type, id)

    return type === ItemType.Area && itemType.routes
  },

  hasAreas (type: ItemType, item: Area|Route) {
    const itemType = this.find(type, item.type_id)

    let hasAreas = type === ItemType.Area && itemType.parenting

    if ('routes' in item) {
      hasAreas = hasAreas && item.routes?.length === 0
    }

    return hasAreas
  },

  hasPitches (type: ItemType, id: AreaDatabaseId|RouteDatabaseId) {
    const itemType = this.find(type, id)

    return type === ItemType.Route && itemType.pitches
  },

  find (type: ItemType, id: AreaDatabaseId|RouteDatabaseId) {
    return this[type].find((t: AreaType|RouteType) => t.databaseId === id)
  },

  shapeTypeForSelect (type: AreaType|RouteType|undefined) {
    return {
      value: type?.databaseId,
      text: type?.value
    }
  }
}
