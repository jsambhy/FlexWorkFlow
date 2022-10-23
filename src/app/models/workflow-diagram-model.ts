import { DecimalPipe } from "@angular/common";

export class workflownodemodel {
  Id: number;
  offsetY: number;
  offsetX: number;
  //annotation: string;
  shapeName: string;
  WorkflowId: number;  
  Label: string;
  Description: string;
  ScopeEntityType: string;
  ScopeEntityId: number;
  NVarcharId: string;
  ParameterCarrier: string;
  WFLabel: string;
  CreatedById : number;
  UpdatedById: number;
  CreatedByRoleId: number;
  UpdatedByRoleId: number
  CreatedDateTime: Date;
  UpdatedDateTime: Date;
  IsReady: boolean;
  IsMandatory: boolean;
}


export class workflowconnectormodel {
  connectorId: string;
  sourceID: string;
  targetID: string;

  annotation: string;
}

export class ActionIconsmodel {
  Id: number;
  Class: string;  
  SocialMedia: string;
}



export class StepActionLabelmodel {
  Label: string;
  IconId: number;
  Icon: string;
  Counts: number;
  StepActionLabelCount: number;
  StepId: number;
  
}


export class NextStepmodel {
  ConnectorId: string;
  StepId: number;
  NextStepId: number;
  NVarcharStepId: string;
  NVarcharNextStepId: string;
  ActionIconId: number;
  ActionLabel: string;
  Label: string;
  StepName: string;
  NextStepName: string;
  ParameterCarrier: string;
  StepActionId: number;
  BranchCondition: string;
  WorkFlowId: number;
  WorkFlowName: string;
  CreatedByRoleId: number;
  UpdatedByRoleId: number;
  CreatedById: number;
  UpdatedById: number;
  CreatedDateTime: Date;
  UpdatedDateTime: Date;

}


