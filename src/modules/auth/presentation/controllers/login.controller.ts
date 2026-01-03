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
import { ZodValidationSilentPipe } from '@/common/pipes/zod-validation-silent.pipe';
import { LoginUserDto } from '../dto/login-user.dto';
import { loginUserSchema, type LoginUserInput } from '../dto/login-user.schema';
import { LoginUserUseCase } from '../../application/use-cases/login-user.usecase';
import { GenerateTokensUseCase } from '../../application/use-cases/generate-tokens.usecase';
import { CookieService } from '../../infrastructure/services/cookie.service';
import type { UserRepositoryPort } from '../../application/ports/user.repository.port';
import { Email } from '../../domain/value-objects/email.vo';

@ApiTags(SWAGGER_CONSTANTS.TAGS.AUTH.name)
@Controller('auth/login')
export class LoginController {
  constructor(
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly generateTokensUseCase: GenerateTokensUseCase,
    @Inject('UserRepositoryPort')
    private readonly userRepository: UserRepositoryPort,
  ) {}

  @Post()
  @UseGuards(ThrottlerGuard)
  @UsePipes(new ZodValidationSilentPipe(loginUserSchema, 'Invalid credentials'))
  @ApiOperation({
    summary: 'Login de usuário',
    description:
      'Endpoint para autenticação de usuário no sistema. Após login bem-sucedido, os tokens JWT são enviados via cookies HttpOnly.',
  })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    status: 200,
    description:
      'Login realizado com sucesso. Tokens JWT enviados via cookies HttpOnly.',
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciais inválidas',
  })
  async login(
    @Body() loginUserInput: LoginUserInput,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const ip = req.ip || req.socket.remoteAddress;
    const userAgent = req.get('user-agent');

    const result = await this.loginUserUseCase.execute(
      {
        email: loginUserInput.email,
        password: loginUserInput.password,
      },
      ip,
      userAgent,
    );

    const user = await this.userRepository.findByEmail(
      Email.create(loginUserInput.email),
    );

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const tokens = await this.generateTokensUseCase.execute(user);

    CookieService.setAccessTokenCookie(res, tokens.accessToken);
    CookieService.setRefreshTokenCookie(res, tokens.refreshToken);

    return res.status(200).json({
      message: 'Login successful',
      user: result.user,
    });
  }
}
