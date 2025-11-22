import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsUUID } from "class-validator";

export class AssignPermissionsDto {

    @IsNotEmpty()
    @IsArray()
    @IsUUID('4', { each: true })
    @ApiProperty({
        description: 'Array de IDs de permisos (UUID v4)',
        example: ['550e8400-e29b-41d4-a716-446655440000', '6ba7b810-9dad-11d1-80b4-00c04fd430c8'],
        type: [String],
        isArray: true
    })
    permissionIds: string[];
}