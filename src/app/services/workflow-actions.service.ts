import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { stepactionsmodel } from '../models/step-actions-model';

@Injectable()
export class WorkflowActionsService {
  readonly basrUrl = environment.baseUrl;
  sessionprojectid: string = sessionStorage.getItem("ProjectId");
  projectId: number = +this.sessionprojectid; // conversion from string to int
  UserName: string = sessionStorage.getItem("LoginEmail");
  CurrentRoleName: string = sessionStorage.getItem("CurrentRoleName");
  LoginEmail: string = sessionStorage.getItem("LoginEmail");
  SessionValues: any = sessionStorage;
  
  constructor(private httpClient: HttpClient) {}

  //method to get all the actions used in wf
  getAllActionsDetailsByWFId(WFId: number): Observable<any> {
    return this.httpClient.get(this.basrUrl + "/WorkflowActions/GetAllActionsDetailForWorflow?WFId=" + WFId);
  }

  //method to update the data
  Update(cdata: stepactionsmodel,newlabel: string): Observable<string> {
    cdata.ParameterCarrier = "UserName=" + this.LoginEmail + "|" + "NewLabel=" + newlabel + "|WorkFlow=" + cdata.wfname + "|RoleName=" + this.CurrentRoleName + "|SessionValues=" + this.SessionValues + "|" + "ProjectId=" + this.projectId + "|" + "WorkFlowId=" + cdata.WFId;
    return this.httpClient.put<string>(this.basrUrl + "/WorkflowActions/UpdateManageAction", cdata, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  //method for deleting the data
  Delete(cdata: stepactionsmodel, IsContinue: string) {
    cdata.ParameterCarrier = "UserName=" + this.LoginEmail + "|" + "Iscontinuetoproceed=" + IsContinue + "|WorkFlow=" + cdata.wfname + "|RoleName=" + this.CurrentRoleName + "|SessionValues=" + this.SessionValues + "|" + "ProjectId=" + this.projectId + "|" + "WorkFlowId=" + cdata.WFId;
    return this.httpClient.post<string>(this.basrUrl + "/WorkflowActions/DeleteWFAction", cdata, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }  
}
