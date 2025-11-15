import { IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class CategoryDto {
     @IsNotEmpty()
     @IsMongoId()
     companyId: string;

     @IsNotEmpty()
     @IsString()
     name: string;
}