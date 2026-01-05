export class UserRoleAssignment {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly roleId: string,
    public readonly createdAt: Date,
  ) {}
}
