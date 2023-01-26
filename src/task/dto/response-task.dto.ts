import { Schema, Types } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { TaskDto } from './task.dto';

export class GetTaskResponse {
  @ApiProperty()
  readonly totalTasksQty: number;

  @ApiProperty()
  readonly totalPagesQty: number;

  @ApiProperty()
  readonly tasksOnPageQty: number;

  @ApiProperty()
  readonly tasks: Array<TaskDto>;
}

export class CreateTaskResponse {
  @ApiProperty()
  readonly _id: Types.ObjectId;

  @ApiProperty()
  readonly title: string;

  @ApiPropertyOptional()
  readonly subtitle?: string;

  @ApiPropertyOptional()
  readonly description?: string;

  @ApiPropertyOptional()
  readonly deadline?: Schema.Types.Date;

  @ApiProperty()
  readonly createdAt: Schema.Types.Date;

  @ApiProperty()
  readonly completed: boolean;

  @ApiProperty()
  readonly message: string;
}

export class DeleteTaskResponse {
  @ApiProperty()
  readonly taskStatus: {
    acknowledged: boolean;
    deletedCount: number;
  };
  @ApiProperty()
  readonly message: string;
}
