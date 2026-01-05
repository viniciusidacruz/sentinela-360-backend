import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import type { FeedbackRepositoryPort } from '../ports/feedback.repository.port';
import { FeedbackStatus } from '../../domain/entities/feedback.entity';

export interface DeleteFeedbackInput {
  id: string;
  consumerId: string;
}

@Injectable()
export class DeleteFeedbackUseCase {
  constructor(
    @Inject('FeedbackRepositoryPort')
    private readonly feedbackRepository: FeedbackRepositoryPort,
  ) {}

  async execute(input: DeleteFeedbackInput): Promise<void> {
    const feedback = await this.feedbackRepository.findById(input.id);

    if (!feedback) {
      throw new NotFoundException('Feedback not found');
    }

    if (feedback.consumerId !== input.consumerId) {
      throw new ForbiddenException('You can only delete your own feedback');
    }

    await this.feedbackRepository.update(input.id, {
      status: FeedbackStatus.DELETED,
    });
  }
}
