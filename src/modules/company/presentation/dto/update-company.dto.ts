import { ApiProperty } from '@nestjs/swagger';
import { UpdateCompanyInput } from './update-company.schema';

export class UpdateCompanyDto implements UpdateCompanyInput {
  @ApiProperty({
    description: 'Nome da empresa',
    example: 'Empresa XYZ Ltda Atualizada',
    minLength: 2,
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: 'Status da empresa',
    example: 'ACTIVE',
    enum: ['ACTIVE', 'INACTIVE', 'PENDING'],
    required: false,
  })
  status?: 'ACTIVE' | 'INACTIVE' | 'PENDING';
}
