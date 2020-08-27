import { Area, Route, Trail, Pitch, Tag } from '.'

export interface Image {
  id: number;
  size: number[];
  captured_type: 'area'|'route'|'pitch'|'trail';
  captured_id: number;
  captured: Area|Route|Trail|Pitch;
  tags: Tag[];
  map_tag: Tag;
  path: string;
  reviewer_id: number;

  // [latitudeBound, longitudeBound]
  boundary: number[];

  // routes for the tagged pitches
  routes: Route[];

  owner_id: number;

  // image is an entity by it self
  // if all parts of the image are loaded like tags, map_tag ...
  // then the image is fullyLoaded
  fullyLoaded: boolean;
}
