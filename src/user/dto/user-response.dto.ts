import { ApiProperty } from '@nestjs/swagger';

import { UserDto } from './user.dto';

export class UserResponseDto extends UserDto {
  @ApiProperty()
  readonly message: string;
}

export class ConfirmPasswordResponse {
  @ApiProperty()
  confirmStatus: boolean;

  @ApiProperty()
  message: string;
}

export class DeletedStatus {
  @ApiProperty()
  acknowledged: boolean;

  @ApiProperty()
  deletedCount: number;
}

export class DeleteUserResponse {
  @ApiProperty()
  userStatus: DeletedStatus;

  @ApiProperty()
  taskStatus: DeletedStatus;

  @ApiProperty()
  message: string;
}

export class TaskStatisticResponse {
  @ApiProperty()
  totalTasks: number;

  @ApiProperty()
  completedTasks: number;

  @ApiProperty()
  activeTasks: number;

  @ApiProperty()
  overdueTasks: number;

  @ApiProperty()
  message: string;
}
