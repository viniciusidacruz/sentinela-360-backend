import { Injectable, Inject } from '@nestjs/common';
import type {
  PermissionCheckerPort,
  PermissionCheckContext,
} from '../../application/ports/permission-checker.port';
import type { UserRoleRepositoryPort } from '../../application/ports/user-role.repository.port';
import type { RolePermissionRepositoryPort } from '../../application/ports/role-permission.repository.port';
import type { PermissionRepositoryPort } from '../../application/ports/permission.repository.port';
import type { UserRepositoryPort } from '@/modules/auth/application/ports/user.repository.port';
import type { CompanyRepositoryPort } from '@/modules/company/application/ports/company.repository.port';
import { UserRole } from '@/modules/auth/domain/entities/user.entity';

@Injectable()
export class PermissionCheckerService implements PermissionCheckerPort {
  constructor(
    @Inject('UserRoleRepositoryPort')
    private readonly userRoleRepository: UserRoleRepositoryPort,
    @Inject('RolePermissionRepositoryPort')
    private readonly rolePermissionRepository: RolePermissionRepositoryPort,
    @Inject('PermissionRepositoryPort')
    private readonly permissionRepository: PermissionRepositoryPort,
    @Inject('UserRepositoryPort')
    private readonly userRepository: UserRepositoryPort,
    @Inject('CompanyRepositoryPort')
    private readonly companyRepository: CompanyRepositoryPort,
  ) {}

  async check(context: PermissionCheckContext): Promise<boolean> {
    const user = await this.userRepository.findById(context.userId);

    if (!user || !user.isActive()) {
      return false;
    }

    if (user.hasRole(UserRole.SUPER_ADMIN)) {
      return true;
    }

    const userRoles = await this.userRoleRepository.findByUserId(
      context.userId,
    );

    if (userRoles.length === 0) {
      return false;
    }

    const permission = await this.permissionRepository.findByResourceAndAction(
      context.resource,
      context.action,
    );

    if (!permission) {
      return false;
    }

    for (const userRole of userRoles) {
      const rolePermissions = await this.rolePermissionRepository.findByRoleId(
        userRole.roleId,
      );

      const hasPermission = rolePermissions.some(
        (rp) => rp.permissionId === permission.id,
      );

      if (hasPermission) {
        if (context.companyId) {
          const userCompany = await this.companyRepository.findByUserId(
            context.userId,
          );
          if (userCompany && userCompany.id === context.companyId) {
            return true;
          }
        } else {
          return true;
        }
      }
    }

    return false;
  }

  async getUserPermissions(userId: string): Promise<string[]> {
    const user = await this.userRepository.findById(userId);

    if (!user || !user.isActive()) {
      return [];
    }

    if (user.hasRole(UserRole.SUPER_ADMIN)) {
      const allPermissions = await this.permissionRepository.findAll();
      return allPermissions.map((p) => p.getFullName());
    }

    const userRoles = await this.userRoleRepository.findByUserId(userId);

    if (userRoles.length === 0) {
      return [];
    }

    const permissionIds = new Set<string>();

    for (const userRole of userRoles) {
      const rolePermissions = await this.rolePermissionRepository.findByRoleId(
        userRole.roleId,
      );

      rolePermissions.forEach((rp) => permissionIds.add(rp.permissionId));
    }

    const permissions = await Promise.all(
      Array.from(permissionIds).map((id) =>
        this.permissionRepository.findById(id),
      ),
    );

    return permissions
      .filter((p): p is NonNullable<typeof p> => p !== null)
      .map((p) => p.getFullName());
  }
}
