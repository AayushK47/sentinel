import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { RbacConfigDTO } from '@sentinel/validators';
import { Permission, RbacConfig } from '@sentinel/types';

export class Rbac {
  private constructor(private roles: Map<string, Permission[]>) { }

  public static async init(configInput: RbacConfig): Promise<Rbac> {
    const instance = plainToInstance(RbacConfigDTO, configInput);
    const errors = await validate(instance);

    if (errors.length > 0) {
      throw new Error(`Invalid config:-\n ${JSON.stringify(errors, null, 2)}`);
    }

    const roleMap = new Map(
      configInput.roles.map((role) => [role.name, role.permissions])
    );

    return new Rbac(roleMap);
  }

  public can(roleName: string, action: string, resource: string): boolean {
    const permissions = this.roles.get(roleName);
    if (!permissions) return false;

    return permissions.some((p) => {
      const actionMatch = p.action === '*' || p.action === action;
      const resourceMatch = p.resource === '*' || p.resource === resource;
      return actionMatch && resourceMatch;
    });
  }
}