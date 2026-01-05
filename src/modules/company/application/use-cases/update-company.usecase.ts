import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import type { CompanyRepositoryPort } from '../ports/company.repository.port';
import {
  CompanyStatus,
  CompanyCategory,
} from '../../domain/entities/company.entity';

export interface UpdateCompanyInput {
  id: string;
  userId: string;
  name?: string;
  status?: CompanyStatus;
}

export interface UpdateCompanyOutput {
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
export class UpdateCompanyUseCase {
  constructor(
    @Inject('CompanyRepositoryPort')
    private readonly companyRepository: CompanyRepositoryPort,
  ) {}

  async execute(input: UpdateCompanyInput): Promise<UpdateCompanyOutput> {
    const existingCompany = await this.companyRepository.findById(input.id);

    if (!existingCompany) {
      throw new NotFoundException('Company not found');
    }

    if (existingCompany.userId !== input.userId) {
      throw new ForbiddenException('You can only update your own company');
    }

    const updateData: {
      name?: string;
      status?: CompanyStatus;
    } = {};

    if (input.name !== undefined) {
      updateData.name = input.name;
    }

    if (input.status !== undefined) {
      updateData.status = input.status;
    }

    const company = await this.companyRepository.update(input.id, updateData);

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
