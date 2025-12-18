import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCategoriaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({
    description: 'Nombre de la categoría',
    type: 'string',
    example: 'Útiles de Oficina',
    maxLength: 100,
  })
  nombre: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Descripción de la categoría',
    type: 'string',
    example: 'Categoría para útiles de escritorio',
    required: false,
  })
  descripcion?: string;
}
