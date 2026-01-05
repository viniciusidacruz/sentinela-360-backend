import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/database/prisma/prisma.service';
import type {
  ConsumerRepositoryPort,
  CreateConsumerInput,
} from '../../application/ports/consumer.repository.port';
import { Consumer } from '../../domain/entities/consumer.entity';

@Injectable()
export class ConsumerPrismaRepository implements ConsumerRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateConsumerInput): Promise<Consumer> {
    const consumerData = await this.prisma.consumer.create({
      data: {
        userId: input.userId,
      },
    });

    return this.mapToDomain(consumerData);
  }

  async findById(id: string): Promise<Consumer | null> {
    const consumerData = await this.prisma.consumer.findUnique({
      where: { id },
    });

    if (!consumerData) {
      return null;
    }

    return this.mapToDomain(consumerData);
  }

  async findByUserId(userId: string): Promise<Consumer | null> {
    const consumerData = await this.prisma.consumer.findUnique({
      where: { userId },
    });

    if (!consumerData) {
      return null;
    }

    return this.mapToDomain(consumerData);
  }

  private mapToDomain(consumerData: {
    id: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  }): Consumer {
    return new Consumer(
      consumerData.id,
      consumerData.userId,
      consumerData.createdAt,
      consumerData.updatedAt,
    );
  }
}
