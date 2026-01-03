import {
  Controller,
  Post,
  Req,
  Res,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { SWAGGER_CONSTANTS } from '@/common/constants/swagger.constants';
import { RefreshTokenUseCase } from '../../application/use-cases/refresh-token.usecase';
import { CookieService } from '../../infrastructure/services/cookie.service';

@ApiTags(SWAGGER_CONSTANTS.TAGS.AUTH.name)
@Controller('auth/refresh')
export class RefreshController {
  constructor(private readonly refreshTokenUseCase: RefreshTokenUseCase) {}

  @Post()
  @UseGuards(ThrottlerGuard)
  @ApiOperation({
    summary: 'Refresh token',
    description:
      'Endpoint para renovar tokens JWT usando o refresh token armazenado em cookie HttpOnly. Implementa rotação de tokens (novo refresh token é gerado e o anterior é invalidado).',
  })
  @ApiResponse({
    status: 200,
    description:
      'Tokens renovados com sucesso. Novos tokens enviados via cookies HttpOnly.',
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh token inválido ou expirado',
  })
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const ip = req.ip || req.socket.remoteAddress;
    const userAgent = req.get('user-agent');

    const tokens = await this.refreshTokenUseCase.execute(
      refreshToken,
      ip,
      userAgent,
    );

    CookieService.setAccessTokenCookie(res, tokens.accessToken);
    CookieService.setRefreshTokenCookie(res, tokens.refreshToken);

    return res.status(200).json({
      message: 'Tokens refreshed successfully',
      ok: true,
    });
  }
}
