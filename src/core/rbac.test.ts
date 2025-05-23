import { describe, it, expect } from 'vitest';

import { Rbac } from '@sentinel/core';
import type { RbacConfig } from '@sentinel/types';

const config: RbacConfig = {
  roles: [
    {
      name: 'admin',
      permissions: [{ action: '*', resource: '*' }],
    },
    {
      name: 'user',
      permissions: [{ action: 'read', resource: 'profile' }],
    },
  ],
};

describe('Rbac', () => {
  it('admin can do anything', async () => {
    const rbac = await Rbac.init(config);
    expect(rbac.can('admin', 'delete', 'user')).toBe(true);
  });

  it('user cannot delete profile', async () => {
    const rbac = await Rbac.init(config);
    expect(rbac.can('user', 'delete', 'profile')).toBe(false);
  });
});