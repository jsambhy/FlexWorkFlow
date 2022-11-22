export class stepactionsmodel {
  Id: number;
  Label: string;
  Icon: string;
  ActionId: number;
  Description: string;
  StepId: number;
  ActionIconId: number;
  ParameterCarrier: string;
  ExecuteAfterDays: number;
  wfname: string;
  ChoosenSteps: string;
  WFId: number;
  Counts: number;
  CreatedById: number;
  UpdatedById: number;
  LoginUserRoleId: number;
  CreatedByRoleId: number;
  UpdatedByRoleId: number;
  CreatedDateTime: Date;
  UpdatedDateTime: Date;
  Iscontinuetoproceed: string;
}


export class ActionIconsmodel {
  Id: number;
  Label: string;
  Class: string;
  SocialMedia: string;
}


//wstepactioncalc

export class StepActionCalcViewModel {
  Id: number;
  Name: string;
  WStepActionId: number;
  Condition: string;
  Calculation: string;
  TargetColumnValue: string;
  TargetColumn: number;
  UpdateQuery: string;
  CreatedById: number;
  CreatedbyRoleId: number;
  CreatedDateTime: Date;
  UpdatedById: number;
  UpdatedByRoleId: number;
  UpdatedDateTime: Date;
  ParameterCarrier: string;
  ColumnList: string;
  OperatorCalc: string;
  DataValueCalc: string;
  AndOrCalc: string;
  Constants: number;
}



