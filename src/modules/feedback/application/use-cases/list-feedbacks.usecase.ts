import { Injectable, Inject } from '@nestjs/common';
import type {
  FeedbackRepositoryPort,
  FindAllFeedbacksFilters,
} from '../ports/feedback.repository.port';
import { FeedbackStatus } from '../../domain/entities/feedback.entity';

export interface ListFeedbacksInput {
  consumerId?: string;
  companyId?: string;
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ListFeedbacksOutput {
  feedbacks: Array<{
    id: string;
    consumerId: string;
    companyId: string;
    rating: number;
    comment: string | null;
    status: FeedbackStatus;
    createdAt: Date;
    updatedAt: Date;
  }>;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

@Injectable()
export class ListFeedbacksUseCase {
  constructor(
    @Inject('FeedbackRepositoryPort')
    private readonly feedbackRepository: FeedbackRepositoryPort,
  ) {}

  async execute(input: ListFeedbacksInput): Promise<ListFeedbacksOutput> {
    const filters: FindAllFeedbacksFilters = {
      consumerId: input.consumerId,
      companyId: input.companyId,
      category: input.category,
      search: input.search,
      page: input.page || 1,
      limit: input.limit || 10,
    };

    const result = await this.feedbackRepository.findAll(filters);

    return {
      feedbacks: result.data.map((feedback) => ({
        id: feedback.id,
        consumerId: feedback.consumerId,
        companyId: feedback.companyId,
        rating: feedback.rating.getValue(),
        comment: feedback.comment,
        status: feedback.status,
        createdAt: feedback.createdAt,
        updatedAt: feedback.updatedAt,
      })),
      meta: result.meta,
    };
  }
}
