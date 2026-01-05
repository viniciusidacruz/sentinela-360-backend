import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/database/prisma/prisma.service';
import type { Prisma } from 'generated/prisma/client';
import type {
  FeedbackRepositoryPort,
  CreateFeedbackInput,
  UpdateFeedbackInput,
  FindAllFeedbacksFilters,
  PaginatedResult,
} from '../../application/ports/feedback.repository.port';
import {
  Feedback,
  FeedbackStatus,
} from '../../domain/entities/feedback.entity';
import { Rating } from '../../domain/value-objects/rating.vo';
import { CompanyCategory } from '@/modules/company/domain/entities/company.entity';

@Injectable()
export class FeedbackPrismaRepository implements FeedbackRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateFeedbackInput): Promise<Feedback> {
    const feedbackData = await this.prisma.feedback.create({
      data: {
        consumerId: input.consumerId,
        companyId: input.companyId,
        rating: input.rating.getValue(),
        comment: input.comment,
        status: input.status,
      },
    });

    return this.mapToDomain(feedbackData);
  }

  async findById(id: string): Promise<Feedback | null> {
    const feedbackData = await this.prisma.feedback.findUnique({
      where: { id },
    });

    if (!feedbackData) {
      return null;
    }

    return this.mapToDomain(feedbackData);
  }

  async findByConsumerId(consumerId: string): Promise<Feedback[]> {
    const feedbacksData = await this.prisma.feedback.findMany({
      where: { consumerId },
      orderBy: { createdAt: 'desc' },
    });

    return feedbacksData.map((data) => this.mapToDomain(data));
  }

  async findByCompanyId(companyId: string): Promise<Feedback[]> {
    const feedbacksData = await this.prisma.feedback.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });

    return feedbacksData.map((data) => this.mapToDomain(data));
  }

  async findAll(
    filters?: FindAllFeedbacksFilters,
  ): Promise<PaginatedResult<Feedback>> {
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.FeedbackWhereInput = {
      status: FeedbackStatus.ACTIVE,
    };

    if (filters?.companyId) {
      where.companyId = filters.companyId;
    }

    if (filters?.consumerId) {
      where.consumerId = filters.consumerId;
    }

    if (filters?.category) {
      where.company = {
        category: filters.category as CompanyCategory,
      };
    }

    if (filters?.search) {
      where.OR = [
        {
          comment: {
            contains: filters.search,
            mode: 'insensitive',
          },
        },
      ];
    }

    const [feedbacksData, total] = await Promise.all([
      this.prisma.feedback.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          company: true,
        },
      }),
      this.prisma.feedback.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: feedbacksData.map((data) => this.mapToDomain(data)),
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async update(id: string, input: UpdateFeedbackInput): Promise<Feedback> {
    const updateData: {
      rating?: number;
      comment?: string | null;
      status?: FeedbackStatus;
    } = {};

    if (input.rating) {
      updateData.rating = input.rating.getValue();
    }

    if (input.comment !== undefined) {
      updateData.comment = input.comment;
    }

    if (input.status) {
      updateData.status = input.status;
    }

    const feedbackData = await this.prisma.feedback.update({
      where: { id },
      data: updateData,
    });

    return this.mapToDomain(feedbackData);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.feedback.update({
      where: { id },
      data: { status: FeedbackStatus.DELETED },
    });
  }

  private mapToDomain(feedbackData: {
    id: string;
    consumerId: string;
    companyId: string;
    rating: number;
    comment: string | null;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }): Feedback {
    return new Feedback(
      feedbackData.id,
      feedbackData.consumerId,
      feedbackData.companyId,
      Rating.create(feedbackData.rating),
      feedbackData.comment,
      feedbackData.status as FeedbackStatus,
      feedbackData.createdAt,
      feedbackData.updatedAt,
    );
  }
}
