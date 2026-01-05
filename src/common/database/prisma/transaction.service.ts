import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import type { Prisma } from 'generated/prisma/client';

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

  async execute<T>(
    callback: (tx: Prisma.TransactionClient) => Promise<T>,
  ): Promise<T> {
    return this.prisma.$transaction(callback);
  }
}
