import {
  Company,
  CompanyStatus,
  CompanyCategory,
} from '../../domain/entities/company.entity';
import { Cnpj } from '../../domain/value-objects/cnpj.vo';

export interface CreateCompanyInput {
  userId: string;
  cnpj: Cnpj;
  name: string;
  category: CompanyCategory;
  status: CompanyStatus;
}

export interface UpdateCompanyInput {
  name?: string;
  status?: CompanyStatus;
}

export interface FindAllCompaniesFilters {
  status?: CompanyStatus;
  category?: CompanyCategory;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CompanyRepositoryPort {
  create(input: CreateCompanyInput): Promise<Company>;
  findById(id: string): Promise<Company | null>;
  findByUserId(userId: string): Promise<Company | null>;
  findByCnpj(cnpj: string): Promise<Company | null>;
  findAll(filters?: FindAllCompaniesFilters): Promise<PaginatedResult<Company>>;
  update(id: string, input: UpdateCompanyInput): Promise<Company>;
}
