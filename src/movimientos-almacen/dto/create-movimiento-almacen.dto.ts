import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  TipoMovimiento,
  OrigenMovimiento,
} from '../entities/movimiento-almacen.entity';

export class CreateMovimientoAlmacenDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'ID del producto',
    type: 'string',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  productoId: string;

  @IsEnum(TipoMovimiento)
  @IsNotEmpty()
  @ApiProperty({
    description: 'Tipo de movimiento',
    enum: TipoMovimiento,
    example: TipoMovimiento.ENTRADA,
  })
  tipoMovimiento: TipoMovimiento;

  @IsEnum(OrigenMovimiento)
  @IsNotEmpty()
  @ApiProperty({
    description: 'Origen del movimiento',
    enum: OrigenMovimiento,
    example: OrigenMovimiento.COMPRA,
  })
  origenMovimiento: OrigenMovimiento;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  @ApiProperty({
    description: 'Cantidad de productos',
    type: 'number',
    example: 10,
  })
  cantidad: number;

  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description: 'ID de referencia (compra, venta, etc.)',
    type: 'string',
    required: false,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  referenciaId?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Observaciones adicionales',
    type: 'string',
    required: false,
    example: 'Ajuste por inventario físico',
  })
  observaciones?: string;
}
