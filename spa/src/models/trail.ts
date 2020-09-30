import { Tag } from '.'

export interface Trail {
  id: number;
  name: string;
  map_tag: Tag;
  path: string;
  owner_id: number;
}
