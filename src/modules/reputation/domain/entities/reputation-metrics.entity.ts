export class RatingDistribution {
  constructor(
    public readonly rating1: number,
    public readonly rating2: number,
    public readonly rating3: number,
    public readonly rating4: number,
    public readonly rating5: number,
  ) {}

  getTotal(): number {
    return (
      this.rating1 + this.rating2 + this.rating3 + this.rating4 + this.rating5
    );
  }

  getPercentage(rating: number): number {
    const total = this.getTotal();
    if (total === 0) return 0;

    switch (rating) {
      case 1:
        return (this.rating1 / total) * 100;
      case 2:
        return (this.rating2 / total) * 100;
      case 3:
        return (this.rating3 / total) * 100;
      case 4:
        return (this.rating4 / total) * 100;
      case 5:
        return (this.rating5 / total) * 100;
      default:
        return 0;
    }
  }
}

export class ReputationMetrics {
  constructor(
    public readonly id: string,
    public readonly companyId: string,
    public readonly averageRating: number,
    public readonly totalFeedbacks: number,
    public readonly distribution: RatingDistribution,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  getTrendIndicator(
    previousMetrics: ReputationMetrics | null,
  ): 'up' | 'down' | 'stable' {
    if (!previousMetrics) {
      return 'stable';
    }

    const diff = this.averageRating - previousMetrics.averageRating;
    const threshold = 0.1;

    if (diff > threshold) return 'up';
    if (diff < -threshold) return 'down';
    return 'stable';
  }
}
