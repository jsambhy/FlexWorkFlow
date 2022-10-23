import { Injectable, Inject } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { MasterDataViewModel, ColumnConfigurationModel } from '../models/columnConfig-model';
import { FlexFormsViewModel } from '../models/FormDesignerModel';



@Injectable()
export class DataFieldService {
  readonly baseUrl = environment.baseUrl;
  sessionprojectid: string = sessionStorage.getItem("ProjectId");
  projectId: number = +this.sessionprojectid; // conversion from string to int
  UserName: string = sessionStorage.getItem("LoginEmail");
  CurrentRoleName: string = sessionStorage.getItem("CurrentRoleName");
  LoggedInUserId: string = sessionStorage.getItem("LoggedInUserId");
  LoggedInRoleId: string = sessionStorage.getItem("LoggedInRoleId");
  LoginEmail: string = sessionStorage.getItem("LoginEmail");
  SessionValues: any = sessionStorage;
  UserRoleId : number = +sessionStorage.getItem("UserRoleId");
  constructor(private httpClient: HttpClient) {
  }
  GetColumnsForMCLPopup(DFId): Observable<any> {
    return this.httpClient.get(this.baseUrl + "/DataFields/GetColumnsForMCLPopup?DFId=" + DFId );
  }

  //GetDataForMCLPopup(DFId, TxnId, SelectedValue): Observable<any> {
  //  return this.httpClient.get(this.baseUrl + "/DataFields/GetDataForMCLPopup?DFId=" + DFId
  //    + "&TxnId=" + TxnId + "&UserRoleId=" + this.UserRoleId + "&SelectedValue=" + SelectedValue);
  //}
  GetDatafieldsForFormMapping(EntityType, EntityId, FormId): Observable<any> {
    return this.httpClient.get(this.baseUrl + "/DataFields/GetDatafieldsForFormMapping?EntityType=" + EntityType
      + "&EntityId=" + EntityId + "&ProjectId=" + this.projectId + "&FormId=" + FormId);
  }

  UpdateRestrictedColumnsMapping(model): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl + "/DataFields/UpdateRestrictedColumnsMapping", model,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  GetFieldRestrictionsForParticipant(ParticipantId, DataFieldId): Observable<any> {
    return this.httpClient.get(this.baseUrl + "/DataFields/GetFieldRestrictionsForParticipant?ParticipantId="
      + ParticipantId + "&DataFieldId=" + DataFieldId );
  }

  GetRestrictedColumns(EntityType, EntityId, ProjectId): Observable<any> {
    return this.httpClient.get(this.baseUrl + "/DataFields/GetRestrictedColumns?EntityType=" + EntityType +
      "&EntityId=" + EntityId + "&ProjectId=" + ProjectId);
  }
  GetColumnForRestrictedColumnsMapping(EntityType, EntityId, ScopeEntityType, ScopeEntityId): Observable<any> {
    return this.httpClient.get(this.baseUrl + "/DataFields/GetColumnForRestrictedColumnsMapping?EntityType=" + EntityType +
      "&EntityId=" + EntityId + "&ScopeEntityType=" + ScopeEntityType + "&ScopeEntityId=" + ScopeEntityId);
  }
  //
  SaveMappingData(args: any[]): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl + "/DataFields/SaveRestrictedColumnsMapping", args,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }
  GetTableNamesByProjectIdWithType(ScopeEntityType, ScopeEntityId, EntityType): Observable<any> {
    return this.httpClient.get(this.baseUrl + "/DataFields/GetTableNamesByProjectIdWithType?"
      + "ScopeEntityType=" + ScopeEntityType + "&ScopeEntityId=" + ScopeEntityId + "&Type=" + EntityType);

  }

  //GetAttributeColumns(EntityType, EntityId): Observable<any> {
  //  return this.httpClient.get<any>(this.baseUrl + "/DataFields/GetAllDataFieldsForEntity?"
  //    + "EntityType=" + EntityType + "&EntityId=" + EntityId);
  //    //+ "&ProjectId=" + ProjectId + "&ControlProperties=" + ControlProperties);
  //}
  DataforFormRenderer(EntityType, EntityId,ControlProperties, TransactionId, LoggedInRoleId,FormId,TabId): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/DataFields/DataforFormRenderer?"
      + "EntityType=" + EntityType + "&EntityId=" + EntityId + "&ControlProperties=" + ControlProperties + "&TransactionId=" + TransactionId
      + "&LoggedInRoleId=" + LoggedInRoleId + "&FormId=" + FormId + "&UserRoleId=" + this.UserRoleId + "&TabId=" + TabId);

  }
  //ControlProperties will be '' empty string in case of Workflow and mastredata and for Users , it will be something
  GetAllDataFieldsForEntity(EntityType, EntityId): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/DataFields/GetAllDataFieldsForEntity?"
      + "EntityType=" + EntityType + "&EntityId=" + EntityId);
  }

 
  GetEntityNameById(EntityId, EntityType, ScopeEntityType, ScopeEntityId): Observable<any> {
    if (EntityType == 'FlexTables') {
      return this.httpClient.get<any>(this.baseUrl + "/FlexTables/GetLabelById?"
        + "TableId=" + EntityId + "&ScopeEntityType=" + ScopeEntityType + "&ScopeEntityId=" + ScopeEntityId);
    }
    else// (EntityType == 'LReferences')
    {
      return this.httpClient.get<any>(this.baseUrl + "/LReferences/GetNameById?"
        + "Id=" + EntityId);
    }
  }

  SaveFormField(postdata: ColumnConfigurationModel, ScopeEntityType:string, ScopeEntityId:number): Observable<any> {
    let WorkflowId = sessionStorage.getItem("WorkflowId");
    postdata.ParameterCarrier = postdata.ParameterCarrier + "|WorkflowId=" + WorkflowId +"|UserName=" + this.LoginEmail + "|WorkFlow=" + "DataFields" + "|RoleName=" + this.CurrentRoleName + "|SessionValues=" + this.SessionValues + "|" + "ProjectId=" + this.projectId;
    postdata.ParameterCarrier = postdata.ParameterCarrier + "|DropDownValues=" + postdata.DropDownValues + "|LoggedInUserId=" + this.LoggedInUserId + "|ScopeEntityType=" + ScopeEntityType + "|ScopeEntityId=" + ScopeEntityId + "|LoggedInRoleId=" + this.LoggedInRoleId;
    console.log(JSON.stringify(postdata));
    let strpostdata = JSON.stringify(postdata);
    return this.httpClient.post(this.baseUrl + "/DataFields/PostLColumnConfigurationsForField",
      strpostdata, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  CheckIfDatafieldIsMapped(Id): Observable<string> { 
    return this.httpClient.get<string>(this.baseUrl + "/DataFields/CheckIfDatafieldIsMapped?" + "Id=" + Id);
  }

  GetById(Id: number): Observable<any> { 
    return this.httpClient.get(this.baseUrl + "/DataFields/GetLColumnConfigurationsForFieldById?" + "id=" + Id);
  }

  UpdateFormField(Id: number, putdata: ColumnConfigurationModel): Observable<any> {
    putdata.ParameterCarrier += "|UserName=" + this.LoginEmail + "|WorkFlow=" + "DataFields" + "|RoleName=" + this.CurrentRoleName + "|SessionValues=" + this.SessionValues + "|" + "ProjectId=" + this.projectId;
    return this.httpClient.put<string>(this.baseUrl + "/DataFields/PutLColumnConfigurationsForField?Id=" + Id, putdata,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  GetMasterData(ProjectId): Observable<any> {
    return this.httpClient.get(this.baseUrl + "/LReferences/GetByProjectId?ProjectId=" + ProjectId);

  }

  GetMasterDataForDropdown(ScopeEntityType: string, ScopeEntityId: number): Observable<any> {
    return this.httpClient.get(this.baseUrl + "/LReferences/GetMasterDataForDropdown?"
      + "ScopeEntityType=" + ScopeEntityType + "&ScopeEntityId=" + ScopeEntityId);

  }
  GetPreviewDataForMasterData(ReferenceId): Observable<any> {
    return this.httpClient.get(this.baseUrl + "/LReferenceData/GenerateReferenceDataGrid?ReferenceId=" + ReferenceId +
       "&sortdatafield=&sortorder=&FilterQuery=&PageNumber=0&PageSize=200");

  }

  AddNewReferenceData(postdata): Observable<any> {
    //postdata.ParameterCarrier = "UserName=" + this.LoginEmail + "|WorkFlow=" + "DataFields" + "|RoleName=" + this.CurrentRoleName + "|SessionValues=" + this.SessionValues + "|" + "ProjectId=" + this.projectId;
    //postdata.ParameterCarrier = postdata.ParameterCarrier + "|LoggedInUserId=" + this.LoggedInUserId
    //  + "|LoggedInRoleId=" + this.LoggedInRoleId
    return this.httpClient.post(this.baseUrl + "/LReferenceData/PostReference",
      postdata, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    )
  }

  CheckMasterDataNameAlreadyExists(Label): Observable<any> {
    return this.httpClient.get(this.baseUrl + "/LReferenceData/CheckMasterDataNameAlreadyExists?Name=" + Label);
  }
  DragAndDropRowDynamic(SourceId,TargetId): Observable<any> {
    return this.httpClient.get(this.baseUrl + "/DataFields/DragAndDropRowDynamic?SourceId=" + SourceId
      + "&TargetId=" + TargetId );
  }

  
}
