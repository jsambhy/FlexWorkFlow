export class calculationmodel
{
  Id: number;
  Name: string;
  WStepActionId: number;
  Condition: string;
  Calculation: string;
  TargetDatafieldId: number
  UpdateQuery: string;
  CreatedById: number;
  CreatedByRoleId: number;
  CreatedDateTime: Date;
  UpdatedById: number;
  UpdatedByRoleId: number;
  UpdatedDateTime: Date;
  ParameterCarrier: string;
  wfname: string;
  Type: string;
  EntityType: string;
  EntityId: number;
  IsFormGrid: Boolean;
  FormGridName: string;
  CalcMappingDFIds: string;
}
