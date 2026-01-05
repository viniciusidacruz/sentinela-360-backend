import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import type { FeedbackRepositoryPort } from '../ports/feedback.repository.port';

export interface GetFeedbackInput {
  id: string;
}

export interface GetFeedbackOutput {
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
export class GetFeedbackUseCase {
  constructor(
    @Inject('FeedbackRepositoryPort')
    private readonly feedbackRepository: FeedbackRepositoryPort,
  ) {}

  async execute(input: GetFeedbackInput): Promise<GetFeedbackOutput> {
    const feedback = await this.feedbackRepository.findById(input.id);

    if (!feedback) {
      throw new NotFoundException('Feedback not found');
    }

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
