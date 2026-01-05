import { RatingDistribution } from './reputation-metrics.entity';

export class ReputationHistory {
  constructor(
    public readonly id: string,
    public readonly reputationMetricsId: string,
    public readonly averageRating: number,
    public readonly totalFeedbacks: number,
    public readonly distribution: RatingDistribution,
    public readonly recordedAt: Date,
  ) {}
}
