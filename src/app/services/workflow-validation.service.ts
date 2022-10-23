import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { flexworkflowmodel } from '../models/flex-workflows-model';


@Injectable()
export class WFValidationService {
  readonly basrUrl = environment.baseUrl;
  sessionprojectid: string = sessionStorage.getItem("ProjectId");
  projectId: number = +this.sessionprojectid; // conversion from string to int
  UserName: string = sessionStorage.getItem("LoginEmail");
  CurrentRoleName: string = sessionStorage.getItem("CurrentRoleName");
  LoginEmail: string = sessionStorage.getItem("LoginEmail");
  SessionValues: any = sessionStorage;
  constructor(private httpClient: HttpClient) {
  }
  getErrorListAfterValidation(model: flexworkflowmodel): Observable<any> {
   
    model.ParameterCarrier = "UserName=" + this.LoginEmail + "|WorkFlow=" + model.Name + "|RoleName=" + this.CurrentRoleName + "|SessionValues=" + this.SessionValues + "|ProjectName=" + model.ProjectName;

    return this.httpClient.post<any>(this.basrUrl + "/WorkflowDesigner/GetErrorListOfValidateWorkFlow", model, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

 

 

}
