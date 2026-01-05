import { Module, forwardRef } from '@nestjs/common';
import { PrismaModule } from '@/common/database/prisma/prisma.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { CompanyModule } from '@/modules/company/company.module';
import { PublicFeedbacksController } from './presentation/controllers/public-feedbacks.controller';
import { AdminFeedbacksController } from './presentation/controllers/admin-feedbacks.controller';
import { CreateFeedbackUseCase } from './application/use-cases/create-feedback.usecase';
import { ListFeedbacksUseCase } from './application/use-cases/list-feedbacks.usecase';
import { GetFeedbackUseCase } from './application/use-cases/get-feedback.usecase';
import { UpdateFeedbackUseCase } from './application/use-cases/update-feedback.usecase';
import { DeleteFeedbackUseCase } from './application/use-cases/delete-feedback.usecase';
import { FeedbackPrismaRepository } from './infrastructure/repositories/feedback.prisma.repository';
import { ConsumerPrismaRepository } from './infrastructure/repositories/consumer.prisma.repository';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => AuthModule),
    forwardRef(() => CompanyModule),
  ],
  controllers: [PublicFeedbacksController, AdminFeedbacksController],
  providers: [
    FeedbackPrismaRepository,
    {
      provide: 'FeedbackRepositoryPort',
      useExisting: FeedbackPrismaRepository,
    },
    ConsumerPrismaRepository,
    {
      provide: 'ConsumerRepositoryPort',
      useExisting: ConsumerPrismaRepository,
    },
    CreateFeedbackUseCase,
    ListFeedbacksUseCase,
    GetFeedbackUseCase,
    UpdateFeedbackUseCase,
    DeleteFeedbackUseCase,
  ],
  exports: ['ConsumerRepositoryPort'],
})
export class FeedbackModule {}
