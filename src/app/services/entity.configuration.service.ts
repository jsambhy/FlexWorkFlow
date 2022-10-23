import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { GProject } from '../models/project-model';
import { RFileExtensions } from '../models/file-extension-model';
import { EntityModel } from '../models/entity.model';


@Injectable()
export class EntityConfigurationService {
  baseUrl = environment.baseUrl;


  constructor(private httpClient: HttpClient) {

  }


  GetDataByLoggedInEntity(LoggedInScopeEntityType: string, LoggedInScopeEntityId: number): Observable<GProject[]> {
    return this.httpClient.get<GProject[]>(this.baseUrl + "/EntityConfiguration/GetDataByLoggedInEntity?LoggedInScopeEntityType=" + LoggedInScopeEntityType + "&LoggedInScopeEntityId=" + LoggedInScopeEntityId);
  }

  IsUserNameRequired(LoggedInScopeEntityType: string, LoggedInScopeEntityId: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/EntityConfiguration/IsUserNameRequired?LoggedInScopeEntityType=" + LoggedInScopeEntityType + "&LoggedInScopeEntityId=" + LoggedInScopeEntityId);
  }

  getFileExtensions(): Observable<RFileExtensions[]> {
    return this.httpClient.get<RFileExtensions[]>(this.baseUrl + "/GProjects/GetFileExtensions");
  }

  PostEntityData(model: EntityModel): Observable<EntityModel> {
    return this.httpClient.post<EntityModel>(this.baseUrl + "/EntityConfiguration/PostEntityData", model, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  GetEntityById(LoggedInScopeEntityType: string, LoggedInScopeEntityId: number): Observable<EntityModel> {
    return this.httpClient.get<EntityModel>(this.baseUrl + "/EntityConfiguration/GetEntityById?EntityType=" + LoggedInScopeEntityType + "&EntityId=" + LoggedInScopeEntityId);
  }

  PutEntityData(model: EntityModel): Observable<void> {
    return this.httpClient.put<void>(this.baseUrl + "/EntityConfiguration/PutEntityData", model, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  GetWFCountByProjectId(ProjectId: number): Observable<number> {
    return this.httpClient.get<number>(this.baseUrl + "/EntityConfiguration/GetWFCountByProjectId?ProjectId=" + ProjectId);
  }

  GetProjectCountByCompanyId(CompanyId: number): Observable<number> {
    return this.httpClient.get<number>(this.baseUrl + "/EntityConfiguration/GetProjectCountByCompanyId?CompanyId=" + CompanyId);
  }

  GetCompanyCountByGroupId(GroupId: number): Observable<number> {
    return this.httpClient.get<number>(this.baseUrl + "/EntityConfiguration/GetCompanyCountByGroupId?GroupId=" + GroupId);
  }

  UpdateEntityStatus(EntityType: string, EntityId: number): Observable<void> {
    return this.httpClient.get<void>(this.baseUrl + "/EntityConfiguration/UpdateEntityStatus?EntityType=" + EntityType + "&EntityId=" + EntityId);
  }

  DeleteEntity(EntityType: string, EntityId: number): Observable<void> {
    return this.httpClient.delete<void>(this.baseUrl + "/EntityConfiguration/DeleteEntity?EntityType=" + EntityType + "&EntityId=" + EntityId);
  }

  GetEntityUsers(EntityType: string, EntityId: number): Observable<any[]> {
    return this.httpClient.get<any[]>(this.baseUrl + "/EntityConfiguration/GetEntityUsers?EntityType=" + EntityType + "&EntityId=" + EntityId);
  }

  GetAssignedAdminForEntity(EntityType: string, EntityId: number): Observable<any[]> {
    return this.httpClient.get<any[]>(this.baseUrl + "/EntityConfiguration/GetAssignedAdminForEntity?EntityType=" + EntityType + "&EntityId=" + EntityId);
  }

}
