import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UsePipes,
  UseGuards,
  Inject,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { SWAGGER_CONSTANTS } from '@/common/constants/swagger.constants';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import {
  registerUserSchema,
  type RegisterUserInput,
} from '../dto/register-user.schema';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.usecase';
import { GenerateTokensUseCase } from '../../application/use-cases/generate-tokens.usecase';
import { CookieService } from '../../infrastructure/services/cookie.service';

@ApiTags(SWAGGER_CONSTANTS.TAGS.AUTH.name)
@Controller('auth/register')
export class RegisterController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly generateTokensUseCase: GenerateTokensUseCase,
  ) {}

  @Post()
  @UseGuards(ThrottlerGuard)
  @UsePipes(new ZodValidationPipe(registerUserSchema))
  @ApiOperation({
    summary: 'Registro de usuário',
    description:
      'Endpoint para registro de novo usuário no sistema. Suporta registro de Consumer (consumidor) ou Company (empresa). Após registro bem-sucedido, os tokens JWT são enviados via cookies HttpOnly.',
  })
  @ApiBody({
    description:
      'Dados de registro. Use userType: "consumer" para consumidor ou userType: "company" para empresa.',
    schema: {
      oneOf: [
        {
          type: 'object',
          properties: {
            userType: { type: 'string', enum: ['consumer'] },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 8 },
            name: { type: 'string' },
          },
          required: ['userType', 'email', 'password'],
        },
        {
          type: 'object',
          properties: {
            userType: { type: 'string', enum: ['company'] },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 8 },
            name: { type: 'string' },
            cnpj: { type: 'string', pattern: String.raw`^\d{14}$` },
            companyName: { type: 'string' },
          },
          required: ['userType', 'email', 'password', 'cnpj', 'companyName'],
        },
      ],
    },
    examples: {
      consumer: {
        summary: 'Registro de Consumer',
        value: {
          userType: 'consumer',
          email: 'consumer@example.com',
          password: 'senhaSegura123',
          name: 'João Silva',
        },
      },
      company: {
        summary: 'Registro de Company',
        value: {
          userType: 'company',
          email: 'owner@company.com',
          password: 'senhaSegura123',
          name: 'Maria Santos',
          cnpj: '12345678000190',
          companyName: 'Empresa XYZ Ltda',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description:
      'Usuário registrado com sucesso. Tokens JWT enviados via cookies HttpOnly.',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: 409,
    description: 'Email já cadastrado',
  })
  async register(
    @Body() registerUserInput: RegisterUserInput,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const ip = req.ip || req.socket.remoteAddress;
    const userAgent = req.get('user-agent');

    const result = await this.registerUserUseCase.execute(
      {
        email: registerUserInput.email,
        password: registerUserInput.password,
        name: registerUserInput.name,
        userType: registerUserInput.userType || 'consumer',
        cnpj:
          registerUserInput.userType === 'company'
            ? registerUserInput.cnpj
            : undefined,
        companyName:
          registerUserInput.userType === 'company'
            ? registerUserInput.companyName
            : undefined,
        category:
          registerUserInput.userType === 'company'
            ? registerUserInput.category
            : undefined,
      },
      ip,
      userAgent,
    );

    const tokens = await this.generateTokensUseCase.execute(result.user);

    CookieService.setAccessTokenCookie(res, tokens.accessToken);
    CookieService.setRefreshTokenCookie(res, tokens.refreshToken);

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: result.user.id,
        email: result.user.email.getValue(),
        name: result.user.name,
        roles: result.user.roles,
        createdAt: result.user.createdAt,
      },
    });
  }
}
