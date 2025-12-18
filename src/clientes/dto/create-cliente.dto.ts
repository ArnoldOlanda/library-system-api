import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateClienteDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  @ApiProperty({
    description: 'Nombre del cliente',
    type: 'string',
    example: 'María González',
    maxLength: 200,
  })
  nombre: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  @ApiProperty({
    description: 'DNI o documento de identidad',
    type: 'string',
    example: '12345678',
    required: false,
    maxLength: 20,
  })
  dni?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  @ApiProperty({
    description: 'Teléfono de contacto',
    type: 'string',
    example: '+51987654321',
    required: false,
    maxLength: 20,
  })
  telefono?: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty({
    description: 'Correo electrónico',
    type: 'string',
    example: 'cliente@example.com',
    required: false,
  })
  correo?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Dirección del cliente',
    type: 'string',
    example: 'Jr. Los Olivos 456',
    required: false,
  })
  direccion?: string;
}
