export class validationsmodel {
  Id: number;
  Name: string;
  StepActionId: number;
  Type: string;
  Description: string;
  CreatedById: number;
  UpdatedById: number;
  CreatedByRoleId: number;
  UpdatedByRoleId: number;
  ParameterCarrier: string;
  LoggedInScopeEntityType: string;
  LoggedInScopeEntityId: number;
  StepName: string;
  ActionName: string;
  IsActive: Boolean;
  SelectedValidationRules: string;
  ProjectId: number;
}

export class validationRulesmodel {
  Id: number;
  Name: string;
  Description: string;
  Message: string;
  CreatedById: number;
  UpdatedById: number;
  CreatedByRoleId: number;
  UpdatedByRoleId: number;
  ParameterCarrier: string;
  LoggedInScopeEntityType: string;
  LoggedInScopeEntityId: number;
  WhereClause: string;
  WorkflowId: number;
  Type: string;
  VoilationThreshold: number;
  FormGridColumn: string;
  FormGridColumnIds: string;
  FlexTableId: number;
  IsActive: Boolean;
  ProjectId: number;
}
