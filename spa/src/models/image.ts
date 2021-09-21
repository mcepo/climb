import { Route, Tag } from '.'

export interface Image {
  id: number;
  size: number[];
  tags: Tag[];
  map_tag: Tag;
  path: string;
  reviewer_id: number;

  // [latitudeBound, longitudeBound]
  boundary: number[];

  // routes for the tagged pitches
  routes?: Route[];

  owner_id: number;

  // image is an entity by it self
  // if all parts of the image are loaded like tags, map_tag ...
  // then the image is fullyLoaded
  fullyLoaded: number;
}
