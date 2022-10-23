import { ColumnConfigurationModel } from './columnConfig-model';
import { bool } from 'aws-sdk/clients/signer';

export class ConstraintModel {
  Id: number;
  ConstraintType: string;
  ProjectId: number;
  EntityType: string;
  EntityId: number;
  Description: string;
  CreatedById: number;
  UpdatedById: number;
  CreatedByRoleId: number;
  UpdatedByRoleId: number;
  CreatedDateTime: Date;
  UpdatedDateTime: Date;
  ParameterCarrier: string;
  ErrorMessage: string;
  IsPrimaryKey: bool;
  IsActive: bool;
  Columns: ColumnConfigurationModel;
  FormGridColumn: string;
}



