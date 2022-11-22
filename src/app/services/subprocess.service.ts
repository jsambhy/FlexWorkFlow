import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders} from "@angular/common/http";
import { environment } from "../../environments/environment";  
import { StepActionSubProcessModel, MParentSubProcessDFViewModel } from '../models/step-action-sub-process-model';


@Injectable()
export class SubProcessService {
  readonly baseUrl = environment.baseUrl;
  sessionprojectid: string = sessionStorage.getItem("ProjectId");
  projectId: number = +this.sessionprojectid; 
  UserName: string = sessionStorage.getItem("LoginEmail");
  CurrentRoleName: string = sessionStorage.getItem("CurrentRoleName");
  LoggedInUserId: string = sessionStorage.getItem("LoggedInUserId");
  LoggedInRoleId: string = sessionStorage.getItem("LoggedInRoleId");
  LoginEmail: string = sessionStorage.getItem("LoginEmail");
  SessionValues: any = sessionStorage;
  constructor(private httpClient: HttpClient) { 
  }

  GetParentProcesses(ProjectId ): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/SubProcess/GetParentProcesses?ProjectId=" + ProjectId);
  }

  GetSubProcesses(StepActionId): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/SubProcess/GetSubProcesses?StepActionId=" + StepActionId);
  }

  GetAvailableDFs(EntityType, ParentWFId, EntityId, ProjectId, SubProcessWFId): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/SubProcess/GetAvailableDFs?EntityType=" + EntityType + "&ParentWFId=" + ParentWFId
      + "&EntityId=" + EntityId + "&ProjectId=" + ProjectId + "&SubProcessWFId=" + SubProcessWFId);
  }
  GetMappedDFs(ParentWFId, SubProcessWFId): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/SubProcess/GetMappedDFs?ParentWFId=" + ParentWFId + "&SubProcessWFId=" + SubProcessWFId);
  }
  GetSubProcessDFs(ParentDFId, SubProcessWFId): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/SubProcess/GetSubProcessDFs?ParentDFId=" + ParentDFId + "&SubProcessWFId=" + SubProcessWFId);
  }

 

  GetSubProcessesByStepAction(StepActionId:number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/SubProcess/GetSubProcessesByStepAction?StepActionId=" + StepActionId);
  }


  GetWorkflowsForSubProcess(WorkflowId: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/SubProcess/GetWorkflowsForSubProcess?WorkflowId=" + WorkflowId);
  }

  PostSubProcesses(model: StepActionSubProcessModel): Observable<void> {
    return this.httpClient.post<void>(this.baseUrl + "/SubProcess/PostSubProcesses", model, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  PutSubProcesses(model: StepActionSubProcessModel): Observable<void> {
    return this.httpClient.put<void>(this.baseUrl + "/SubProcess/PutSubProcesses", model, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  GetSubProcessById(Id:number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/SubProcess/GetSubProcessById?Id=" + Id);
  }

  GetSubProcessDFExistence(SubProcessWFId: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/SubProcess/GetSubProcessDFExistence?SubProcessWFId=" + SubProcessWFId);
  }

  DeleteSubProcessById(Id: number, SubProcessWFIdForDeletion:number): Observable<void> {
    return this.httpClient.delete<void>(this.baseUrl + "/SubProcess/DeleteSubProcessById?Id=" + Id + "&SubProcessWFIdForDeletion=" + SubProcessWFIdForDeletion);
  }

  GetWiringActionByStepId(StepId: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/SubProcess/GetWiringActionByStepId?StepId=" + StepId);
  }

  GetSubProcessesByParentTxnId(ParentTxnId: any): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/SubProcess/GetSubProcessesByParentTxnId?ParentTxnId=" + ParentTxnId);
  }

  AddMapping(model): Observable<string> { 
    return this.httpClient.post<string>(this.baseUrl + "/SubProcess/AddMapping", model, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }
  RemoveMapping(Id): Observable<string> {
    return this.httpClient.post<string>(this.baseUrl + "/SubProcess/RemoveMapping?Id="+Id, null, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }
}
