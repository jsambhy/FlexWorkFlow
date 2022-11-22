import { Injectable} from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { JsonModelForSP } from '../models/flex-entity-model';

@Injectable()
export class FormRendererService {
  readonly baseUrl = environment.baseUrl;
  constructor(private httpClient: HttpClient) {

  }
  LoggedInScopeEntityId = +sessionStorage.getItem("LoggedInScopeEntityId");
  LoggedInScopeEntityType = sessionStorage.getItem("LoggedInScopeEntityType");


  GetUserNameforTxn(TransactionId, EntityType, EntityId): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/FlexEntityData/GetUserNameforTxn?TransactionId=" + TransactionId
      + "&EntityType=" + EntityType + "&EntityId=" + EntityId);
  }

  GetAvailableTagsForUser(UserRoleId,EntityType,EntityId): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/FlexEntityData/GetAvailableTagsForUser?UserRoleId=" + UserRoleId
      + "&EntityType=" + EntityType + "&EntityId=" + EntityId
      + "&LoggedInScopeEntityId= " + this.LoggedInScopeEntityId + "&LoggedInScopeEntityType=" + this.LoggedInScopeEntityType);
  }

  GetHistory(EntityType,EntityId,TransactionId,locale,offset ): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/LAudit/GetByTypeEntityId?EntityType=" + EntityType
      + "&EntityId=" + EntityId + "&TransactionId=" + TransactionId + "&locale=" + locale + "&offset=" + offset);
  }
  SaveFormField(postdata: JsonModelForSP): Observable<any> {
   
    return this.httpClient.post(this.baseUrl  + "/FlexEntityData/PostEntityData",
      postdata, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }


  GetTransactionDataById(Id,EntityType,EntityId): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/FlexEntityData/GetById?Id=" + Id + '&EntityType=' + EntityType + "&EntityId=" + EntityId);
  }
  
  UpdateFormField(postdata, TransactionId): Observable<any> {
    return this.httpClient.put(this.baseUrl + "/FlexEntityData/PutEntityData" ,
      postdata, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  GetAssociatedTags(EntityId, EntityType, TransactionId): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/FlexTableData/GetById?Id=" + TransactionId);
  }

  GenerateTemplateFileName(ProjectId, EntityType, EntityId): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/FlexEntityData/GenerateTemplate?ProjectId=" + ProjectId
      + "&EntityType=" + EntityType + "&EntityId=" + EntityId);
  }

  UploadExcel(postdata): Observable<any> {
    return this.httpClient.put(this.baseUrl + "/FlexEntityData/PutEntityData",
      postdata, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  ReadAndValidateExcelData(filename, EntityType, EntityId, ProjectId, LoggedInRoleId, LoggedInUserId, RequestType): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/FlexEntityData/ReadAndValidateExcelData?filename="
      + filename + "&EntityType=" + EntityType + "&EntityId=" + EntityId + "&ProjectId=" + ProjectId
      + "&LoggedInRoleId=" + LoggedInRoleId + "&LoggedInUserId=" + LoggedInUserId + "&RequestType=" + RequestType);
  }
  ImportTransactions(LobbyId, BaseTable): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/FlexEntityData/ImportTransactions?LobbyId="
      + LobbyId + "&BaseTable=" + BaseTable);
  }
  GetLobbyInfo(EntityType, EntityId, ProjectId): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/FlexEntityData/GetLobbyInfo?EntityType="
      + EntityType + "&EntityId=" + EntityId + "&ProjectId=" + ProjectId);
  }
  DownloadUploadErrors(LobbyId): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/FlexEntityData/DownloadUploadErrors?LobbyId="
      + LobbyId);
  }
}
