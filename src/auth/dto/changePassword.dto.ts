import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Contraseña actual del usuario',
    example: 'currentPassword123',
    type: 'string'
  })
  currentPassword: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @ApiProperty({
    description: 'Nueva contraseña del usuario',
    example: 'newPassword456',
    type: 'string',
    minLength: 6
  })
  newPassword: string;
}