import { Module } from '@nestjs/common';
import { PrismaModule } from '@/common/database/prisma/prisma.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { FeedbackModule } from '@/modules/feedback/feedback.module';
import { CompanyModule } from '@/modules/company/company.module';

@Module({
  imports: [PrismaModule, AuthModule, FeedbackModule, CompanyModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
