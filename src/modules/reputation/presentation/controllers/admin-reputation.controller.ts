import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UsePipes,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import type { Request } from 'express';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { SWAGGER_CONSTANTS } from '@/common/constants/swagger.constants';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '@/modules/auth/presentation/guards/jwt-auth.guard';
import { AdminGuard } from '@/modules/auth/presentation/guards/admin.guard';
import { CalculateReputationUseCase } from '../../application/use-cases/calculate-reputation.usecase';
import { GetReputationMetricsUseCase } from '../../application/use-cases/get-reputation-metrics.usecase';
import { GetReputationHistoryUseCase } from '../../application/use-cases/get-reputation-history.usecase';
import {
  calculateReputationSchema,
  type CalculateReputationInput,
} from '../dto/calculate-reputation.schema';
import type { CompanyRepositoryPort } from '@/modules/company/application/ports/company.repository.port';
import { Inject } from '@nestjs/common';

@ApiTags('Reputation')
@Controller('admin/reputation')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth(SWAGGER_CONSTANTS.BEARER_AUTH_NAME)
export class AdminReputationController {
  constructor(
    private readonly calculateReputationUseCase: CalculateReputationUseCase,
    private readonly getReputationMetricsUseCase: GetReputationMetricsUseCase,
    private readonly getReputationHistoryUseCase: GetReputationHistoryUseCase,
    @Inject('CompanyRepositoryPort')
    private readonly companyRepository: CompanyRepositoryPort,
  ) {}

  @Post('calculate')
  @UsePipes(new ZodValidationPipe(calculateReputationSchema))
  @ApiOperation({
    summary: 'Calcular e atualizar métricas de reputação (admin)',
    description:
      'Endpoint para calcular e atualizar as métricas de reputação da empresa do usuário autenticado',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        saveHistory: {
          type: 'boolean',
          description: 'Salvar snapshot no histórico antes de atualizar',
          default: false,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Métricas calculadas e atualizadas com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Empresa não encontrada ou sem feedbacks',
  })
  async calculateReputation(
    @Body() calculateInput: CalculateReputationInput,
    @Req() req: Request,
  ) {
    const user = req.user;
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    const company = await this.companyRepository.findByUserId(user.sub);
    if (!company) {
      throw new ForbiddenException('Company not found for this user');
    }

    const result = await this.calculateReputationUseCase.execute({
      companyId: company.id,
      saveHistory: calculateInput.saveHistory,
    });

    return {
      message: 'Reputation calculated successfully',
      ...result,
    };
  }

  @Get('metrics')
  @ApiOperation({
    summary: 'Obter métricas de reputação da empresa autenticada (admin)',
    description:
      'Endpoint para obter as métricas de reputação da empresa do usuário autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Métricas de reputação da empresa',
  })
  @ApiResponse({
    status: 404,
    description: 'Empresa ou métricas não encontradas',
  })
  async getMyCompanyMetrics(@Req() req: Request) {
    const user = req.user;
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    const company = await this.companyRepository.findByUserId(user.sub);
    if (!company) {
      throw new ForbiddenException('Company not found for this user');
    }

    const result = await this.getReputationMetricsUseCase.execute({
      companyId: company.id,
    });

    return result;
  }

  @Get('history')
  @ApiOperation({
    summary: 'Obter histórico de reputação da empresa autenticada (admin)',
    description:
      'Endpoint para obter o histórico de reputação da empresa do usuário autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Histórico de reputação com tendência',
  })
  @ApiResponse({
    status: 404,
    description: 'Empresa ou métricas não encontradas',
  })
  async getMyCompanyHistory(@Req() req: Request) {
    const user = req.user;
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    const company = await this.companyRepository.findByUserId(user.sub);
    if (!company) {
      throw new ForbiddenException('Company not found for this user');
    }

    const result = await this.getReputationHistoryUseCase.execute({
      companyId: company.id,
    });

    return result;
  }
}
