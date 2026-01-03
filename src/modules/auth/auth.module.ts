import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from '@/common/database/prisma/prisma.module';
import { RegisterController } from './presentation/controllers/register.controller';
import { LoginController } from './presentation/controllers/login.controller';
import { RefreshController } from './presentation/controllers/refresh.controller';
import { LogoutController } from './presentation/controllers/logout.controller';
import { RegisterUserUseCase } from './application/use-cases/register-user.usecase';
import { LoginUserUseCase } from './application/use-cases/login-user.usecase';
import { GenerateTokensUseCase } from './application/use-cases/generate-tokens.usecase';
import { RefreshTokenUseCase } from './application/use-cases/refresh-token.usecase';
import { LogoutUserUseCase } from './application/use-cases/logout-user.usecase';
import { UserPrismaRepository } from './infrastructure/repositories/user.prisma.repository';
import { JwtTokenService } from './infrastructure/services/jwt.token.service';
import { AuditNoopService } from './infrastructure/services/audit.noop.service';
import { PasswordHashService } from './infrastructure/services/password-hash.service';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({}),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 5,
      },
    ]),
  ],
  controllers: [
    RegisterController,
    LoginController,
    RefreshController,
    LogoutController,
  ],
  providers: [
    UserPrismaRepository,
    {
      provide: 'UserRepositoryPort',
      useExisting: UserPrismaRepository,
    },
    JwtTokenService,
    {
      provide: 'TokenServicePort',
      useExisting: JwtTokenService,
    },
    AuditNoopService,
    {
      provide: 'AuditPort',
      useExisting: AuditNoopService,
    },
    RegisterUserUseCase,
    LoginUserUseCase,
    GenerateTokensUseCase,
    RefreshTokenUseCase,
    LogoutUserUseCase,
    PasswordHashService,
  ],
})
export class AuthModule {}
