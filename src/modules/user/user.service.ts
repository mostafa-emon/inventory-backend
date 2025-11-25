import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/schemas/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";
import { Company } from "src/schemas/company.schema";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UserService {
    constructor (
        private configService: ConfigService,
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Company.name) private companyModel: Model<Company>
    ) {}

    async onModuleInit() {
        await this.createInitialUser();
    }

    async createUser(createUserDto: CreateUserDto) {
        return await new this.userModel(createUserDto).save();
    }

    async createInitialUser() {
        const isExists = await this.userModel.findOne({ email: this.configService.get<string>('DEFAULT_USER_EMAIL') }).exec()
        if(isExists) return;
        const defaultCompany = await this.companyModel.findOne({ invoicePhone: this.configService.get<string>('DEFAULT_COMPANY_INVOICE_PHONE') }).select('_id').exec()
        
        return await this.userModel.create({
            company: defaultCompany?._id,
            name: this.configService.get<string>('DEFAULT_USER_NAME'),
            designation: this.configService.get<string>('DEFAULT_USER_DESIGNATION'),
            phone: this.configService.get<string>('DEFAULT_USER_PHONE'),
            email: this.configService.get<string>('DEFAULT_USER_EMAIL'),
            password: this.configService.get<string>('DEFAULT_USER_PASSWORD'),
            permissions: [],
            status: this.configService.get<string>('DEFAULT_USER_STATUS'),
        })
    }
}