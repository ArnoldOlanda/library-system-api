import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsDecimal,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { FormaPago } from '../entities/venta.entity';

export class DetalleVentaDto {
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
    description: 'Cantidad vendida',
    type: 'number',
    example: 5,
    minimum: 1,
  })
  cantidad: number;

  @IsDecimal({ decimal_digits: '2' })
  @IsNotEmpty()
  @ApiProperty({
    description: 'Precio unitario del producto',
    type: 'number',
    example: 1.0,
  })
  precioUnitario: number;
}

export class CreateVentaDto {
  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description: 'ID del cliente (opcional)',
    type: 'string',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  clienteId?: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Fecha de la venta',
    type: 'string',
    example: '2025-12-18T14:30:00Z',
  })
  fechaVenta: string;

  @IsEnum(FormaPago)
  @IsNotEmpty()
  @ApiProperty({
    description: 'Forma de pago',
    enum: FormaPago,
    example: FormaPago.EFECTIVO,
  })
  formaPago: FormaPago;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetalleVentaDto)
  @ApiProperty({
    description: 'Detalle de productos vendidos',
    type: [DetalleVentaDto],
  })
  detalles: DetalleVentaDto[];
}
