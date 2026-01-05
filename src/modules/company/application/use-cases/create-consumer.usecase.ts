import {
  Injectable,
  ConflictException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import type { ConsumerRepositoryPort } from '@/modules/feedback/application/ports/consumer.repository.port';
import type { UserRepositoryPort } from '@/modules/auth/application/ports/user.repository.port';

export interface CreateConsumerInput {
  userId: string;
}

export interface CreateConsumerOutput {
  consumer: {
    id: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

@Injectable()
export class CreateConsumerUseCase {
  constructor(
    @Inject('ConsumerRepositoryPort')
    private readonly consumerRepository: ConsumerRepositoryPort,
    @Inject('UserRepositoryPort')
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(input: CreateConsumerInput): Promise<CreateConsumerOutput> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingConsumer = await this.consumerRepository.findByUserId(
      input.userId,
    );
    if (existingConsumer) {
      throw new ConflictException('Consumer already exists for this user');
    }

    const consumer = await this.consumerRepository.create({
      userId: input.userId,
    });

    return {
      consumer: {
        id: consumer.id,
        userId: consumer.userId,
        createdAt: consumer.createdAt,
        updatedAt: consumer.updatedAt,
      },
    };
  }
}
