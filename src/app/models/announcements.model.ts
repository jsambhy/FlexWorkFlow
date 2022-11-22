export class announcementsmodel {
  Id: number;
  Subject: string; Name: string;
  Body: string;
  Type: string;
  Description: string;
  MovetoTop: boolean;
  CreatedById: number;
  UpdatedById: number;
  CreatedByRoleId: number;
  UpdatedByRoleId: number;
  ParameterCarrier: string;
  EntityType: string;
  EntityId: number;
  EffectiveStartDate: Date;
  EffectiveEndDate: Date;
  ProjectId: number;
}
