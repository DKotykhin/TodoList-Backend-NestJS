import { Schema, Types } from 'mongoose';

export class UserResponse {
  readonly _id: Types.ObjectId;
  readonly name: string;
  readonly email: string;
  readonly avatarURL?: string;
  readonly createdAt: Schema.Types.Date;
  readonly message: string;
}
