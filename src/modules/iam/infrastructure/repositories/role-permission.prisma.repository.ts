import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/database/prisma/prisma.service';
import type {
  RolePermissionRepositoryPort,
  CreateRolePermissionInput,
} from '../../application/ports/role-permission.repository.port';
import { RolePermission } from '../../domain/entities/role-permission.entity';

@Injectable()
export class RolePermissionPrismaRepository implements RolePermissionRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateRolePermissionInput): Promise<RolePermission> {
    const rolePermissionData = await this.prisma.rolePermission.create({
      data: {
        roleId: input.roleId,
        permissionId: input.permissionId,
      },
    });

    return this.mapToDomain(rolePermissionData);
  }

  async findByRoleId(roleId: string): Promise<RolePermission[]> {
    const rolePermissionsData = await this.prisma.rolePermission.findMany({
      where: { roleId },
    });

    return rolePermissionsData.map((data) => this.mapToDomain(data));
  }

  async findByPermissionId(permissionId: string): Promise<RolePermission[]> {
    const rolePermissionsData = await this.prisma.rolePermission.findMany({
      where: { permissionId },
    });

    return rolePermissionsData.map((data) => this.mapToDomain(data));
  }

  async findByRoleIdAndPermissionId(
    roleId: string,
    permissionId: string,
  ): Promise<RolePermission | null> {
    const rolePermissionData = await this.prisma.rolePermission.findUnique({
      where: {
        roleId_permissionId: {
          roleId,
          permissionId,
        },
      },
    });

    if (!rolePermissionData) {
      return null;
    }

    return this.mapToDomain(rolePermissionData);
  }

  async delete(roleId: string, permissionId: string): Promise<void> {
    await this.prisma.rolePermission.delete({
      where: {
        roleId_permissionId: {
          roleId,
          permissionId,
        },
      },
    });
  }

  async deleteByRoleId(roleId: string): Promise<void> {
    await this.prisma.rolePermission.deleteMany({
      where: { roleId },
    });
  }

  private mapToDomain(rolePermissionData: {
    id: string;
    roleId: string;
    permissionId: string;
    createdAt: Date;
  }): RolePermission {
    return new RolePermission(
      rolePermissionData.id,
      rolePermissionData.roleId,
      rolePermissionData.permissionId,
      rolePermissionData.createdAt,
    );
  }
}
