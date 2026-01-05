import { Rating } from '../value-objects/rating.vo';

export enum FeedbackStatus {
  ACTIVE = 'ACTIVE',
  MODERATED = 'MODERATED',
  DELETED = 'DELETED',
}

export class Feedback {
  constructor(
    public readonly id: string,
    public readonly consumerId: string,
    public readonly companyId: string,
    public readonly rating: Rating,
    public readonly comment: string | null,
    public readonly status: FeedbackStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  isActive(): boolean {
    return this.status === FeedbackStatus.ACTIVE;
  }

  isModerated(): boolean {
    return this.status === FeedbackStatus.MODERATED;
  }

  isDeleted(): boolean {
    return this.status === FeedbackStatus.DELETED;
  }
}
