import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { environment } from '../../environments/environment'; 


@Injectable()
export class GKeyValueService {
  readonly baseUrl = environment.baseUrl;
  
  projectId: number   = +sessionStorage.getItem("ProjectId");
  UserName: string = sessionStorage.getItem("LoginEmail");
  CurrentRoleName: string = sessionStorage.getItem("CurrentRoleName");
  LoginEmail: string = sessionStorage.getItem("LoginEmail");
  SessionValues: any = sessionStorage;
  constructor(private httpClient: HttpClient) {
  }

  GetKeyValue(Key, Projectid): Observable<any> {
    return this.httpClient.get(this.baseUrl + "/GKeyValues/GetByKey?Key=" + Key + '&Projectid=' + Projectid);
  }
}
