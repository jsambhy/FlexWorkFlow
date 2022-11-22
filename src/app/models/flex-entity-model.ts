import { SupportingDocument } from './supportingDocModel';

export class FlexTableDataModel {
  Id: number;
  FlexTableId: number;
  AttributeC01: string;
  AttributeC02: string;
  AttributeC03: string;
  AttributeC04: string;
  AttributeC05: string;
  AttributeC06: string;
  AttributeC07: string;
  AttributeC08: string;
  AttributeC09: string;
  AttributeC10: string;
  AttributeI01: number;
  AttributeI02: number;
  AttributeI03: number;
  AttributeI04: number;
  AttributeI05: number;
  AttributeI06: number;
  AttributeI07: number;
  AttributeI08: number;
  AttributeI09: number;
  AttributeI10: number;
  AttributeB01: boolean;
  AttributeB02: boolean;
  AttributeB03: boolean;
  AttributeB04: boolean;
  AttributeB05: boolean;
  AttributeB06: boolean;
  AttributeB07: boolean;
  AttributeB08: boolean;
  AttributeB09: boolean;
  AttributeB10: boolean;
  AttributeD01: Date;
  AttributeD02: Date;
  AttributeD03: Date;
  AttributeD04: Date;
  AttributeD05: Date;
  AttributeD06: Date;
  AttributeM01: string;
  AttributeM02: string;
  AttributeM03: string;
  AttributeM04: string;
  AttributeM05: string;
  RequesterId: string;
  RequesterRoleId: string;
  CurrentOwnerId: string;
  CreatedById: string;
  UpdatedById: string;
  CreatedDateTime: Date;
  UpdatedDateTime: Date;
  StepId: string;
  CreatedByRoleId: string;
  UpdatedByRoleId: string;
  ArrivedDateTime: Date;
  Status: string;
  TxnType: string;
  ParameterCarrier: string;
  TagIds: number[];
  EntityId: number;
  EntityType: string;
  LoggedInUserId: number;
  LoggedInRoleId: number;
  ProjectId: number;
  Comments: string;
  supportingDocuments: SupportingDocument[];
  FormId: number;
}


export class ReferenceDataModel {
  Id: number;
  ReferenceId: number;
  EffectiveStartDate: Date;
  EffectiveEndDate: Date;
  AttributeC01: string;
  AttributeC02: string;
  AttributeC03: string;
  AttributeC04: string;
  AttributeC05: string;
  AttributeC06: string;
  AttributeC07: string;
  AttributeC08: string;
  AttributeC09: string;
  AttributeC10: string;
  AttributeI01: number;
  AttributeI02: number;
  AttributeI03: number;
  AttributeI04: number;
  AttributeI05: number;
  AttributeI06: number;
  AttributeI07: number;
  AttributeI08: number;
  AttributeI09: number;
  AttributeI10: number;
  AttributeB01: boolean;
  AttributeB02: boolean;
  AttributeB03: boolean;
  AttributeB04: boolean;
  AttributeB05: boolean;
  AttributeB06: boolean;
  AttributeB07: boolean;
  AttributeB08: boolean;
  AttributeB09: boolean;
  AttributeB10: boolean;
  AttributeD01: Date;
  AttributeD02: Date;
  AttributeD03: Date;
  AttributeD04: Date;
  AttributeD05: Date;
  AttributeD06: Date;
  AttributeD07: Date;
  AttributeD08: Date;
  AttributeD09: Date;
  AttributeD10: Date;
  AttributeT01: Date;
  AttributeT02: Date;
  AttributeT03: Date;
  AttributeT04: Date;
  AttributeT05: Date;
  AttributeT06: Date;
  AttributeT07: Date;
  AttributeT08: Date;
  AttributeT09: Date;
  AttributeT10: Date;
  AttributeM01: string;
  AttributeM02: string;
  AttributeM03: string;
  AttributeM04: string;
  AttributeM05: string;
  CreatedById: string;
  UpdatedById: string;
  CreatedDateTime: Date;
  UpdatedDateTime: Date;
  CreatedByRoleId: string;
  UpdatedByRoleId: string;
  ParameterCarrier: string;
  RefCode: string; 
  EntityId: number;
  EntityType: string;
  LoggedInUserId: number;
  LoggedInRoleId: number;
  ProjectId: number;
  Comments: string;
  TagIds: number[];
  supportingDocuments: SupportingDocument[];
  FormId: number;
  UserId: number;
}

export class JsonModelForSP {
  JSONStr: string;
  TagIds: number[];
  DropdownInfo_json: string;
  FormGridJson: string;
}

