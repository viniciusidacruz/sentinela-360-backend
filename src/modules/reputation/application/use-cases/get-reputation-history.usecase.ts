import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import type { ReputationRepositoryPort } from '../ports/reputation.repository.port';
import type { CompanyRepositoryPort } from '@/modules/company/application/ports/company.repository.port';
import { ReputationMetrics } from '../../domain/entities/reputation-metrics.entity';

export interface GetReputationHistoryInput {
  companyId: string;
  limit?: number;
}

export interface GetReputationHistoryOutput {
  history: Array<{
    id: string;
    averageRating: number;
    totalFeedbacks: number;
    distribution: {
      rating1: number;
      rating2: number;
      rating3: number;
      rating4: number;
      rating5: number;
    };
    recordedAt: Date;
  }>;
  trend: 'up' | 'down' | 'stable';
}

@Injectable()
export class GetReputationHistoryUseCase {
  constructor(
    @Inject('ReputationRepositoryPort')
    private readonly reputationRepository: ReputationRepositoryPort,
    @Inject('CompanyRepositoryPort')
    private readonly companyRepository: CompanyRepositoryPort,
  ) {}

  async execute(
    input: GetReputationHistoryInput,
  ): Promise<GetReputationHistoryOutput> {
    const company = await this.companyRepository.findById(input.companyId);
    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const currentMetrics =
      await this.reputationRepository.findMetricsByCompanyId(input.companyId);

    if (!currentMetrics) {
      throw new NotFoundException(
        'Reputation metrics not found for this company',
      );
    }

    const history = await this.reputationRepository.findHistoryByCompanyId(
      input.companyId,
      input.limit || 30,
    );

    const previousEntry = history.length > 0 ? history[0] : null;
    const previousMetrics = previousEntry
      ? new ReputationMetrics(
          previousEntry.id,
          input.companyId,
          previousEntry.averageRating,
          previousEntry.totalFeedbacks,
          previousEntry.distribution,
          new Date(),
          new Date(),
        )
      : null;

    const trend = currentMetrics.getTrendIndicator(previousMetrics);

    return {
      history: history.map((entry) => ({
        id: entry.id,
        averageRating: entry.averageRating,
        totalFeedbacks: entry.totalFeedbacks,
        distribution: {
          rating1: entry.distribution.rating1,
          rating2: entry.distribution.rating2,
          rating3: entry.distribution.rating3,
          rating4: entry.distribution.rating4,
          rating5: entry.distribution.rating5,
        },
        recordedAt: entry.recordedAt,
      })),
      trend,
    };
  }
}
