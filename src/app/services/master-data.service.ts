import { Injectable, Inject } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";



@Injectable()
export class MasterDataService {
  readonly basrUrl = environment.baseUrl;
  sessionprojectid: string = sessionStorage.getItem("ProjectId");
  projectId: number = +this.sessionprojectid; // conversion from string to int
  UserName: string = sessionStorage.getItem("LoginEmail");
  CurrentRoleName: string = sessionStorage.getItem("CurrentRoleName");
  LoggedInUserId: string = sessionStorage.getItem("LoggedInUserId");
  LoggedInRoleId: string = sessionStorage.getItem("LoggedInRoleId");
  UserRoleId: string = sessionStorage.getItem("UserRoleId");
  LoginEmail: string = sessionStorage.getItem("LoginEmail");
  SessionValues: any = sessionStorage;
  constructor(private httpClient: HttpClient) {
  }
  GetWFForCreateReference(   ReferenceId): Observable<any> {
    return this.httpClient.get(this.basrUrl + "/LReferences/GetWFForCreateReference?"
      + "LoggedInRoleId=" + this.LoggedInRoleId + "&ReferenceId=" + ReferenceId);
  }


  GetMasterDataByEntity(ScopeEntityType:string, ScopeEntityId:number): Observable<any> {
    return this.httpClient.get(this.basrUrl + "/LReferences/GetMasterDataByEntity?"
      + "ScopeEntityType=" + ScopeEntityType + "&ScopeEntityId=" + ScopeEntityId);
  }

  //GetRefDataIdByEntity(EntityType:string, EntityId: number,ProjectId:number): Observable<number> {
  //  return this.httpClient.get<number>(this.basrUrl + "/LReferences/GetRefDataIdByEntity?EntityType=" + EntityType + "&EntityId=" + EntityId + "&ProjectId=" + ProjectId);
  //}

  GetReferencesByTypeAndProjectId(Type: string,ScopeEntityType:string, ScopeEntityId: number): Observable<any> {
    return this.httpClient.get<any>(this.basrUrl + "/LReferences/GetReferencesByTypeAndProjectId?Type=" + Type + "&ScopeEntityType=" + ScopeEntityType + "&ScopeEntityId=" + ScopeEntityId);
  }

  GetMasterDetails(ReferenceId): Observable<any> {
    return this.httpClient.get(this.basrUrl + "/LReferences/GetNameById?"
      + "Id=" + ReferenceId + "&ProjectId=" + this.projectId);
  }
  GetMasterGridDataByReferenceId(ReferenceId: number, PageSize: number, PageNumber: number, sortdatafield: string, sortorder: string, FilterQuery: string, locale: string, timeZone: string, offSet: number, filterData): Observable<any> {
    return this.httpClient.get(this.basrUrl + "/LReferenceData/GetMasterGridDataByReferenceId?ReferenceId=" + ReferenceId
      + "&ProjectId=" + this.projectId + "&PageSize=" + PageSize + "&PageNumber=" + PageNumber + "&sortdatafield=" + sortdatafield + "&sortorder=" + sortorder + "&FilterQuery=" + FilterQuery +
      "&locale=" + locale + "&timeZone=" + timeZone + "&offSet=" + offSet + "&UserRoleId=" + this.UserRoleId + "&filterData=" + filterData);
  }
  GetMasterGridCounts(ReferenceId: number): Observable<any> {
    return this.httpClient.get(this.basrUrl + "/LReferenceData/GetMasterGridCounts?ReferenceId=" + ReferenceId
      + "&ProjectId=" + this.projectId);
  }
  GetMasterGridColumnsByRefId(ReferenceId): Observable<any> {
    return this.httpClient.get<any>(this.basrUrl + "/LReferenceData/GetMasterGridColumnsByRefId?ReferenceId=" + ReferenceId);
  }
  AddNewReferenceWithoutData(postData): Observable<any> {
    return this.httpClient.post(this.basrUrl + "/LReferences/AddWithoutData",
      postData, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  GetById(ReferenceId): Observable<any> {
    return this.httpClient.get<any>(this.basrUrl + "/LReferences/GetLReferencesById?ReferenceId=" + ReferenceId);
  }

  UpdateReference( putdata): Observable<any> {
    return this.httpClient.put<string>(this.basrUrl + "/LReferences/UpdateReference", putdata,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })

  }

  //GetRefIdbyNameAndType(ReferenceName: string, ReferenceType: string , ProjectId:number): Observable<number> {
  //  return this.httpClient.get<number>(this.basrUrl + "/LReferences/GetRefIdbyNameAndType?ReferenceName=" + ReferenceName + "&ReferenceType=" + ReferenceType + "&ProjectId=" + ProjectId);
  //}

}
