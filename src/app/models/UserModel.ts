import { UserRoleTag } from './UserRoleTagModel';
import { SupportingDocument } from './supportingDocModel';
import { Image } from 'aws-sdk/clients/ecr';
import { Blob } from 'aws-sdk/lib/dynamodb/document_client';


export class LUser {
 
  GroupName: string;
  CompanyName: string;
  LoginEmail: string;
  Id: number;
  UserName: string;
  FirstName: string;
  LastName: string;
  PhoneNumber: string;
  Status: string;
  IsMFARequired: boolean;
  BlockNotification: boolean;
  AddressLine1: string;
  AddressLine2: string;
  City: string;
  State: string;
  PostalCode: string;
  ChangePwdAtNextLogin: boolean;
  IsPolicyAccepted: boolean;
  ParameterCarrier: string;
  CreatedById: number;
  UpdatedById: number;
  CreatedByRoleId: number;
  UpdatedByRoleId: number;
  CreatedDateTime: Date;
  UpdatedDateTime: Date;
  CountryCode: string;
  UserRoleTags: UserRoleTag[];
  EntityType: string;
  EntityId: number;
  IsProjectMember: boolean;
  supportingDocuments: SupportingDocument[];
  ImagePath: string;
  Image: Blob;
  EmpCode: string;
  UserRoleTagJson: string;
  ScopeEntityType: string;
  ScopeEntityId: number;

}
