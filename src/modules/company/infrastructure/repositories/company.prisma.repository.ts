import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/database/prisma/prisma.service';
import type { Prisma } from 'generated/prisma/client';
import type {
  CompanyRepositoryPort,
  CreateCompanyInput,
  UpdateCompanyInput,
  FindAllCompaniesFilters,
  PaginatedResult,
} from '../../application/ports/company.repository.port';
import {
  Company,
  CompanyStatus,
  CompanyCategory,
} from '../../domain/entities/company.entity';

@Injectable()
export class CompanyPrismaRepository implements CompanyRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateCompanyInput): Promise<Company> {
    const companyData = await this.prisma.company.create({
      data: {
        userId: input.userId,
        cnpj: input.cnpj.getValue(),
        name: input.name,
        category: input.category,
        status: input.status,
      },
    });

    return this.mapToDomain(companyData);
  }

  async findById(id: string): Promise<Company | null> {
    const companyData = await this.prisma.company.findUnique({
      where: { id },
    });

    if (!companyData) {
      return null;
    }

    return this.mapToDomain(companyData);
  }

  async findByUserId(userId: string): Promise<Company | null> {
    const companyData = await this.prisma.company.findUnique({
      where: { userId },
    });

    if (!companyData) {
      return null;
    }

    return this.mapToDomain(companyData);
  }

  async findByCnpj(cnpj: string): Promise<Company | null> {
    const companyData = await this.prisma.company.findUnique({
      where: { cnpj },
    });

    if (!companyData) {
      return null;
    }

    return this.mapToDomain(companyData);
  }

  async findAll(
    filters?: FindAllCompaniesFilters,
  ): Promise<PaginatedResult<Company>> {
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.CompanyWhereInput = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.category) {
      where.category = filters.category;
    }

    if (filters?.search) {
      where.name = {
        contains: filters.search,
        mode: 'insensitive',
      };
    }

    const [companiesData, total] = await Promise.all([
      this.prisma.company.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.company.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: companiesData.map((data) => {
        try {
          return this.mapToDomain(data);
        } catch (error) {
          throw new Error(
            `Error mapping company ${data.id} to domain: ${error instanceof Error ? error.message : 'Unknown error'}`,
          );
        }
      }),
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async update(id: string, input: UpdateCompanyInput): Promise<Company> {
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

    const companyData = await this.prisma.company.update({
      where: { id },
      data: updateData,
    });

    return this.mapToDomain(companyData);
  }

  private mapToDomain(companyData: {
    id: string;
    userId: string;
    cnpj: string;
    name: string;
    category: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }): Company {
    return new Company(
      companyData.id,
      companyData.userId,
      companyData.cnpj,
      companyData.name,
      companyData.category as CompanyCategory,
      companyData.status as CompanyStatus,
      companyData.createdAt,
      companyData.updatedAt,
    );
  }
}
