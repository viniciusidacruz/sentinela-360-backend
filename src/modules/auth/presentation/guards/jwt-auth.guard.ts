import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import type { Request } from 'express';
import type { TokenServicePort } from '../../application/ports/token.service.port';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject('TokenServicePort')
    private readonly tokenService: TokenServicePort,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies?.access_token;

    if (!token) {
      throw new UnauthorizedException('Access token not found');
    }

    try {
      const payload = this.tokenService.verifyAccessToken(token);
      (request as any).user = {
        sub: payload.sub,
        email: payload.email,
        roles: payload.roles,
      };
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
