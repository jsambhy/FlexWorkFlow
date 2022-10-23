import { DateTime } from 'aws-sdk/clients/worklink';


export class DashboardDetailsModel {
  Id: number;
  PanelId: number;
  UIComponentId: number;
  ConfigJson: string;
  CreatedById: number;
  UpdatedById: number;
  CreatedUpdatedId: number;
  CreatedUpdatedRoleId: number;
  UpdatedByRoleId: number;
  CreatedByRoleId: number;
  CreatedDateTime: DateTime;
  UpdatedDateTime: DateTime;
  PanelJson: string;
  UserRoleId: number;
  TechnicalQuery: string;
  EntityType: string;
  EntityId: number;
  Label: string;
  AggFunction: string;
  WhereClause: string;
  HavingClause: string;
  DataFieldId: number;
  RoleId: number;
  ReportId: number;
  Operation: string;
  ParameterCarrier: string;
  PivotId: number;
}


