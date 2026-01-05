import { Consumer } from '../../domain/entities/consumer.entity';

export interface CreateConsumerInput {
  userId: string;
}

export interface ConsumerRepositoryPort {
  create(input: CreateConsumerInput): Promise<Consumer>;
  findById(id: string): Promise<Consumer | null>;
  findByUserId(userId: string): Promise<Consumer | null>;
}
