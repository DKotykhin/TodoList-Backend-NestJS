import { ApiProperty } from '@nestjs/swagger';

import { TaskDto } from './task.dto';
import { DeletedStatus } from '../../user/dto/user-response.dto';

export class GetTasksResponse {
  @ApiProperty()
  readonly totalTasksQty: number;

  @ApiProperty()
  readonly totalPagesQty: number;

  @ApiProperty()
  readonly tasksOnPageQty: number;

  @ApiProperty()
  readonly tasks: Array<TaskDto>;
}

export class TaskResponse {
  @ApiProperty()
  readonly task: TaskDto;

  @ApiProperty()
  readonly message: string;
}

export class DeleteTaskResponse {
  @ApiProperty()
  readonly taskStatus: DeletedStatus;
  @ApiProperty()
  readonly message: string;
}
