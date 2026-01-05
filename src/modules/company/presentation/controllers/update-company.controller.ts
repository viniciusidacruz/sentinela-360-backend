import {
  Body,
  Controller,
  Put,
  Param,
  Req,
  UsePipes,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { SWAGGER_CONSTANTS } from '@/common/constants/swagger.constants';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '@/modules/auth/presentation/guards/jwt-auth.guard';
import {
  updateCompanySchema,
  type UpdateCompanyInput,
} from '../dto/update-company.schema';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { UpdateCompanyUseCase } from '../../application/use-cases/update-company.usecase';

@ApiTags(SWAGGER_CONSTANTS.TAGS.COMPANIES.name)
@Controller('companies')
export class UpdateCompanyController {
  constructor(private readonly updateCompanyUseCase: UpdateCompanyUseCase) {}

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ZodValidationPipe(updateCompanySchema))
  @ApiOperation({
    summary: 'Atualizar empresa',
    description: 'Endpoint para atualizar dados de uma empresa',
  })
  @ApiParam({
    name: 'id',
    description: 'Company ID',
  })
  @ApiBody({ type: UpdateCompanyDto })
  @ApiResponse({
    status: 200,
    description: 'Empresa atualizada com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: 403,
    description: 'Você só pode atualizar sua própria empresa',
  })
  @ApiResponse({
    status: 404,
    description: 'Empresa não encontrada',
  })
  async update(
    @Param('id') id: string,
    @Body() updateCompanyInput: UpdateCompanyInput,
    @Req() req: Request,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    const result = await this.updateCompanyUseCase.execute({
      id,
      userId,
      name: updateCompanyInput.name,
      category: updateCompanyInput.category,
    });

    return {
      message: 'Company updated successfully',
      ...result,
    };
  }
}
