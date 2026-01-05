import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { SWAGGER_CONSTANTS } from '@/common/constants/swagger.constants';
import { ListFeedbacksUseCase } from '../../application/use-cases/list-feedbacks.usecase';
import { GetFeedbackUseCase } from '../../application/use-cases/get-feedback.usecase';

@ApiTags(SWAGGER_CONSTANTS.TAGS.FEEDBACKS.name)
@Controller('feedbacks')
export class PublicFeedbacksController {
  constructor(
    private readonly listFeedbacksUseCase: ListFeedbacksUseCase,
    private readonly getFeedbackUseCase: GetFeedbackUseCase,
  ) {}

  @Get('list')
  @ApiOperation({
    summary: 'Listar feedbacks (público)',
    description:
      'Endpoint público para listar feedbacks. Suporta filtros por empresa, categoria, busca por texto e paginação.',
  })
  @ApiQuery({
    name: 'companyId',
    required: false,
    description: 'Filtrar feedbacks por ID da empresa',
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
    description: 'Lista de feedbacks com metadados de paginação',
  })
  async list(
    @Query('companyId') companyId?: string,
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.listFeedbacksUseCase.execute({
      companyId,
      category,
      search,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
    return result;
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar feedback por ID (público)',
    description: 'Endpoint público para buscar um feedback específico por ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do feedback',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalhes do feedback',
  })
  @ApiResponse({
    status: 404,
    description: 'Feedback não encontrado',
  })
  async getById(@Param('id') id: string) {
    const result = await this.getFeedbackUseCase.execute({ id });
    return result;
  }
}
