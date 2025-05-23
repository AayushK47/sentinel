import { describe, it, expect } from 'vitest';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { PermissionDTO, RbacConfigDTO, RoleDTO } from '@sentinel/validators';

describe('RbacConfigDTO', () => {
  it('should validate a correct config', async () => {
    const dto = plainToInstance(RbacConfigDTO, {
      roles: [
        {
          name: 'admin',
          permissions: [{ action: '*', resource: '*' }]
        }
      ]
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail with missing role name', async () => {
    const dto = plainToInstance(RbacConfigDTO, {
      roles: [
        {
          permissions: [{ action: '*', resource: '*' }]
        }
      ]
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);

    const roleErrors = errors[0].children ?? [];
    const nameError = roleErrors[0].children?.find(child => child.property === 'name');

    expect(nameError?.property).toBe('name');
  });
});

describe('PermissionDTO', () => {
  it('should validate a correct permission', async () => {
    const dto = plainToInstance(PermissionDTO, {
      action: 'read',
      resource: 'user',
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail if action or resource is missing', async () => {
    const dto = plainToInstance(PermissionDTO, {
      action: '',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.map(e => e.property)).toContain('resource');
  });
});

describe('RoleDTO', () => {
  it('should validate a correct role', async () => {
    const dto = plainToInstance(RoleDTO, {
      name: 'admin',
      permissions: [{ action: 'read', resource: 'user' }],
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail if name is missing or permissions invalid', async () => {
    const dto = plainToInstance(RoleDTO, {
      permissions: [{}] // missing action & resource
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);

    const nameError = errors.find(e => e.property === 'name');
    expect(nameError?.constraints?.isString).toBeDefined();

    const permissionsError = errors.find(e => e.property === 'permissions');
    const permissionChildren = permissionsError?.children?.[0].children ?? [];
    expect(permissionChildren.map(e => e.property)).toContain('action');
  });
});