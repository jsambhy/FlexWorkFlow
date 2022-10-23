import { SupportingDocument } from './supportingDocModel';

export class LRoles {
  RoleName: string;
  IsExternal: boolean;
  ScopeEntityType: string;
  ScopeEntityId: number;
  Id: number;
  ParameterCarrier: string;
  OutputMessage: string;
  CreatedById: number;
  CreatedByRoleId: number;
  UpdatedById: number;
  UpdatedByRoleId: number;
  supportingDocuments: SupportingDocument[];
  SupportingDocComments: string;
}


