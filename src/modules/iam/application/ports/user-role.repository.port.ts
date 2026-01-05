import { UserRoleAssignment } from '../../domain/entities/user-role-assignment.entity';

export interface CreateUserRoleInput {
  userId: string;
  roleId: string;
}

export interface UserRoleRepositoryPort {
  create(input: CreateUserRoleInput): Promise<UserRoleAssignment>;
  findByUserId(userId: string): Promise<UserRoleAssignment[]>;
  findByRoleId(roleId: string): Promise<UserRoleAssignment[]>;
  findByUserIdAndRoleId(
    userId: string,
    roleId: string,
  ): Promise<UserRoleAssignment | null>;
  delete(userId: string, roleId: string): Promise<void>;
  deleteByUserId(userId: string): Promise<void>;
}
