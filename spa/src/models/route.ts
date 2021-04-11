import { Area, Tag } from '.'

export interface Route {
  id: number;
  name: string;
  type_id: number;
  length: number;
  orientation: number;
  area_id: number;
  path: string;
  grades: Array<Array<number>>;
  map_tag: Tag;
  pitches: number[];
  ancestors: Area[];
  images: Area[];
  position: number;

  owner_id: number;

  // when all the info on route is loaded on the frontend

  fullyLoaded: number;
}
