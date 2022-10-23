import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { stepparticipantsmodel } from '../models/step-participants-model';

@Injectable()
export class StepParticipantsService {
  readonly basrUrl = environment.baseUrl;
  sessionprojectid: string = sessionStorage.getItem("ProjectId");
  projectId: number = +this.sessionprojectid; // conversion from string to int
  UserName: string = sessionStorage.getItem("LoginEmail");
  CurrentRoleName: string = sessionStorage.getItem("CurrentRoleName");
  LoginEmail: string = sessionStorage.getItem("LoginEmail");
  SessionValues: any = sessionStorage;
  constructor(private httpClient: HttpClient) {
  }
 

  //---------------------------Below code will be used for participant purpose when required-------------------------------
  
  getParticipantsInformation(StepId: number, WorkflowId: number): Observable<any> {
    return this.httpClient.get(this.basrUrl + "/FlexWFStepParticipants/GetWStepParticipantByStepId?StepId=" + StepId + "&WorkflowId=" + WorkflowId);
  }

  getParticipantsByStepId(StepId: number, WorkflowId: number, LoggedInScopeEntityType: string, LoggedInScopeEntityId: number): Observable<any> {
    return this.httpClient.get(this.basrUrl + "/FlexWFStepParticipants/GetLRolesByEntityAndStepId?StepId=" + StepId + "&WorkflowId=" + WorkflowId + "&LoggedInScopeEntityType=" + LoggedInScopeEntityType + "&LoggedInScopeEntityId=" + LoggedInScopeEntityId);
  }

  UpdateActionsForParticipant(model: stepparticipantsmodel): Observable<string> {
    model.ParameterCarrier = "UserName=" + this.LoginEmail + "|WorkFlow=" + model.WorkflowName + "|RoleName=" + this.CurrentRoleName + "|SessionValues=" + this.SessionValues + "|ProjectId=" + this.projectId + "|" + "WorkflowId=" + model.WorkflowId;
    return this.httpClient.put<string>(this.basrUrl + "/FlexWFStepParticipants/UpdateActionsForParticipant", model, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }


  //Delete functionality
  DeleteById(ParticipantId: number, StepId: number, WorkflowId: number): Observable<string> {
    //int ParticipantId,string UserName,int WorkflowId,int ,string RoleName
    return this.httpClient.delete<string>(this.basrUrl + "/FlexWFStepParticipants/DeleteParticipantActions?ParticipantId=" + ParticipantId + "&UserName=" + this.LoginEmail + "&WorkflowId=" + WorkflowId + "&StepId=" + StepId + "&RoleName=" + this.CurrentRoleName)
  }


  GetSelectedActionsForParticipant(ParticipantId: number, StepId: number): Observable<any> {
    //int ParticipantId,string UserName,int WorkflowId,int ,string RoleName
    return this.httpClient.get(this.basrUrl + "/FlexWFStepParticipants/GetSelectedActionsForParticipant?StepId=" + StepId + "&participantId=" + ParticipantId);
  }

  SaveParticipants(data: stepparticipantsmodel): Observable<any> {
    data.ParameterCarrier = "UserName=" + this.LoginEmail + "|WorkFlow=" + data.WorkflowName + "|RoleName=" + this.CurrentRoleName + "|SessionValues=" + this.SessionValues + "|ProjectId=" + this.projectId;
    return this.httpClient.post<any>(this.basrUrl + "/FlexWFStepParticipants/SaveParticipants", data, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  SaveMappingData(args: any[]): Observable<any> {
    return this.httpClient.post<any>(this.basrUrl + "/FlexWFStepActionsParticipants/SaveMappingData", args, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }
  GetColumnForMenuRoles(): Observable<any> {
    return this.httpClient.get(this.basrUrl + "/MMenuRoles/GetColumnForParticipantRoles?ProjectId=" + this.projectId);
  }

  GetDataForActionRoleMapping(StepId: number): Observable<any> {
    return this.httpClient.get(this.basrUrl + "/FlexWFStepActionsParticipants/GetDataForActionRoleMapping?ProjectId=" + this.projectId + "&StepId=" + StepId);
  }


}
