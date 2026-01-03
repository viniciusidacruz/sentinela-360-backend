import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    description: 'Email do usuário',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'senhaSegura123',
  })
  password: string;
}
