export class RolePermission {
  constructor(
    public readonly id: string,
    public readonly roleId: string,
    public readonly permissionId: string,
    public readonly createdAt: Date,
  ) {}
}
