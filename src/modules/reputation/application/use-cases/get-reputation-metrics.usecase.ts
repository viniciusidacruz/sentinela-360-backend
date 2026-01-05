import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import type { ReputationRepositoryPort } from '../ports/reputation.repository.port';
import type { CompanyRepositoryPort } from '@/modules/company/application/ports/company.repository.port';
import type { FeedbackRepositoryPort } from '../ports/feedback.repository.port';

export interface GetReputationMetricsInput {
  companyId: string;
}

export interface GetReputationMetricsOutput {
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
      percentages: {
        rating1: number;
        rating2: number;
        rating3: number;
        rating4: number;
        rating5: number;
      };
    };
    createdAt: Date;
    updatedAt: Date;
  };
}

@Injectable()
export class GetReputationMetricsUseCase {
  constructor(
    @Inject('ReputationRepositoryPort')
    private readonly reputationRepository: ReputationRepositoryPort,
    @Inject('CompanyRepositoryPort')
    private readonly companyRepository: CompanyRepositoryPort,
    @Inject('FeedbackRepositoryPort')
    private readonly feedbackRepository: FeedbackRepositoryPort,
  ) {}

  async execute(
    input: GetReputationMetricsInput,
  ): Promise<GetReputationMetricsOutput> {
    const company = await this.companyRepository.findById(input.companyId);
    if (!company) {
      throw new NotFoundException('Company not found');
    }

    let metrics = await this.reputationRepository.findMetricsByCompanyId(
      input.companyId,
    );

    if (!metrics) {
      const stats = await this.feedbackRepository.getStatsByCompanyId(
        input.companyId,
      );

      if (!stats) {
        throw new NotFoundException(
          'No feedbacks found for this company. Metrics cannot be calculated.',
        );
      }

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
          percentages: {
            rating1: metrics.distribution.getPercentage(1),
            rating2: metrics.distribution.getPercentage(2),
            rating3: metrics.distribution.getPercentage(3),
            rating4: metrics.distribution.getPercentage(4),
            rating5: metrics.distribution.getPercentage(5),
          },
        },
        createdAt: metrics.createdAt,
        updatedAt: metrics.updatedAt,
      },
    };
  }
}
