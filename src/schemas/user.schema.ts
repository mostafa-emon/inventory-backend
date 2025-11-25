import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Company } from "./company.schema";

@Schema({ timestamps: true })

export class User {
    @Prop({ type: mongoose.Schema.ObjectId, ref: 'Company', required: true, index: true })
    company: Company;

    @Prop({ required: true })
    name: string;

    @Prop()
    designation: string;

    @Prop({ required: true })
    phone: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop()
    avatar: string;

    @Prop({ type: [String], default: [] })
    permissions: string[];

    @Prop({ required: true, default: true })
    status: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);