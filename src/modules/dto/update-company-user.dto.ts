import { IsEmail, IsOptional, IsString, ValidateIf } from "class-validator";

export class UpdateCompanyByUserDto {
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

    @IsOptional()
    @IsString()
    logo: string;
}