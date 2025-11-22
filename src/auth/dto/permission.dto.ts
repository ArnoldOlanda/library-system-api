import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePermissionDto {
   
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Nombre del permiso',
        example: 'CREATE_USER',
        type: 'string'
    })
    name: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Descripción del permiso',
        example: 'Permite crear nuevos usuarios en el sistema',
        type: 'string'
    })
    description?: string;
}

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {}
