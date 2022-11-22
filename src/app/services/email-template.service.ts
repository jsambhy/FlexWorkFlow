import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from '../../environments/environment';
import { LEmailTemplate } from '../models/EmailTemplate';

@Injectable()
export class EmailTemplateService {
  readonly basrUrl = environment.baseUrl;
  constructor(private httpClient: HttpClient) {
  }
  GetLEmailTemplates(ScopeEntityType:string, ScopeEntityId:number): Observable<any> {
    return this.httpClient.get(this.basrUrl + "/LEmailTemplates/GetLEmailTemplates?ScopeEntityType=" + ScopeEntityType + "&ScopeEntityId=" + ScopeEntityId);
  }
  GetLColumnConfigurationsByEntity(EntityType, EntityId, ProjectId): Observable<any> {
    return this.httpClient.get<any>(this.basrUrl + "/DataFields/GetColumnListByTableName?"
      + "TableName=" + EntityType + "&SelecterType=" + EntityId + "&ProjectID=" + ProjectId);
  }
  PostLEmailTemplate(data: LEmailTemplate): Observable<LEmailTemplate> {
    return this.httpClient.post<LEmailTemplate>(this.basrUrl + "/LEmailTemplates/PostLEmailTemplate", data, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  GetLEmailTemplateById(Id: number): Observable<LEmailTemplate> {
    return this.httpClient.get<LEmailTemplate>(this.basrUrl + "/LEmailTemplates/GetLEmailTemplateById?id=" + Id);
  }

  PutLEmailTemplate(data: LEmailTemplate): Observable<void> {   
    return this.httpClient.put<void>(this.basrUrl + "/LEmailTemplates/PutLEmailTemplate", data, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  DeleteEmailTemplate(data: LEmailTemplate): Observable<void> {
    return this.httpClient.post<void>(this.basrUrl + "/LEmailTemplates/DeleteLEmailTemplate", data, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
    //return this.httpClient.delete<void>(this.basrUrl + "/LEmailTemplates/DeleteLEmailTemplate?id=" + Id + "&UserName=" + LoginEmail + "&RoleName=" + CurrentRoleName  + "&LoggedInUserId=" +LoggedInUserId + "&LoggedInRoleId=" + LoggedInRoleId);
  }
}
