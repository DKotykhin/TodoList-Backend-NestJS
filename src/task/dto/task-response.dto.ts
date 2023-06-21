import { ApiProperty } from '@nestjs/swagger';

import { TaskDto } from './task.dto';
import { DeletedStatus } from 'src/user/dto/user-response.dto';

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

export class CreateTaskResponse extends TaskDto {
  @ApiProperty()
  readonly message: string;
}

export class DeleteTaskResponse {
  @ApiProperty()
  readonly taskStatus: DeletedStatus;
  @ApiProperty()
  readonly message: string;
}
