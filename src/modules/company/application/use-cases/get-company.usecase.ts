import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import type { CompanyRepositoryPort } from '../ports/company.repository.port';
import {
  CompanyStatus,
  CompanyCategory,
} from '../../domain/entities/company.entity';

export interface GetCompanyInput {
  id?: string;
  userId?: string;
}

export interface GetCompanyOutput {
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
export class GetCompanyUseCase {
  constructor(
    @Inject('CompanyRepositoryPort')
    private readonly companyRepository: CompanyRepositoryPort,
  ) {}

  async execute(input: GetCompanyInput): Promise<GetCompanyOutput> {
    let company;

    if (input.id) {
      company = await this.companyRepository.findById(input.id);
    } else if (input.userId) {
      company = await this.companyRepository.findByUserId(input.userId);
    } else {
      throw new NotFoundException('Company not found');
    }

    if (!company) {
      throw new NotFoundException('Company not found');
    }

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
