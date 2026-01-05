import {
  Body,
  Controller,
  Post,
  Delete,
  Param,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
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
import { AdminGuard } from '@/modules/auth/presentation/guards/admin.guard';
import { AssignRoleToUserUseCase } from '../../application/use-cases/assign-role-to-user.usecase';
import { RemoveRoleFromUserUseCase } from '../../application/use-cases/remove-role-from-user.usecase';
import {
  assignRoleSchema,
  type AssignRoleInput,
} from '../dto/assign-role.schema';
import { AssignRoleDto } from '../dto/assign-role.dto';

@ApiTags('IAM')
@Controller('admin/iam/roles')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth(SWAGGER_CONSTANTS.BEARER_AUTH_NAME)
export class RolesController {
  constructor(
    private readonly assignRoleToUserUseCase: AssignRoleToUserUseCase,
    private readonly removeRoleFromUserUseCase: RemoveRoleFromUserUseCase,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(assignRoleSchema))
  @ApiOperation({
    summary: 'Atribuir role a usuário',
    description: 'Endpoint para atribuir uma role a um usuário',
  })
  @ApiBody({ type: AssignRoleDto })
  @ApiResponse({
    status: 201,
    description: 'Role atribuída com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário ou role não encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Usuário já possui esta role',
  })
  async assignRole(@Body() assignRoleInput: AssignRoleInput) {
    const result = await this.assignRoleToUserUseCase.execute({
      userId: assignRoleInput.userId,
      roleId: assignRoleInput.roleId,
    });

    return {
      message: 'Role assigned successfully',
      ...result,
    };
  }

  @Delete(':userId/:roleId')
  @ApiOperation({
    summary: 'Remover role de usuário',
    description: 'Endpoint para remover uma role de um usuário',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID do usuário',
  })
  @ApiParam({
    name: 'roleId',
    description: 'ID da role',
  })
  @ApiResponse({
    status: 200,
    description: 'Role removida com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário, role ou atribuição não encontrada',
  })
  async removeRole(
    @Param('userId') userId: string,
    @Param('roleId') roleId: string,
  ) {
    await this.removeRoleFromUserUseCase.execute({
      userId,
      roleId,
    });

    return {
      message: 'Role removed successfully',
      ok: true,
    };
  }
}
