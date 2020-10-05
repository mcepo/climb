import { Trail } from './trail'
import { Pitch } from './pitch'
import { Area } from './area'
import { Route } from './route'
import { Image } from './image'

export type TaggedType = 'area'|'route'|'pitch'|'trail'|'image'

export type GeometryType = 'Point'|'LineString'

export interface Tag {
  id: number;
  geometry: Geometry;
  tagged_type: TaggedType;
  tagged_id: number;
  tagged?: Area|Route|Pitch|Trail|Image;
  image_id: number;
  path: string;

  owner_id: number;
}

export interface Geometry {
  type: GeometryType;
  coordinates: [number, number]|Array<[number, number]>;
}
