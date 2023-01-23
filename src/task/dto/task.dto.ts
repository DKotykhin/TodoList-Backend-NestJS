import { Schema, Types } from 'mongoose';
import { IsOptional } from 'class-validator';

export class CreateTaskDto {
  readonly title: string;

  @IsOptional()
  readonly subtitle: string;

  @IsOptional()
  readonly description: string;

  @IsOptional()
  readonly deadline: Schema.Types.Date;

  @IsOptional()
  readonly completed: boolean;
}

export class TaskDto {
  readonly _id: Types.ObjectId;
  readonly title: string;

  @IsOptional()
  readonly subtitle: string;

  @IsOptional()
  readonly description: string;

  @IsOptional()
  readonly deadline: Schema.Types.Date;

  @IsOptional()
  readonly completed: boolean;
}
