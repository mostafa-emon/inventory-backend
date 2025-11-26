import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/schemas/user.schema";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { Company, CompanySchema } from "src/schemas/company.schema";
import { FileHandlingService } from "src/common/services/file-handling.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: User.name,
                schema: UserSchema
            },
            {
                name: Company.name,
                schema: CompanySchema
            }
        ]),
    ],
    controllers: [ UserController ],
    providers: [ UserService, FileHandlingService ]
})

export class UserModule {}