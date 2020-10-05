import { Area, Tag, Route, Image, Trail, User } from '.'

export interface Activity {
  id: number[];
  description: string;
  subject: Area|Image|Route|Trail|Tag;
  causer: User;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  properties: Record<string, any>;
  created_at: string;
  subject_type: string;
  reviewed_at: string;
  reviewed_by: number;
  status: boolean;
}
