import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePermissionDto {
   
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description?: string;
}

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {}
