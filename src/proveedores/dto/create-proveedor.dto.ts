import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateProveedorDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  @ApiProperty({
    description: 'Nombre del proveedor',
    type: 'string',
    example: 'Distribuidora XYZ',
    maxLength: 200,
  })
  nombre: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  @ApiProperty({
    description: 'Nombre de la persona de contacto',
    type: 'string',
    example: 'Juan Pérez',
    required: false,
    maxLength: 100,
  })
  contacto?: string;

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
    example: 'contacto@proveedor.com',
    required: false,
  })
  correo?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Dirección física del proveedor',
    type: 'string',
    example: 'Av. Principal 123, Lima',
    required: false,
  })
  direccion?: string;
}
