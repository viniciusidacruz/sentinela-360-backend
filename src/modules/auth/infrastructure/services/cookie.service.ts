import { Response } from 'express';
import { env } from '@/common/config/env.config';

export class CookieService {
  static setAccessTokenCookie(res: Response, token: string): void {
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: env.COOKIE_SECURE,
      sameSite: env.COOKIE_SAMESITE,
      path: '/',
      maxAge: this.getMaxAge(env.JWT_ACCESS_EXPIRES_IN),
    });
  }

  static setRefreshTokenCookie(res: Response, token: string): void {
    res.cookie('refresh_token', token, {
      httpOnly: true,
      secure: env.COOKIE_SECURE,
      sameSite: env.COOKIE_SAMESITE,
      path: '/',
      maxAge: this.getMaxAge(env.JWT_REFRESH_EXPIRES_IN),
    });
  }

  static clearAuthCookies(res: Response): void {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: env.COOKIE_SECURE,
      sameSite: env.COOKIE_SAMESITE,
      path: '/',
    });
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: env.COOKIE_SECURE,
      sameSite: env.COOKIE_SAMESITE,
      path: '/',
    });
  }

  private static getMaxAge(expiresIn: string): number {
    const unit = expiresIn.slice(-1);
    const value = parseInt(expiresIn.slice(0, -1), 10);

    switch (unit) {
      case 's':
        return value * 1000;
      case 'm':
        return value * 60 * 1000;
      case 'h':
        return value * 60 * 60 * 1000;
      case 'd':
        return value * 24 * 60 * 60 * 1000;
      default:
        return 15 * 60 * 1000;
    }
  }
}
