export interface User {
  path_permissions: string[];
  name: string;
  email: string;
  role_id: Role;
  id: number;
}

export enum Role {
  ADMIN = 1,
  USER = 2
}
