import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable()
export class MenuRoleService {
  //readonly basrUrl = environment.baseUrl;
  //sessionprojectid: string = sessionStorage.getItem("ProjectId");
  //projectId: number = +this.sessionprojectid; // conversion from string to int
  //UserName: string = sessionStorage.getItem("LoginEmail");
  //CurrentRoleName: string = sessionStorage.getItem("CurrentRoleName");
  //LoginEmail: string = sessionStorage.getItem("LoginEmail");
  //SessionValues: any = sessionStorage;
  //constructor(private httpClient: HttpClient) {
    
  //}

  //getMenuRoles(ProjectId:number): Observable<any> {
  //  return this.httpClient.get(this.basrUrl + "/MMenuRoles/GetColumnForMenuRoles?ProjectId=" + ProjectId);
  //}

  //GetDataForMenuRoleMapping(ProjectId: number): Observable<any> {
  //  return this.httpClient.get(this.basrUrl + "/MMenuRoles/GetDataForMenuRoleMapping?ProjectId=" + ProjectId);
  //}

  //SaveMappingData(args: any[]): Observable<any> {
  //  return this.httpClient.post<any>(this.basrUrl + "/MMenuRoles/SaveDataForMenuRole", args, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  //}
}
