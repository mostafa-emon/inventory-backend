import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { User } from "src/schemas/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";
import { Company } from "src/schemas/company.schema";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from 'bcrypt';
import { ValidateObjectIdPipe } from "src/common/validations/validate-object-id.pipe";
import { UpdateUserDto } from "./dto/update-user.dto";

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

    async create(createUserDto: CreateUserDto) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

        return await new this.userModel({
            ...createUserDto,
            password: hashedPassword
        }).save();
    }

    async updateAvatar(userId: Types.ObjectId, fileURl: string) {
        return await this.userModel.findByIdAndUpdate(userId, { $set: { avatar: fileURl } }, { new: true });
    }

    async findOne(id: ValidateObjectIdPipe) {
        return await this.userModel.findById(id).select('name designation phone email permissions avatar status');
    }

    async update(id: ValidateObjectIdPipe, updateData: UpdateUserDto) {
        if(updateData.password && updateData.password != '') {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(updateData.password, salt);
            return await this.userModel.findByIdAndUpdate(id, {
                ...updateData,
                password: hashedPassword
            }, {new: true});
        } else {
            return await this.userModel.findByIdAndUpdate(id, updateData, {new: true});
        }
    }

    async createInitialUser() {
        const isExists = await this.userModel.findOne({ email: this.configService.get<string>('DEFAULT_USER_EMAIL') }).exec()
        if(isExists) return;
        const defaultCompany = await this.companyModel.findOne({ invoicePhone: this.configService.get<string>('DEFAULT_COMPANY_INVOICE_PHONE') }).select('_id').exec()
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.configService.get<string>('DEFAULT_USER_PASSWORD'), salt);
        return await this.userModel.create({
            company: defaultCompany?._id,
            name: this.configService.get<string>('DEFAULT_USER_NAME'),
            designation: this.configService.get<string>('DEFAULT_USER_DESIGNATION'),
            phone: this.configService.get<string>('DEFAULT_USER_PHONE'),
            email: this.configService.get<string>('DEFAULT_USER_EMAIL'),
            password: hashedPassword,
            permissions: [],
            status: this.configService.get<string>('DEFAULT_USER_STATUS'),
        })
    }
}