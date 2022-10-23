import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { workflownodemodel, StepActionLabelmodel, NextStepmodel } from '../models/workflow-diagram-model';
import { flexworkflowmodel } from '../models/flex-workflows-model';
import { map } from 'rxjs/operators';

@Injectable()
export class WorkflowdesignerService {
  readonly basrUrl = environment.baseUrl;
  //readonly basrUrl = 'http://localhost:60346/api/';
  sessionprojectid: string = sessionStorage.getItem("ProjectId");
  projectId: number = +this.sessionprojectid; // conversion from string to int
  UserName: string = sessionStorage.getItem("LoginEmail");
  CurrentRoleName: string = sessionStorage.getItem("CurrentRoleName");
  LoginEmail: string = sessionStorage.getItem("LoginEmail");
  LoggedInRoleId: number = +sessionStorage.getItem("LoggedInRoleId");
  LoggedInUserId: number = +sessionStorage.getItem("LoggedInUserId");
  SessionValues: any = sessionStorage;
  constructor(private httpClient: HttpClient) {}

  //Getting details of the connector by Id
  GetConnectorById(connectorid: string): Observable<any> {
    return this.httpClient.get<StepActionLabelmodel>(this.basrUrl + "/WorkflowDesigner/GetConnectorById?connectorid=" + connectorid);
  }

  //getting status of workflow by id
  getStatusByWFId(wfid: number): Observable<string> {
    return this.httpClient.get<string>(this.basrUrl + "/WorkflowDesigner/GetStatusByWFId?wfid=" + wfid);
  }

  //saving node
  SaveNodedata(ndata: workflownodemodel): Observable<number> {
    
   
    ndata.CreatedById = this.LoggedInUserId;
    ndata.UpdatedById = this.LoggedInUserId;
    ndata.CreatedByRoleId = this.LoggedInRoleId;
    ndata.UpdatedByRoleId = this.LoggedInRoleId;
    ndata.ParameterCarrier = "UserName=" + this.LoginEmail + "|" + "WorkFlow=" + "no worflow" + "|RoleName=" + this.CurrentRoleName;
    console.log(ndata);
    return this.httpClient.post<number>(this.basrUrl + "/WorkflowDesigner/PostWStep", ndata, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    })

  }

  //saving state of diagram
  SaveDiagramState(model: flexworkflowmodel): Observable<any> {
    model.ParameterCarrier = "UserName=" + this.LoginEmail + "|WorkFlow=" + model.Name + "|RoleName=" + this.CurrentRoleName + "|SessionValues=" + this.SessionValues + "|ProjectId=" + this.projectId;
    return this.httpClient.post(this.basrUrl + "/WorkflowDesigner/SaveDiagramState", model, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }
  
  //deleting node
  DeleteNodeData(ndata: workflownodemodel): Observable<string>{
    
    ndata.CreatedById = this.LoggedInUserId;
    ndata.UpdatedById = this.LoggedInUserId;
    ndata.CreatedByRoleId = this.LoggedInRoleId;
    ndata.UpdatedByRoleId = this.LoggedInRoleId;
    ndata.ParameterCarrier = "UserName=" + this.LoginEmail + "|" + "WorkFlow=" + "no worflow" + "|RoleName=" + this.CurrentRoleName;
    console.log(ndata);
    return this.httpClient.post<string>(this.basrUrl + "/WorkflowDesigner/DeleteStep", ndata, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  //updating node
  UpdateNodedata(ndata: workflownodemodel): Observable<string> {
    
    ndata.UpdatedById = this.LoggedInUserId;
    ndata.UpdatedByRoleId = this.LoggedInRoleId;
    ndata.ParameterCarrier = "UserName=" + this.LoginEmail + "|" + "WorkFlow=" + ndata.WFLabel + "|RoleName=" + this.CurrentRoleName;    
    return this.httpClient.post<string>(this.basrUrl + "/WorkflowDesigner/UpdateNode", ndata, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  //method called when ever there will be position of node done
  UpdatePosition(ndata: workflownodemodel): Observable<workflownodemodel> {
   
     ndata.ParameterCarrier = "UserName=" + this.LoginEmail + "|" + "WorkFlow=" + ndata.WFLabel + "|RoleName=" + this.CurrentRoleName;
    return this.httpClient.post<workflownodemodel>(this.basrUrl + "/WorkflowDesigner/UpdatePosition", ndata, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  //saving link
  SaveLinkdata(cdata: NextStepmodel): Observable<NextStepmodel> {
    cdata.CreatedById = this.LoggedInUserId;
    cdata.UpdatedById = this.LoggedInUserId;
    cdata.CreatedByRoleId = this.LoggedInRoleId;
    cdata.UpdatedByRoleId = this.LoggedInRoleId;
    cdata.ParameterCarrier = "linktext=" + cdata.ActionLabel + "|" + "ActionIconId=" + cdata.ActionIconId + "|" + "UserName=" + this.LoginEmail + "|RoleName=" + "test" +"|WorkFlow=" + "no workflow" + "|ProjectId=" + this.projectId;
    return this.httpClient.post<NextStepmodel>(this.basrUrl + "/WorkflowDesigner/SaveLink", cdata, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  //updating link 
  UpdateLinkdata(cdata: NextStepmodel, newtext, newIconId): Observable<NextStepmodel> {   
    cdata.Label = cdata.ActionLabel;//old label
    cdata.CreatedById = this.LoggedInUserId;
    cdata.UpdatedById = this.LoggedInUserId;
    cdata.CreatedByRoleId = this.LoggedInRoleId;
    cdata.UpdatedByRoleId = this.LoggedInRoleId;
    cdata.ParameterCarrier = "UserName=" + this.LoginEmail + "|" + "WorkFlow=" + cdata.WorkFlowName + "|RoleName=" + this.CurrentRoleName + "|SessionValues=" + this.SessionValues + "|nextstepid=" + cdata.NextStepId + "|" + "newlinktext=" + newtext + "|" + "NewIconId=" + newIconId + "|" + "ConnectorId=" + cdata.ConnectorId;    
    return this.httpClient.put<NextStepmodel>(this.basrUrl + "/WorkflowDesigner/UpdateStepActionLabels", cdata, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  //deleting link
  DeleteLinkdata(Id: string): Observable<string> {
    return this.httpClient.delete<string>(this.basrUrl + "/WorkflowDesigner/LinkDelete?ConnectorId=" +Id + "&UserName=" + this.LoginEmail + "&RoleName=" + this.CurrentRoleName)
  }

  //getting icons data
  getactionicondata(WorkflowId:number): Observable<any> {
    return this.httpClient.get(this.basrUrl + "/WorkflowDesigner/GetActionIconsByActionId?WorkflowId=" + WorkflowId)
  }

  //getting the state of diagram
  GetDiagramState(WFId: number): Observable<any> {
    return this.httpClient.get(this.basrUrl + "/WorkflowDesigner/GetDiagramState?WFId="+ WFId)
  }


  //getting all the actions used in the workflow
  getexistingaction(stepid: number): Observable<any> {
    return this.httpClient.get(this.basrUrl + "/WorkflowDesigner/GetStepActionLabels?StepId=" + stepid);
  }

  //getting counts of branches in workflow
  getBranchCount(stepid: number, WFId: number): Observable<any> {
    return this.httpClient.get(this.basrUrl + "/FlexWFStepActions/GetBranches?StepId=" + stepid + "&WFId=" + WFId);
  }

  //Update IsReady Flag for step
  UpdateReadyForStep(StepId: number, IsReady: boolean): Observable<any> {
    return this.httpClient.get(this.basrUrl + "/WorkflowDesigner/UpdateReadyForStep?StepId=" + StepId + "&IsReady=" + IsReady);
  }

  UpdateMandatoryFlagForStep(StepId: number, IsMandatory: boolean): Observable<any> {
    return this.httpClient.get(this.basrUrl + "/WorkflowDesigner/UpdateMandatoryFlagForStep?StepId=" + StepId + "&IsMandatory=" + IsMandatory);
  }

  //method to get the project name
  getProjectName(): Observable<any> {
   
    return this.httpClient.get(this.basrUrl + "/GProjects/GetProjectById?ProjectId=" + this.projectId);
  }

  //method to the list of all the issues (Validation errors) for the worklfow
  DownloadValidateWorkFlowData(model: flexworkflowmodel): Observable<any> {
    
    model.ParameterCarrier = "UserName=" + this.LoginEmail + "|WorkFlow=" + model.Name + "|RoleName=" + this.CurrentRoleName + "|SessionValues=" + this.SessionValues + "|ProjectName=" + model.ProjectName;
    return this.httpClient.post<any>(this.basrUrl + "/WorkflowDesigner/DownloadValidateWorkFlowData", model, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

 //getting counts of data fields
  GetDataFieldsCount(EntityType:string,EntityId: number): Observable<any> {
    return this.httpClient.get<number>(this.basrUrl + "/DataFields/GetLColumnConfigurationsDataCountByEntityId?EntityType=" + EntityType + "&EntityId=" + EntityId + "&ProjectId=" + this.projectId);
  }

  //updating status of workflow
  UpdateWFStatus(WFId: number, Status: string): Observable<string> {
    return this.httpClient.get<string>(this.basrUrl + "/WorkflowDesigner/UpdateWFStatus?WFId=" + WFId + "&Status=" + Status)
  }

  //getting the counts of all the components required in workflow
  getWFComponentsCounts(WFId: number, EntityId: number): Observable<any> {
    return this.httpClient.get<any>(this.basrUrl + "/WorkflowDesigner/GetWFComponentsCount?WFId=" + WFId + "&EntityId=" + EntityId);
  }
}
