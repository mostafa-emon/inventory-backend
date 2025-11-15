import { Type } from "class-transformer";
import { IsMongoId, IsNotEmpty, IsOptional, IsPositive, IsString, MinLength, ValidateIf } from "class-validator";

export class CategoryPaginationDto {
    @IsNotEmpty()
    @IsMongoId()
    companyId: string;

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
}