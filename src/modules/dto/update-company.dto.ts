import { Transform } from "class-transformer";
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, ValidateIf } from "class-validator";

export class UpdateCompanyDto {
    @IsOptional()
    @IsString()
    name: string;

    @Transform(({ value }) => value === 'true')
    @IsOptional()
    @IsBoolean()
    status: boolean;

    @IsOptional()
    @IsString()
    invoicePhone: string;

    @IsOptional()
    @IsString()
    invoiceAddress: string;

    @ValidateIf((obj) => obj.invoiceEmail !== '')
    @IsOptional()
    @IsEmail()
    invoiceEmail: string;
    
    @IsOptional()
    @IsString()
    invoiceWebsite: string;
}