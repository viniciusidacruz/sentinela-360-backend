import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { SWAGGER_CONSTANTS } from '@/common/constants/swagger.constants';
import { GetReputationMetricsUseCase } from '../../application/use-cases/get-reputation-metrics.usecase';
import { GetReputationHistoryUseCase } from '../../application/use-cases/get-reputation-history.usecase';
import { GetRankingsUseCase } from '../../application/use-cases/get-rankings.usecase';
import { CompanyCategory } from '@/modules/company/domain/entities/company.entity';

@ApiTags('Reputation')
@Controller('reputation')
export class PublicReputationController {
  constructor(
    private readonly getReputationMetricsUseCase: GetReputationMetricsUseCase,
    private readonly getReputationHistoryUseCase: GetReputationHistoryUseCase,
    private readonly getRankingsUseCase: GetRankingsUseCase,
  ) {}

  @Get('companies/:companyId')
  @ApiOperation({
    summary: 'Obter métricas de reputação de uma empresa (público)',
    description:
      'Endpoint público para obter as métricas de reputação de uma empresa específica',
  })
  @ApiParam({
    name: 'companyId',
    description: 'ID da empresa',
  })
  @ApiResponse({
    status: 200,
    description: 'Métricas de reputação da empresa',
  })
  @ApiResponse({
    status: 404,
    description: 'Empresa ou métricas não encontradas',
  })
  async getMetrics(@Param('companyId') companyId: string) {
    const result = await this.getReputationMetricsUseCase.execute({
      companyId,
    });
    return result;
  }

  @Get('companies/:companyId/history')
  @ApiOperation({
    summary: 'Obter histórico de reputação de uma empresa (público)',
    description:
      'Endpoint público para obter o histórico de reputação de uma empresa com tendência',
  })
  @ApiParam({
    name: 'companyId',
    description: 'ID da empresa',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Número de registros históricos (padrão: 30)',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Histórico de reputação com tendência',
  })
  @ApiResponse({
    status: 404,
    description: 'Empresa ou métricas não encontradas',
  })
  async getHistory(
    @Param('companyId') companyId: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.getReputationHistoryUseCase.execute({
      companyId,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
    return result;
  }

  @Get('rankings')
  @ApiOperation({
    summary: 'Obter rankings de empresas (público)',
    description:
      'Endpoint público para obter rankings de empresas ordenadas por rating médio',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Número de empresas no ranking (padrão: 100)',
    type: Number,
  })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Filtrar por categoria da empresa',
    enum: CompanyCategory,
  })
  @ApiResponse({
    status: 200,
    description: 'Rankings de empresas',
  })
  async getRankings(
    @Query('limit') limit?: string,
    @Query('category') category?: string,
  ) {
    const result = await this.getRankingsUseCase.execute({
      limit: limit ? parseInt(limit, 10) : undefined,
      category: category as CompanyCategory | undefined,
    });
    return result;
  }
}
