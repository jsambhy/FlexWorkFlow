export class ColumnConfigurationModel {
  Id: number;
  EntityType: string;
  ColumnName: string;
  Label: string;
  Ordinal: number;
  IsMandatory: boolean;
  //ReferenceId: number;
  DefaultValue: string;
  UserDataType: string;
  DataType: string;
  MaximumLength: number;
  DigitsAfterDecimal: number;
  EntityId: string;
  ProjectId: number;
  AuditEnabled: boolean;
  DropDownName: string;
  formName: string;
  MinValueInclusive: number;
  MaxValueInclusive: number;
  MinDate: Date;
  MaxDate: Date;
  //MaxDateInclusiveLocal: Date;
  IsDropDown: boolean;
  Type: string;
  MinimumLength: number;
  IsActive: boolean;
  //DropdownDisplayColumnsId: number;
  SelectedColumnName:string;
  ParameterCarrier: string;
  //TabId: number;
  //FormSectionId: number;
  //TabName: string;
  //SectionName: string;
  //FormSectionOrdinal: number;
  //TabOrdinal: number;
  //OldTabbId: number;
  //OldFormSectionId: number;
  IsMultiSelection: boolean;
  ToolTip: string;
  Width: number;
  DropDownValues: string;
  ControlProperties: string;
  JoiningEntityType: string;
  JoiningEntityId: number;
  DisplayColumnsList: string;
 
}

export class MasterDataViewModel {
  Label: string;
  Values: string;
  ScopeEntityType: string;
  ScopeEntityId: number;
  RefCode: string;
  CreatedById: number;
  UpdatedById: number;
  CreatedDateTime: Date;
  UpdatedDateTime: Date;
  CreatedByRoleId: number;
  UpdatedByRoleId: number;
  ParameterCarrier: string;
}


