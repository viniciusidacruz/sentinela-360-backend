import { Injectable, Inject } from '@nestjs/common';
import type {
  CompanyRepositoryPort,
  FindAllCompaniesFilters,
} from '../ports/company.repository.port';
import {
  CompanyStatus,
  CompanyCategory,
} from '../../domain/entities/company.entity';

export interface ListCompaniesInput {
  status?: CompanyStatus;
  category?: CompanyCategory;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ListCompaniesOutput {
  companies: Array<{
    id: string;
    name: string;
    cnpj: string;
    category: CompanyCategory;
    status: CompanyStatus;
    createdAt: Date;
    updatedAt: Date;
  }>;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

@Injectable()
export class ListCompaniesUseCase {
  constructor(
    @Inject('CompanyRepositoryPort')
    private readonly companyRepository: CompanyRepositoryPort,
  ) {}

  async execute(input?: ListCompaniesInput): Promise<ListCompaniesOutput> {
    const filters: FindAllCompaniesFilters = {
      status: input?.status,
      category: input?.category,
      search: input?.search,
      page: input?.page || 1,
      limit: input?.limit || 10,
    };

    const result = await this.companyRepository.findAll(filters);

    return {
      companies: result.data.map((company) => ({
        id: company.id,
        name: company.name,
        cnpj: company.cnpj,
        category: company.category,
        status: company.status,
        createdAt: company.createdAt,
        updatedAt: company.updatedAt,
      })),
      meta: result.meta,
    };
  }
}
