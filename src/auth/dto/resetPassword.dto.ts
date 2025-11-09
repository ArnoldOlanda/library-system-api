import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class ResetPasswordDto {
    
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Token para resetear la contraseña',
        example: 'a1b2c3d4e5f6g7h8i9j0',
    })
    token: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @ApiProperty({
        description: 'Nueva contraseña del usuario',
        example: 'nuevaContraseña123',
    })
    password: string;

}