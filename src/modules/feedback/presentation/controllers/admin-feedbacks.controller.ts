import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  UsePipes,
  Inject,
  ForbiddenException,
  NotFoundException,
  Query,
} from '@nestjs/common';
import type { Request } from 'express';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { SWAGGER_CONSTANTS } from '@/common/constants/swagger.constants';
import { AdminGuard } from '@/modules/auth/presentation/guards/admin.guard';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import { ListFeedbacksUseCase } from '../../application/use-cases/list-feedbacks.usecase';
import { CreateFeedbackUseCase } from '../../application/use-cases/create-feedback.usecase';
import { UpdateFeedbackUseCase } from '../../application/use-cases/update-feedback.usecase';
import { DeleteFeedbackUseCase } from '../../application/use-cases/delete-feedback.usecase';
import type { ConsumerRepositoryPort } from '../../application/ports/consumer.repository.port';
import type { CompanyRepositoryPort } from '@/modules/company/application/ports/company.repository.port';
import {
  createFeedbackSchema,
  type CreateFeedbackInput,
} from '../dto/create-feedback.schema';
import {
  updateFeedbackSchema,
  type UpdateFeedbackInput,
} from '../dto/update-feedback.schema';
import { CreateFeedbackDto } from '../dto/create-feedback.dto';
import { UpdateFeedbackDto } from '../dto/update-feedback.dto';
import { UserRole } from '@/modules/auth/domain/entities/user.entity';

@ApiTags(SWAGGER_CONSTANTS.TAGS.FEEDBACKS.name)
@Controller('admin/feedbacks')
@UseGuards(AdminGuard)
export class AdminFeedbacksController {
  constructor(
    private readonly listFeedbacksUseCase: ListFeedbacksUseCase,
    private readonly createFeedbackUseCase: CreateFeedbackUseCase,
    private readonly updateFeedbackUseCase: UpdateFeedbackUseCase,
    private readonly deleteFeedbackUseCase: DeleteFeedbackUseCase,
    @Inject('ConsumerRepositoryPort')
    private readonly consumerRepository: ConsumerRepositoryPort,
    @Inject('CompanyRepositoryPort')
    private readonly companyRepository: CompanyRepositoryPort,
  ) {}

  @Get()
  @ApiBearerAuth(SWAGGER_CONSTANTS.BEARER_AUTH_NAME)
  @ApiOperation({
    summary: 'Listar feedbacks do usuário autenticado (admin)',
    description:
      'Endpoint autenticado para listar feedbacks. Consumidores veem apenas seus próprios feedbacks. Empresas veem apenas feedbacks da sua empresa. Suporta filtros por categoria, busca por texto e paginação.',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Filtrar feedbacks por categoria da empresa',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Buscar por comentário (case-insensitive)',
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
    description:
      'Lista de feedbacks do usuário autenticado com metadados de paginação',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  async list(
    @Req() req: Request,
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const user = (req as any).user;
    const userId = user?.sub;
    const roles = user?.roles || [];

    let consumerId: string | undefined;
    let companyId: string | undefined;

    if (roles.includes(UserRole.CONSUMER)) {
      const consumer = await this.consumerRepository.findByUserId(userId);
      consumerId = consumer?.id;
    } else if (
      roles.includes(UserRole.COMPANY_OWNER) ||
      roles.includes(UserRole.COMPANY_ADMIN)
    ) {
      const company = await this.companyRepository.findByUserId(userId);
      companyId = company?.id;
    }

    const result = await this.listFeedbacksUseCase.execute({
      consumerId,
      companyId,
      category,
      search,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });

    return result;
  }

  @Post()
  @ApiBearerAuth(SWAGGER_CONSTANTS.BEARER_AUTH_NAME)
  @UsePipes(new ZodValidationPipe(createFeedbackSchema))
  @ApiOperation({
    summary: 'Criar feedback (admin)',
    description:
      'Endpoint autenticado para criar um novo feedback. Apenas consumidores podem criar feedbacks.',
  })
  @ApiBody({ type: CreateFeedbackDto })
  @ApiResponse({
    status: 201,
    description: 'Feedback criado com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou empresa inativa',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @ApiResponse({
    status: 403,
    description: 'Apenas consumidores podem criar feedbacks',
  })
  @ApiResponse({
    status: 404,
    description: 'Consumer ou Company não encontrado',
  })
  async create(
    @Body() createFeedbackInput: CreateFeedbackInput,
    @Req() req: Request,
  ) {
    const user = (req as any).user;
    const userId = user?.sub;
    const roles = user?.roles || [];

    if (!roles.includes(UserRole.CONSUMER)) {
      throw new ForbiddenException('Only consumers can create feedbacks');
    }

    const consumer = await this.consumerRepository.findByUserId(userId);
    if (!consumer) {
      throw new NotFoundException('Consumer not found');
    }

    const result = await this.createFeedbackUseCase.execute({
      consumerId: consumer.id,
      companyId: createFeedbackInput.companyId,
      rating: createFeedbackInput.rating,
      comment: createFeedbackInput.comment,
    });

    return {
      message: 'Feedback created successfully',
      ...result,
    };
  }

  @Put(':id')
  @ApiBearerAuth(SWAGGER_CONSTANTS.BEARER_AUTH_NAME)
  @UsePipes(new ZodValidationPipe(updateFeedbackSchema))
  @ApiOperation({
    summary: 'Atualizar feedback (admin)',
    description:
      'Endpoint autenticado para atualizar um feedback. Apenas consumidores podem atualizar seus próprios feedbacks.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do feedback',
  })
  @ApiBody({ type: UpdateFeedbackDto })
  @ApiResponse({
    status: 200,
    description: 'Feedback atualizado com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @ApiResponse({
    status: 403,
    description: 'Você só pode atualizar seus próprios feedbacks',
  })
  @ApiResponse({
    status: 404,
    description: 'Feedback não encontrado',
  })
  async update(
    @Param('id') id: string,
    @Body() updateFeedbackInput: UpdateFeedbackInput,
    @Req() req: Request,
  ) {
    const user = (req as any).user;
    const userId = user?.sub;
    const roles = user?.roles || [];

    if (!roles.includes(UserRole.CONSUMER)) {
      throw new ForbiddenException('Only consumers can update feedbacks');
    }

    const consumer = await this.consumerRepository.findByUserId(userId);
    if (!consumer) {
      throw new NotFoundException('Consumer not found');
    }

    const result = await this.updateFeedbackUseCase.execute({
      id,
      consumerId: consumer.id,
      rating: updateFeedbackInput.rating,
      comment: updateFeedbackInput.comment,
    });

    return {
      message: 'Feedback updated successfully',
      ...result,
    };
  }

  @Delete(':id')
  @ApiBearerAuth(SWAGGER_CONSTANTS.BEARER_AUTH_NAME)
  @ApiOperation({
    summary: 'Deletar feedback (admin)',
    description:
      'Endpoint autenticado para deletar um feedback. Apenas consumidores podem deletar seus próprios feedbacks.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do feedback',
  })
  @ApiResponse({
    status: 200,
    description: 'Feedback deletado com sucesso',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @ApiResponse({
    status: 403,
    description: 'Você só pode deletar seus próprios feedbacks',
  })
  @ApiResponse({
    status: 404,
    description: 'Feedback não encontrado',
  })
  async delete(@Param('id') id: string, @Req() req: Request) {
    const user = (req as any).user;
    const userId = user?.sub;
    const roles = user?.roles || [];

    if (!roles.includes(UserRole.CONSUMER)) {
      throw new ForbiddenException('Only consumers can delete feedbacks');
    }

    const consumer = await this.consumerRepository.findByUserId(userId);
    if (!consumer) {
      throw new NotFoundException('Consumer not found');
    }

    await this.deleteFeedbackUseCase.execute({
      id,
      consumerId: consumer.id,
    });

    return {
      message: 'Feedback deleted successfully',
      ok: true,
    };
  }
}
