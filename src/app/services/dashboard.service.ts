import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { whereconditionmodel } from '../models/WhereCondition.model';
import { environment } from '../../environments/environment';
import { DashboardDetailsModel } from '../models/dashboard-detail-model';
import { DashboardPanelModel } from '../models/dashboard-panel-model';


@Injectable()
export class DashboardService {
  readonly basrUrl = environment.baseUrl;
  
  sessionprojectid: string = sessionStorage.getItem("ProjectId");
  projectId: number = +this.sessionprojectid; // conversion from string to int
  UserName: string = sessionStorage.getItem("LoginEmail");
  CurrentRoleName: string = sessionStorage.getItem("CurrentRoleName");
  LoginEmail: string = sessionStorage.getItem("LoginEmail");
  SessionValues: any = sessionStorage;
  constructor(private httpClient: HttpClient) {
  }
  getWorkflowsbyRoleId(RoleId: number): Observable<string> {
    return this.httpClient.get<string>(this.basrUrl + "/Dashboard/GetWFByRoleId?RoleId=" + RoleId);
  }

  GetEntiesByParticipant(RoleId: number,ScopeEntityType:string,ScopeEntityId:number): Observable<string> {
    return this.httpClient.get<string>(this.basrUrl + "/Dashboard/GetEntiesByParticipant?RoleId=" + RoleId + "&ScopeEntityType=" + ScopeEntityType + "&ScopeEntityId=" + ScopeEntityId);
  }

  getDashboardUIComponents(): Observable<string> {
    return this.httpClient.get<string>(this.basrUrl + "/Dashboard/GetDashBoardUIComponents");
  }

  GetPanelDetailsByPanelId(PanelId:number,UserRoleId:number): Observable<any> {
    return this.httpClient.get<any>(this.basrUrl + "/Dashboard/GetPanelDetailsByPanelId?PanelId=" + PanelId + "&UserRoleId=" + UserRoleId);
  }

  GetPanelDetailsByRoleId(PanelId: number, RoleId: number): Observable<any> {
    return this.httpClient.get<any>(this.basrUrl + "/Dashboard/GetPanelDetailsByRoleId?PanelId=" + PanelId + "&RoleId=" + RoleId);
  }

  DeletePanelDetailsByPanelId(PanelId: number, UserRoleId: number): Observable<any> {
    return this.httpClient.get<any>(this.basrUrl + "/Dashboard/DeletePanelDetailsByPanelId?PanelId=" + PanelId + "&UserRoleId=" + UserRoleId);
  }


  Validate(conditiondata: whereconditionmodel): Observable<string> {
    return this.httpClient.post<string>(this.basrUrl + "/Dashboard/ValidateWhereCondition", conditiondata, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }
  getTechExp(conditiondata: whereconditionmodel): Observable<string> {
    
    return this.httpClient.post<string>(this.basrUrl + "/ExpressionBuilder/GetTechnicalExpressionFromUserWhereClause", conditiondata, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
    //return this.httpClient.get<string>(this.basrUrl + "/ExpressionBuilder/GetTechnicalExpressionFromUserWhereClause?EntityId=" + EntityId + "&UserWhereClause=" + Condition);
  }
  getComponentDescription(query: string) {
    
    return this.httpClient.get<any>(this.basrUrl + "/Dashboard/GetComponentDetail?query=" + query);
    //return this.httpClient.post<string>(this.basrUrl + "/Dashboard/GetComponentDetail", query, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

        //method to get the result of executed query from database on dashboard panel we are using post method in case og getting ther information because we need to pass n number of parameters 
  //getPanelInforForDashboard(paneldata: DashboardPanelModel) {
  //  return this.httpClient.post<string>(this.basrUrl + "/Dashboard/GetPanelInforForDashboard", paneldata, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }) 
  //}

  GetPanelInfoByUserRole(UserRoleId: number): Observable<any> {
    return this.httpClient.get<any>(this.basrUrl + "/Dashboard/GetPanelInfoByUserRole?UserRoleId=" + UserRoleId);
  }

  //PostPanelPosition
  PostPanelPosition(jsonString) {
    return this.httpClient.post<string>(this.basrUrl + "/Dashboard/PostPanelPosition?info=" + jsonString, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }
  PostPanelInfo(DashboardDetails: DashboardDetailsModel) {
    return this.httpClient.post<string>(this.basrUrl + "/Dashboard/PostPanelInfo", DashboardDetails, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }
  //PerformPanelOperations
  PerformPanelOperations(DashboardDetails: DashboardDetailsModel) {
    return this.httpClient.post<string>(this.basrUrl + "/Dashboard/PerformPanelOperations", DashboardDetails, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }
  GetOnDemandDashboardData(UserRoleId: number, ProjectId: number, EntityType: string, EntityId: number): Observable<any> {
    return this.httpClient.get<any>(this.basrUrl + "/Dashboard/GetDashboard?UserRoleId=" + UserRoleId + "&ProjectId=" + ProjectId + "&EntityType=" + EntityType + "&EntityId=" + EntityId);
  }

  UpdatePanelInfo(DashboardDetails: DashboardDetailsModel) {
    return this.httpClient.post<string>(this.basrUrl + "/Dashboard/UpdatePanelInfo", DashboardDetails, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  //UpdatePosition
  UpdatePosition(DashboardDetails: DashboardDetailsModel) {
    return this.httpClient.post<string>(this.basrUrl + "/Dashboard/UpdatePosition", DashboardDetails, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  //DeletePanel
  DeletePanel(Id : number): Observable<void> {
    return this.httpClient.delete<void>(this.basrUrl + "/Dashboard/DeletePanel?id=" + Id);
  }
  //GetDesigningDashboard
  GetDesigningDashboard(UserRoleId: number, ProjectId: number, EntityType: string, EntityId: number, source : string): Observable<any> {
    return this.httpClient.get<any>(this.basrUrl + "/Dashboard/GetDesigningDashboard?UserRoleId=" + UserRoleId + "&ProjectId=" + ProjectId + "&EntityType=" + EntityType + "&EntityId=" + EntityId + "&source="+ source);
  }

  GetPanelInfoById(Id: string): Observable<any> {
    return this.httpClient.get<any>(this.basrUrl + "/Dashboard/GetPanelInfoById?Id=" + Id);
  }

  GetPanelId(UserRoleId: number) {
    return this.httpClient.get<number>(this.basrUrl + "/Dashboard/GetPanelId?UserRoleId=" + UserRoleId);
   
  }
  //--------------Static Dashboard api calls------------------------------
  DismissTipsByUserRole(TipsIds: string,UserRoleId: number): Observable<any> {
    return this.httpClient.get<any>(this.basrUrl + "/Dashboard/DismissTipsByUserRole?TipsIds=" + TipsIds + "&UserRoleId=" + UserRoleId);
  }

  GetLandingPagePanelsData(UserRoleId: number, ProjectId: number,EntityType:string, EntityId:number): Observable<any> {
    return this.httpClient.get<any>(this.basrUrl + "/Dashboard/GetLandingPagePanelsData?UserRoleId=" + UserRoleId + "&ProjectId=" + ProjectId + "&EntityType=" + EntityType + "&EntityId=" + EntityId);
  }

  GetTipsByUserRole(UserRoleId: number): Observable<any> {
    return this.httpClient.get<any>(this.basrUrl + "/Dashboard/GetTipsByUserRole?UserRoleId=" + UserRoleId);
  }

  GetNewsByEntity(EntityType:string,EntityId:number): Observable<any> {
    return this.httpClient.get<any>(this.basrUrl + "/Dashboard/GetNewsByEntity?EntityType=" + EntityType + "&EntityId=" + EntityId);
  }

  GetLandingPageColumnsGridData(EntityType: string, EntityId: number, UserRoleId: number): Observable<any> {
    return this.httpClient.get<any>(this.basrUrl + "/Dashboard/GetLandingPageColumnsGridData?EntityType=" + EntityType + "&EntityId=" + EntityId + "&UserRoleId=" + UserRoleId);
  }


  GetLandingPageGridData(EntityType: string, EntityId: number, UserRoleId:number): Observable<any> {
    return this.httpClient.get<any>(this.basrUrl + "/Dashboard/GetLandingPageGridData?EntityType=" + EntityType + "&EntityId=" + EntityId + "&UserRoleId=" + UserRoleId);
  }

GetLandingDashBoardTags(EntityType: string, EntityId: number, UserRoleId:number,Locale:string): Observable<any> {
  return this.httpClient.get<any>(this.basrUrl + "/Dashboard/GetLandingDashBoardTags?EntityType=" + EntityType + "&EntityId=" + EntityId + "&UserRoleId=" + UserRoleId + "&Locale=" + Locale);
  }
}
