import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class Company {
    @Prop({ required: true, unique: true })
    name: string;

    @Prop({ required: false })
    logo: string;

    @Prop({ required: true, default: true })
    status: boolean;

    @Prop({ required: true })
    invoicePhone: string;

    @Prop({ required: false })
    invoiceAddress: string;

    @Prop({ required: false })
    invoiceEmail?: string;

    @Prop({ required: false })
    invoiceWebsite: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);