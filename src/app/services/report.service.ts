import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from '../../environments/environment';
import { Report, ReportParametersModel } from '../models/report-model';
import { PivotViewOnReportModel } from "../models/pivotviewonreport-model";
import { SchedulerModel, ViewReportDataModel } from "../models/scheduler-model";

@Injectable()
export class ReportService {
  readonly baseUrl = environment.baseUrl;
  readonly reportBaseUrl = environment.reportBaseUrl;
  constructor(private httpClient: HttpClient) { }

  LoggedInUserId = +sessionStorage.getItem("LoggedInUserId");
  UserRoleId = sessionStorage.getItem("UserRoleId");
  ProjectId = sessionStorage.getItem("ProjectId");

  GetDataForReportParameterForm(ReportId ): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/Report/GetDataForReportParameterForm?ReportId=" + ReportId
      + "&ProjectId=" + this.ProjectId + "&LoggedInUserId=" + this.LoggedInUserId + "&UserRoleId=" + this.UserRoleId);
  }

  GetReports(LoggedInRoleId: number, LoggedInUserId: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/Report/GetReports?LoggedInRoleId=" + LoggedInRoleId + "&LoggedInUserId=" + LoggedInUserId);
  }

  GetViewReportGridData(model: ViewReportDataModel): Observable<any> {
    //return this.httpClient.get<any>(this.baseUrl + "/Report/GetViewReportGridData?ReportId=" + ReportId + "&ParamJson=" + ParamJson);
    return this.httpClient.post<string>(this.baseUrl + "/Report/GetViewReportGridData", model, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  GetHeaderOfReportGridData(ReportId: number, LoggedInUserId: number, LoggedInRoleId:number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/Report/GetHeaderOfReportGridData?ReportId=" + ReportId + "&LoggedInUserId=" + LoggedInUserId + "&LoggedInRoleId=" + LoggedInRoleId);
  }

  GetReportName(ReportId: number, Source: string): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/Report/GetReportName?ReportId=" + ReportId + "&Source=" + Source);
  }

  GetReportGroupName(ReportGroupId: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/Report/GetReportGroupName?ReportGroupId=" + ReportGroupId);
  }

  GetReportById(ReportId: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/Report/GetReportById?ReportId=" + ReportId);
  }

  GetTagsForReport(EntityType: string, EntityId: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/Report/GetTagsForReport?EntityType=" + EntityType + "&EntityId=" + EntityId);
  }


  Save(ReportModel: Report): Observable<string> {
    return this.httpClient.post<string>(this.baseUrl + "/Report/Post", ReportModel, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  Update(ReportModel: Report): Observable<string> {
    return this.httpClient.put<string>(this.baseUrl + "/Report/Put", ReportModel, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  Delete(Id: number): Observable<void> {
    return this.httpClient.delete<void>(this.baseUrl + "/Report/Delete?id=" + Id)
  }

  
  GetTechnicalQueryByReportId(ReportId: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/Report/GetTechnicalQueryByReportId?ReportId=" + ReportId);
  }
  ///GetReportsColumnWithDataTypeByReportId

  GetReportsColumnWithDataTypeByReportId(ReportId: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/Report/GetReportsColumnWithDataTypeByReportId?ReportId=" + ReportId);
  }

  
  GetDataTypeOfSelectedField(FieldLabel: string ,ReportId: number): Observable<any> {
    return this.httpClient.get<string>(this.baseUrl + "/Report/GetDataTypeOfSelectedField?FieldLabel=" + FieldLabel + "&ReportId=" + ReportId);
  }

  GetCustomFunctionWithInScope(LoggedInScopeEntityType: string, LoggedInScopeEntityId: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/Report/GetCustomFunctionWithInScope?LoggedInScopeEntityType=" + LoggedInScopeEntityType + "&LoggedInScopeEntityId=" + LoggedInScopeEntityId);
  }

  GetCustomFunctionParameters(CustomFunctionId:number,LoggedInScopeEntityType: string, LoggedInScopeEntityId: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/Report/GetCustomFunctionParameters?CustomFunctionId=" + CustomFunctionId + "&LoggedInScopeEntityType=" + LoggedInScopeEntityType + "&LoggedInScopeEntityId=" + LoggedInScopeEntityId);
  }

 /* -------------start-----------------DisplayPivotViewOnReports Section-------------------------------------------------------------*/

  GetDisplayPivotViewOnReports(ReportId: number): Observable < any > {
    return this.httpClient.get<any>(this.baseUrl + "/Report/GetDisplayPivotViewOnReports?ReportId=" + ReportId);
  }

  GetPivotViewOnReportById(Id: number): Observable < any > {
  return this.httpClient.get<any>(this.baseUrl + "/Report/GetPivotViewOnReportById?Id=" + Id);
  }

  DeletePivotViewOnReport(Id: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/Report/DeletePivotViewOnReport?Id=" + Id);
  }

  SavePivotViewOnReport(model: PivotViewOnReportModel): Observable<string> {
    return this.httpClient.post<string>(this.baseUrl + "/Report/SavePivotViewOnReport", model, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  UpdatePivotViewOnReport(model: PivotViewOnReportModel): Observable<string> {
    return this.httpClient.put<string>(this.baseUrl + "/Report/UpdatePivotViewOnReport", model, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

/* -------------end-----------------DisplayPivotViewOnReports Section-------------------------------------------------------------*/
  GetSchedularData(ReportGroupId: number, LoggedInUserId: number, locale:string, offSet:number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/Report/GetSchedularData?ReportGroupId=" + ReportGroupId + "&LoggedInUserId=" + LoggedInUserId + "&locale=" + locale + "&offSet=" + offSet);
  }



  //--------------------------------Report Group Functions which will call the method on different api--------------------

  SaveScheduler(Scheduler: SchedulerModel): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl + "/Report/SaveScheduler", Scheduler, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
 
  }

  ProcessReportGroup(SchedulerRunId:number, LoggedInUserId: number): Observable<any> {
    return this.httpClient.get<any>(this.reportBaseUrl + "/ReportGroup/ProcessReportGroup?SchedulerRunId=" + SchedulerRunId + "&LoggedInUserId=" + LoggedInUserId);
 
  }

  //------------------------------------Reports Parameters---------------------------------------
  IsParametersExist(ReportId: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/Report/IsParametersExist?ReportId=" + ReportId);
  }

  GetReportIdByRptGrpId(ReportGroupId: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/Report/GetReportIdByRptGrpId?ReportGroupId=" + ReportGroupId);
  }

  GetParamFormFieldDataForReport(ReportId: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/Report/GetParamFormFieldDataForReport?ReportId=" + ReportId);
  }


  //--------------------------------Report Parameters configuration-----------------------------------

  GetParametersData(): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/ReportParameters/GetParametersData");
  }

  SaveReportParameter(model: ReportParametersModel): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl + "/ReportParameters/Save", model, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  UpdateReportParameter(model: ReportParametersModel): Observable<any> {
    return this.httpClient.put<any>(this.baseUrl + "/ReportParameters/Update", model, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  GetReportParameterById(ReportParameterId: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/ReportParameters/GetById?Id=" + ReportParameterId);
  }

  ReportParameterDelete(ReportParameterId: number): Observable<void> {
    return this.httpClient.delete<void>(this.baseUrl + "/ReportParameters/Delete?Id=" + ReportParameterId);
  }


  //GetParamFormNote(ReportId: number): Observable<string> {
  //  return this.httpClient.get<string>(this.baseUrl + "/Report/GetParamFormNote?ReportId=" + ReportId);
  //}

  //GetEmployees(LoggedInUserId ): Observable<any> {
  //  return this.httpClient.get<any>(this.baseUrl + "/Report/GetEmployees?LoggedInUserId=" + LoggedInUserId);
  //}


}
