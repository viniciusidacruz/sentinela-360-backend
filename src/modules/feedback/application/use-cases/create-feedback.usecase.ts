import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import type { FeedbackRepositoryPort } from '../ports/feedback.repository.port';
import type { CompanyRepositoryPort } from '@/modules/company/application/ports/company.repository.port';
import type { ConsumerRepositoryPort } from '../ports/consumer.repository.port';
import {
  Feedback,
  FeedbackStatus,
} from '../../domain/entities/feedback.entity';
import { Rating } from '../../domain/value-objects/rating.vo';

export interface CreateFeedbackInput {
  consumerId: string;
  companyId: string;
  rating: number;
  comment?: string;
}

export interface CreateFeedbackOutput {
  feedback: {
    id: string;
    consumerId: string;
    companyId: string;
    rating: number;
    comment: string | null;
    status: FeedbackStatus;
    createdAt: Date;
    updatedAt: Date;
  };
}

@Injectable()
export class CreateFeedbackUseCase {
  constructor(
    @Inject('FeedbackRepositoryPort')
    private readonly feedbackRepository: FeedbackRepositoryPort,
    @Inject('CompanyRepositoryPort')
    private readonly companyRepository: CompanyRepositoryPort,
    @Inject('ConsumerRepositoryPort')
    private readonly consumerRepository: ConsumerRepositoryPort,
  ) {}

  async execute(input: CreateFeedbackInput): Promise<CreateFeedbackOutput> {
    const consumer = await this.consumerRepository.findById(input.consumerId);
    if (!consumer) {
      throw new NotFoundException('Consumer not found');
    }

    const company = await this.companyRepository.findById(input.companyId);
    if (!company) {
      throw new NotFoundException('Company not found');
    }

    if (!company.canReceiveFeedback()) {
      throw new BadRequestException(
        'Company is not active and cannot receive feedback',
      );
    }

    const rating = Rating.create(input.rating);

    const feedback = await this.feedbackRepository.create({
      consumerId: input.consumerId,
      companyId: input.companyId,
      rating,
      comment: input.comment || null,
      status: FeedbackStatus.ACTIVE,
    });

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
