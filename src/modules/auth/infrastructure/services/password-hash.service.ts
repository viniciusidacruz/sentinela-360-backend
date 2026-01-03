import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordHashService {
  async hash(plainPassword: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(plainPassword.trim(), saltRounds);
  }

  async compare(plainPassword: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainPassword.trim(), hash);
  }
}
