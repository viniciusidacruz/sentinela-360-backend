import { Module } from '@nestjs/common';
import { PrismaModule } from '@/common/database/prisma/prisma.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { FeedbackModule } from '@/modules/feedback/feedback.module';
import { CompanyModule } from '@/modules/company/company.module';
import { IamModule } from '@/modules/iam/iam.module';
import { ReputationModule } from '@/modules/reputation/reputation.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    FeedbackModule,
    CompanyModule,
    IamModule,
    ReputationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
