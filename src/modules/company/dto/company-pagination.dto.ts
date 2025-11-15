import { Transform, Type } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MinLength, ValidateIf } from "class-validator";

export class CompanyPaginationDto {
    @IsNotEmpty()
    @Type(() => Number)
    @IsPositive()
    page: number;

    @IsNotEmpty()
    @Type(() => Number)
    @IsPositive()
    limit: number;

    @ValidateIf((obj) => obj.name !== '')
    @IsOptional()
    @IsString()
    @MinLength(3)
    name: string;

    @IsOptional()
    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    status: boolean;
}