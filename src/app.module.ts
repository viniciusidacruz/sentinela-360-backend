import { Module } from '@nestjs/common';
import { PrismaModule } from '@/common/database/prisma/prisma.module';
import { AuthModule } from '@/modules/auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
