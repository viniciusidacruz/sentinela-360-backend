import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import type { ReputationRepositoryPort } from '../ports/reputation.repository.port';
import type { FeedbackRepositoryPort } from '../ports/feedback.repository.port';
import type { CompanyRepositoryPort } from '@/modules/company/application/ports/company.repository.port';
import {
  ReputationMetrics,
  RatingDistribution,
} from '../../domain/entities/reputation-metrics.entity';

export interface CalculateReputationInput {
  companyId: string;
  saveHistory?: boolean;
}

export interface CalculateReputationOutput {
  metrics: {
    id: string;
    companyId: string;
    averageRating: number;
    totalFeedbacks: number;
    distribution: {
      rating1: number;
      rating2: number;
      rating3: number;
      rating4: number;
      rating5: number;
    };
    createdAt: Date;
    updatedAt: Date;
  };
}

@Injectable()
export class CalculateReputationUseCase {
  constructor(
    @Inject('ReputationRepositoryPort')
    private readonly reputationRepository: ReputationRepositoryPort,
    @Inject('FeedbackRepositoryPort')
    private readonly feedbackRepository: FeedbackRepositoryPort,
    @Inject('CompanyRepositoryPort')
    private readonly companyRepository: CompanyRepositoryPort,
  ) {}

  async execute(
    input: CalculateReputationInput,
  ): Promise<CalculateReputationOutput> {
    const company = await this.companyRepository.findById(input.companyId);
    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const stats = await this.feedbackRepository.getStatsByCompanyId(
      input.companyId,
    );

    if (!stats) {
      throw new NotFoundException('No feedbacks found for this company');
    }

    const existingMetrics =
      await this.reputationRepository.findMetricsByCompanyId(input.companyId);

    let metrics: ReputationMetrics;

    if (existingMetrics) {
      if (input.saveHistory) {
        await this.reputationRepository.createHistoryEntry(
          existingMetrics.id,
          existingMetrics,
        );
      }

      metrics = await this.reputationRepository.updateMetrics(input.companyId, {
        averageRating: stats.averageRating,
        totalFeedbacks: stats.totalFeedbacks,
        rating1: stats.rating1,
        rating2: stats.rating2,
        rating3: stats.rating3,
        rating4: stats.rating4,
        rating5: stats.rating5,
      });
    } else {
      metrics = await this.reputationRepository.createMetrics({
        companyId: input.companyId,
        averageRating: stats.averageRating,
        totalFeedbacks: stats.totalFeedbacks,
        rating1: stats.rating1,
        rating2: stats.rating2,
        rating3: stats.rating3,
        rating4: stats.rating4,
        rating5: stats.rating5,
      });
    }

    return {
      metrics: {
        id: metrics.id,
        companyId: metrics.companyId,
        averageRating: metrics.averageRating,
        totalFeedbacks: metrics.totalFeedbacks,
        distribution: {
          rating1: metrics.distribution.rating1,
          rating2: metrics.distribution.rating2,
          rating3: metrics.distribution.rating3,
          rating4: metrics.distribution.rating4,
          rating5: metrics.distribution.rating5,
        },
        createdAt: metrics.createdAt,
        updatedAt: metrics.updatedAt,
      },
    };
  }
}
