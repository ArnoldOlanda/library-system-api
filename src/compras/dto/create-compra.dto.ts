import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsDecimal,
  IsInt,
  IsNotEmpty,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class DetalleCompraDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'ID del producto',
    type: 'string',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  productoId: string;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  @ApiProperty({
    description: 'Cantidad comprada',
    type: 'number',
    example: 50,
    minimum: 1,
  })
  cantidad: number;

  @IsDecimal({ decimal_digits: '2' })
  @IsNotEmpty()
  @ApiProperty({
    description: 'Precio unitario del producto',
    type: 'number',
    example: 0.5,
  })
  precioUnitario: number;
}

export class CreateCompraDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'ID del proveedor',
    type: 'string',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  proveedorId: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Fecha de la compra',
    type: 'string',
    example: '2025-12-18T10:00:00Z',
  })
  fechaCompra: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetalleCompraDto)
  @ApiProperty({
    description: 'Detalle de productos comprados',
    type: [DetalleCompraDto],
  })
  detalles: DetalleCompraDto[];
}
