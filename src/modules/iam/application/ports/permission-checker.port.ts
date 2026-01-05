export interface PermissionCheckContext {
  userId: string;
  resource: string;
  action: string;
  companyId?: string;
}

export interface PermissionCheckerPort {
  check(context: PermissionCheckContext): Promise<boolean>;
  getUserPermissions(userId: string): Promise<string[]>;
}
