import { Injectable, Inject } from '@nestjs/common';
import type { PermissionCheckerPort } from '../ports/permission-checker.port';

export interface CheckPermissionInput {
  userId: string;
  resource: string;
  action: string;
  companyId?: string;
}

export interface CheckPermissionOutput {
  allowed: boolean;
}

@Injectable()
export class CheckPermissionUseCase {
  constructor(
    @Inject('PermissionCheckerPort')
    private readonly permissionChecker: PermissionCheckerPort,
  ) {}

  async execute(input: CheckPermissionInput): Promise<CheckPermissionOutput> {
    const allowed = await this.permissionChecker.check({
      userId: input.userId,
      resource: input.resource,
      action: input.action,
      companyId: input.companyId,
    });

    return { allowed };
  }
}
