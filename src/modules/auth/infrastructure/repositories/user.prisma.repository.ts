import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/database/prisma/prisma.service';
import {
  UserRepositoryPort,
  CreateUserInput,
} from '../../application/ports/user.repository.port';
import { Email } from '../../domain/value-objects/email.vo';
import { Password } from '../../domain/value-objects/password.vo';
import { User, UserRole, UserStatus } from '../../domain/entities/user.entity';

@Injectable()
export class UserPrismaRepository implements UserRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: Email): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({
      where: { email: email.getValue() },
    });

    if (!userData) {
      return null;
    }

    return this.mapToDomain(userData);
  }

  async findById(id: string): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!userData) {
      return null;
    }

    return this.mapToDomain(userData);
  }

  async create(user: CreateUserInput): Promise<User> {
    const userData = await this.prisma.user.create({
      data: {
        email: user.email.getValue(),
        passwordHash: user.passwordHash.getHash(),
        name: user.name,
        roles: user.roles,
        status: user.status,
      },
    });

    return this.mapToDomain(userData);
  }

  async updateRefreshTokenHash(
    userId: string,
    refreshTokenHash: string | null,
  ): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash },
    });
  }

  async update(user: User): Promise<User> {
    const userData = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        email: user.email.getValue(),
        passwordHash: user.passwordHash.getHash(),
        name: user.name,
        roles: user.roles,
        status: user.status,
        refreshTokenHash: null,
      },
    });

    return this.mapToDomain(userData);
  }

  private mapToDomain(userData: {
    id: string;
    email: string;
    passwordHash: string;
    name: string | null;
    roles: string[];
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return new User(
      userData.id,
      Email.create(userData.email),
      Password.fromHash(userData.passwordHash),
      userData.name,
      userData.roles as UserRole[],
      userData.status as UserStatus,
      userData.createdAt,
      userData.updatedAt,
    );
  }
}
