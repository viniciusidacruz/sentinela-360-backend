import * as bcrypt from 'bcrypt';

export class Password {
  private readonly hash: string;

  private constructor(hash: string) {
    this.hash = hash;
  }

  static async create(plainPassword: string): Promise<Password> {
    const trimmed = plainPassword.trim();

    if (!trimmed) {
      throw new Error('Password is required');
    }

    if (trimmed.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    const saltRounds = 10;
    const hash = await bcrypt.hash(trimmed, saltRounds);

    return new Password(hash);
  }

  static fromHash(hash: string): Password {
    return new Password(hash);
  }

  async compare(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword.trim(), this.hash);
  }

  getHash(): string {
    return this.hash;
  }
}
