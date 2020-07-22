import { Tag } from '.'

export interface Area {
  id: number;
  name: string;
  ancestors: number[]; // ids of ancestor areas
  areas: number[]; // ids of child areas
  statistics: Record<number, Record<number, number>>;
  type_id: number;
  map_tag: Tag;
  routes: number[]; // ids of routes in this areas ???? todo remove this
  images: number[]; // ids of image of this area
  trails: number[]; // ids of trails in this area
  moderators: number[]; // ids of users that moderate this area
  path: string;
  parent_id: number;

  // when all info on the area is loaded in the frontend
  fullyLoaded: boolean;
}
