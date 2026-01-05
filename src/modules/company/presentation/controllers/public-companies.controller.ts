import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { SWAGGER_CONSTANTS } from '@/common/constants/swagger.constants';
import { ListCompaniesUseCase } from '../../application/use-cases/list-companies.usecase';
import { GetCompanyUseCase } from '../../application/use-cases/get-company.usecase';
import {
  CompanyStatus,
  CompanyCategory,
} from '../../domain/entities/company.entity';

@ApiTags(SWAGGER_CONSTANTS.TAGS.COMPANIES.name)
@Controller('companies')
export class PublicCompaniesController {
  constructor(
    private readonly listCompaniesUseCase: ListCompaniesUseCase,
    private readonly getCompanyUseCase: GetCompanyUseCase,
  ) {}

  @Get('list')
  @ApiOperation({
    summary: 'Listar todas as empresas (público)',
    description:
      'Endpoint público para listar todas as empresas cadastradas. Suporta filtros por status, categoria, busca por texto e paginação.',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filtrar por status da empresa (ACTIVE, INACTIVE, PENDING)',
    enum: ['ACTIVE', 'INACTIVE', 'PENDING'],
  })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Filtrar por categoria da empresa',
    enum: CompanyCategory,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Buscar por nome da empresa (case-insensitive)',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número da página (padrão: 1)',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Itens por página (padrão: 10)',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de empresas com metadados de paginação',
  })
  async list(
    @Query('status') status?: string,
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.listCompaniesUseCase.execute({
      status: status ? (status as CompanyStatus) : undefined,
      category: category ? (category as CompanyCategory) : undefined,
      search,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });

    return result;
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar empresa por ID (público)',
    description:
      'Endpoint público para buscar detalhes de uma empresa específica por ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da empresa',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalhes da empresa',
  })
  @ApiResponse({
    status: 404,
    description: 'Empresa não encontrada',
  })
  async getById(@Param('id') id: string) {
    const result = await this.getCompanyUseCase.execute({ id });
    return result;
  }
}
