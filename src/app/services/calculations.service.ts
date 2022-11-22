import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { NextStepmodel } from '../models/workflow-diagram-model';
import { calculationmodel } from '../models/calculations.model';

@Injectable()
export class CalculationsService {
  readonly basrUrl = environment.baseUrl;
  sessionprojectid: string = sessionStorage.getItem("ProjectId");
  projectId: number = +this.sessionprojectid; // conversion from string to int
  UserName: string = sessionStorage.getItem("LoginEmail");
  CurrentRoleName: string = sessionStorage.getItem("CurrentRoleName");
  LoginEmail: string = sessionStorage.getItem("LoginEmail");
  SessionValues: any = sessionStorage;
  LoggedInRoleId: number = +sessionStorage.getItem("LoggedInRoleId");
  LoggedInUserId: number = +sessionStorage.getItem("LoggedInUserId"); 
  constructor(private httpClient: HttpClient) { }

  GetByTargetDatafieldId(TargetDatafieldId,EntityType,EntityId): Observable<any> {
    return this.httpClient.get(this.basrUrl + "/CustomCalculation/GetByTargetDatafieldId?TargetDatafieldId=" + TargetDatafieldId
      + "&EntityType=" + EntityType + "&EntityId=" + EntityId);
  }

  //method to get the calculation data by stepactionid
  getCalcDetails(StepActionId: number, EntityType: string, EntityId: number): Observable<any> { 
    return this.httpClient.get(this.basrUrl + "/CustomCalculation/GetData?StepActionId=" + StepActionId +
      "&EntityType=" + EntityType + "&EntityId=" + EntityId);
  }
  //method called while deleting calculation
  DeleteById(Id: number): Observable<string> {
    return this.httpClient.delete<string>(this.basrUrl + "/CustomCalculation/Delete?Id=" + Id + "&UserName=" + this.LoginEmail  + "&RoleName=" + this.CurrentRoleName)
  }
  //method to get the entities on the basis of datatype
  getAllEntitiesByDataType(FlexTableId: number, Datatype: string): Observable<any> {    
    return this.httpClient.get(this.basrUrl + "/DataFields/GetBaseTableFieldsWithReferenceWithDataType?TableId=" + FlexTableId + "&DataType=" + Datatype);
  }
  //method for validating where clause
  fnValidate(data: NextStepmodel): Observable<string> {
    return this.httpClient.post<string>(this.basrUrl + "/CustomCalculation/ValidateWhereCondition", data, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }
  //method called while edition of the calculation
  EditById(Id: number): Observable<any> {
    return this.httpClient.get<string>(this.basrUrl + "/CustomCalculation/GetCalculationDatabyId?Id="+Id)
  }

  GetMappedDFIDsByCalcId(CalculationId: number): Observable<any> {
    return this.httpClient.get<string>(this.basrUrl + "/CustomCalculation/GetMappedDFIDsByCalcId?CalculationId=" + CalculationId)
  }

  //method for saving the data
  Save(modeldata: calculationmodel): Observable<string> {
    modeldata.CreatedById = this.LoggedInUserId;
    modeldata.CreatedByRoleId = this.LoggedInRoleId;   
    modeldata.ParameterCarrier = "UserName=" + this.LoginEmail + "|WorkFlow=" + modeldata.wfname + "|RoleName=" + this.CurrentRoleName + "|SessionValues=" + this.SessionValues + "|" + "ProjectId=" + this.projectId;
    //modeldata.Calculation = modeldata.Calculation.replace("plus", "+");
    modeldata.UpdatedById = this.LoggedInUserId;
    modeldata.UpdatedByRoleId = this.LoggedInRoleId;
    return this.httpClient.post<string>(this.basrUrl + "/CustomCalculation/SaveData", modeldata, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }
  //method for updating the data
  Update(modeldata: calculationmodel): Observable<string> {
    modeldata.UpdatedById = this.LoggedInUserId;
    modeldata.UpdatedByRoleId = this.LoggedInRoleId;
    modeldata.ParameterCarrier = "UserName=" + this.LoginEmail + "|WorkFlow=" + modeldata.wfname + "|RoleName=" + this.CurrentRoleName + "|SessionValues=" + this.SessionValues + "|" + "ProjectId=" + this.projectId;
   // modeldata.Calculation = modeldata.Calculation.replace("plus", "+");
    return this.httpClient.put<string>(this.basrUrl + "/CustomCalculation/Update", modeldata, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }
}
