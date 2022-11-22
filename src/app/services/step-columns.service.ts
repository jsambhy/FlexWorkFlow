import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { stepcolumnsmodel } from '../models/step-columns-model';

@Injectable()
export class StepColumnsService {
  readonly basrUrl = environment.baseUrl;
  sessionprojectid: string = sessionStorage.getItem("ProjectId");
  projectId: number = +this.sessionprojectid; // conversion from string to int
  UserName: string = sessionStorage.getItem("LoginEmail");
  CurrentRoleName: string = sessionStorage.getItem("CurrentRoleName");
  LoginEmail: string = sessionStorage.getItem("LoginEmail");
  LoggedInRoleId: number = +sessionStorage.getItem("LoggedInRoleId");
  LoggedInUserId: number = +sessionStorage.getItem("LoggedInUserId");
  SessionValues: any = sessionStorage;
  public stepcolumndata: stepcolumnsmodel = new stepcolumnsmodel();//declaring and initializing the variable to use further
  constructor(private httpClient: HttpClient) {
  }

  //this method is used to get the data for the step dropwdown
  getAllSteps(WFId: number,WFname : string): Observable<any> {
    return this.httpClient.get(this.basrUrl + "/FlexWFSteps/GetWStepByWFIdForDropDown?WorkflowId=" + WFId + "&UserName=" + this.LoginEmail + "&WorkFlow=" + WFname + "&ProjectId=" + this.projectId);
  }

  //method to get all the entities (columns) on the basis of Flextableid of the workflow
  GetAllFlattenedDFsForEntity(EntityType:string,EntityId: number): Observable<any> {
    return this.httpClient.get(this.basrUrl + "/DataFields/GetAllFlattenedDFsForEntity?EntityType=" + EntityType + "&EntityId=" + EntityId);
  }

  //getting all the columns data for the wflevel and steplevel to show in grid of manage landing page
  getColumndetailforstep(Id: number, wfid: number): Observable<any> {
    return this.httpClient.get(this.basrUrl + "/FlexWFStepColumns/GetColumnsByStepId?StepId="+Id+"&WorkflowId="+wfid);
  }

  //method to get the stepnames except the source step
  GetAllStepsFromWFExceptSourceStep(wfid: number, stepid: number): Observable<any> {
    return this.httpClient.get(this.basrUrl + "/FlexWFSteps/GetAllStepsFromWFExceptSourceStep?WorkFlowId=" + wfid + "&ProjectId=" + this.projectId + "&Id=" + stepid);
  }
  //Cloning functionality
  CloneToSelectedSteps(stepcolumnsmodel: stepcolumnsmodel): Observable<string> {
    stepcolumnsmodel.CreatedById = this.LoggedInUserId;
    stepcolumnsmodel.CreatedByRoleId = this.LoggedInRoleId;
    stepcolumnsmodel.ParameterCarrier = "UserName=" + this.LoginEmail + "|WorkFlow=" + stepcolumnsmodel.wfname + "|RoleName=" + this.CurrentRoleName + "|SessionValues=" + this.SessionValues + "|ProjectId=" + this.projectId + "|" + "WorkflowId=" + stepcolumnsmodel.wfId;
    return this.httpClient.post<string>(this.basrUrl + "/FlexWFStepColumns/CloneToSelectedSteps", stepcolumnsmodel, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }
  //Add all fields functionality
  AddFields(StepId: number, wfid: number, Flextableid: number, wfname: string): Observable<any> {
    this.stepcolumndata.WStepId = StepId;
    this.stepcolumndata.CreatedById = this.LoggedInUserId;
    this.stepcolumndata.UpdatedById = this.LoggedInUserId;
    this.stepcolumndata.CreatedByRoleId = this.LoggedInRoleId;
    this.stepcolumndata.UpdatedByRoleId = this.LoggedInRoleId;

    this.stepcolumndata.ParameterCarrier = "UserName=" + this.UserName + "|WorkFlow=" + wfname + "|RoleName=" + this.CurrentRoleName + "|SessionValues=" + this.SessionValues + "|" + "WorkflowId=" + wfid + "|" + "EntityId=" + Flextableid + "|" + "ProjectId=" + this.projectId;
    return this.httpClient.post<string>(this.basrUrl + "/FlexWFStepColumns/AddAllFields", this.stepcolumndata, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }
  //edit functionality
  GetById(Id: number): Observable<stepcolumnsmodel> {
    return this.httpClient.get<stepcolumnsmodel>(this.basrUrl + "/FlexWFStepColumns/GetByStepColumnId?Id=" + Id);
  }
  //update functionality
  Put(stepcolumnsmodel: stepcolumnsmodel): Observable<string> {
    stepcolumnsmodel.CreatedById = this.LoggedInUserId;
    stepcolumnsmodel.UpdatedById = this.LoggedInUserId;
    stepcolumnsmodel.CreatedByRoleId = this.LoggedInRoleId;
    stepcolumnsmodel.UpdatedByRoleId = this.LoggedInRoleId;
    stepcolumnsmodel.ParameterCarrier = "UserName=" + this.LoginEmail + "|WorkFlow=" + stepcolumnsmodel.wfname + "|RoleName=" + this.CurrentRoleName + "|SessionValues=" + this.SessionValues + "|ProjectId=" + this.projectId;
    return this.httpClient.put<string>(this.basrUrl + "/FlexWFStepColumns/UpdateStepColumn", stepcolumnsmodel, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }
  //Delete functionality
  DeleteById(stepcolumn: stepcolumnsmodel): Observable<string>{
    stepcolumn.ParameterCarrier = "UserName=" + this.LoginEmail + "|WorkFlow=" + stepcolumn.wfname + "|RoleName=" + this.CurrentRoleName + "|SessionValues=" + this.SessionValues + "|ProjectId=" + this.projectId;
    return this.httpClient.post<string>(this.basrUrl + "/FlexWFStepColumns/DeleteStepColumnData", stepcolumn, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }
  //Saving functionality
  Save(cdata: stepcolumnsmodel): Observable<string> {
    cdata.CreatedById = this.LoggedInUserId;
    cdata.UpdatedById = this.LoggedInUserId;
    cdata.CreatedByRoleId = this.LoggedInRoleId;
    cdata.UpdatedByRoleId = this.LoggedInRoleId;
    cdata.ParameterCarrier = "UserName=" + this.LoginEmail + "|WorkFlow=" + cdata.wfname + "|RoleName=" + this.CurrentRoleName + "|SessionValues=" + this.SessionValues + "|IsJoin=" + cdata.IsJoin + "|TableName=" + cdata.tablenamefromcolumname + "|ProjectId=" + this.projectId + "|ParentDataFieldId=" + cdata.ParentDataFieldId;
    return this.httpClient.post<string>(this.basrUrl + "/FlexWFStepColumns/SaveStepColumn", cdata, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }
  //Method to set the ordinals of the rows after drag and drop in grid
  DragAndDropRowDynamic(SourceId, TargetId,StepId): Observable<any> {
    return this.httpClient.get(this.basrUrl + "/FlexWFStepColumns/DragAndDropRowDynamic?SourceId=" + SourceId + "&TargetId=" + TargetId + "&StepId=" + StepId);
  }
}
