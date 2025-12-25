import { IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../users/dto/pagination.dto';

export class FindVentasDto extends PaginationDto {
  @IsOptional()
  @IsDateString()
  @ApiProperty({
    description: 'Start date for filtering (YYYY-MM-DD)',
    required: false,
  })
  startDate?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    description: 'End date for filtering (YYYY-MM-DD)',
    required: false,
  })
  endDate?: string;
}
