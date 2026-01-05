import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SWAGGER_CONSTANTS } from '@/common/constants/swagger.constants';
import { AdminGuard } from '@/modules/auth/presentation/guards/admin.guard';
import { GetCompanyUseCase } from '../../application/use-cases/get-company.usecase';
import type { CompanyRepositoryPort } from '../../application/ports/company.repository.port';
import { Inject } from '@nestjs/common';

@ApiTags(SWAGGER_CONSTANTS.TAGS.COMPANIES.name)
@Controller('admin/companies')
@UseGuards(AdminGuard)
export class AdminCompaniesController {
  constructor(
    private readonly getCompanyUseCase: GetCompanyUseCase,
    @Inject('CompanyRepositoryPort')
    private readonly companyRepository: CompanyRepositoryPort,
  ) {}

  @Get()
  @ApiBearerAuth(SWAGGER_CONSTANTS.BEARER_AUTH_NAME)
  @ApiOperation({
    summary: 'Buscar empresa do usuário autenticado (admin)',
    description:
      'Endpoint autenticado para buscar a empresa do usuário logado. Empresas veem apenas sua própria empresa.',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalhes da empresa do usuário autenticado',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @ApiResponse({
    status: 404,
    description: 'Empresa não encontrada para o usuário',
  })
  async getMyCompany(@Req() req: Request) {
    const userId = req.user?.sub;

    const result = await this.getCompanyUseCase.execute({
      userId,
    });

    return result;
  }
}
