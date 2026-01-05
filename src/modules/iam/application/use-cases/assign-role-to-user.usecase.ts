import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import type { UserRoleRepositoryPort } from '../ports/user-role.repository.port';
import type { RoleRepositoryPort } from '../ports/role.repository.port';
import type { UserRepositoryPort } from '@/modules/auth/application/ports/user.repository.port';

export interface AssignRoleToUserInput {
  userId: string;
  roleId: string;
}

export interface AssignRoleToUserOutput {
  userRole: {
    id: string;
    userId: string;
    roleId: string;
    createdAt: Date;
  };
}

@Injectable()
export class AssignRoleToUserUseCase {
  constructor(
    @Inject('UserRoleRepositoryPort')
    private readonly userRoleRepository: UserRoleRepositoryPort,
    @Inject('RoleRepositoryPort')
    private readonly roleRepository: RoleRepositoryPort,
    @Inject('UserRepositoryPort')
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(input: AssignRoleToUserInput): Promise<AssignRoleToUserOutput> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const role = await this.roleRepository.findById(input.roleId);
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const existingAssignment =
      await this.userRoleRepository.findByUserIdAndRoleId(
        input.userId,
        input.roleId,
      );

    if (existingAssignment) {
      throw new ConflictException('User already has this role');
    }

    const userRole = await this.userRoleRepository.create({
      userId: input.userId,
      roleId: input.roleId,
    });

    return {
      userRole: {
        id: userRole.id,
        userId: userRole.userId,
        roleId: userRole.roleId,
        createdAt: userRole.createdAt,
      },
    };
  }
}
