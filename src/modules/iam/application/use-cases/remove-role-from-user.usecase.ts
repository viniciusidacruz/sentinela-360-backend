import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import type { UserRoleRepositoryPort } from '../ports/user-role.repository.port';
import type { RoleRepositoryPort } from '../ports/role.repository.port';
import type { UserRepositoryPort } from '@/modules/auth/application/ports/user.repository.port';

export interface RemoveRoleFromUserInput {
  userId: string;
  roleId: string;
}

@Injectable()
export class RemoveRoleFromUserUseCase {
  constructor(
    @Inject('UserRoleRepositoryPort')
    private readonly userRoleRepository: UserRoleRepositoryPort,
    @Inject('RoleRepositoryPort')
    private readonly roleRepository: RoleRepositoryPort,
    @Inject('UserRepositoryPort')
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(input: RemoveRoleFromUserInput): Promise<void> {
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

    if (!existingAssignment) {
      throw new NotFoundException('User does not have this role');
    }

    await this.userRoleRepository.delete(input.userId, input.roleId);
  }
}
