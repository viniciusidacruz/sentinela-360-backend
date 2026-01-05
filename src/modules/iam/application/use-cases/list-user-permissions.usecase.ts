import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import type { PermissionCheckerPort } from '../ports/permission-checker.port';
import type { UserRepositoryPort } from '@/modules/auth/application/ports/user.repository.port';

export interface ListUserPermissionsInput {
  userId: string;
}

export interface ListUserPermissionsOutput {
  permissions: string[];
}

@Injectable()
export class ListUserPermissionsUseCase {
  constructor(
    @Inject('PermissionCheckerPort')
    private readonly permissionChecker: PermissionCheckerPort,
    @Inject('UserRepositoryPort')
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(
    input: ListUserPermissionsInput,
  ): Promise<ListUserPermissionsOutput> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const permissions = await this.permissionChecker.getUserPermissions(
      input.userId,
    );

    return { permissions };
  }
}
