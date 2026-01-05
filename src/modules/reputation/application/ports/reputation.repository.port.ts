import { ReputationMetrics } from '../../domain/entities/reputation-metrics.entity';
import { ReputationHistory } from '../../domain/entities/reputation-history.entity';

export interface CreateReputationMetricsInput {
  companyId: string;
  averageRating: number;
  totalFeedbacks: number;
  rating1: number;
  rating2: number;
  rating3: number;
  rating4: number;
  rating5: number;
}

export interface UpdateReputationMetricsInput {
  averageRating?: number;
  totalFeedbacks?: number;
  rating1?: number;
  rating2?: number;
  rating3?: number;
  rating4?: number;
  rating5?: number;
}

export interface ReputationRepositoryPort {
  createMetrics(
    input: CreateReputationMetricsInput,
  ): Promise<ReputationMetrics>;
  findMetricsByCompanyId(companyId: string): Promise<ReputationMetrics | null>;
  updateMetrics(
    companyId: string,
    input: UpdateReputationMetricsInput,
  ): Promise<ReputationMetrics>;
  createHistoryEntry(
    reputationMetricsId: string,
    metrics: ReputationMetrics,
  ): Promise<ReputationHistory>;
  findHistoryByCompanyId(
    companyId: string,
    limit?: number,
  ): Promise<ReputationHistory[]>;
  findAllMetricsOrderedByRating(limit?: number): Promise<ReputationMetrics[]>;
}
