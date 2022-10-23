import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { stepactionsmodel } from '../models/step-actions-model';

@Injectable()
export class StepActionsService {
  readonly basrUrl = environment.baseUrl;
  sessionprojectid: string = sessionStorage.getItem("ProjectId");
  projectId: number = +this.sessionprojectid; // conversion from string to int
  UserName: string = sessionStorage.getItem("LoginEmail");
  CurrentRoleName: string = sessionStorage.getItem("CurrentRoleName");
  LoginEmail: string = sessionStorage.getItem("LoginEmail");
  LoggedInRoleId: number = +sessionStorage.getItem("LoggedInRoleId");
  LoggedInUserId: number = +sessionStorage.getItem("LoggedInUserId");
  SessionValues: any = sessionStorage;
  
  constructor(private httpClient: HttpClient) {}

  //method to get the actions details
  getAllActionsDetailsByStepId(StepId: number): Observable<any> {
    return this.httpClient.get(this.basrUrl + "/FlexWFStepActions/GetAllActionsDetailsByStepId?StepId=" + StepId);
  }



  getWiringActionsByStepId(StepId): Observable<any> {
    return this.httpClient.get(this.basrUrl + "/FlexWFStepActions/GetWiringActionsByStepId?StepId=" + StepId);
  }

  GetStepActionIdListForNextActionByStepId(StepId): Observable<any> {
    return this.httpClient.get(this.basrUrl + "/FlexWFStepActions/GetStepActionIdListForNextActionByStepId?StepId=" + StepId);
  }
  //method to get the Actions list for the dropdown
  GetNonLinkingActionsByStepId(StepId: number): Observable<any> {
    return this.httpClient.get(this.basrUrl + "/FlexWFStepActions/GetNonLinkingActionsByStepId?StepId=" + StepId);
  }
  
  DeleteById(Id: number, Iscontinuetoproceed: string, wfname: string,wfid: number,stepid: number): Observable<string> {
    let cdata = new stepactionsmodel;
    cdata.Id = Id;
    cdata.CreatedById = this.LoggedInUserId;
    cdata.CreatedByRoleId = this.LoggedInRoleId;
    cdata.StepId = stepid;
    cdata.ParameterCarrier = "UserName=" + this.LoginEmail + "|WorkFlow=" + wfname + "|WorkFlowId=" + wfid + "|RoleName=" + this.CurrentRoleName + "|SessionValues=" + this.SessionValues + "|" + "ProjectId=" + this.projectId + "|" + "Iscontinuetoproceed=" + Iscontinuetoproceed;
    console.log(cdata);
    return this.httpClient.post<string>(this.basrUrl + "/FlexWFStepActions/DeleteStepAction", cdata, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
    //return this.httpClient.delete<string>(this.basrUrl + "/FlexWFStepActions/DeleteStepAction?Id=" + Id + "&UserName=" + this.LoginEmail + "&Iscontinuetoproceed=" + Iscontinuetoproceed + "&RoleName=" + this.CurrentRoleName)
  }

  //Icon detail on the selection of action from the dropdown
  GetIconsDetailsByActionIdForAngular(ActionId: number): Observable<any> {
    return this.httpClient.get(this.basrUrl + "/FlexWFStepActions/GetIconsDetailsByActionIdForAngular?ActionId=" + ActionId)
  }

  //method to get the default labe of the action selected from the dropdown
  GetStepActionUsedDefaultLabelInWF(WFId: number, Label: string): Observable<any> {
    return this.httpClient.get(this.basrUrl + "/FlexWFStepActions/GetStepActionUsedDefaultLabelInWF?WFId=" + WFId +"&Label="+Label);
  }

  //Saving functionality
  Save(cdata: stepactionsmodel): Observable<string> {
    
    //string WorkflowName = Globals.GetValueFromParameterCarrier(model.ParameterCarrier, "WorkflowName");
    //int ProjectId = Convert.ToInt32(Globals.GetValueFromParameterCarrier(model.ParameterCarrier, "ProjectId"));
    //int WorkflowId = Convert.ToInt32(Globals.GetValueFromParameterCarrier(model.ParameterCarrier, "WorkflowId"));
    cdata.CreatedById = this.LoggedInUserId;
    cdata.CreatedByRoleId = this.LoggedInRoleId;


    cdata.ParameterCarrier = "UserName=" + this.LoginEmail + "|WorkFlow=" + cdata.wfname + "|WorkFlowId=" + cdata.WFId + "|RoleName=" + this.CurrentRoleName + "|SessionValues=" + this.SessionValues + "|" + "ProjectId=" + this.projectId;

    console.log(cdata);
    return this.httpClient.post<string>(this.basrUrl + "/FlexWFStepActions/SaveStepAction", cdata, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  //method to get the list of steps on which selected action has not clonned
  GetAllStepsForClonningAction(stepid: number,ActionId: number,WFId:number): Observable<any> {
    return this.httpClient.get(this.basrUrl + "/FlexWFSteps/GetAllStepsForClonningAction?Id=" + stepid + "&ActionId=" + ActionId + "&WorkFlowId=" + WFId + "&ProjectId=" + this.projectId + "&UserName=" + this.LoginEmail);
  }

  //method to clone action to all the selected steps in group
  CloneActionsToChoosenSteps(model: stepactionsmodel): Observable<string> {
    model.CreatedById = this.LoggedInUserId;
    model.CreatedByRoleId = this.LoggedInRoleId;
    model.ParameterCarrier = "UserName=" + this.LoginEmail + "|WorkFlow=" + model.wfname + "|RoleName=" + this.CurrentRoleName + "|SessionValues=" + this.SessionValues + "|ProjectId=" + this.projectId + "|" + "WorkflowId=" + model.WFId;
    return this.httpClient.post<string>(this.basrUrl + "/FlexWFStepActions/CloneActionsToChoosenSteps", model, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  //method to get the calculations alloted with the selected step action
  GetDataForCalc(Id: number): Observable<any> {
    return this.httpClient.get(this.basrUrl + "/WStepActionCalculation/GetData?StepActionId=" + Id);
  }

  //method to get the label of the selected action from dropdown if already used in the corresponsing workflow
  GetStepActionLabelStatusInWorkFlow(WFId: number, Label: string): Observable<any> {    
    return this.httpClient.get(this.basrUrl + "/FlexWFStepActions/GetStepActionLabelStatusInWorkFlow?WFId=" + WFId + "&Label=" + Label);
  }
}
