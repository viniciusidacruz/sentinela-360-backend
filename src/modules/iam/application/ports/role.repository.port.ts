import { Role } from '../../domain/entities/role.entity';

export interface CreateRoleInput {
  name: string;
  description?: string | null;
}

export interface UpdateRoleInput {
  name?: string;
  description?: string | null;
}

export interface RoleRepositoryPort {
  create(input: CreateRoleInput): Promise<Role>;
  findById(id: string): Promise<Role | null>;
  findByName(name: string): Promise<Role | null>;
  findAll(): Promise<Role[]>;
  update(id: string, input: UpdateRoleInput): Promise<Role>;
  delete(id: string): Promise<void>;
}
