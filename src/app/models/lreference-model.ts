import { bool } from 'aws-sdk/clients/signer';

export class LReferenceModel {
  Id: number;
  Name: string;
  Type: string;
  Description: string;
  CreatedById: number;
  UpdatedById: number;
  CreatedDateTime: Date;
  UpdatedDateTime: Date;
  ScopeEntityType: string;
  ScopeEntityId: number;
  ParameterCarrier: string;
  CreatedByRoleId: number;
  UpdatedByRoleId: number;
  MappedRoleIds: number[];
  MappedViewRoleIds: number[];
  HelpFilePath: string;
  IsPortfolioEnabled: bool;
  SelectedTagIdList: string;
  DatabaseId: number;
}
