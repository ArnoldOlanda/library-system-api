import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsDecimal, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateArqueoCajaDto {
  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Fecha del arqueo de caja',
    type: 'string',
    example: '2025-12-18T18:00:00Z',
  })
  fechaArqueo: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  @ApiProperty({
    description: 'Monto inicial de caja',
    type: 'number',
    example: 100.0,
  })
  montoInicial: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  @ApiProperty({
    description: 'Total recaudado',
    type: 'number',
    example: 500.0,
  })
  totalRecaudado: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  @ApiProperty({
    description: 'Total en efectivo',
    type: 'number',
    example: 300.0,
  })
  totalEfectivo: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  @ApiProperty({
    description: 'Total en tarjeta',
    type: 'number',
    example: 200.0,
  })
  totalTarjeta: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  @ApiProperty({
    description: 'Diferencia entre monto esperado y recaudado',
    type: 'number',
    example: 0.0,
  })
  diferencia: number;
}
