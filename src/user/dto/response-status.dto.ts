export class ResponseStatusConfirmPassword {
  confirmStatus: boolean;
  message: string;
}

export class ResponseStatusDeleteUser {
  userStatus: {
    acknowledged: boolean;
    deletedCount: number;
  };
  //   taskStatus: {
  //     acknowledged: boolean;
  //     deletedCount: number;
  //   };
  message: string;
}
