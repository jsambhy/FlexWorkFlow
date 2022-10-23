export class ILogin {
  UserName: string;
  Password: string;
}
export class UserRoleViewModel {
  Id: number;
  RoleId: number;
  RoleName: string;
  IsDefault: boolean;
  EntityType: string;
  EntityId: number;
}

export class LoginViewModel {
  Id: number;
  RoleId: number;
  Email: string;
  FirstName: string;
  LastName: string;
  FullName: string;
  ProjectId: number;
  LastLoginMessage: string;
  ChangePwdAtNextLogin: boolean;
  IsMFARequired: boolean;
  IsMFASet: boolean;
  IsADResetPasswordRequired: boolean;
  PolicyAccepted: boolean;
  UserRoles: UserRoleViewModel[];
  UserImagePath: string;
  Environment: string;
  IsSystemUser: boolean;
}


export class ChangePasswordModel {
  Email: string;
  Password: string;
  NewPassword: string;
  ConfirmPassword: string;
  ParameterCarrier: string;
}
export class PasswordQuestionModel {
  PasswordDetails: ChangePasswordModel;
  QuestionList: QuestionsModel[];
}
export class ChangeSecurityQuestionsModel {
  //Email: string;
  UserId: number;
  QuestionList: QuestionsModel[];
}
export class QuestionsModel {
  Id?: number;
  Question: string;
  Answer: string;
  Answerhint: string;
}


export class ForgotPasswordViewModel{
  Id: number;
  UserId: number;
  ParameterCarrier: string;
  Answer: string;
}



export class LogActivityViewModel {
  Remarks: string;
  Activity: string;
  IsActivitySuccess: boolean;
  ReturnUrl: string;
}
