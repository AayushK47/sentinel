export interface Permission {
  action: string;
  resource: string;
}

export class Role {
  name: string;
  permissions: Permission[];
}

export interface RbacConfig {
  roles: Role[];
}