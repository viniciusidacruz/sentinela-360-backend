import { Permission } from '../../domain/entities/permission.entity';

export interface CreatePermissionInput {
  name: string;
  resource: string;
  action: string;
  description?: string | null;
}

export interface UpdatePermissionInput {
  name?: string;
  resource?: string;
  action?: string;
  description?: string | null;
}

export interface PermissionRepositoryPort {
  create(input: CreatePermissionInput): Promise<Permission>;
  findById(id: string): Promise<Permission | null>;
  findByName(name: string): Promise<Permission | null>;
  findByResourceAndAction(
    resource: string,
    action: string,
  ): Promise<Permission | null>;
  findAll(): Promise<Permission[]>;
  update(id: string, input: UpdatePermissionInput): Promise<Permission>;
  delete(id: string): Promise<void>;
}
