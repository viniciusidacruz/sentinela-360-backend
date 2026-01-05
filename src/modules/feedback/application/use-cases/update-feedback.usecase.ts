import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import type { FeedbackRepositoryPort } from '../ports/feedback.repository.port';
import { Rating } from '../../domain/value-objects/rating.vo';
import { FeedbackStatus } from '../../domain/entities/feedback.entity';

export interface UpdateFeedbackInput {
  id: string;
  consumerId: string;
  rating?: number;
  comment?: string | null;
}

export interface UpdateFeedbackOutput {
  feedback: {
    id: string;
    consumerId: string;
    companyId: string;
    rating: number;
    comment: string | null;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

@Injectable()
export class UpdateFeedbackUseCase {
  constructor(
    @Inject('FeedbackRepositoryPort')
    private readonly feedbackRepository: FeedbackRepositoryPort,
  ) {}

  async execute(input: UpdateFeedbackInput): Promise<UpdateFeedbackOutput> {
    const existingFeedback = await this.feedbackRepository.findById(input.id);

    if (!existingFeedback) {
      throw new NotFoundException('Feedback not found');
    }

    if (existingFeedback.consumerId !== input.consumerId) {
      throw new ForbiddenException('You can only update your own feedback');
    }

    if (existingFeedback.isDeleted()) {
      throw new ForbiddenException('Cannot update deleted feedback');
    }

    const updateData: {
      rating?: Rating;
      comment?: string | null;
    } = {};

    if (input.rating !== undefined) {
      updateData.rating = Rating.create(input.rating);
    }

    if (input.comment !== undefined) {
      updateData.comment = input.comment;
    }

    const feedback = await this.feedbackRepository.update(input.id, updateData);

    return {
      feedback: {
        id: feedback.id,
        consumerId: feedback.consumerId,
        companyId: feedback.companyId,
        rating: feedback.rating.getValue(),
        comment: feedback.comment,
        status: feedback.status,
        createdAt: feedback.createdAt,
        updatedAt: feedback.updatedAt,
      },
    };
  }
}
