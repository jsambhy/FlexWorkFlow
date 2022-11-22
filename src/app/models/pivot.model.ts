import { DateTime } from 'aws-sdk/clients/worklink';


export class PivotModel {
  Id: number;
  ReportId: number;
  Name: string;
  Description: string;
  PivotJson: string;  
  CreatedById: number;
  UpdatedById: number;
  CreatedUpdatedId: number;
  UpdatedByRoleId: number;
  CreatedByRoleId: number;
  CreatedDateTime: DateTime;
  UpdatedDateTime: DateTime; 
  ParameterCarrier: string;
}

export class PivotRowModel {
  Id: number;
  PivotViewId: number;
  DataFieldId: number;
  Caption: string;
  Ordinal: number;
  ParameterCarrier: string;
}

export class PivotColumnModel {
  Id: number;
  PivotViewId: number;
  DataFieldId: number;
  Caption: string;
  Ordinal: number;
  ParameterCarrier: string;
}

export class PivotValueModel {
  Id: number;
  PivotViewId: number;
  DataFieldId: number;
  Caption: string;
  Ordinal: number;
  Format: string;
  Formula: string;
  AggregateFunc: string;
  ParameterCarrier: string;
}

//export class PivotConfigData {
//  Id: number;
//  PivotViewId: number;
//  DataFieldId: number;
//  Caption: number;
//  Ordinal: number;
//}



