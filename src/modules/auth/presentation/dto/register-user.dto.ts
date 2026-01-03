import { ApiProperty } from '@nestjs/swagger';

export class RegisterConsumerDto {
  @ApiProperty({
    description: 'Tipo de usuário',
    example: 'consumer',
    enum: ['consumer'],
  })
  userType: 'consumer';

  @ApiProperty({
    description: 'Email do usuário',
    example: 'consumer@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'senhaSegura123',
    minLength: 6,
  })
  password: string;

  @ApiProperty({
    description: 'Nome do usuário',
    example: 'João Silva',
    required: false,
  })
  name?: string;
}

export class RegisterCompanyDto {
  @ApiProperty({
    description: 'Tipo de usuário',
    example: 'company',
    enum: ['company'],
  })
  userType: 'company';

  @ApiProperty({
    description: 'Email do usuário (dono da empresa)',
    example: 'owner@company.com',
  })
  email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'senhaSegura123',
    minLength: 6,
  })
  password: string;

  @ApiProperty({
    description: 'Nome do usuário (dono da empresa)',
    example: 'Maria Santos',
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: 'CNPJ da empresa (14 dígitos)',
    example: '12345678000190',
    pattern: String.raw`^\d{14}$`,
  })
  cnpj: string;

  @ApiProperty({
    description: 'Nome da empresa',
    example: 'Empresa XYZ Ltda',
  })
  companyName: string;
}

export type RegisterUserDto = RegisterConsumerDto | RegisterCompanyDto;
