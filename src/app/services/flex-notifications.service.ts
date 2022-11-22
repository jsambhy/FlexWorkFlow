import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notificationmodel } from '../models/flex-notifications.model';

@Injectable()
export class FlexNotificationsService {
  readonly basrUrl = environment.baseUrl;
  constructor(private httpClient: HttpClient) { }
  projectId: number = +sessionStorage.getItem("ProjectId"); // conversion from string to int
  //method to show notifications in grid for managing
  GetLNotificationsByWFId(WFId, StepActionId): Observable<any> {
    return this.httpClient.get(this.basrUrl + "/LNotificationConfigurations/GetLNotifications?WFId=" + WFId + "&StepActionId=" + StepActionId);
  }

  //method to get the email templates for dropdown of templates while creating notification
  GetTemplates(WFId, StepActionId, LoggedInScopeEntityType, LoggedInScopeEntityId): Observable<any> {
    return this.httpClient.get(this.basrUrl + "/LNotificationConfigurations/GetTemplates?WFId=" + WFId + "&StepActionId=" + StepActionId +
      "&ScopeEntityType=" + LoggedInScopeEntityType + "&ScopeEntityId=" + LoggedInScopeEntityId);
  }
   
  GetAllTemplates() {
    return this.httpClient.get(this.basrUrl + "/LNotificationConfigurations/GetAllTemplates?ProjectId=" + this.projectId);
  }
  
  //method to get the users in dropdown while selecting recipient as "User" type
  GetLUsers(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.basrUrl + "/LUser/GetByProjectId?ProjectId=" + this.projectId);
  }

  //method to get all the recipients againts the notification selected to ahow in grid and managing
  GetRecipientsByNotificationId(id, WFId): Observable<any[]> {
    return this.httpClient.get<any[]>(this.basrUrl + "/LNotificationConfigurations/GetRecipientsByNotificationId?id=" + id + "&WFId=" + WFId);
  }

  //method to save the notification
  Post(data: Notificationmodel): Observable<any> {    
    return this.httpClient.post<any>(this.basrUrl + "/LNotificationConfigurations/Post", data, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  //method to get notification for edition
  GetById(Id): Observable<any> {
    return this.httpClient.get(this.basrUrl + "/LNotificationConfigurations/GetById?id=" + Id);
  }

  //method for updation of the notification
  Update(data: Notificationmodel): Observable<string> {    
    return this.httpClient.put<string>(this.basrUrl + "/LNotificationConfigurations/Put", data, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  //method for deleting notification
  Delete(model: Notificationmodel): Observable<string> { 
    return this.httpClient.post<string>(this.basrUrl + "/LNotificationConfigurations/Delete", model, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  GetStepActionId(StepId, ActionId): Observable<any> {
    return this.httpClient.get(this.basrUrl + "/FlexWFStepActions/GetStepActionId?StepId=" + StepId + "&ActionId=" + ActionId);
  }
}
