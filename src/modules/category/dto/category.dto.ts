import { IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class CategoryDto {
     @IsNotEmpty()
     @IsMongoId()
     company: string;

     @IsNotEmpty()
     @IsString()
     name: string;
}