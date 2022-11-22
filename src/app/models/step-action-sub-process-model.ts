import { Boolean } from 'aws-sdk/clients/ebs';

export class StepActionSubProcessModel {
  Id: number;
  StepActionId: number;
  LandingStepId: number;
  IsReadyWait: Boolean;
  CreatedById: number;
  UpdatedById: number;
  LoginUserRoleId: number;
  CreatedByRoleId: number;
  UpdatedByRoleId: number;
  CreatedDateTime: Date;
  UpdatedDateTime: Date;
  ParameterCarrier: string;
}

export class MParentSubProcessDFViewModel {
  Id: number;
  ParentWFId: number;
  ParentDFId: number;
  SubProcessWFId: number;
  SubProcessDFId: number;
  ToDirection: Boolean;
  FroDirection: Boolean;
  CreatedById: number;
  UpdatedById: number; 
  CreatedByRoleId: number;
  UpdatedByRoleId: number;
  CreatedDateTime: Date;
  UpdatedDateTime: Date;
  ParameterCarrier: string;
}
