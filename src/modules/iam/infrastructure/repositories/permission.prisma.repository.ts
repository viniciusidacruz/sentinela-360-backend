import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/database/prisma/prisma.service';
import type {
  PermissionRepositoryPort,
  CreatePermissionInput,
  UpdatePermissionInput,
} from '../../application/ports/permission.repository.port';
import { Permission } from '../../domain/entities/permission.entity';

@Injectable()
export class PermissionPrismaRepository implements PermissionRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreatePermissionInput): Promise<Permission> {
    const permissionData = await this.prisma.permission.create({
      data: {
        name: input.name,
        resource: input.resource,
        action: input.action,
        description: input.description || null,
      },
    });

    return this.mapToDomain(permissionData);
  }

  async findById(id: string): Promise<Permission | null> {
    const permissionData = await this.prisma.permission.findUnique({
      where: { id },
    });

    if (!permissionData) {
      return null;
    }

    return this.mapToDomain(permissionData);
  }

  async findByName(name: string): Promise<Permission | null> {
    const permissionData = await this.prisma.permission.findUnique({
      where: { name },
    });

    if (!permissionData) {
      return null;
    }

    return this.mapToDomain(permissionData);
  }

  async findByResourceAndAction(
    resource: string,
    action: string,
  ): Promise<Permission | null> {
    const permissionData = await this.prisma.permission.findFirst({
      where: {
        resource,
        action,
      },
    });

    if (!permissionData) {
      return null;
    }

    return this.mapToDomain(permissionData);
  }

  async findAll(): Promise<Permission[]> {
    const permissionsData = await this.prisma.permission.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return permissionsData.map((data) => this.mapToDomain(data));
  }

  async update(id: string, input: UpdatePermissionInput): Promise<Permission> {
    const updateData: {
      name?: string;
      resource?: string;
      action?: string;
      description?: string | null;
    } = {};

    if (input.name !== undefined) {
      updateData.name = input.name;
    }

    if (input.resource !== undefined) {
      updateData.resource = input.resource;
    }

    if (input.action !== undefined) {
      updateData.action = input.action;
    }

    if (input.description !== undefined) {
      updateData.description = input.description;
    }

    const permissionData = await this.prisma.permission.update({
      where: { id },
      data: updateData,
    });

    return this.mapToDomain(permissionData);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.permission.delete({
      where: { id },
    });
  }

  private mapToDomain(permissionData: {
    id: string;
    name: string;
    resource: string;
    action: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Permission {
    return new Permission(
      permissionData.id,
      permissionData.name,
      permissionData.resource,
      permissionData.action,
      permissionData.description,
      permissionData.createdAt,
      permissionData.updatedAt,
    );
  }
}
