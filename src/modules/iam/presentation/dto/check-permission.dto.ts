import { ApiProperty } from '@nestjs/swagger';

export class CheckPermissionDto {
  @ApiProperty({
    description: 'Recurso (resource) a ser verificado',
    example: 'feedbacks',
  })
  resource: string;

  @ApiProperty({
    description: 'Ação (action) a ser verificada',
    example: 'create',
  })
  action: string;

  @ApiProperty({
    description: 'ID da empresa (opcional, para verificação contextual)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  companyId?: string;
}
