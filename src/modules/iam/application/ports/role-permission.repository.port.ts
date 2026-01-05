import { RolePermission } from '../../domain/entities/role-permission.entity';

export interface CreateRolePermissionInput {
  roleId: string;
  permissionId: string;
}

export interface RolePermissionRepositoryPort {
  create(input: CreateRolePermissionInput): Promise<RolePermission>;
  findByRoleId(roleId: string): Promise<RolePermission[]>;
  findByPermissionId(permissionId: string): Promise<RolePermission[]>;
  findByRoleIdAndPermissionId(
    roleId: string,
    permissionId: string,
  ): Promise<RolePermission | null>;
  delete(roleId: string, permissionId: string): Promise<void>;
  deleteByRoleId(roleId: string): Promise<void>;
}
