import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { WSteps } from '../models/wsteps-model';
import { GenericGridColumns } from '../models/generic-grid-column-model';
import { UpdateActionStatusModel } from '../models/update-action-model';
import { DataResult } from "@syncfusion/ej2-angular-grids";



@Injectable()
export class GenericGridService {
  readonly basrUrl = environment.baseUrl;
  constructor(private httpClient: HttpClient) {
    //this.getData();
  }

  loggedInRoleId = +sessionStorage.getItem("LoggedInRoleId");
  
  GetTabsByWorkflow(WorkFlowId: number, ForcedBranchStepId: number, LoggedInRoleId: number): Observable<WSteps[]> {
    return this.httpClient.get<WSteps[]>(this.basrUrl + "/GenericGrid/GetStepsByWorkflow?WorkFlowId=" + WorkFlowId + "&ForcedBranchStepId=" + ForcedBranchStepId + "&LoggedInRoleId=" + LoggedInRoleId);
  }

  GetGridDataByStepId(StepId: number, UserRoleId: number, TransactionStatus: string, PageSize: number, PageNumber: number, sortdatafield: string, sortorder: string, FilterQuery: string, locale: string, timeZone: string, offSet: number): Observable<any> {
    //FilterQuery = FilterQuery.replace(/'/g, '\'\'');
    FilterQuery = encodeURIComponent(FilterQuery);
    return this.httpClient.get<any>(this.basrUrl + "/GenericGrid/GetGridDataByStepId?StepId=" + StepId + "&UserRoleId=" + UserRoleId + "&TransactionStatus=" + TransactionStatus + "&PageSize=" + PageSize + "&PageNumber=" + PageNumber + "&sortdatafield=" + sortdatafield + "&sortorder=" + sortorder + "&FilterQuery=" + FilterQuery + "&locale=" + locale + "&timeZone=" + timeZone + "&offSet=" + offSet);
  }

  //GetGridDataByStepId(StepId: number, UserRoleId: number, TransactionStatus: string, PageSize: number, PageNumber: number, sortdatafield: string, sortorder: string, FilterQuery: string, locale: string, timeZone: string, offSet: number): Observable<any> {
  //  return this.httpClient.get<any>(this.basrUrl + "/GenericGrid/GetGridDataByStepId?StepId=" + StepId + "&UserRoleId=" + UserRoleId + "&TransactionStatus=" + TransactionStatus + "&PageSize=" + PageSize + "&PageNumber=" + PageNumber + "&sortdatafield=" + sortdatafield + "&sortorder=" + sortorder + "&FilterQuery=" + FilterQuery + "&locale=" + locale + "&timeZone=" + timeZone + "&offSet=" + offSet)
  //    .pipe(map((response: any) => response))
  //    .pipe(map((response: any) => (<DataResult>{
  //      result: response,
  //      count: response.length
  //    })))
  //    .pipe((data: any) => data);
  //}

  public execute(state: any): void {
    console.log(state);
    this.getAllData(state).subscribe(x => console.log(x));
  }
  getAllData(state?: any): Observable<any[]> {
    return this.httpClient.get<object>(this.basrUrl + "/GenericGrid/GetGridDataByStepId?StepId=162&UserRoleId=183&PageSize=12&PageNumber=0&sortdatafield=''&sortorder=''&FilterQuery=''")
      .pipe(map((data: any) => data));
  }

  GetGenericGridColumnsByStepId(StepId: number, LoggedInRoleId: number): Observable<GenericGridColumns[]> {
    return this.httpClient.get<GenericGridColumns[]>(this.basrUrl + "/GenericGrid/GetGenericGridColumnsByStep?StepId=" + StepId + "&LoggedInRoleId=" + LoggedInRoleId);
  }

  GetBranchStepInfo(BranchStepId: number): Observable<any[]> {
    return this.httpClient.get<any[]>(this.basrUrl + "/GenericGrid/GetBranchGridData?BranchingStepId=" + BranchStepId);
}

  //ExecuteAction(TransactionIdList: string, StepActionId: number, EntityId: number, LoggedInUserId: number, WorkflowId: number, StepActionComments:string): Observable<UpdateActionStatusModel[]> {
  //  return this.httpClient.get<UpdateActionStatusModel[]>(this.basrUrl + "/GenericGrid/ExecuteAction?TransactionIdList=" + TransactionIdList + "&StepActionId=" + StepActionId + "&EntityId=" + EntityId + "&LoggedInUserId=" + LoggedInUserId + "&LoggedInRoleId=" + this.loggedInRoleId + "&WorkflowId=" + WorkflowId + "&StepActionComments=" + StepActionComments);
  //}

  ExecuteAction(TransactionIdList: string, StepActionId: number, EntityId: number, LoggedInUserId: number, WorkflowId: number, StepActionComments: string): Observable<any> {
    return this.httpClient.get<any>(this.basrUrl + "/GenericGrid/ExecuteAction?TransactionIdList=" + TransactionIdList + "&StepActionId=" + StepActionId + "&EntityId=" + EntityId + "&LoggedInUserId=" + LoggedInUserId + "&LoggedInRoleId=" + this.loggedInRoleId + "&WorkflowId=" + WorkflowId + "&StepActionComments=" + StepActionComments);
  }

  IsMassAction(StepActionId: number): Observable<boolean> {
    return this.httpClient.get<boolean>(this.basrUrl + "/FlexWFStepActions/IsMassAction?StepActionId=" + StepActionId);
  }

  GetUserRoleId(LoggedInUserId: number, LoggedInRoleId: number): Observable<number> {
    return this.httpClient.get<number>(this.basrUrl + "/LUser/GetUserRoleId?UserId=" + LoggedInUserId + "&RoleId=" + LoggedInRoleId);
  }

  MakeTxnActive(ScopeEntityType: string, ScopeEntityId: number,TransactionIdList: string): Observable<void> {
    return this.httpClient.get<void>(this.basrUrl + "/GenericGrid/MakeTxnActive?ScopeEntityType=" + ScopeEntityType + "&ScopeEntityId=" + ScopeEntityId + "&TransactionIdList=" + TransactionIdList);
  }
}
