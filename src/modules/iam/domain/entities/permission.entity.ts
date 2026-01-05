export class Permission {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly resource: string,
    public readonly action: string,
    public readonly description: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  matches(resource: string, action: string): boolean {
    return this.resource === resource && this.action === action;
  }

  getFullName(): string {
    return `${this.resource}:${this.action}`;
  }
}
