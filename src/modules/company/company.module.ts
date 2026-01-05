import { Module, forwardRef } from '@nestjs/common';
import { PrismaModule } from '@/common/database/prisma/prisma.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { CreateCompanyController } from './presentation/controllers/create-company.controller';
import { UpdateCompanyController } from './presentation/controllers/update-company.controller';
import { PublicCompaniesController } from './presentation/controllers/public-companies.controller';
import { AdminCompaniesController } from './presentation/controllers/admin-companies.controller';
import { CreateCompanyUseCase } from './application/use-cases/create-company.usecase';
import { GetCompanyUseCase } from './application/use-cases/get-company.usecase';
import { ListCompaniesUseCase } from './application/use-cases/list-companies.usecase';
import { UpdateCompanyUseCase } from './application/use-cases/update-company.usecase';
import { CompanyPrismaRepository } from './infrastructure/repositories/company.prisma.repository';

@Module({
  imports: [PrismaModule, forwardRef(() => AuthModule)],
  controllers: [
    PublicCompaniesController,
    AdminCompaniesController,
    CreateCompanyController,
    UpdateCompanyController,
  ],
  providers: [
    CompanyPrismaRepository,
    {
      provide: 'CompanyRepositoryPort',
      useExisting: CompanyPrismaRepository,
    },
    CreateCompanyUseCase,
    GetCompanyUseCase,
    ListCompaniesUseCase,
    UpdateCompanyUseCase,
  ],
  exports: ['CompanyRepositoryPort'],
})
export class CompanyModule {}
