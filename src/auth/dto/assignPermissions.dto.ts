import { IsArray, IsNotEmpty, IsUUID } from "class-validator";

export class AssignPermissionsDto {

    @IsNotEmpty()
    @IsArray()
    @IsUUID('4', { each: true })
    permissionIds: string[];
}