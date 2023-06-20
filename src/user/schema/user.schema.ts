import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
class resetPasswordData {
  @Prop()
  token: string;

  @Prop()
  expire: MongooseSchema.Types.Date;

  @Prop()
  changed: MongooseSchema.Types.Date;
}
const resetPasswordSchema = SchemaFactory.createForClass(resetPasswordData);

@Schema({
  timestamps: true,
  versionKey: false,
})
export class User {
  @Prop()
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ type: resetPasswordSchema, default: {} })
  resetPassword: typeof resetPasswordSchema;

  @Prop()
  avatarURL: string;

  @Prop()
  createdAt: MongooseSchema.Types.Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
