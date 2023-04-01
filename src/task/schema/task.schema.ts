import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop()
  subtitle: string;

  @Prop()
  description: string;

  @Prop({ default: false })
  completed: boolean;

  @Prop()
  deadline: MongooseSchema.Types.Date;

  @Prop()
  createdAt: MongooseSchema.Types.Date;

  @Prop()
  updatedAt: MongooseSchema.Types.Date;

  @Prop()
  completedAt: MongooseSchema.Types.Date;

  @Prop({ required: true, ref: 'User' })
  author: MongooseSchema.Types.ObjectId;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
