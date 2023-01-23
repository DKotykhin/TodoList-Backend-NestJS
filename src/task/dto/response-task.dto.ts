import { Schema, Types } from 'mongoose';

import { TaskDto } from './task.dto';

export class GetTaskResponse {
  readonly totalTasksQty: number;
  readonly totalPagesQty: number;
  readonly tasksOnPageQty: number;
  readonly tasks: Array<TaskDto>;
}

export class CreateTaskResponse {
  readonly _id: Types.ObjectId;
  readonly title: string;
  readonly subtitle?: string;
  readonly description?: string;
  readonly deadline?: Schema.Types.Date;
  readonly createdAt: Schema.Types.Date;
  readonly completed: boolean;
  readonly message: string;
}

export class DeleteTaskResponse {
  readonly taskStatus: {
    acknowledged: boolean;
    deletedCount: number;
  };
  readonly message: string;
}
