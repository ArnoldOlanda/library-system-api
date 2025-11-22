import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateRoleDto {
    
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Nombre del rol',
        example: 'ADMIN',
        type: 'string'
    })
    name: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Descripción del rol',
        example: 'Rol de administrador con acceso completo al sistema',
        type: 'string'
    })
    description?: string;
}

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
