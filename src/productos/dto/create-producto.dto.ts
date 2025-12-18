import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDecimal,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProductoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @ApiProperty({
    description: 'Código único del producto (SKU)',
    type: 'string',
    example: 'LAP-001',
    maxLength: 50,
  })
  codigo: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  @ApiProperty({
    description: 'Nombre del producto',
    type: 'string',
    example: 'Lápiz HB',
    maxLength: 200,
  })
  nombre: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'ID de la categoría del producto',
    type: 'string',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  categoriaId: string;

  @IsDecimal({ decimal_digits: '2' })
  @IsNotEmpty()
  @ApiProperty({
    description: 'Precio de compra del producto',
    type: 'number',
    example: 0.5,
  })
  precioCompra: number;

  @IsDecimal({ decimal_digits: '2' })
  @IsNotEmpty()
  @ApiProperty({
    description: 'Precio de venta del producto',
    type: 'number',
    example: 1.0,
  })
  precioVenta: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  @ApiProperty({
    description: 'Cantidad en stock',
    type: 'number',
    example: 100,
    required: false,
    default: 0,
  })
  stock?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  @ApiProperty({
    description: 'Stock mínimo de seguridad',
    type: 'number',
    example: 10,
    required: false,
    default: 0,
  })
  stockMinimo?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Descripción del producto',
    type: 'string',
    example: 'Lápiz de grafito HB para escritura',
    required: false,
  })
  descripcion?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Estado del producto (activo/inactivo)',
    type: 'boolean',
    example: true,
    required: false,
    default: true,
  })
  estado?: boolean;
}
