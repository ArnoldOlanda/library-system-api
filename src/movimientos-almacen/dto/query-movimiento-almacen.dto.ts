import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaginationDto } from '../../users/dto/pagination.dto';
import {
  TipoMovimiento,
  OrigenMovimiento,
} from '../entities/movimiento-almacen.entity';

export class QueryMovimientoAlmacenDto extends PaginationDto {
  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description: 'Filtrar por ID de producto',
    type: 'string',
    required: false,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  productoId?: string;

  @IsEnum(TipoMovimiento)
  @IsOptional()
  @ApiProperty({
    description: 'Filtrar por tipo de movimiento',
    enum: TipoMovimiento,
    required: false,
    example: TipoMovimiento.ENTRADA,
  })
  tipoMovimiento?: TipoMovimiento;

  @IsEnum(OrigenMovimiento)
  @IsOptional()
  @ApiProperty({
    description: 'Filtrar por origen del movimiento',
    enum: OrigenMovimiento,
    required: false,
    example: OrigenMovimiento.COMPRA,
  })
  origenMovimiento?: OrigenMovimiento;

  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description: 'Filtrar por ID de referencia',
    type: 'string',
    required: false,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  referenciaId?: string;
}
