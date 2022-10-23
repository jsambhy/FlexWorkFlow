import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from '../../environments/environment';
import { LRoles } from '../models/RoleModel';


@Injectable()
export class RolesService {
   readonly baseUrl = environment.baseUrl;
  

 
  sessionprojectid: string = sessionStorage.getItem("ProjectId");
  projectId: number = +this.sessionprojectid; // conversion from string to int
  UserName: string = sessionStorage.getItem("LoginEmail");
  CurrentRoleName: string = sessionStorage.getItem("CurrentRoleName");
  LoginEmail: string = sessionStorage.getItem("LoginEmail");
  LoggedInRoleId: number = +sessionStorage.getItem("LoggedInRoleId");
  LoggedInUserId: number = +sessionStorage.getItem("LoggedInUserId");
  SessionValues: any = sessionStorage;
  constructor(private httpClient: HttpClient) { }
  //Method to get active roles and those are not configured in Lreferences for that Project yet.

  GetRolesListforUserRefData(LoggedInScopeEntityType:string, LoggedInScopeEntityId:number): Observable<any> {
    return this.httpClient.get(this.baseUrl + "/LRoles/GetRolesListforUserRefData?LoggedInScopeEntityType=" + LoggedInScopeEntityType + "&LoggedInScopeEntityId=" + LoggedInScopeEntityId); 
  }

  //method to get all the roles and display in grid
  getAllRoles(LoggedInScopeEntityType: string, LoggedInScopeEntityId: number): Observable<any> {
    return this.httpClient.get(this.baseUrl + "/LRoles/GetLRolesByEntity?LoggedInScopeEntityType=" + LoggedInScopeEntityType + "&LoggedInScopeEntityId=" + LoggedInScopeEntityId);//+ "&UserName=" + this.UserName + "&WorkFlow=");
  }

  //method for deleting role
  Delete(Id: number, Iscontinuetodelete: string, RoleNameToDelete, LoggedInScopeEntityType:string,LoggedInScopeEntityId:number): Observable<string> {
    return this.httpClient.delete<string>(this.baseUrl + "/LRoles/Delete?Id=" + Id +
      "&UserName=" + this.LoginEmail + "&Iscontinuetodelete=" + Iscontinuetodelete +
      "&RoleName=" + this.CurrentRoleName + "&LoginUserId=" + this.LoggedInUserId +
      "&LoginUserRoleId=" + this.LoggedInRoleId + "&RoleNameToDelete=" + RoleNameToDelete
      + "&LoggedInScopeEntityType=" + LoggedInScopeEntityType + "&LoggedInScopeEntityId=" + LoggedInScopeEntityId);
  }

  //method for saving the role
  Save(role: LRoles): Observable<string> {
   
    role.ParameterCarrier = "UserName=" + this.LoginEmail + "|WorkFlow=" + "" + "|RoleName=" + this.CurrentRoleName + "|SessionValues=" + this.SessionValues;
    role.CreatedById = this.LoggedInUserId;
    role.CreatedByRoleId = this.LoggedInRoleId;
    role.UpdatedById = this.LoggedInUserId;
    role.UpdatedByRoleId = this.LoggedInRoleId;
    //return this.httpClient.post<string>(this.baseUrl + "/LRoles/Post", role,
    //  {
    //    headers: new HttpHeaders({
    //      'Content-Type': 'application/json',
    //      'Access-Control-Allow-Origin': '*'
    //    })
    //  })
    return this.httpClient.post<string>(this.baseUrl + "/LRoles/Post", role, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  //method to get the information of data by id
  GetById(Id: number): Observable<LRoles> {
    return this.httpClient.get<LRoles>(this.baseUrl + "/LRoles/GetById?id=" + Id + "&ProjectId=" + this.projectId);
  }

  //method for updating the data
  Update(role: LRoles): Observable<string> {
   
    role.ParameterCarrier = "UserName=" + this.LoginEmail + "|WorkFlow=" + "" + "|RoleName=" + this.CurrentRoleName + "|SessionValues=" + this.SessionValues;
    role.CreatedById = this.LoggedInUserId;
    role.CreatedByRoleId = this.LoggedInRoleId;
    role.UpdatedById = this.LoggedInUserId;
    role.UpdatedByRoleId = this.LoggedInRoleId;
    return this.httpClient.put<string>(this.baseUrl + "/LRoles/Put", role, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  GetUserRoleByUserId(UserId : string): Observable<any> {
   return this.httpClient.get(this.baseUrl + "/LUser/GetUserRoleByUserId?UserId="+ UserId);
 }

  UpdateDefaultUserRole(UserId,RoleId): Observable<any> {
    return this.httpClient.get<void>(this.baseUrl + "/LRoles/UpdateDefaultRole?UserId="+ UserId + "&RoleId=" + RoleId)
  }

  IsSystemRole(LoggedInRoleId: number): Observable<boolean> {
    return this.httpClient.get<boolean>(this.baseUrl + "/LRoles/IsSystemRole?LoggedInRoleId=" + LoggedInRoleId);
  }
}
