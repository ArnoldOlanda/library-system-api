import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl, Length } from "class-validator";

export class CreateUserDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    @Length(6, 20)
    password: string;

    @IsOptional()
    @IsUrl()
    avatar?: string;
}
