export interface TokenPayload {
  sub: string;
  email: string;
  roles: string[];
  type: 'access' | 'refresh';
}

export interface TokenServicePort {
  generateAccessToken(payload: Omit<TokenPayload, 'type'>): string;
  generateRefreshToken(payload: Omit<TokenPayload, 'type'>): string;
  verifyAccessToken(token: string): TokenPayload;
  verifyRefreshToken(token: string): TokenPayload;
}
