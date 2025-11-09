import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class ForgotPasswordDto {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({ example: 'example@gmail.com', description: 'Email del usuario que ha olvidado su contraseña' })
    email: string;
}