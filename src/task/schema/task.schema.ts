import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as Sch } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

@Schema({
  timestamps: true,
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
  deadline: Sch.Types.Date;

  @Prop()
  createdAt: Sch.Types.Date;

  @Prop({ required: true, ref: 'User' })
  author: Sch.Types.ObjectId;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
