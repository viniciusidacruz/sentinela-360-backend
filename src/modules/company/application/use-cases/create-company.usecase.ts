import {
  Injectable,
  ConflictException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import type { CompanyRepositoryPort } from '../ports/company.repository.port';
import type { UserRepositoryPort } from '@/modules/auth/application/ports/user.repository.port';
import {
  Company,
  CompanyStatus,
  CompanyCategory,
} from '../../domain/entities/company.entity';
import { Cnpj } from '../../domain/value-objects/cnpj.vo';

export interface CreateCompanyInput {
  userId: string;
  cnpj: string;
  name: string;
  category: CompanyCategory;
}

export interface CreateCompanyOutput {
  company: {
    id: string;
    userId: string;
    cnpj: string;
    name: string;
    category: CompanyCategory;
    status: CompanyStatus;
    createdAt: Date;
    updatedAt: Date;
  };
}

@Injectable()
export class CreateCompanyUseCase {
  constructor(
    @Inject('CompanyRepositoryPort')
    private readonly companyRepository: CompanyRepositoryPort,
    @Inject('UserRepositoryPort')
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(input: CreateCompanyInput): Promise<CreateCompanyOutput> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingCompany = await this.companyRepository.findByUserId(
      input.userId,
    );
    if (existingCompany) {
      throw new ConflictException('User already has a company');
    }

    const cnpj = Cnpj.create(input.cnpj);
    const existingCnpj = await this.companyRepository.findByCnpj(
      cnpj.getValue(),
    );
    if (existingCnpj) {
      throw new ConflictException('CNPJ already registered');
    }

    const company = await this.companyRepository.create({
      userId: input.userId,
      cnpj,
      name: input.name,
      category: input.category,
      status: CompanyStatus.ACTIVE,
    });

    return {
      company: {
        id: company.id,
        userId: company.userId,
        cnpj: company.cnpj,
        name: company.name,
        category: company.category,
        status: company.status,
        createdAt: company.createdAt,
        updatedAt: company.updatedAt,
      },
    };
  }
}
