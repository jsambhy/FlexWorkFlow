import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { flexworkflowmodel } from '../models/flex-workflows-model';
import { WorkflowExternalParticipantmodel } from '../models/workflow-external-participant-model';

@Injectable()

export class FlexWorkflowsService {
  readonly basrUrl = environment.baseUrl;
  sessionprojectid: string = sessionStorage.getItem("ProjectId");
  projectId: number = +this.sessionprojectid; // conversion from string to int
  UserName: string = sessionStorage.getItem("LoginEmail");
  CurrentRoleName: string = sessionStorage.getItem("CurrentRoleName");
  LoginEmail: string = sessionStorage.getItem("LoginEmail");
  LoggedInRoleId: number = +sessionStorage.getItem("LoggedInRoleId");
  LoggedInUserId: number = +sessionStorage.getItem("LoggedInUserId");
  
  constructor(private httpClient: HttpClient) {}

  //Getting Workflows on the basis of ProjectId  
  GetWorkFlowsByScopeEntity(ScopeEntityType:string,ScopeEntityId:number): Observable<any> {  
    return this.httpClient.get(this.basrUrl + "/FlexWorkflows/GetWorkFlowsByScopeEntity?ScopeEntityType=" + ScopeEntityType + "&ScopeEntityId=" + ScopeEntityId);
  }

  GetWFIdByFlexId(FlexTableId:number): Observable<number> {
    return this.httpClient.get<number>(this.basrUrl + "/FlexWorkflows/GetWFIdByFlexId?FlexTableId=" + FlexTableId);
  }
  GetFlexIdByWFId(WorkflowId: number): Observable<number> {
    return this.httpClient.get<number>(this.basrUrl + "/FlexWorkflows/GetFlexIdByWFId?WorkflowId=" + WorkflowId);
  }
  //Logging Workflow
  Save(wfdata: flexworkflowmodel): Observable<any> {
   
    wfdata.CreatedById = this.LoggedInUserId;
    wfdata.UpdatedById = this.LoggedInUserId;
    wfdata.LoginUserRoleId = this.LoggedInRoleId;
    return this.httpClient.post<any>(this.basrUrl + "/FlexWorkflows/Post", wfdata, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  //Updating Workflow
  Update(wfdata: flexworkflowmodel): Observable<string> {
   
    wfdata.CreatedById = this.LoggedInUserId;
    wfdata.UpdatedById = this.LoggedInUserId;
    wfdata.LoginUserRoleId = this.LoggedInRoleId;
    return this.httpClient.put<string>(this.basrUrl + "/FlexWorkflows/Put", wfdata, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

 
  GetWFExternalParticipants(WorkflowId:number): Observable<any> {
    return this.httpClient.get(this.basrUrl + "/FlexWorkflows/GetWFExternalParticipants?WorkflowId=" + WorkflowId);
  }

  PostWorkflowExternalParticipant(model: WorkflowExternalParticipantmodel): Observable<void> {
    return this.httpClient.post<void>(this.basrUrl + "/FlexWorkflows/PostWorkflowExternalParticipant", model, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  PutWorkflowExternalParticipant(model: WorkflowExternalParticipantmodel): Observable<void> {
    return this.httpClient.put<void>(this.basrUrl + "/FlexWorkflows/PutWorkflowExternalParticipant", model, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  //Deleting Workflow
  Delete(data: flexworkflowmodel): Observable<string> {
    
    data.CreatedById = this.LoggedInUserId;
    data.LoginUserRoleId = this.LoggedInRoleId;
    data.ParameterCarrier = "UserName=" + this.LoginEmail + "|RoleName=" + this.CurrentRoleName;
    console.log(data);
    return this.httpClient.post<string>(this.basrUrl + "/FlexWorkflows/Delete", data, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  //Getting WF details by Id
  GetWFById(Id: number): Observable<any> {
    return this.httpClient.get<flexworkflowmodel>(this.basrUrl + "/FlexWorkflows/GetById?Id=" + Id);
  }

  GetSelectedTagsByEntity(EntityType,EntityId: number): Observable<any> {
    return this.httpClient.get<flexworkflowmodel>(this.basrUrl + "/FlexWorkflows/GetSelectedTagsByFlexTableId?EntityType="
      + EntityType + "&EntityId=" + EntityId);
  }

  GetNonRestrictedParticipantsList(WorkflowId:number): Observable<any> {
    return this.httpClient.get(this.basrUrl + "/FlexWorkflows/GetNonRestrictedParticipantsList?WorkflowId=" + WorkflowId);
  }

  GetExternalParticipantById(ExternalParticipantId: number): Observable<WorkflowExternalParticipantmodel> {
    return this.httpClient.get<WorkflowExternalParticipantmodel>(this.basrUrl + "/FlexWorkflows/GetExternalParticipantById?ExternalParticipantId=" + ExternalParticipantId);
  }

  DeleteExternalParticipantById(ExternalParticipantId: number): Observable<void> {
    return this.httpClient.delete<void>(this.basrUrl + "/FlexWorkflows/DeleteExternalParticipantById?ExternalParticipantId=" + ExternalParticipantId);
  }
}
