import { IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryDto {
     @IsNotEmpty()
     @IsMongoId()
     company: string;

     @IsNotEmpty()
     @IsString()
     name: string;
}