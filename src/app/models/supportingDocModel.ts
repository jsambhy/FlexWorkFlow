//This model will use only to add in session at the time of upload
export class SupportingDocument {
  OriginalFileName: string;
  FileName: string;
  TargetPath: string;
}

//It will use in supporting doc in case of Edit when we are attaching Supporting doc with Entity
export class SupportingDocumentViewModel {
  FileName: string;
  OriginalFileName: string;
  Description: string;
  FilePath: string;
  EntityType: string;
  EntityId: number;
  CreatedById: number;
  CreatedByRoleId: number;
  CreatedDateTime: Date;
  UpdatedById: number;
  UpdatedDateTime: Date;
  IsDeleted: boolean;
  WFStepId: number;
  Projectid: number;
  ParameterCarrier: string;
  UpdatedByRoleId: number;
  TransactionId: number
}
