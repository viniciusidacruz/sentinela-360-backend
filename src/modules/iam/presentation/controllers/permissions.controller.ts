import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Req,
  UsePipes,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import type { Request } from 'express';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { SWAGGER_CONSTANTS } from '@/common/constants/swagger.constants';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '@/modules/auth/presentation/guards/jwt-auth.guard';
import { CheckPermissionUseCase } from '../../application/use-cases/check-permission.usecase';
import { ListUserPermissionsUseCase } from '../../application/use-cases/list-user-permissions.usecase';
import {
  checkPermissionSchema,
  type CheckPermissionInput,
} from '../dto/check-permission.schema';
import { CheckPermissionDto } from '../dto/check-permission.dto';

@ApiTags('IAM')
@Controller('admin/iam/permissions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth(SWAGGER_CONSTANTS.BEARER_AUTH_NAME)
export class PermissionsController {
  constructor(
    private readonly checkPermissionUseCase: CheckPermissionUseCase,
    private readonly listUserPermissionsUseCase: ListUserPermissionsUseCase,
  ) {}

  @Post('check')
  @UsePipes(new ZodValidationPipe(checkPermissionSchema))
  @ApiOperation({
    summary: 'Verificar permissão',
    description:
      'Endpoint para verificar se o usuário autenticado possui uma permissão específica',
  })
  @ApiBody({ type: CheckPermissionDto })
  @ApiResponse({
    status: 200,
    description: 'Resultado da verificação de permissão',
  })
  async checkPermission(
    @Body() checkPermissionInput: CheckPermissionInput,
    @Req() req: Request,
  ) {
    const user = req.user;
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    const result = await this.checkPermissionUseCase.execute({
      userId: user.sub,
      resource: checkPermissionInput.resource,
      action: checkPermissionInput.action,
      companyId: checkPermissionInput.companyId,
    });

    return result;
  }

  @Get('me')
  @ApiOperation({
    summary: 'Listar permissões do usuário autenticado',
    description:
      'Endpoint para listar todas as permissões do usuário autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de permissões do usuário',
  })
  async listMyPermissions(@Req() req: Request) {
    const user = req.user;
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    const result = await this.listUserPermissionsUseCase.execute({
      userId: user.sub,
    });

    return result;
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: 'Listar permissões de um usuário',
    description:
      'Endpoint para listar todas as permissões de um usuário específico',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID do usuário',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de permissões do usuário',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  async listUserPermissions(@Param('userId') userId: string) {
    const result = await this.listUserPermissionsUseCase.execute({
      userId,
    });

    return result;
  }
}
