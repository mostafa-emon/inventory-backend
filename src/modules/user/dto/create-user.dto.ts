import { IsArray, IsBoolean, IsEmail, IsMongoId, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from "class-validator";

export class CreateUserDto {
    @IsMongoId()
    @IsNotEmpty()
    company: string;

    @IsString()
    @IsNotEmpty()
    name: string;
    
    @IsString()
    @IsOptional()
    designation: string;

    @Matches(/^\+?\d+$/, {
        message: 'Phone number can only contain digits and may start with a plus sign',
    })
    phone: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @MinLength(8)
    @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, {
        message: 'Password must include at least one uppercase letter and one number',
    })
    password: string;

    @IsOptional()
    avatar: string;

    @IsArray()
    @IsString({ each: true })
    permissions: string[];

    @IsBoolean()
    @IsNotEmpty()
    status: boolean;
}