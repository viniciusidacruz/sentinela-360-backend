import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { JwtSignOptions } from '@nestjs/jwt';
import { env } from '@/common/config/env.config';
import {
  TokenServicePort,
  TokenPayload,
} from '../../application/ports/token.service.port';

@Injectable()
export class JwtTokenService implements TokenServicePort {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken(payload: Omit<TokenPayload, 'type'>): string {
    const tokenPayload = {
      ...payload,
      type: 'access' as const,
    };
    return this.jwtService.sign(tokenPayload, {
      secret: env.JWT_ACCESS_SECRET,
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    } as JwtSignOptions);
  }

  generateRefreshToken(payload: Omit<TokenPayload, 'type'>): string {
    const tokenPayload = {
      ...payload,
      type: 'refresh' as const,
    };
    return this.jwtService.sign(tokenPayload, {
      secret: env.JWT_REFRESH_SECRET,
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    } as JwtSignOptions);
  }

  verifyAccessToken(token: string): TokenPayload {
    const payload = this.jwtService.verify<TokenPayload>(token, {
      secret: env.JWT_ACCESS_SECRET,
    });

    if (payload.type !== 'access') {
      throw new Error('Invalid token type');
    }

    return payload;
  }

  verifyRefreshToken(token: string): TokenPayload {
    const payload = this.jwtService.verify<TokenPayload>(token, {
      secret: env.JWT_REFRESH_SECRET,
    });

    if (payload.type !== 'refresh') {
      throw new Error('Invalid token type');
    }

    return payload;
  }
}
