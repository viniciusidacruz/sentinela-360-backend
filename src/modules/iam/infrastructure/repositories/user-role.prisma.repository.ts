import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/database/prisma/prisma.service';
import type {
  UserRoleRepositoryPort,
  CreateUserRoleInput,
} from '../../application/ports/user-role.repository.port';
import { UserRoleAssignment } from '../../domain/entities/user-role-assignment.entity';

@Injectable()
export class UserRolePrismaRepository implements UserRoleRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateUserRoleInput): Promise<UserRoleAssignment> {
    const userRoleData = await this.prisma.userRoleAssignment.create({
      data: {
        userId: input.userId,
        roleId: input.roleId,
      },
    });

    return this.mapToDomain(userRoleData);
  }

  async findByUserId(userId: string): Promise<UserRoleAssignment[]> {
    const userRolesData = await this.prisma.userRoleAssignment.findMany({
      where: { userId },
    });

    return userRolesData.map((data) => this.mapToDomain(data));
  }

  async findByRoleId(roleId: string): Promise<UserRoleAssignment[]> {
    const userRolesData = await this.prisma.userRoleAssignment.findMany({
      where: { roleId },
    });

    return userRolesData.map((data) => this.mapToDomain(data));
  }

  async findByUserIdAndRoleId(
    userId: string,
    roleId: string,
  ): Promise<UserRoleAssignment | null> {
    const userRoleData = await this.prisma.userRoleAssignment.findUnique({
      where: {
        userId_roleId: {
          userId,
          roleId,
        },
      },
    });

    if (!userRoleData) {
      return null;
    }

    return this.mapToDomain(userRoleData);
  }

  async delete(userId: string, roleId: string): Promise<void> {
    await this.prisma.userRoleAssignment.delete({
      where: {
        userId_roleId: {
          userId,
          roleId,
        },
      },
    });
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.prisma.userRoleAssignment.deleteMany({
      where: { userId },
    });
  }

  private mapToDomain(userRoleData: {
    id: string;
    userId: string;
    roleId: string;
    createdAt: Date;
  }): UserRoleAssignment {
    return new UserRoleAssignment(
      userRoleData.id,
      userRoleData.userId,
      userRoleData.roleId,
      userRoleData.createdAt,
    );
  }
}
