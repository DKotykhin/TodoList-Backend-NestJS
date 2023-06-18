import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as Sch } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class resetPasswordApi {
  @Prop()
  token: string;

  @Prop()
  expire: Sch.Types.Date;
}
const resetPasswordSchema = SchemaFactory.createForClass(resetPasswordApi);

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
  createdAt: Sch.Types.Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
