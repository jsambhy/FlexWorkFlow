import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { participantTypesModel } from '../models/participantTypes.model';

@Injectable()

export class RepresentativeService {
  readonly basrUrl = environment.baseUrl;
  constructor(private httpClient: HttpClient) { }

  getData(ScopeEntityType: string, ScopeEntityId: number): Observable<any> 
  {

    return this.httpClient.get(this.basrUrl + "/Representatives/GetReps?ScopeEntityType=" + ScopeEntityType + "&ScopeEntityId=" + ScopeEntityId);
  }

  getRepDataById(RepId: number): Observable<any> {
    return this.httpClient.get<any>(this.basrUrl + "/Representatives/GetRepDataById?ReportId=" + RepId);
  }


  delete(modeldata: participantTypesModel): Observable<string> {
    return this.httpClient.post<string>(this.basrUrl + "/Representatives/Delete", modeldata, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  save(modeldata: participantTypesModel): Observable<string> {
    return this.httpClient.post<string>(this.basrUrl + "/Representatives/Post", modeldata, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  update(modeldata: participantTypesModel): Observable<string> {
    return this.httpClient.post<string>(this.basrUrl + "/Representatives/Update", modeldata, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }

  GetExistingUsersList(RepId: number, CompanyId: number) {
    return this.httpClient.get<any>(this.basrUrl + "/Representatives/GetExistingUsersList?RepId=" + RepId + "&ScopeEntityId=" + CompanyId);
  }

  
}
