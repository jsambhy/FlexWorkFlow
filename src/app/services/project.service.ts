import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { GProject } from '../models/project-model';
import { RFileExtensions } from '../models/file-extension-model';


@Injectable()
export class ProjectService {
  baseUrl = environment.baseUrl;
 

  constructor(private httpClient: HttpClient) {
   
  }


  getAllProjects(CompanyId: number): Observable<GProject[]> {
    return this.httpClient.get<GProject[]>(this.baseUrl + "/GProjects/GetAllProjectsByCompanyId?CompanyId=" + CompanyId);
  }

  getFileExtensions(): Observable<RFileExtensions[]> {
    return this.httpClient.get<RFileExtensions[]>(this.baseUrl + "/GProjects/GetFileExtensions");
  }

  getFileExtensionsByProjectId(ProjectId : number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/GProjects/GetFileExtensionsByProjectId?ProjectId=" + ProjectId);
  }

  SaveProject(ProjectModel: GProject): Observable<GProject> {
    return this.httpClient.post<GProject>(this.baseUrl + "/GProjects/PostGProject", ProjectModel, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  GetById(ProjectId: number): Observable<GProject> {
    return this.httpClient.get<GProject>(this.baseUrl + "/GProjects/GetProjectById?ProjectId=" + ProjectId);
  }

  UpdateProject(ProjectModel: GProject): Observable<void> {
    return this.httpClient.put<void>(this.baseUrl + "/GProjects/PutGProject", ProjectModel, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  GetWFCountByProjectId(ProjectId: number): Observable<number> {
    return this.httpClient.get<number>(this.baseUrl + "/GProjects/GetWFCountByProjectId?ProjectId=" + ProjectId);
  }

  UpdateProjectStatus(ProjectId: number): Observable<void> {
    return this.httpClient.get<void>(this.baseUrl + "/GProjects/UpdateProjectStatus?ProjectId=" + ProjectId);
  }

  DeleteProject(ProjectId: number): Observable<void> {
    return this.httpClient.delete<void>(this.baseUrl + "/GProjects/DeleteGProject?id=" + ProjectId);
  }

  GetEntityUsers(EntityType:string,EntityId:number): Observable<any[]> {
    return this.httpClient.get<any[]>(this.baseUrl + "/GProjects/GetEntityUsers?EntityType=" + EntityType + "&EntityId=" + EntityId);
  }

  GetCompanyById(CompanyId: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + "/GProjects/GetCompanyById?CompanyId=" + CompanyId);
  }

  GetProjectNamesByUserId(UserId: number): Observable<GProject[]> {
    return this.httpClient.get<GProject[]>(this.baseUrl + "/GProjects/GetProjectNamesByUserId?UserId=" + UserId);
  }
}
