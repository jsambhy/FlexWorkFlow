import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RecipientsModel } from '../models/recipients.model';

@Injectable()
export class RecipientsService {
  readonly basrUrl = environment.baseUrl;  
  projectId: number = +sessionStorage.getItem("ProjectId"); // conversion from string to int  
  constructor(private httpClient: HttpClient) { }

  SaveRecipients(Model: RecipientsModel): Observable<RecipientsModel> {
    console.log(Model);
    return this.httpClient.post<RecipientsModel>(this.basrUrl + "/LNotificationConfigurations/SaveRecipients", Model, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  GetRecipientsListForDropdown(Type: string,ScopeEntityType:string,ScopeEntityId:number, WFId: number,NotificationId : number): Observable<any[]> {
    return this.httpClient.get<any[]>(this.basrUrl + "/LNotificationConfigurations/GetRecipientsListForDropdown?Type=" + Type + "&ScopeEntityType=" + ScopeEntityType + "&ScopeEntityId=" + ScopeEntityId + "&WFId=" + WFId + "&NotificationId=" + NotificationId );
  }

  Delete(Model: RecipientsModel): Observable<string> {   
    console.log(Model)
    return this.httpClient.post<string>(this.basrUrl + "/LNotificationConfigurations/DeleteRecipient", Model, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
    //return this.httpClient.delete<string>(this.basrUrl + "/LNotificationConfigurations/DeleteRecipient?NotificationId=" + Model.Id + "&EntityType=" + Model.EntityType + "&EntityId=" + Model.EntityId + "&WFLabel=" + Model.WFLabel + "&WFId=" + Model.WFId + "&CreatedByRoleId=" + this.LoggedInRoleId + "&CreatedByUserId=" + this.LoggedInUserId + "&ProjectId=" + this.projectId + "&StepId=" + Model.StepId);
  }

  GetRequestorCountByNotificationId(NotificationId: number, EntityType: string) {
    return this.httpClient.get<number>(this.basrUrl + "/LNotificationConfigurations/GetRequestorCountByNotificationId?NotificationId=" + NotificationId + "&EntityType=" + EntityType);
  }
  //GetRecipientsListForDropdown

}
