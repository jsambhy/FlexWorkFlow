import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { PivotColumnModel, PivotModel, PivotRowModel, PivotValueModel } from "../models/pivot.model";
import { DashboardDetailsModel } from "../models/dashboard-detail-model";


@Injectable()
export class ReportPivotViewsService {
  baseUrl = environment.baseUrl;


  constructor(private httpClient: HttpClient) {

  }
  

  Save(model: PivotModel): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl + "/ReportPivotViews/Save", model, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  GetData(): Observable<any> {
    return this.httpClient.get(this.baseUrl + "/ReportPivotViews/GetData");
  }
  
  
  GetFilterData(): Observable<any> {
    return this.httpClient.get(this.baseUrl + "/ReportPivotViews/GetFilterData");
  }
  
  
  GetById(Id: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/ReportPivotViews/GetById?Id=" + Id);
  }
  //getPivotManufacturerId
  getPivotManufacturerId(Id: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/ReportPivotViews/getPivotManufacturerId?Id=" + Id);
  }
  Delete(Id: number, ProjectId: number, iscontinuetodelete, createdbyid): Observable<string> {
    return this.httpClient.delete<string>(this.baseUrl + "/ReportPivotViews/Delete?Id=" + Id + "&ProjectId=" + ProjectId + "&iscontinuetodelete=" + iscontinuetodelete + "&CreatedById=" + createdbyid);
  }
  

  Update(model: PivotModel): Observable<string> {
    return this.httpClient.post<string>(this.baseUrl + "/ReportPivotViews/Update", model, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  GetDataByReportId(ReportId: number): Observable<any> {
    return this.httpClient.get(this.baseUrl + "/ReportPivotViews/GetDataByReportId?ReportId=" + ReportId);
  }
  //UpdatePivotJson
  UpdatePivotJson(model: DashboardDetailsModel): Observable<any> {
    return this.httpClient.post<string>(this.baseUrl + "/DashBoard/UpdateConfigJson", model, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  //--------------------------------Row Related Code------------------------------------------
  GetRowDataByPivotViewId(PivotViewId): Observable<any> {
    return this.httpClient.get(this.baseUrl + "/ReportPivotViews/GetRowDataByPivotViewId?PivotViewId=" + PivotViewId);
  }

  SaveRowdata(model: PivotRowModel): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl + "/ReportPivotViews/SaveRowdata", model, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  UpdateRowdata(model: PivotRowModel): Observable<any> {
    return this.httpClient.put<any>(this.baseUrl + "/ReportPivotViews/UpdateRowdata", model, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  GetRowById(RowId: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/ReportPivotViews/GetRowById?RowId=" + RowId);
  }

  RowDelete(RowId: number): Observable<void> {
    return this.httpClient.delete<void>(this.baseUrl + "/ReportPivotViews/RowDelete?RowId=" + RowId);
  }

  //--------------------------------Column Related Code------------------------------------------
  GetColumnDataByPivotViewId(PivotViewId): Observable<any> {
    return this.httpClient.get(this.baseUrl + "/ReportPivotViews/GetColumnDataByPivotViewId?PivotViewId=" + PivotViewId);
  }

  SaveColumndata(model: PivotColumnModel): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl + "/ReportPivotViews/SaveColumndata", model, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  UpdateColumndata(model: PivotColumnModel): Observable<any> {
    return this.httpClient.put<any>(this.baseUrl + "/ReportPivotViews/UpdateColumndata", model, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  GetColumnById(ColumnId: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/ReportPivotViews/GetColumnById?ColumnId=" + ColumnId);
  }

  ColumnDelete(ColumnId: number): Observable<void> {
    return this.httpClient.delete<void>(this.baseUrl + "/ReportPivotViews/ColumnDelete?ColumnId=" + ColumnId);
  }

  //----------------------------------Values related Code-----------------------------------------------

  GetValueDataByPivotViewId(PivotViewId): Observable<any> {
    return this.httpClient.get(this.baseUrl + "/ReportPivotViews/GetValueDataByPivotViewId?PivotViewId=" + PivotViewId);
  }

  SaveValuedata(model: PivotValueModel): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl + "/ReportPivotViews/SaveValuedata", model, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  UpdateValuedata(model: PivotValueModel): Observable<any> {
    return this.httpClient.put<any>(this.baseUrl + "/ReportPivotViews/UpdateValuedata", model, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  GetValueById(ValueId: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/ReportPivotViews/GetValueById?ValueId=" + ValueId);
  }

  ValueDelete(ValueId: number): Observable<void> {
    return this.httpClient.delete<void>(this.baseUrl + "/ReportPivotViews/ValueDelete?ValueId=" + ValueId);
  }

}
