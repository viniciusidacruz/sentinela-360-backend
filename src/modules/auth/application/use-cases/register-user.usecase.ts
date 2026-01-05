import {
  Injectable,
  ConflictException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import type { UserRepositoryPort } from '../ports/user.repository.port';
import type { ConsumerRepositoryPort } from '@/modules/feedback/application/ports/consumer.repository.port';
import type { CompanyRepositoryPort } from '@/modules/company/application/ports/company.repository.port';
import * as auditPort from '../ports/audit.port';
import { Email } from '../../domain/value-objects/email.vo';
import { Password } from '../../domain/value-objects/password.vo';
import { UserRole, UserStatus } from '../../domain/entities/user.entity';
import {
  CompanyStatus,
  CompanyCategory,
} from '@/modules/company/domain/entities/company.entity';
import { Cnpj } from '@/modules/company/domain/value-objects/cnpj.vo';
import { PrismaService } from '@/common/database/prisma/prisma.service';
import type { Prisma } from 'generated/prisma/client';
import { User } from '../../domain/entities/user.entity';

export interface RegisterUserInput {
  email: string;
  password: string;
  name?: string;
  userType?: 'consumer' | 'company';
  cnpj?: string;
  companyName?: string;
  category?: string;
}

export interface RegisterUserOutput {
  user: User;
}

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject('UserRepositoryPort')
    private readonly userRepository: UserRepositoryPort,
    @Inject('AuditPort')
    private readonly auditPort: auditPort.AuditPort,
    @Inject('ConsumerRepositoryPort')
    private readonly consumerRepository: ConsumerRepositoryPort,
    @Inject('CompanyRepositoryPort')
    private readonly companyRepository: CompanyRepositoryPort,
    private readonly prisma: PrismaService,
  ) {}

  async execute(
    input: RegisterUserInput,
    ip?: string,
    userAgent?: string,
  ): Promise<RegisterUserOutput> {
    try {
      const email = Email.create(input.email);
      const existingUser = await this.userRepository.findByEmail(email);

      if (existingUser) {
        await this.auditPort.log({
          type: auditPort.AuditEventType.AUTH_REGISTER,
          ip,
          userAgent,
          success: false,
          error: 'Email already exists',
        });
        throw new ConflictException('Email already registered');
      }

      let validatedCnpj: Cnpj | null = null;

      if (input.userType === 'company') {
        if (!input.cnpj || !input.companyName || !input.category) {
          await this.auditPort.log({
            type: auditPort.AuditEventType.AUTH_REGISTER,
            ip,
            userAgent,
            success: false,
            error:
              'CNPJ, company name, and category are required for company registration',
          });
          throw new BadRequestException(
            'CNPJ, company name, and category are required for company registration',
          );
        }

        if (
          !Object.values(CompanyCategory).includes(
            input.category as CompanyCategory,
          )
        ) {
          await this.auditPort.log({
            type: auditPort.AuditEventType.AUTH_REGISTER,
            ip,
            userAgent,
            success: false,
            error: 'Invalid company category',
          });
          throw new BadRequestException('Invalid company category');
        }

        try {
          validatedCnpj = Cnpj.create(input.cnpj);
        } catch (error) {
          await this.auditPort.log({
            type: auditPort.AuditEventType.AUTH_REGISTER,
            ip,
            userAgent,
            success: false,
            error: error instanceof Error ? error.message : 'Invalid CNPJ',
          });
          throw new BadRequestException('Invalid CNPJ format');
        }

        const existingCompany = await this.companyRepository.findByCnpj(
          validatedCnpj.getValue(),
        );
        if (existingCompany) {
          await this.auditPort.log({
            type: auditPort.AuditEventType.AUTH_REGISTER,
            ip,
            userAgent,
            success: false,
            error: 'CNPJ already registered',
          });
          throw new ConflictException('CNPJ already registered');
        }
      }

      const password = await Password.create(input.password);
      const roles: UserRole[] =
        input.userType === 'company'
          ? [UserRole.COMPANY_OWNER]
          : [UserRole.CONSUMER];

      const user = await this.prisma.$transaction(
        async (tx: Prisma.TransactionClient): Promise<User> => {
          const userData = await tx.user.create({
            data: {
              email: email.getValue(),
              passwordHash: password.getHash(),
              name: input.name || null,
              roles,
              status: UserStatus.ACTIVE,
            },
          });

          if (input.userType === 'company') {
            await tx.company.create({
              data: {
                userId: userData.id,
                cnpj: validatedCnpj!.getValue(),
                name: input.companyName!,
                category: input.category as CompanyCategory,
                status: CompanyStatus.ACTIVE,
              },
            });
          } else {
            await tx.consumer.create({
              data: {
                userId: userData.id,
              },
            });
          }

          return this.mapToDomainUser(userData);
        },
      );

      await this.auditPort.log({
        type: auditPort.AuditEventType.AUTH_REGISTER,
        userId: user.id,
        ip,
        userAgent,
        success: true,
      });

      return { user };
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      await this.auditPort.log({
        type: auditPort.AuditEventType.AUTH_REGISTER,
        ip,
        userAgent,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  private mapToDomainUser(userData: {
    id: string;
    email: string;
    passwordHash: string;
    name: string | null;
    roles: string[];
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return new User(
      userData.id,
      Email.create(userData.email),
      Password.fromHash(userData.passwordHash),
      userData.name,
      userData.roles as UserRole[],
      userData.status as UserStatus,
      userData.createdAt,
      userData.updatedAt,
    );
  }
}
