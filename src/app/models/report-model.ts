import { DateTime } from "aws-sdk/clients/forecastqueryservice";

export class Report {
  
  Id: number;
  ScopeEntityType: string;
  ScopeEntityId: number;
  EntityType: string;
  EntityId: number;
  Name: string;
  DownloadFileName: string;
  Description: string;
  SelectClause: string;
  WhereClause: string;
  HavingClause: string;
  OrderByClause: string;
  SortOrder: string;
  AggFuncDataJson: string;
  AccessRoleIdList: string;
  UserIdList: string;
  TagIdList: string;
  GroupByClause: string;
  ParameterCarrier: string;
  CreatedById: number;
  CreatedByRoleId: number;
  UpdatedById: number;
  UpdatedByRoleId: number;
  ReportParamJson: string;
}



export class ReportSelectColumnModel {

  Id: number;
  Label: string;
  DataFieldId: number;
  Cast: string;
}


export class ReportParametersModel {
  Id: number;
  ReportId: number;
  DataFieldId: number;
  Label: string;
  Ordinal: number;
  IsMandatory: boolean;
  DefaultValue: string;
  UserDataType: string;
  DataType: string;
  MaximumLength: number;
  DigitsAfterDecimal: number;
  AuditEnabled: boolean;
  DropDownName: string;
  MinValueInclusive: number;
  MaxValueInclusive: number;
  MinDate: Date;
  MaxDate: Date;
  DefaultDateValue: Date;
  DefaultTimeValue: DateTime;
  IsDropDown: boolean;
  Type: string;
  MinimumLength: number;
  IsActive: boolean;
  SelectedColumnName: string;
  ParameterCarrier: string;
  IsMultiSelection: boolean;
  ToolTip: string;
  Width: number;
  DropDownValues: string;
  ControlProperties: string;
  JoiningEntityType: string;
  JoiningEntityId: number;
  DisplayColumnsList: string;
  CustomFunctionId: number;
  CustomFunctionParameters: string;
  EntityType: string;
  EntityId: string;
  ProjectId: number;
}


