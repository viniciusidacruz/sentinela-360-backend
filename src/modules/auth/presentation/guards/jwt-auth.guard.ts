import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import type { Request } from 'express';
import type { TokenServicePort } from '../../application/ports/token.service.port';
import { UserRole } from '../../domain/entities/user.entity';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject('TokenServicePort')
    private readonly tokenService: TokenServicePort,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies?.access_token as string | undefined;

    if (!token || typeof token !== 'string') {
      throw new UnauthorizedException('Access token not found');
    }

    try {
      const payload = this.tokenService.verifyAccessToken(token);
      request.user = {
        sub: payload.sub,
        email: payload.email,
        roles: payload.roles as UserRole[],
      };
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
