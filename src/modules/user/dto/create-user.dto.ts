import { Transform } from "class-transformer";
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
    @IsString()
    avatar?: string;

    @IsArray()
    @IsString({ each: true })
    @Transform(({ value }) => {
        if (typeof value === 'string') {
        try {
            return JSON.parse(value);
        } catch {
            return value;
        }
        }
        return value;
    })
    permissions: string[];

    @Transform(({ value }) => value === 'true')
    @IsNotEmpty()
    @IsBoolean()
    status: boolean;
}