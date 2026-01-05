export interface FeedbackStats {
  companyId: string;
  averageRating: number;
  totalFeedbacks: number;
  rating1: number;
  rating2: number;
  rating3: number;
  rating4: number;
  rating5: number;
}

export interface FeedbackRepositoryPort {
  getStatsByCompanyId(companyId: string): Promise<FeedbackStats | null>;
  getAllCompaniesStats(): Promise<FeedbackStats[]>;
}
