import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from '../../environments/environment';
import { LUser } from '../models/UserModel';
import * as AWS from 'aws-sdk';
import { PostSecretKeyModel } from '../models/postsecretkey.model';



@Injectable()
export class UserService {
  readonly basrUrl = environment.baseUrl;
   
  constructor(private httpClient: HttpClient) {
   
  }
  GetByRoleId(RoleId): Observable<any[]> {
    return this.httpClient.get<any[]>(this.basrUrl + "/LUser/GetByRoleId?RoleId=" + RoleId);
  }

  ManageUsersByEntity(EntityType: string, EntityId: number, Operation: string, UserId: number): Observable<LUser[]> {
    return this.httpClient.get<LUser[]>(this.basrUrl + "/LUser/ManageUsersByEntity?EntityType=" + EntityType + "&EntityId=" + EntityId + "&Operation=" + Operation + "&UserId=" + UserId);
  }

  GetRolesByEntityId(EntityType: string, EntityId: number): Observable<any[]> {
    return this.httpClient.get<any[]>(this.basrUrl + "/LUser/GetRolesByEntityId?EntityType=" + EntityType + "&EntityId=" + EntityId);
  }

  GetEntityTags(EntityType: string, EntityId: number): Observable<any[]> {
    return this.httpClient.get<any[]>(this.basrUrl + "/LUser/GetEntityTags?EntityType=" + EntityType + "&EntityId=" + EntityId);
  }

  GetAllTagsForUser(EntityType: string, EntityId: number): Observable<any[]> {
    return this.httpClient.get<any[]>(this.basrUrl + "/LUser/GetAllTagsForUser?EntityType=" + EntityType + "&EntityId=" + EntityId);
  }


  GetMappedTagsByTransaction(EntityType,EntityId, TransactionId): Observable<any[]> {
    return this.httpClient.get<any[]>(this.basrUrl + "/FlexTableData/GetMappedTags?EntityType=" + EntityType + "&EntityId=" + EntityId + "&TransactionId=" + TransactionId);
  }

  SaveUser(UserModel: LUser): Observable<number> {
    return this.httpClient.post<number>(this.basrUrl + "/LUser/PostLUser", UserModel, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  UpdateUser(UserModel: LUser): Observable<void> {
    return this.httpClient.put<void>(this.basrUrl + "/LUser/PutLUser", UserModel, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  GetById(UserId: number): Observable<LUser> {
    return this.httpClient.get<LUser>(this.basrUrl + "/LUser/GetById?id=" + UserId);
  }

 
  GetCurrencyCodeByUserId(UserId: number): Observable<string> {
    return this.httpClient.get<string>(this.basrUrl + "/LUser/GetCurrencyCodeByUserId?LoginUserId=" + UserId);
  }
  DeleteUser(UserId: number): Observable<void> {
    return this.httpClient.delete<void>(this.basrUrl + "/LUser/DeleteUser?UserId=" + UserId);
  }

  SaveSecretAndUpdateMFA(model: PostSecretKeyModel): Observable<void> {
    return this.httpClient.put<void>(this.basrUrl + "/LUser/SaveSecretAndUpdateMFA", model, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  GetImageFromS3(imagePath: string): Observable<any> {
    return this.httpClient.get<any>(this.basrUrl + "/LUser/GetImageFromS3?imagePath=" + imagePath);
  }

  ReadAndValidateUserExcel(filename, ProjectId, LoggedInRoleId, LoggedInUserId): Observable<any> {
    return this.httpClient.get<any>(this.basrUrl + "/LUser/ReadAndValidateUserExcel?Filename="
      + filename + "&ProjectId=" + ProjectId + "&LoggedInUserId=" + LoggedInUserId + "&LoggedInRoleId=" + LoggedInRoleId);
  }

  GetUsersByScope(ScopeType: string, ScopeId: number) {
    return this.httpClient.get(this.basrUrl + "/LUser/GetUsersByScope?ScopeId=" + ScopeId + "&ScopeType=" + ScopeType);
  }
 
}
