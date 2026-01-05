import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '@/common/database/prisma/prisma.service';
import type {
  FeedbackRepositoryPort,
  FeedbackStats,
} from '../../application/ports/feedback.repository.port';
import { FeedbackStatus } from '@/modules/feedback/domain/entities/feedback.entity';

@Injectable()
export class FeedbackStatsRepository implements FeedbackRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async getStatsByCompanyId(companyId: string): Promise<FeedbackStats | null> {
    const feedbacks = await this.prisma.feedback.findMany({
      where: {
        companyId,
        status: FeedbackStatus.ACTIVE,
      },
    });

    if (feedbacks.length === 0) {
      return null;
    }

    const totalFeedbacks = feedbacks.length;
    const sumRatings = feedbacks.reduce((sum, f) => sum + f.rating, 0);
    const averageRating = sumRatings / totalFeedbacks;

    const rating1 = feedbacks.filter((f) => f.rating === 1).length;
    const rating2 = feedbacks.filter((f) => f.rating === 2).length;
    const rating3 = feedbacks.filter((f) => f.rating === 3).length;
    const rating4 = feedbacks.filter((f) => f.rating === 4).length;
    const rating5 = feedbacks.filter((f) => f.rating === 5).length;

    return {
      companyId,
      averageRating: Math.round(averageRating * 100) / 100,
      totalFeedbacks,
      rating1,
      rating2,
      rating3,
      rating4,
      rating5,
    };
  }

  async getAllCompaniesStats(): Promise<FeedbackStats[]> {
    const feedbacks = await this.prisma.feedback.findMany({
      where: {
        status: FeedbackStatus.ACTIVE,
      },
    });

    const statsByCompany = new Map<string, FeedbackStats>();

    for (const feedback of feedbacks) {
      const existing = statsByCompany.get(feedback.companyId);

      if (existing) {
        existing.totalFeedbacks += 1;
        existing.averageRating =
          (existing.averageRating * (existing.totalFeedbacks - 1) +
            feedback.rating) /
          existing.totalFeedbacks;

        switch (feedback.rating) {
          case 1:
            existing.rating1 += 1;
            break;
          case 2:
            existing.rating2 += 1;
            break;
          case 3:
            existing.rating3 += 1;
            break;
          case 4:
            existing.rating4 += 1;
            break;
          case 5:
            existing.rating5 += 1;
            break;
        }
      } else {
        const rating1 = feedback.rating === 1 ? 1 : 0;
        const rating2 = feedback.rating === 2 ? 1 : 0;
        const rating3 = feedback.rating === 3 ? 1 : 0;
        const rating4 = feedback.rating === 4 ? 1 : 0;
        const rating5 = feedback.rating === 5 ? 1 : 0;

        statsByCompany.set(feedback.companyId, {
          companyId: feedback.companyId,
          averageRating: feedback.rating,
          totalFeedbacks: 1,
          rating1,
          rating2,
          rating3,
          rating4,
          rating5,
        });
      }
    }

    return Array.from(statsByCompany.values()).map((stats) => ({
      ...stats,
      averageRating: Math.round(stats.averageRating * 100) / 100,
    }));
  }
}
