export interface Permission {
  action: string;
  resource: string;
}

export interface Role {
  name: string;
  permissions: Permission[];
}

export interface RbacConfig {
  roles: Role[];
}