export class ConfirmPasswordResponse {
  confirmStatus: boolean;
  message: string;
}

export class DeleteUserResponse {
  userStatus: {
    acknowledged: boolean;
    deletedCount: number;
  };
  taskStatus: {
    acknowledged: boolean;
    deletedCount: number;
  };
  message: string;
}

export class TaskStatisticResponse {
  totalTasks: number;
  completedTasks: number;
  activeTasks: number;
  overdueTasks: number;
  message: string;
}
