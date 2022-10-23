

export class LEmailTemplate {
  Id: number;
  TemplateName: string;
  EmailSubject: string;
  EmailBody: string;
  Signature: string;
  ScopeEntityType: string;
  ScopeEntityId: number;
  CreatedById: number;
  UpdatedById: number;
  CreatedByRoleId: number;
  UpdatedByRoleId: number;
  CreatedDateTime: Date;
  UpdatedDateTime: Date;

  EntityId: number;
  EntityType: string;
  ParameterCarrier: string;
}
