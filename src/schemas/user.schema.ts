import { Prop, Schema } from "@nestjs/mongoose";

@Schema({ timestamps: true })

export class User {
    @Prop()
    name: string;
}