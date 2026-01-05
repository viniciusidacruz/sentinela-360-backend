import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/database/prisma/prisma.service';
import type {
  RoleRepositoryPort,
  CreateRoleInput,
  UpdateRoleInput,
} from '../../application/ports/role.repository.port';
import { Role } from '../../domain/entities/role.entity';

@Injectable()
export class RolePrismaRepository implements RoleRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateRoleInput): Promise<Role> {
    const roleData = await this.prisma.role.create({
      data: {
        name: input.name,
        description: input.description || null,
      },
    });

    return this.mapToDomain(roleData);
  }

  async findById(id: string): Promise<Role | null> {
    const roleData = await this.prisma.role.findUnique({
      where: { id },
    });

    if (!roleData) {
      return null;
    }

    return this.mapToDomain(roleData);
  }

  async findByName(name: string): Promise<Role | null> {
    const roleData = await this.prisma.role.findUnique({
      where: { name },
    });

    if (!roleData) {
      return null;
    }

    return this.mapToDomain(roleData);
  }

  async findAll(): Promise<Role[]> {
    const rolesData = await this.prisma.role.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return rolesData.map((data) => this.mapToDomain(data));
  }

  async update(id: string, input: UpdateRoleInput): Promise<Role> {
    const updateData: {
      name?: string;
      description?: string | null;
    } = {};

    if (input.name !== undefined) {
      updateData.name = input.name;
    }

    if (input.description !== undefined) {
      updateData.description = input.description;
    }

    const roleData = await this.prisma.role.update({
      where: { id },
      data: updateData,
    });

    return this.mapToDomain(roleData);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.role.delete({
      where: { id },
    });
  }

  private mapToDomain(roleData: {
    id: string;
    name: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Role {
    return new Role(
      roleData.id,
      roleData.name,
      roleData.description,
      roleData.createdAt,
      roleData.updatedAt,
    );
  }
}
