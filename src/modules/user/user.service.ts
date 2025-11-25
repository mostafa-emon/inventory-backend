import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/schemas/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UserService {
    constructor (
        @InjectModel(User.name) private userModel: Model<User>
    ) {}

    async createUser(createUserDto: CreateUserDto) {
        return await new this.userModel(createUserDto).save();
    }
}