import { Module, forwardRef } from '@nestjs/common';
import { PrismaModule } from '@/common/database/prisma/prisma.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { CompanyModule } from '@/modules/company/company.module';
import { ReputationPrismaRepository } from './infrastructure/repositories/reputation.prisma.repository';
import { FeedbackStatsRepository } from './infrastructure/repositories/feedback-stats.repository';
import { CalculateReputationUseCase } from './application/use-cases/calculate-reputation.usecase';
import { GetReputationMetricsUseCase } from './application/use-cases/get-reputation-metrics.usecase';
import { GetReputationHistoryUseCase } from './application/use-cases/get-reputation-history.usecase';
import { GetRankingsUseCase } from './application/use-cases/get-rankings.usecase';
import { PublicReputationController } from './presentation/controllers/public-reputation.controller';
import { AdminReputationController } from './presentation/controllers/admin-reputation.controller';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => AuthModule),
    forwardRef(() => CompanyModule),
  ],
  controllers: [PublicReputationController, AdminReputationController],
  providers: [
    ReputationPrismaRepository,
    {
      provide: 'ReputationRepositoryPort',
      useExisting: ReputationPrismaRepository,
    },
    FeedbackStatsRepository,
    {
      provide: 'FeedbackRepositoryPort',
      useExisting: FeedbackStatsRepository,
    },
    CalculateReputationUseCase,
    GetReputationMetricsUseCase,
    GetReputationHistoryUseCase,
    GetRankingsUseCase,
  ],
  exports: ['ReputationRepositoryPort', 'FeedbackRepositoryPort'],
})
export class ReputationModule {}
