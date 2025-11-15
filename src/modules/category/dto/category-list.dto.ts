import { IsMongoId, IsNotEmpty, IsOptional, IsString, MinLength, ValidateIf } from "class-validator";

export class CategoryFilterDto {
    @IsNotEmpty()
    @IsMongoId()
    companyId: string;

    @ValidateIf((obj) => obj.name !== '')
    @IsOptional()
    @IsString()
    @MinLength(3)
    name: string;
}