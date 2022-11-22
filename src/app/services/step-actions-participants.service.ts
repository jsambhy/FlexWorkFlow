import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { stepparticipantsmodel } from '../models/step-participants-model';
@Injectable()
export class StepActionsParticipantsService {
  readonly basrUrl = environment.baseUrl;
  sessionprojectid: string = sessionStorage.getItem("ProjectId");
  projectId: number = +this.sessionprojectid; // conversion from string to int
  UserName: string = sessionStorage.getItem("LoginEmail");
  CurrentRoleName: string = sessionStorage.getItem("CurrentRoleName");
  LoginEmail: string = sessionStorage.getItem("LoginEmail");
  SessionValues: any = sessionStorage;
  constructor(private httpClient: HttpClient) {
  }
  SaveMappingData(args: any[]): Observable<any> {   
    return this.httpClient.post<any>(this.basrUrl + "/FlexWFStepActionsParticipants/SaveMappingData", args, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  GetColumnForMenuRoles(LoggedInScopeEntityType: string, LoggedInScopeEntityId: number): Observable<any> {
    return this.httpClient.get(this.basrUrl + "/MMenuRoles/GetColumnForParticipantRoles?LoggedInScopeEntityType=" + LoggedInScopeEntityType + "&LoggedInScopeEntityId=" + LoggedInScopeEntityId);
  }
  //not in use
  //GetDataForActionRoleMapping(LoggedInScopeEntityType: string, LoggedInScopeEntityId: number, StepId: number): Observable<any> {
  //  return this.httpClient.get(this.basrUrl + "/FlexWFStepActionsParticipants/GetDataForActionRoleMapping?LoggedInScopeEntityType=" + LoggedInScopeEntityType + "&LoggedInScopeEntityId=" + LoggedInScopeEntityId + "&StepId=" + StepId);
  //}

  GetDataForActionParticipantMapping(modeldata: stepparticipantsmodel): Observable<any> {
    return this.httpClient.post<any>(this.basrUrl + "/FlexWFStepActionsParticipants/GetDataForActionParticipantMapping", modeldata, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  GetColumnForMenuRolesNew(modeldata: stepparticipantsmodel): Observable<any> {
    return this.httpClient.post<any>(this.basrUrl + "/FlexWFStepActionsParticipants/GetColumnForParticipantRoles", modeldata, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  GetParticipantsByStepActionId(StepActionId: number): Observable<any> {
    return this.httpClient.get(this.basrUrl + "/FlexWFStepActionsParticipants/GetParticipantsByStepActionId?StepActionId=" + StepActionId);
  }

  GetParticipants(modeldata: stepparticipantsmodel): Observable<any> {
    return this.httpClient.post<any>(this.basrUrl + "/FlexWFStepActionsParticipants/GetParticipantsList", modeldata, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  GetAssignedParticipants(modeldata: stepparticipantsmodel): Observable<any> {
    return this.httpClient.post<any>(this.basrUrl + "/FlexWFStepActionsParticipants/GetAssignedParticipants", modeldata, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  GetColumnsForMatrixForDiferentParticipantTypes(modeldata: stepparticipantsmodel): Observable<any> {
    return this.httpClient.post<any>(this.basrUrl + "/FlexWFStepActionsParticipants/GetColumnsForMatrixForDiferentParticipantTypes", modeldata, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  GetParticipantByHierarchyJobRole(HierarchyTypeId: number): Observable<any> {
    return this.httpClient.get(this.basrUrl + "/FlexWFStepActionsParticipants/GetParticipantByHierarchyJobRole?HierarchyTypeId=" + HierarchyTypeId);
  }

  GetParticipantByPositionType (HierarchyTypeId: number): Observable<any> {
    return this.httpClient.get(this.basrUrl + "/FlexWFStepActionsParticipants/GetParticipantByPositionType?PositionId=" + HierarchyTypeId);
  }
  //GetParticipantByPositionType
}
