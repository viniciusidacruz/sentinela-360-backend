import { ApiProperty } from '@nestjs/swagger';
import { CreateCompanyInput } from './create-company.schema';
import { CompanyCategory } from '../../domain/entities/company.entity';

export class CreateCompanyDto implements CreateCompanyInput {
  @ApiProperty({
    description: 'CNPJ da empresa (14 dígitos)',
    example: '12345678000190',
    pattern: String.raw`^\d{14}$`,
  })
  cnpj: string;

  @ApiProperty({
    description: 'Nome da empresa',
    example: 'Empresa XYZ Ltda',
    minLength: 2,
  })
  name: string;

  @ApiProperty({
    description: 'Categoria da empresa',
    example: CompanyCategory.FOOD_AND_BEVERAGE,
    enum: CompanyCategory,
  })
  category: CompanyCategory;
}
