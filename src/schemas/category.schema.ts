import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Company } from "./company.schema";

@Schema({ timestamps: true})
export class Category {
    @Prop({ type: mongoose.Schema.ObjectId, ref: 'Company', required: true})
    company: Company;

    @Prop({ required:true })
    name: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
CategorySchema.index({ companyId: 1, name: 1 }, { unique: true });