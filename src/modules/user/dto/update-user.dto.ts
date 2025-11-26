import { Transform } from "class-transformer";
import { IsArray, IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MinLength, ValidateIf } from "class-validator";

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    name: string;
    
    @IsString()
    @IsOptional()
    designation: string;

    @Transform(({ value }) => value === '' ? undefined : value)
    @IsOptional()
    @Matches(/^\+?\d+$/, {
        message: 'Phone number can only contain digits and may start with a plus sign',
    })
    phone: string;

    //@ValidateIf((obj) => obj.invoiceEmail !== '')
    @IsOptional()
    @IsEmail()
    email: string;

    @Transform(({ value }) => value === '' ? undefined : value)
    @IsOptional()
    @MinLength(8)
    @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, {
        message: 'Password must include at least one uppercase letter and one number',
    })
    password: string;

    @IsOptional()
    @IsString()
    avatar?: string;

    @IsOptional()
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

    @IsOptional()
    @Transform(({ value }) => value === 'true')
    @IsNotEmpty()
    @IsBoolean()
    status: boolean;
}