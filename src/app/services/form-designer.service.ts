import { Injectable, Inject } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { environment } from "../../environments/environment";
import { FlexFormsViewModel, FormTabViewModel, FormSectionViewModel, FormFieldViewModel } from '../models/FormDesignerModel';
import { CalcFieldModel } from "../models/calc-field.model";

@Injectable()
export class FormDesignerService {
  readonly baseUrl = environment.baseUrl;

  constructor(private httpClient: HttpClient) {
  }
  //SourceColumnLabel, TargetColumnType, ChangedValue, 
  GetCalculatedValue(Calc, ImpactedJson): Observable<any> {
    let data: CalcFieldModel = new CalcFieldModel();
    //let encodedVal = Calc.replace(/\+/gi, '%2B'); //replaing plus(+) sign if any, because (+) was being replaced with space in http call
    //encoding not required as now sending data in request body.
    data.Calc = Calc;
    //data.ProjectId = ProjectId;
    data.ImpactedJson = ImpactedJson;
    return this.httpClient.post<FlexFormsViewModel>(this.baseUrl + "/Forms/GetCalculatedValue?"
      , data, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })

    //return this.httpClient.get(this.baseUrl + "/Forms/GetCalculatedValue?Calc=" + encodedVal +
    //  "&ImpactedJson=" + ImpactedJson
    //  + "&ProjectId=" + ProjectId);
  }

  GetMainGridData(FormId): Observable<any> {
    return this.httpClient.get(this.baseUrl + "/Forms/GetMainGridData?FormId=" + FormId);
  }

  GetAvailableForms(EntityType, EntityId, UserRoleId): Observable<any> {
    return this.httpClient.get(this.baseUrl + "/Forms/GetAvailableForms?EntityType=" + EntityType + "&EntityId=" + EntityId + "&UserRoleId=" + UserRoleId);
  }

  GetFieldInfo(Id): Observable<any> {
    return this.httpClient.get(this.baseUrl + "/Forms/GetFieldInfoById?FormFieldId=" + Id);
  }
  GetDefaultValuesForFormField(EntityType,EntityId, ProjectId, FormId): Observable<any> {
    return this.httpClient.get(this.baseUrl + "/Forms/GetDefaultValuesForFormField?EntityType=" + EntityType + "&EntityId=" + EntityId
      + "&ProjectId=" + ProjectId + "&FormId=" + FormId);
  }
  SaveNewField(model): Observable<FormFieldViewModel> {
    return this.httpClient.post<FormFieldViewModel>(this.baseUrl + "/Forms/PostNewField", model, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }
  UpdateField(Id,model): Observable<any> {
    return this.httpClient.put<any>(this.baseUrl + "/Forms/UpdateField?Id=" + Id, model,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }
  DeleteField(FieldId): Observable<any> {
    return this.httpClient.post<string>(this.baseUrl + "/Forms/DeleteField?FieldId="+ FieldId, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }
  /********* Sections*/
  GetSectionById(TabId): Observable<any> {
    return this.httpClient.get(this.baseUrl + "/Forms/GetSectionById?Id=" + TabId);
  }
  DeleteSection(tabmodel): Observable<any> {
    return this.httpClient.post<string>(this.baseUrl + "/Forms/DeleteSection", tabmodel, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }
  UpdateSection(Id, putdata): Observable<any> {
    return this.httpClient.put<string>(this.baseUrl + "/Forms/UpdateSection?Id=" + Id, putdata,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }
   
  SaveNewSection(model): Observable<FormSectionViewModel> {
    return this.httpClient.post<FormSectionViewModel>(this.baseUrl + "/Forms/PostNewSection", model, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }
  /********* Tabs*/
  GetTabById(TabId): Observable<any> {
    return this.httpClient.get(this.baseUrl + "/Forms/GetTabById?Id=" + TabId );
  }
  DeleteTab(tabmodel): Observable<any> {
    return this.httpClient.post<string>(this.baseUrl + "/Forms/DeleteTab", tabmodel, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }
  UpdateTab(Id, putdata ): Observable<any> {
    return this.httpClient.put<string>(this.baseUrl + "/Forms/UpdateTab?Id=" + Id, putdata,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }
  DragAndDropRowDynamic(SourceId, TargetId, TableName): Observable<any> {
    return this.httpClient.get(this.baseUrl + "/Forms/DragAndDropRowDynamic?SourceId=" + SourceId
      + "&TargetId=" + TargetId + "&TableName=" + TableName );
  }
  SaveNewTab(model ): Observable<FormTabViewModel> {
    return this.httpClient.post<FormTabViewModel>(this.baseUrl + "/Forms/PostNewTab", model, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }
  /******************/
  SaveFlexForm(flexform: FlexFormsViewModel): Observable<FlexFormsViewModel> {
    return this.httpClient.post<FlexFormsViewModel>(this.baseUrl + "/Forms/PostForm", flexform, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }
  UpdateFlexForm(Id,flexform): Observable<any> {
    return this.httpClient.put<string>(this.baseUrl + "/Forms/PutForm?Id=" + Id, flexform,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }
  GetColumnsListForDropDown(ColumnConfigId, EntityId, EntityType, ProjectId): Observable<any> {
    return this.httpClient.get(this.baseUrl + "/FlexEntityData/GetColumnsListForDropDown?ColumnConfigId=" +
      ColumnConfigId + "&EntityId=" + EntityId + "&EntityType=" + EntityType + "&ProjectId=" + ProjectId);
  }
  GetDataForDropDown(ColumnConfigId, EntityId, EntityType, ProjectId,TransactionId): Observable<any> {
    return this.httpClient.get(this.baseUrl + "/FlexEntityData/GetDataForDropDown?ColumnConfigId=" +
      ColumnConfigId + "&EntityId=" + EntityId + "&EntityType=" + EntityType + "&ProjectId=" + ProjectId + "&TransactionId=" + TransactionId);
  }
  GetBrowserTitleForForm(FlexFormId): Observable<any> {
    return this.httpClient.get(this.baseUrl + "/Forms/GetBrowserTitleForForm?FlexFormId=" + FlexFormId);
  }
  GetFormTabData(FlexFormId): Observable<any> {
    return this.httpClient.get(this.baseUrl + "/Forms/GetTabsDataByFormId?FlexFormId=" + FlexFormId );
  }
  GetFormDataById(Id): Observable<any> {
    return this.httpClient.get(this.baseUrl + "/Forms/GetById?Id=" + Id);
  }
  GetSectionGridData(SectionId): Observable<any> {
    return this.httpClient.get(this.baseUrl + "/Forms/GetSectionsDataById?SectionId=" + SectionId);
  }
  GetFormSectionData(FormTabId): Observable<any> {
    return this.httpClient.get(this.baseUrl + "/Forms/GetSectionsDataByTabId?FormTabId=" + FormTabId);
  }
  GetFormsByEntityIdType(EntityType, EntityId, ProjectId): Observable<any> {
    return this.httpClient.get(this.baseUrl + "/Forms/GetFormsByEntityIdType?EntityType=" + EntityType + "&EntityId=" + EntityId + "&ProjectId=" + ProjectId);
  }

}
