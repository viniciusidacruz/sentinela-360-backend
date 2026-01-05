import { Injectable, Inject } from '@nestjs/common';
import type { ReputationRepositoryPort } from '../ports/reputation.repository.port';
import type { CompanyRepositoryPort } from '@/modules/company/application/ports/company.repository.port';

export interface GetRankingsInput {
  limit?: number;
  category?: string;
}

export interface GetRankingsOutput {
  rankings: Array<{
    position: number;
    companyId: string;
    companyName: string;
    averageRating: number;
    totalFeedbacks: number;
    distribution: {
      rating1: number;
      rating2: number;
      rating3: number;
      rating4: number;
      rating5: number;
    };
  }>;
  meta: {
    total: number;
    limit: number;
  };
}

@Injectable()
export class GetRankingsUseCase {
  constructor(
    @Inject('ReputationRepositoryPort')
    private readonly reputationRepository: ReputationRepositoryPort,
    @Inject('CompanyRepositoryPort')
    private readonly companyRepository: CompanyRepositoryPort,
  ) {}

  async execute(input?: GetRankingsInput): Promise<GetRankingsOutput> {
    const limit = input?.limit || 100;
    const metricsList =
      await this.reputationRepository.findAllMetricsOrderedByRating(limit);

    const rankings = await Promise.all(
      metricsList.map(async (metrics, index) => {
        const company = await this.companyRepository.findById(
          metrics.companyId,
        );

        if (!company) {
          return null;
        }

        if (input?.category && company.category !== input.category) {
          return null;
        }

        return {
          position: index + 1,
          companyId: metrics.companyId,
          companyName: company.name,
          averageRating: metrics.averageRating,
          totalFeedbacks: metrics.totalFeedbacks,
          distribution: {
            rating1: metrics.distribution.rating1,
            rating2: metrics.distribution.rating2,
            rating3: metrics.distribution.rating3,
            rating4: metrics.distribution.rating4,
            rating5: metrics.distribution.rating5,
          },
        };
      }),
    );

    const validRankings = rankings.filter(
      (r): r is NonNullable<typeof r> => r !== null,
    );

    return {
      rankings: validRankings,
      meta: {
        total: validRankings.length,
        limit,
      },
    };
  }
}
