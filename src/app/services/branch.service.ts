import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { branchmodel } from '../models/branch.model';
import { NextStepmodel } from '../models/workflow-diagram-model';
import { stepactionsmodel } from '../models/step-actions-model';
@Injectable()
export class BranchService {
  readonly basrUrl = environment.baseUrl;
  sessionprojectid: string = sessionStorage.getItem("ProjectId");
  projectId: number = +this.sessionprojectid; // conversion from string to int
  UserName: string = sessionStorage.getItem("LoginEmail");
  CurrentRoleName: string = sessionStorage.getItem("CurrentRoleName");
  LoginEmail: string = sessionStorage.getItem("LoginEmail");
  
  constructor(private httpClient: HttpClient) {
  }
  //method to get the datatype of the column selected from the entity dropdown
  getDataType(EntityId: number, ColumnText: string,EntityType: string): Observable<string> {
    return this.httpClient.get<string>(this.basrUrl + "/DataFields/GetDataTypeForColumn?TableId=" + EntityId + "&ColumnName=" + ColumnText + "&ProjectId=" + this.projectId + "&EntityType=" + EntityType);
  }
  //method to get the attribute column field for the entity column selected
  getAttributeByColConfigId(ColumnConfigId: number): Observable<string> {
    return this.httpClient.get<string>(this.basrUrl + "/DataFields/GetAttributeColumn?ColumnConfigId=" + ColumnConfigId);
  }

  GetFormGridDataByEntity(EntityType:string,EntityId: number): Observable<string> {
    return this.httpClient.get<string>(this.basrUrl + "/DataFields/GetFormGridDataByEntity?EntityType=" + EntityType + "&EntityId=" + EntityId);
  }

  //method to create where clause from the user selected values and add to the resultant text box
  AddCondition(data: branchmodel): Observable<branchmodel> {
    return this.httpClient.post<branchmodel>(this.basrUrl + "/ExpressionBuilder/AddExpressionBuilderData", data, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })

  }

  //method to validate the expression builder
  fnValidate(data: NextStepmodel): Observable<string> {
    return this.httpClient.post<string>(this.basrUrl + "/ExpressionBuilder/ValidateExpressionBuilderData", data, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  //method to get the details of stepaction
  fnGetStepActionDetail(StepActionId: number, StepId: number): Observable<stepactionsmodel> {
    return this.httpClient.get<stepactionsmodel>(this.basrUrl + "/WorkflowDesigner/GetStepActionDetailById?Id=" + StepActionId + "&StepId=" + StepId);
  }

  //method to get the branch data for the action
  fnGetBranchesData(WFId: number, StepId: number): Observable<any> {
    return this.httpClient.get(this.basrUrl + "/FlexWFStepActions/GetBranches?StepId=" + StepId + "&WFId=" + WFId);
  }

 //Getting data while editing
  GetBranchConditionDataForEdit(StepId: number, NextStepId: number, StepActionId: number): Observable<any> {
    return this.httpClient.get(this.basrUrl + "/ExpressionBuilder/GetExpressionBuilder?StepId=" + StepId + "&NextStepId=" + NextStepId + "&StepActionId=" + StepActionId);
  }

  //method called while deleting data
  DeleteBranchCondition(StepId: number, NextStepId: number, StepActionId: number, WorkflowId: number): Observable<any> {
    return this.httpClient.delete(this.basrUrl + "/ExpressionBuilder/DeleteExpressionBuilder?StepId=" + StepId + "&NextStepId=" + NextStepId + "&StepActionId=" + StepActionId + "&WorkflowId=" + WorkflowId + "&RoleName=" + this.CurrentRoleName + "&UserName=" + this.LoginEmail);
  }

}
