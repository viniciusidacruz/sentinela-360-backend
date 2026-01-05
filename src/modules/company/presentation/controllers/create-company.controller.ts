import {
  Body,
  Controller,
  Post,
  Req,
  UsePipes,
  UseGuards,
  Inject,
} from '@nestjs/common';
import type { Request } from 'express';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SWAGGER_CONSTANTS } from '@/common/constants/swagger.constants';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '@/modules/auth/presentation/guards/jwt-auth.guard';
import {
  createCompanySchema,
  type CreateCompanyInput,
} from '../dto/create-company.schema';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { CreateCompanyUseCase } from '../../application/use-cases/create-company.usecase';
import { CompanyCategory } from '../../domain/entities/company.entity';

@ApiTags(SWAGGER_CONSTANTS.TAGS.COMPANIES.name)
@Controller('companies')
export class CreateCompanyController {
  constructor(private readonly createCompanyUseCase: CreateCompanyUseCase) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ZodValidationPipe(createCompanySchema))
  @ApiOperation({
    summary: 'Criar empresa',
    description: 'Endpoint para criar uma nova empresa',
  })
  @ApiBody({ type: CreateCompanyDto })
  @ApiResponse({
    status: 201,
    description: 'Empresa criada com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: 409,
    description: 'CNPJ já cadastrado ou usuário já possui empresa',
  })
  async create(
    @Body() createCompanyInput: CreateCompanyInput,
    @Req() req: Request,
  ) {
    const userId = (req as any).user?.sub;

    const result = await this.createCompanyUseCase.execute({
      userId,
      cnpj: createCompanyInput.cnpj,
      name: createCompanyInput.name,
      category: createCompanyInput.category as CompanyCategory,
    });

    return {
      message: 'Company created successfully',
      ...result,
    };
  }
}
