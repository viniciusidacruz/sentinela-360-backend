import { Module, forwardRef } from '@nestjs/common';
import { PrismaModule } from '@/common/database/prisma/prisma.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { CompanyModule } from '@/modules/company/company.module';
import { RolePrismaRepository } from './infrastructure/repositories/role.prisma.repository';
import { PermissionPrismaRepository } from './infrastructure/repositories/permission.prisma.repository';
import { UserRolePrismaRepository } from './infrastructure/repositories/user-role.prisma.repository';
import { RolePermissionPrismaRepository } from './infrastructure/repositories/role-permission.prisma.repository';
import { PermissionCheckerService } from './infrastructure/services/permission-checker.service';
import { AssignRoleToUserUseCase } from './application/use-cases/assign-role-to-user.usecase';
import { RemoveRoleFromUserUseCase } from './application/use-cases/remove-role-from-user.usecase';
import { CheckPermissionUseCase } from './application/use-cases/check-permission.usecase';
import { ListUserPermissionsUseCase } from './application/use-cases/list-user-permissions.usecase';
import { RolesController } from './presentation/controllers/roles.controller';
import { PermissionsController } from './presentation/controllers/permissions.controller';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => AuthModule),
    forwardRef(() => CompanyModule),
  ],
  controllers: [RolesController, PermissionsController],
  providers: [
    RolePrismaRepository,
    {
      provide: 'RoleRepositoryPort',
      useExisting: RolePrismaRepository,
    },
    PermissionPrismaRepository,
    {
      provide: 'PermissionRepositoryPort',
      useExisting: PermissionPrismaRepository,
    },
    UserRolePrismaRepository,
    {
      provide: 'UserRoleRepositoryPort',
      useExisting: UserRolePrismaRepository,
    },
    RolePermissionPrismaRepository,
    {
      provide: 'RolePermissionRepositoryPort',
      useExisting: RolePermissionPrismaRepository,
    },
    PermissionCheckerService,
    {
      provide: 'PermissionCheckerPort',
      useExisting: PermissionCheckerService,
    },
    AssignRoleToUserUseCase,
    RemoveRoleFromUserUseCase,
    CheckPermissionUseCase,
    ListUserPermissionsUseCase,
  ],
  exports: [
    'PermissionCheckerPort',
    'RoleRepositoryPort',
    'PermissionRepositoryPort',
    'UserRoleRepositoryPort',
    'RolePermissionRepositoryPort',
  ],
})
export class IamModule {}
