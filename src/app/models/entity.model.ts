import { Blob } from 'aws-sdk/lib/dynamodb/document_client';

export class EntityModel {
  Name: string;
  Id: number;
  LogoPath: string;
  PunchLine: string;
  Description: string;
  CompanyId: number;
  GroupId: number;
  ApplicationId: number;
  locale: string;
  LoginPolicy: string;
  CreatedById: number;
  UpdatedById: number;
  CreatedDateTime: Date;
  UpdatedDateTime: Date;
  CreatedByRoleId: number;
  UpdatedByRoleId: number;
  Country: string;
  CountryCode: string;
  AdminUsers: string[];
  AllowedFileTypes: string;
  AddressLine1: string;
  AddressLine2: string;
  City: string;
  State: string;
  PostalCode: string;
  ParameterCarrier: string;
  Logo: Blob
  EntityType: string;
  EntityId: number;
}
