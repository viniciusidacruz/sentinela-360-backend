import {
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SWAGGER_CONSTANTS } from '@/common/constants/swagger.constants';
import { LogoutUserUseCase } from '../../application/use-cases/logout-user.usecase';
import { CookieService } from '../../infrastructure/services/cookie.service';
import type { TokenServicePort } from '../../application/ports/token.service.port';

@ApiTags(SWAGGER_CONSTANTS.TAGS.AUTH.name)
@Controller('auth/logout')
export class LogoutController {
  constructor(
    private readonly logoutUserUseCase: LogoutUserUseCase,
    @Inject('TokenServicePort')
    private readonly tokenService: TokenServicePort,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Logout',
    description:
      'Endpoint para fazer logout do usuário. Remove cookies e invalida o refresh token no banco de dados.',
  })
  @ApiResponse({
    status: 200,
    description: 'Logout realizado com sucesso',
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido ou não fornecido',
  })
  async logout(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies?.refresh_token as string | undefined;

    if (!refreshToken || typeof refreshToken !== 'string') {
      throw new UnauthorizedException('Refresh token not found');
    }

    try {
      const payload = this.tokenService.verifyRefreshToken(refreshToken);
      const ip: string | undefined =
        req.ip || (req.socket.remoteAddress as string) || undefined;
      const userAgent: string | undefined = req.get('user-agent') || undefined;

      await this.logoutUserUseCase.execute(payload.sub, ip, userAgent);
    } catch (error) {
      CookieService.clearAuthCookies(res);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid token');
    }

    CookieService.clearAuthCookies(res);

    return res.status(200).json({
      message: 'Logout successful',
      ok: true,
    });
  }
}
