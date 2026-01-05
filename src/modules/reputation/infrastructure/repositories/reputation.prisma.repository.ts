import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/database/prisma/prisma.service';
import type {
  ReputationRepositoryPort,
  CreateReputationMetricsInput,
  UpdateReputationMetricsInput,
} from '../../application/ports/reputation.repository.port';
import {
  ReputationMetrics,
  RatingDistribution,
} from '../../domain/entities/reputation-metrics.entity';
import { ReputationHistory } from '../../domain/entities/reputation-history.entity';

@Injectable()
export class ReputationPrismaRepository implements ReputationRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async createMetrics(
    input: CreateReputationMetricsInput,
  ): Promise<ReputationMetrics> {
    const metricsData = await this.prisma.reputationMetrics.create({
      data: {
        companyId: input.companyId,
        averageRating: input.averageRating,
        totalFeedbacks: input.totalFeedbacks,
        rating1: input.rating1,
        rating2: input.rating2,
        rating3: input.rating3,
        rating4: input.rating4,
        rating5: input.rating5,
      },
    });

    return this.mapToDomain(metricsData);
  }

  async findMetricsByCompanyId(
    companyId: string,
  ): Promise<ReputationMetrics | null> {
    const metricsData = await this.prisma.reputationMetrics.findUnique({
      where: { companyId },
    });

    if (!metricsData) {
      return null;
    }

    return this.mapToDomain(metricsData);
  }

  async updateMetrics(
    companyId: string,
    input: UpdateReputationMetricsInput,
  ): Promise<ReputationMetrics> {
    const updateData: {
      averageRating?: number;
      totalFeedbacks?: number;
      rating1?: number;
      rating2?: number;
      rating3?: number;
      rating4?: number;
      rating5?: number;
    } = {};

    if (input.averageRating !== undefined) {
      updateData.averageRating = input.averageRating;
    }
    if (input.totalFeedbacks !== undefined) {
      updateData.totalFeedbacks = input.totalFeedbacks;
    }
    if (input.rating1 !== undefined) {
      updateData.rating1 = input.rating1;
    }
    if (input.rating2 !== undefined) {
      updateData.rating2 = input.rating2;
    }
    if (input.rating3 !== undefined) {
      updateData.rating3 = input.rating3;
    }
    if (input.rating4 !== undefined) {
      updateData.rating4 = input.rating4;
    }
    if (input.rating5 !== undefined) {
      updateData.rating5 = input.rating5;
    }

    const metricsData = await this.prisma.reputationMetrics.update({
      where: { companyId },
      data: updateData,
    });

    return this.mapToDomain(metricsData);
  }

  async createHistoryEntry(
    reputationMetricsId: string,
    metrics: ReputationMetrics,
  ): Promise<ReputationHistory> {
    const historyData = await this.prisma.reputationHistory.create({
      data: {
        reputationMetricsId,
        averageRating: metrics.averageRating,
        totalFeedbacks: metrics.totalFeedbacks,
        rating1: metrics.distribution.rating1,
        rating2: metrics.distribution.rating2,
        rating3: metrics.distribution.rating3,
        rating4: metrics.distribution.rating4,
        rating5: metrics.distribution.rating5,
      },
    });

    return this.mapHistoryToDomain(historyData);
  }

  async findHistoryByCompanyId(
    companyId: string,
    limit: number = 30,
  ): Promise<ReputationHistory[]> {
    const metrics = await this.findMetricsByCompanyId(companyId);
    if (!metrics) {
      return [];
    }

    const historyData = await this.prisma.reputationHistory.findMany({
      where: { reputationMetricsId: metrics.id },
      orderBy: { recordedAt: 'desc' },
      take: limit,
    });

    return historyData.map((data) => this.mapHistoryToDomain(data));
  }

  async findAllMetricsOrderedByRating(
    limit: number = 100,
  ): Promise<ReputationMetrics[]> {
    const metricsData = await this.prisma.reputationMetrics.findMany({
      orderBy: { averageRating: 'desc' },
      take: limit,
    });

    return metricsData.map((data) => this.mapToDomain(data));
  }

  private mapToDomain(metricsData: {
    id: string;
    companyId: string;
    averageRating: number;
    totalFeedbacks: number;
    rating1: number;
    rating2: number;
    rating3: number;
    rating4: number;
    rating5: number;
    createdAt: Date;
    updatedAt: Date;
  }): ReputationMetrics {
    const distribution = new RatingDistribution(
      metricsData.rating1,
      metricsData.rating2,
      metricsData.rating3,
      metricsData.rating4,
      metricsData.rating5,
    );

    return new ReputationMetrics(
      metricsData.id,
      metricsData.companyId,
      metricsData.averageRating,
      metricsData.totalFeedbacks,
      distribution,
      metricsData.createdAt,
      metricsData.updatedAt,
    );
  }

  private mapHistoryToDomain(historyData: {
    id: string;
    reputationMetricsId: string;
    averageRating: number;
    totalFeedbacks: number;
    rating1: number;
    rating2: number;
    rating3: number;
    rating4: number;
    rating5: number;
    recordedAt: Date;
  }): ReputationHistory {
    const distribution = new RatingDistribution(
      historyData.rating1,
      historyData.rating2,
      historyData.rating3,
      historyData.rating4,
      historyData.rating5,
    );

    return new ReputationHistory(
      historyData.id,
      historyData.reputationMetricsId,
      historyData.averageRating,
      historyData.totalFeedbacks,
      distribution,
      historyData.recordedAt,
    );
  }
}
