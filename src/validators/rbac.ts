import { IsArray, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class PermissionDTO {
  @IsString()
  action: string;

  @IsString()
  resource: string;
}

export class RoleDTO {
  @IsString()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermissionDTO)
  permissions: PermissionDTO[];
}

export class RbacConfigDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoleDTO)
  roles: RoleDTO[];
}