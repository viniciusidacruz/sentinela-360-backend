import {
  Feedback,
  FeedbackStatus,
} from '../../domain/entities/feedback.entity';
import { Rating } from '../../domain/value-objects/rating.vo';

export interface CreateFeedbackInput {
  consumerId: string;
  companyId: string;
  rating: Rating;
  comment: string | null;
  status: FeedbackStatus;
}

export interface UpdateFeedbackInput {
  rating?: Rating;
  comment?: string | null;
  status?: FeedbackStatus;
}

export interface FindAllFeedbacksFilters {
  companyId?: string;
  consumerId?: string;
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FeedbackRepositoryPort {
  create(input: CreateFeedbackInput): Promise<Feedback>;
  findById(id: string): Promise<Feedback | null>;
  findByConsumerId(consumerId: string): Promise<Feedback[]>;
  findByCompanyId(companyId: string): Promise<Feedback[]>;
  findAll(
    filters?: FindAllFeedbacksFilters,
  ): Promise<PaginatedResult<Feedback>>;
  update(id: string, input: UpdateFeedbackInput): Promise<Feedback>;
  delete(id: string): Promise<void>;
}
