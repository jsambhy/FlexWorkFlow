export class stepcolumnsmodel {
  Id: number;
  Step: string;
  Label: string;
  Ordinal: number;
  ShouldBeVisible: boolean;
  //JoiningTableColumn: string;
  AscDesc: string;
  WStepId: number;
  ParameterCarrier: string;
  DataFieldId: number;
  ParentDataFieldId: number;
  ReferenceId: number;
  //RefTableJoinColConfigId: number;
  //FlexTableJoinColConfigId: number;
  wfname: string;
  IsJoin: string;
  tablenamefromcolumname: string;
  SelectedSteps: string;
  wfId: number;
  CreatedById: number;
  CreatedByRoleId: number;
  UpdatedById: number;
  UpdatedByRoleId: number;
  JoiningEntityType: string;
  JoiningEntityId: number;
}
export class entityviewmodel {
  Value: number;
  EntityId: number;
  EntityType: string;
  RefTableJoinColConfigId: number;
}

