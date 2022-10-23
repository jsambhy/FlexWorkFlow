import { bool } from 'aws-sdk/clients/signer';

export class FlexFormsViewModel {
  EntityType: string;
  EntityId: number;
  Id: number;
  Title: string;
  WebTitle: string;
  Description: string;
  TabBGColor: string;
  SectionBGColor: string;
  PropertiesJson: string;
  ParameterCarrier: string;
  ColumnsCount: number;
  CreatedById: number;
  UpdatedById: number;
  CreatedDateTime: Date;
  UpdatedDateTime: Date;
  CreatedByRoleId: number;
  UpdatedByRoleId: number;
  TextColor: string;
  TextFont: string;
  TextSize: number;
  Width: number;
  IsActive: boolean;
}


export class FormTabViewModel {
  Id: number;
  Label: string;
  ordinal: number;
  IsVisible: bool;
  CreatedById: number;
  UpdatedById: number;
  CreatedDateTime: Date;
  UpdatedDateTime: Date;
  CreatedByRoleId: number;
  UpdatedByRoleId: number;
  ParameterCarrier: string;
  FlexFormId: number;
}

export class FormSectionViewModel {
  Id: number;
  Label: string;
  ordinal: number;
  IsVisible: bool;
  CreatedById: number;
  UpdatedById: number;
  CreatedDateTime: Date;
  UpdatedDateTime: Date;
  CreatedByRoleId: number;
  UpdatedByRoleId: number;
  ParameterCarrier: string;
  FormTabId: number;
}

export class FormFieldViewModel {
  Id: number;
  SectionId: number;
  DataFieldId: number;
  Description: string;
  DefaultValue: string;
  Width: number;
  Ordinal: number;
  TextColor: string;
  TextFont: string;
  TextSize: number; 
  CreatedById: number;
  UpdatedById: number;
  CreatedDateTime: Date;
  UpdatedDateTime: Date;
  CreatedByRoleId: number;
  UpdatedByRoleId: number;
  ParameterCarrier: string;
  FormId:number;
}
